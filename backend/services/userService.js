const UserRepository = require('../repositories/userRepository');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Bank = require('../models/Bank');
const BankRepository = require('../repositories/bankRepository');

class UserService {
    async registerUser(userData) {
        const { FullName, Email, PhoneNumber, dateofBirth, BankName, AccountNumber, Password, ConfirmPassword } = userData;
        const FullNameWords = FullName.trim().split(/\s+/);
        if (FullNameWords.length < 2) {
            throw new Error("Full name must contain at least two words.");
        }

        const existingEmail = await UserRepository.getUserByEmail(Email);
        if (existingEmail) {
            throw new Error("This email is already in use.");
        }

        const existingPhone = await UserRepository.findByPhoneNumber(PhoneNumber);
        if (existingPhone) {
            throw new Error("This phone number is already in use.");
        }

        const bank = await BankRepository.findByName(BankName);
        if (!bank) {
            throw new Error("Please select a valid supported bank from the list.");
        }

        const [day, month, year] = dateofBirth.split('/');
        const birthDate = new Date(year, month - 1, day);
        if (birthDate.getFullYear() !== parseInt(year) ||
            birthDate.getMonth() !== parseInt(month) - 1 ||
            birthDate.getDate() !== parseInt(day)) {
            throw new Error('Please enter a valid date(ex: DD/MM/YYYY).');
        }


        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff == 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age < 21 || age > 65) {
            throw new Error("Age must be between 21 and 65 years.");
        }

        if (!/[A-Z]/.test(Password)) {
            throw new Error('Password must contain at least one uppercase letter.');
        }

        if (!/[a-z]/.test(Password)) {
            throw new Error('Password must contain at least one lowercase letter.');
        }
        if (!/[0-9]/.test(Password)) {
            throw new Error('Password must contain at least one digit.');
        }

        if (!/[!@#$%^&*(),.?":{}|<>]/.test(Password)) {
            throw new Error('Password must contain at least one special character.');
        }

        const nameParts = FullName.toLowerCase().trim().split(/\s+/);
        for (const part of nameParts) {
            if (part.length > 2 && Password.toLowerCase().includes(part)) {
                throw new Error("Password should not contain parts of your name.");
            }
        }

        if (Password.includes(year)) {
            throw new Error("Password should not contain your birth year.");
        }

        const EmailPrefix = Email.split('@')[0];
        if (Password.toLowerCase().includes(EmailPrefix.toLowerCase())) {
            throw new Error("Password should not contain parts of your email.");
        }

        if (Password !== ConfirmPassword) {
            throw new Error("Password and Confirm Password must match.");
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(Password, salt);

        const newUser = {
            FullName,
            Email,
            PhoneNumber,
            dateofBirth: birthDate,
            BankName: bank._id,
            AccountNumber,
            Password: hashedPassword
        };

        const createdUser = await UserRepository.createUser(newUser);
        return createdUser;

    }


    async loginUser(Email, Password) {
        const user = await UserRepository.getUserByEmail(Email);
        if (!user) {
            throw new Error("Invalid email");
        }

        const isMatch = await bcryptjs.compare(Password, user.Password);
        if (!isMatch) {
            throw new Error("Invalid password");
        }

        const token = jwt.sign({ userId: user._id, email: user.Email, role: user.Role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return { user, token };
    }
}

module.exports = new UserService();