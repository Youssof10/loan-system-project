const mongoose = require('mongoose');

const bankSchema = new mongoose.Schema({
    bank_name: { 
        type: String, 
        required: true, 
        unique: true 
    }
});

module.exports = mongoose.model('Bank', bankSchema);