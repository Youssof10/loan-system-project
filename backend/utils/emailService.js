const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }

    async sendLoanApprovalEmail(userEmail, userName, loanDetails) {
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: userEmail,
            subject: 'Loan Application Approved',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #28a745;">Congratulations! Your Loan Has Been Approved</h2>
                    <p>Dear ${userName},</p>
                    <p>We are pleased to inform you that your loan application has been approved.</p>
                    
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                        <h3 style="margin-top: 0;">Loan Details:</h3>
                        <table style="width: 100%;">
                            <tr>
                                <td><strong>Request ID:</strong></td>
                                <td>${loanDetails.loanNumericId}</td>
                            </tr>
                            <tr>
                                <td><strong>Loan Amount:</strong></td>
                                <td>EGP ${loanDetails.loanAmount.toLocaleString()}</td>
                            </tr>
                            <tr>
                                <td><strong>Duration:</strong></td>
                                <td>${loanDetails.duration} months</td>
                            </tr>
                            <tr>
                                <td><strong>Number of Installments:</strong></td>
                                <td>${loanDetails.installments}</td>
                            </tr>
                            <tr>
                                <td><strong>Monthly Payment:</strong></td>
                                <td>EGP ${(loanDetails.loanAmount / loanDetails.installments).toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td><strong>Start Date:</strong></td>
                                <td>${new Date(loanDetails.loanStartDate).toLocaleDateString()}</td>
                            </tr>
                            <tr>
                                <td><strong>End Date:</strong></td>
                                <td>${new Date(loanDetails.loanEndDate).toLocaleDateString()}</td>
                            </tr>
                        </table>
                    </div>
                    
                    <p>The loan amount will be disbursed to your registered bank account within 2-3 business days.</p>
                    
                    <p style="color: #666; font-size: 14px; margin-top: 30px;">
                        If you have any questions, please contact our support team.
                    </p>
                    
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                    <p style="color: #999; font-size: 12px;">
                        This is an automated message. Please do not reply to this email.
                    </p>
                </div>
            `
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Email sent successfully:', info.messageId);
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error('Error sending email:', error);
            return { success: false, error: error.message };
        }
    }
}

module.exports = new EmailService();
