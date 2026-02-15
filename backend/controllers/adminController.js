const adminService = require('../services/adminService');

class AdminController {
    async getAllLoanRequests(req, res) {
        try {
            const loans = await adminService.getAllLoanRequests(req.query);
            res.status(200).json({
                message: "Loan requests retrieved successfully",
                loans
            });
        } catch (error) {
            // Network/MongoDB connection errors
            if (error.name === 'MongoNetworkError' || error.name === 'MongoServerError') {
                return res.status(503).json({
                    error: "Unable to load requests. Please try again later."
                });
            }

            // Timeout errors
            if (error.name === 'MongooseError' && error.message.includes('timeout')) {
                return res.status(503).json({
                    error: "Unable to load requests. Please try again later."
                });
            }

            // Database connection lost
            if (error.message.includes('connect') || error.message.includes('ECONNREFUSED')) {
                return res.status(503).json({
                    error: "Unable to load requests. Please try again later."
                });
            }

            // Validation errors (from service)
            res.status(400).json({ error: error.message });
        }
    }

    async approveLoan(req, res) {
        try {
            const loanId = req.params.id;
            const adminId = req.user.id;

            const updatedLoan = await adminService.approveLoanRequest(loanId, adminId);

            res.status(200).json({
                message: "The loan request has been approved successfully.",
                loan: updatedLoan
            });
        } catch (error) {
            // Handle specific business logic errors
            if (error.message === "Loan request not found.") {
                return res.status(404).json({ error: error.message });
            }

            if (error.message === "Only pending loan requests can be approved.") {
                return res.status(400).json({ error: "Invalid status" });
            }

            // Network/MongoDB connection errors
            if (error.name === 'MongoNetworkError' || error.name === 'MongoServerError') {
                return res.status(503).json({
                    error: "Unable to process request. Please try again later."
                });
            }

            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new AdminController();
