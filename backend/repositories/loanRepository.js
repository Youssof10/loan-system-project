const Loan = require('../models/Loan');

class LoanRepository {
    async createLoan(loanData) {
        const loan = await Loan.create(loanData);
        return await Loan.findById(loan._id).populate('status');
    }

    async findByUserId(userId) {
        return await Loan.find({ userId }).populate('status');
    }

    async findOneByUserId(userId) {
        return await Loan.findOne({ userId }).populate('status');
    }

    async getAllForAdmin(filters = {}) {
        const query = {};

        if (filters.loanNumericId !== undefined) {
            query.loanNumericId = filters.loanNumericId;
        }

        if (filters.installments !== undefined) {
            query.installments = filters.installments;
        }

        if (filters.statusIds && filters.statusIds.length > 0) {
            query.status = { $in: filters.statusIds };
        }

        if (filters.submissionRange) {
            const { from, to } = filters.submissionRange;
            query.createdAt = {};
            if (from) query.createdAt.$gte = from;
            if (to) query.createdAt.$lte = to;
        }

        if (filters.durationRange) {
            const { from, to } = filters.durationRange;
            if (from) query.loanStartDate = { ...(query.loanStartDate || {}), $gte: from };
            if (to) query.loanEndDate = { ...(query.loanEndDate || {}), $lte: to };
        }

        const results = await Loan.find(query)
            .populate('status')
            .populate('userId', 'FullName Email')
            .sort({ createdAt: -1 });

        return results;
    }
}

module.exports = new LoanRepository();