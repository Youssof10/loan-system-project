const User = require('../models/User');

class UserRepository {
    async createUser(userData) {
        const user = new User(userData);
        return await user.save();
    }

    async getUserByEmail(email) {
        const user = await User.findOne({ Email: email });
        return user;
    }

    async findByPhoneNumber(phoneNumber) {
        return await User.findOne({ PhoneNumber: phoneNumber });
    }
}

module.exports = new UserRepository();