const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    FullName: {
        type : String,
        required : [true, "FullName is required"],
        minlength: [3, "Full name should be between 3 and 50 characters."],
        maxlength: [50, "Full name should be between 3 and 50 characters."],
        match: [/^[a-zA-Z\s]+$/, "FullName can only contain letters and spaces"]
    },
    Email: {
        type : String,
        required : [true, "Email is required"],
        unique : [true, "This email is already in use."],
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"],
        maxlength: [100, "Email should not exceed 100 characters."]
    },
    PhoneNumber: {
        type : String,
        required : [true, "Phone number is required"],
        unique : [true, "This phone number is already in use."],
        match: [/^(\+20)?\d{11}$/, 'Please enter a valid phone number (11 digits).']
    },
    dateofBirth: {
        type : Date,
        required : [true, "Date of Birth is required"]
    },
    BankName: {
        type : String,
        required : [true, "Bank Name is required"],
        enum : {values: ['CIB', 'Ahly', 'Banque Misr', 'Alex Bank', 'QNB', 'HSBC'],
               message: '{VALUE} is not supported. Please choose a valid bank.'
        }
    },
    AccountNumber: {
        type : String,
        required : [true, "Account Number is required"],
        match: [/^\d{10,16}$/, 'Account number must be between 10 and 16 digits and contain digits only.']
    },
    Password: {
        type : String,
        required : [true, "Password is required"]
    }

});


module.exports = mongoose.model('User', userSchema);