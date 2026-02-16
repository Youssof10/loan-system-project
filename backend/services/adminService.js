const LoanRepository = require('../repositories/loanRepository');
const LoanStatusRepository = require('../repositories/loanStatusRepository');
const emailService = require('../utils/emailService');
const mongoose = require('mongoose');

class AdminService {
    async getAllLoanRequests(queryParams) {
        const filters = {};

        if (queryParams.requestId !== undefined) {
            const requestId = Number(queryParams.requestId);
            if (Number.isNaN(requestId)) {
                throw new Error("Request id must be a number.");
            }
            filters.loanNumericId = requestId;
        }

        if (queryParams.installments !== undefined) {
            const installments = Number(queryParams.installments);
            if (Number.isNaN(installments)) {
                throw new Error("Installments must be a number.");
            }
            filters.installments = installments;
        }

        if (queryParams.statuses) {
            const normalizeStatusName = (name) =>
                name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

            const statusNames = queryParams.statuses
                .split(',')
                .map(name => normalizeStatusName(name.trim()))
                .filter(Boolean);

            const statusIds = [];
            for (const name of statusNames) {
                const statusDoc = await LoanStatusRepository.getStatusByName(name);
                if (statusDoc) {
                    statusIds.push(new mongoose.Types.ObjectId(statusDoc._id));
                }
            }
            if (statusNames.length > 0 && statusIds.length === 0) {
                return [];
            }
            filters.statusIds = statusIds;
        }

        if (queryParams.submittedFrom || queryParams.submittedTo) {
            const from = queryParams.submittedFrom ? new Date(queryParams.submittedFrom) : null;
            const to = queryParams.submittedTo ? new Date(queryParams.submittedTo) : null;
            if ((from && Number.isNaN(from.getTime())) || (to && Number.isNaN(to.getTime()))) {
                throw new Error("Invalid submission date range.");
            }
            filters.submissionRange = { from, to };
        }

        if (queryParams.durationFrom || queryParams.durationTo) {
            const from = queryParams.durationFrom ? new Date(queryParams.durationFrom) : null;
            const to = queryParams.durationTo ? new Date(queryParams.durationTo) : null;
            if ((from && Number.isNaN(from.getTime())) || (to && Number.isNaN(to.getTime()))) {
                throw new Error("Invalid duration date range.");
            }
            filters.durationRange = { from, to };
        }

        return await LoanRepository.getAllForAdmin(filters);
    }

    async approveLoanRequest(loanId, adminId) {
        const loan = await LoanRepository.findById(loanId);
        if (!loan) {
            throw new Error("Loan request not found.");
        }

        const PendingLoanStatus = await LoanStatusRepository.getStatusByName('Pending');
        const ApprovedLoanStatus = await LoanStatusRepository.getStatusByName('Approved');

        if (loan.status._id.toString() !== PendingLoanStatus._id.toString()) {
            throw new Error("Only pending loan requests can be approved.");
        }

        const logEntry = {
            action: "Approve",
            date: new Date(),
            performedBy: adminId,
            oldStatus: "Pending",
            newStatus: "Approved"
        };

        const updatedLoan = await LoanRepository.updateStatus(loanId, ApprovedLoanStatus._id, logEntry);

        // Send email notification
        try {
            await emailService.sendLoanApprovalEmail(
                updatedLoan.userId.Email,
                updatedLoan.userId.FullName,
                {
                    loanNumericId: updatedLoan.loanNumericId,
                    loanAmount: updatedLoan.loanAmount,
                    duration: updatedLoan.duration,
                    installments: updatedLoan.installments,
                    loanStartDate: updatedLoan.loanStartDate,
                    loanEndDate: updatedLoan.loanEndDate
                }
            );
        } catch (emailError) {
            console.error('Failed to send approval email:', emailError);
            // Don't throw error - loan is still approved even if email fails
        }

        return updatedLoan;
    }

    async approveLoans(loanIds, adminId) {
        if (!Array.isArray(loanIds) || loanIds.length === 0) {
            throw new Error("No loan requests selected for approval.");
        }

        const PendingLoanStatus = await LoanStatusRepository.getStatusByName('Pending');
        const ApprovedLoanStatus = await LoanStatusRepository.getStatusByName('Approved');

        const results = [];
        let approvedCount = 0;
        let failed = [];

        for (const loanId of loanIds) {
            try {
                const loan = await LoanRepository.findById(loanId);
                if (!loan) {
                    failed.push({ loanId, reason: "Loan request not found." });
                    continue;
                }
                if (loan.status._id.toString() !== PendingLoanStatus._id.toString()) {
                    failed.push({ loanId, reason: "Invalid status" });
                    continue;
                }
                const logEntry = {
                    action: "Approve",
                    date: new Date(),
                    performedBy: adminId,
                    oldStatus: "Pending",
                    newStatus: "Approved"
                };
                const updatedLoan = await LoanRepository.updateStatus(loanId, ApprovedLoanStatus._id, logEntry);

                // Send email notification
                try {
                    await emailService.sendLoanApprovalEmail(
                        updatedLoan.userId.Email,
                        updatedLoan.userId.FullName,
                        {
                            loanNumericId: updatedLoan.loanNumericId,
                            loanAmount: updatedLoan.loanAmount,
                            duration: updatedLoan.duration,
                            installments: updatedLoan.installments,
                            loanStartDate: updatedLoan.loanStartDate,
                            loanEndDate: updatedLoan.loanEndDate
                        }
                    );
                } catch (emailError) {
                    console.error('Failed to send approval email:', emailError);
                }

                results.push(updatedLoan);
                approvedCount++;
            } catch (err) {
                failed.push({ loanId, reason: err.message });
            }
        }

        return {
            message: `${approvedCount} loan request(s) approved successfully.`,
            approved: results,
            failed
        };
    }
}

module.exports = new AdminService();