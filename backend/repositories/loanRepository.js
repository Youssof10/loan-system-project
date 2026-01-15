const Loan = require('../models/Loan');

class LoanRepository {
    async createLoan(loanData) {
        const loan = await Loan.create(loanData);
        return await Loan.findById(loan._id).populate('status');
    }

    async findByUserId(userId) {
        return await Loan.find({ userId }).populate('status');
    }
}

module.exports = new LoanRepository();