const loanRepository = require('../repositories/loanRepository');
const loanStatusRepository = require('../repositories/loanStatusRepository');

class LoanService {
    async applyForLoan(userId, loanData) {
        const { loanAmount, duration, installments, status } = loanData;

        const existingLoan = await loanRepository.findOneByUserId(userId);
        if (existingLoan) {
            throw new Error("You already have an existing loan application.");
        }

        if (installments > duration) {
            throw new Error("Number of installments must match or be less than the selected loan duration.");
        }

        const minPayment = 1000;
        if ((loanAmount / installments) < minPayment) {
            throw new Error(`Each installment must be at least ${minPayment}`);

        }

        const PendingLoanStatus = await loanStatusRepository.getStatusByName('Pending');
        if (!PendingLoanStatus) {
            throw new Error("Pending loan status not found in the system.");
        }

        const newLoan = {
            userId,
            loanAmount,
            duration,
            installments,
            status: PendingLoanStatus._id
        };

        const createdLoan = await loanRepository.createLoan(newLoan);
        return {
            message: "Your loan request has been submitted successfully and is pending review.",
            loanRequest: createdLoan
        };
    }
}

module.exports = new LoanService();