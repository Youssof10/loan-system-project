const User = require('../models/User');

class UserRepository {
    async createUser(userData) {
        const user = new User(userData);
        await user.save();
        // Populate BankName after saving
        return await User.findById(user._id).populate('BankName');
    }

    async getUserByEmail(email) {
        // Populate BankName when fetching by email
        return await User.findOne({ Email: email }).populate('BankName');
    }

    async findByPhoneNumber(phoneNumber) {
        return await User.findOne({ PhoneNumber: phoneNumber }).populate('BankName');
    }
}

module.exports = new UserRepository();