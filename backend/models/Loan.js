const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    loanAmount: {
        type: Number,
        required: [true, "Loan Amount is required"]
    },
    duration : {
        type: Number,
        required: [true, "Duration is required"]
    },
    installments : {
        type: Number,
        required: [true, "Installments amount is required"]
    },
    status : {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Loan', loanSchema);