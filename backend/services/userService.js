const UserRepository = require('../repositories/userRepository');
const bcrypt = require('bcrypt');

class UserService {
    async registerUser(userData) {
        const {FullName, Email, PhoneNumber, dateofBirth, BankName, AccountNumber, Password, ConfirmPassword} = userData;
        const FullNameWords = FullName.trim().split(/\s+/);
        if (FullNameWords.length < 2) {
            throw new Error("Full name must contain at least two words.");
        }

        if (!FullName) {
            throw new Error("FullName is required");
        }

        if(FullName.length < 3 || FullName.length > 50) {
            throw new Error("Full name should be between 3 and 50 characters.");
        }

        if (!Email) {
            throw new Error("Email is required");
        }

        const existingEmail = await UserRepository.getUserByEmail(Email);
        if (existingEmail) {
            throw new Error("This email is already in use.");
        }

    }
}

module.exports = new UserService();