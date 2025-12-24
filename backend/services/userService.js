const UserRepository = require('../repositories/userRepository');
const bcryptjs = require('bcryptjs');

class UserService {
    async registerUser(userData) {
        const {FullName, Email, PhoneNumber, dateofBirth, BankName, AccountNumber, Password, ConfirmPassword} = userData;
        const FullNameWords = FullName.trim().split(/\s+/);
        if (FullNameWords.length < 2) {
            throw new Error("Full name must contain at least two words.");
        }

        if (!FullName || FullName.trim() === "") {
            throw new Error("FullName is required");
        }

        if(FullName.length < 3 || FullName.length > 50) {
            throw new Error("Full name should be between 3 and 50 characters.");
        }

        if (!Email || Email.trim() === "") {
            throw new Error("Email is required");
        }

        const existingEmail = await UserRepository.getUserByEmail(Email);
        if (existingEmail) {
            throw new Error("This email is already in use.");
        }

        if (Email.length > 100) {
            throw new Error("Email should not exceed 100 characters.");
        }

        if (Email && !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(Email)) {
            throw new Error("Please fill a valid email address");
        }

        if (!PhoneNumber || PhoneNumber.trim() === "") {
            throw new Error("Phone number is required");
        }

        const existingPhone = await UserRepository.findByPhoneNumber(PhoneNumber);
        if (existingPhone) {
            throw new Error("This phone number is already in use.");
        }

        if (PhoneNumber && !/^(\+20)?\d{11}$/.test(PhoneNumber)) {
            throw new Error("Please enter a valid phone number");
        }

        if(!dateofBirth) {
            throw new Error("Date of Birth is required");
        }

        const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        if (!dateRegex.test(dateofBirth)) {
            throw new Error('Please enter a valid date(ex: DD/MM/YYYY).');
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

        if(age < 21 || age > 65) {
            throw new Error("Age must be between 21 and 65 years.");
        }

        if (!BankName || BankName.trim() === "") {
            throw new Error("Bank Name is required");
        }

        const validBanks = ['CIB', 'Ahly', 'Banque Misr', 'Alex Bank', 'QNB', 'HSBC'];
        if (!validBanks.includes(BankName)) {
            throw new Error(`${BankName} is not supported. Please choose a valid bank.`);
        }

        if(!AccountNumber) {
            throw new Error("Account Number is required");
        }

        if (!/^\d{10,16}$/.test(AccountNumber)) {
            throw new Error("Account number must be between 10 and 16 digits and contain digits only.");
        }

        if (!Password) {
            throw new Error("Password is required");
        }

        if(Password.length < 8) {
            throw new Error("Password must be at least 8 characters long.");
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

        if(!/[!@#$%^&*(),.?":{}|<>]/.test(Password)) {
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
            BankName,
            AccountNumber,
            Password: hashedPassword
        };

        const createdUser = await UserRepository.createUser(newUser);
        return createdUser;

    }
}

module.exports = new UserService();