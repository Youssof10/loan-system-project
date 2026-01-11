const loanService = require('../services/loanService');

class LoanController {

    async applyForLoan(req, res) {
        try {
            const userId = req.user.id;
            const loanData = req.body;
            const newLoan = await loanService.applyForLoan(userId, loanData);
            res.status(201).json({ message: "Loan application successful", loan: newLoan });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

}

module.exports = new LoanController();