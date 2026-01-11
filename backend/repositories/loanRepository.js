const Loan = require('../models/Loan');

class LoanRepository {
    async createLoan(loanData) {
        return await Loan.create(loanData);
    }

    async findByUserId(userId) {
        return await Loan.find({ userId });
    }
}

module.exports = new LoanRepository();