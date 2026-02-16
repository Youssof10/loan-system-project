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

    async approveLoans(req, res) {
        try {
            let loanIds = req.body.loanIds;
            const adminId = req.user.id;

            // Support both single and bulk approval
            if (!Array.isArray(loanIds)) {
                if (typeof loanIds === 'string') {
                    loanIds = [loanIds];
                } else if (req.body.loanId) {
                    loanIds = [req.body.loanId];
                } else {
                    return res.status(400).json({ error: "No loan requests selected for approval." });
                }
            }
            if (loanIds.length === 0) {
                return res.status(400).json({ error: "No loan requests selected for approval." });
            }

            const result = await adminService.approveLoans(loanIds, adminId);
            res.status(200).json(result);
        } catch (error) {
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
