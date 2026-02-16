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
}

module.exports = new AdminController();
