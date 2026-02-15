const loanRepository = require('../repositories/loanRepository');
const loanStatusRepository = require('../repositories/loanStatusRepository');

class LoanService {
    async applyForLoan(userId, loanData) {
        const { loanAmount, duration, installments, status } = loanData;

        const loanAmountNum = Number(loanAmount);
        const durationNum = Number(duration);
        const installmentsNum = Number(installments);

        if ([loanAmountNum, durationNum, installmentsNum].some(n => Number.isNaN(n))) {
            throw new Error("Loan amount, duration, and installments must be valid numbers.");
        }

        const existingLoan = await loanRepository.findOneByUserId(userId);
        if (existingLoan) {
            throw new Error("You already have an existing loan application.");
        }

        if (installmentsNum > durationNum) {
            throw new Error("Number of installments must match or be less than the selected loan duration.");
        }

        const minPayment = 1000;
        if ((loanAmountNum / installmentsNum) < minPayment) {
            throw new Error(`Each installment must be at least ${minPayment}`);

        }

        const PendingLoanStatus = await loanStatusRepository.getStatusByName('Pending');
        if (!PendingLoanStatus) {
            throw new Error("Pending loan status not found in the system.");
        }

        const loanStartDate = new Date();
        const loanEndDate = new Date(loanStartDate);
        loanEndDate.setMonth(loanEndDate.getMonth() + durationNum);

        const newLoan = {
            userId,
            loanAmount: loanAmountNum,
            duration: durationNum,
            installments: installmentsNum,
            status: PendingLoanStatus._id,
            loanStartDate,
            loanEndDate,
            statusHistory: [{
                action: "Submit",
                date: new Date(),
                performedBy: userId,
                oldStatus: null,
                newStatus: "Pending"
            }]
        };

        const createdLoan = await loanRepository.createLoan(newLoan);
        return {
            message: "Your loan request has been submitted successfully and is pending review.",
            loanRequest: createdLoan
        };
    }
}

module.exports = new LoanService();