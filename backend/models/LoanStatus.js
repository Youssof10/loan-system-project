const mongoose = require('mongoose');

const loanstatusSchema = new mongoose.Schema({
    
    status_name : {
        type: String,
        required: true,
        unique: true
    }
})

const LoanStatus = mongoose.model('LoanStatus', loanstatusSchema);

module.exports = LoanStatus;