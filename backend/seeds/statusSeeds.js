const mongoose = require('mongoose');
const LoanStatus = require('../models/LoanStatus');
const dotenv = require('dotenv');

dotenv.config();

async function seedLoanStatuses() {
    const statuses = ['Pending', 'Approved', 'Rejected'];
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to MongoDB for seeding...");

        await LoanStatus.deleteMany({});
        await LoanStatus.insertMany(statuses.map(name => ({ name })));
        console.log("Loan statuses seeded successfully.");

    } catch (error) {
        console.error("Error seeding loan statuses:", error);
    }
}

module.exports = seedLoanStatuses;