const loanRepository = require('../repositories/loanRepository');

class LoanService {
    async applyForLoan(userId, loanData) {
        const { loanAmount, duration, installments, status } = loanData;

        if (installments < duration) {
            throw new Error("Number of installments must match or be less than the selected loan duration.");
        }

        const minPayment = 1000;
        if ((loanAmount / installments) < minPayment) {
            throw new Error(`Each installment must be at least ${minPayment}`);

        }

        const newLoan = {
            userId,
            loanAmount,
            duration,
            installments,
            status: 'Pending'
        };

        const createdLoan = await loanRepository.createLoan(newLoan);
        return {
            message: "Your loan request has been submitted successfully and is pending review.",
            loanRequest: createdLoan
        };
    }
}

module.exports = new LoanService();