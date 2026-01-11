const { IsEmail, IsNotEmpty, MinLength, MaxLength, Matches, IsIn, IsNumber, IsInt, Min, Max } = require('class-validator');

class LoginDto {
    constructor(data = {}) {
        this.Email = data.Email;
        this.Password = data.Password;
    }
}

IsNotEmpty({ message: "Email is required" })(LoginDto.prototype, "Email");
IsEmail({}, { message: "Invalid email format. Please include '@' and a domain." })(LoginDto.prototype, "Email");
IsNotEmpty({ message: "Password is required" })(LoginDto.prototype, "Password");

class RegisterDto {
    constructor(data = {}) {
        this.FullName = data.FullName;
        this.Email = data.Email;
        this.PhoneNumber = data.PhoneNumber;
        this.dateofBirth = data.dateofBirth;
        this.BankName = data.BankName;
        this.AccountNumber = data.AccountNumber;
        this.Password = data.Password;
        this.ConfirmPassword = data.ConfirmPassword;
    }
}

// FullName Validations
IsNotEmpty({ message: "FullName is required" })(RegisterDto.prototype, "FullName");
MinLength(3, { message: "Full name should be between 3 and 50 characters." })(RegisterDto.prototype, "FullName");
MaxLength(50, { message: "Full name should be between 3 and 50 characters." })(RegisterDto.prototype, "FullName");

// Email Validations
IsNotEmpty({ message: "Email is required" })(RegisterDto.prototype, "Email");
IsEmail({}, { message: "Please fill a valid email address" })(RegisterDto.prototype, "Email");
MaxLength(100, { message: "Email should not exceed 100 characters." })(RegisterDto.prototype, "Email");
Matches(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, { message: "Please fill a valid email address" })(RegisterDto.prototype, "Email");

// PhoneNumber Validations
IsNotEmpty({ message: "Phone number is required" })(RegisterDto.prototype, "PhoneNumber");
Matches(/^(\+20\d{10}|\d{11})$/, { message: "Please enter a valid phone number" })(RegisterDto.prototype, "PhoneNumber");

// Date of Birth Validations
IsNotEmpty({ message: "Date of Birth is required" })(RegisterDto.prototype, "dateofBirth");
Matches(/^(\d{2})\/(\d{2})\/(\d{4})$/, { message: "Please enter a valid date(ex: DD/MM/YYYY)." })(RegisterDto.prototype, "dateofBirth");

// BankName Validations
IsNotEmpty({ message: "Bank Name is required" })(RegisterDto.prototype, "BankName");
IsIn(['CIB', 'Ahly', 'Banque Misr', 'Alex Bank', 'QNB', 'HSBC'], { message: "Please choose a valid bank." })(RegisterDto.prototype, "BankName");

// AccountNumber Validations
IsNotEmpty({ message: "Account Number is required" })(RegisterDto.prototype, "AccountNumber");
Matches(/^\d{10,16}$/, { message: "Account number must be between 10 and 16 digits and contain digits only." })(RegisterDto.prototype, "AccountNumber");

// Password Validations
IsNotEmpty({ message: "Password is required" })(RegisterDto.prototype, "Password");
MinLength(8, { message: "Password must be at least 8 characters long." })(RegisterDto.prototype, "Password");

// ConfirmPassword Validations
IsNotEmpty({ message: "Confirm Password is required" })(RegisterDto.prototype, "ConfirmPassword");

class LoanDto {
    constructor(data = {}) {
        this.loanAmount = data.loanAmount;
        this.duration = data.duration;
        this.installments = data.installments;
    }
}

IsNotEmpty({ message: "Loan Amount is required" })(LoanDto.prototype, "loanAmount");
IsNumber({}, { message: "Please enter a valid loan amount within the allowed range." })(LoanDto.prototype, "loanAmount");
Min(10000, { message: "Please enter a valid loan amount within the allowed range." })(LoanDto.prototype, "loanAmount");
Max(100000, { message: "Please enter a valid loan amount within the allowed range." })(LoanDto.prototype, "loanAmount");

IsNotEmpty({ message: "Duration is required" })(LoanDto.prototype, "duration");
IsNumber({}, { message: "Please enter a valid loan duration within the allowed range." })(LoanDto.prototype, "duration");
Min(3, { message: "Please enter a valid loan duration within the allowed range." })(LoanDto.prototype, "duration");
Max(24, { message: "Please enter a valid loan duration within the allowed range." })(LoanDto.prototype, "duration");


IsNotEmpty({ message: "Installments amount is required" })(LoanDto.prototype, "installments");
IsInt({ message: "Number of installments must be an integer (no decimals)." })(LoanDto.prototype, "installments");
module.exports = {
    LoginDto,
    RegisterDto,
    LoanDto
};