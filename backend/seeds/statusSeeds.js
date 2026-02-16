const mongoose = require('mongoose');
const LoanStatus = require('../models/LoanStatus');
const dotenv = require('dotenv');

dotenv.config();

async function seedLoanStatuses() {
    const statuses = ['Pending', 'Approved', 'Rejected'];
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to MongoDB for seeding...");

        // Idempotent upsert keeps existing IDs intact
        for (const name of statuses) {
            await LoanStatus.updateOne(
                { name },
                { $setOnInsert: { name } },
                { upsert: true }
            );
        }

        console.log("Loan statuses seeded successfully.");
    } catch (error) {
        console.error("Error seeding loan statuses:", error);
    }
}

module.exports = seedLoanStatuses;