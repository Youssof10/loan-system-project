const mongoose = require('mongoose');

const LoanStatus = require('./LoanStatus');

const loanSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    loanAmount: {
        type: Number,
        required: [true, "Loan Amount is required"]
    },
    duration: {
        type: Number,
        required: [true, "Duration is required"]
    },
    installments: {
        type: Number,
        required: [true, "Installments amount is required"]
    },
    status: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LoanStatus',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    loanStartDate: {
        type: Date,
        required: true
    },
    loanEndDate: {
        type: Date,
        required: true
    },
    loanNumericId: {
        type: Number,
        unique: true,
        sparse: true
    }
})

loanSchema.pre('save', async function () {
    if (this.isNew && !this.loanNumericId) {
        const lastLoan = await mongoose.model('Loan').findOne({}, { loanNumericId: 1 }, { sort: { loanNumericId: -1 } });
        this.loanNumericId = lastLoan && lastLoan.loanNumericId ? lastLoan.loanNumericId + 1 : 1000;
    }
});

module.exports = mongoose.model('Loan', loanSchema);