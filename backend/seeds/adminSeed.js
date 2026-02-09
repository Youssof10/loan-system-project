const path = require('path');
const dotenv = require('dotenv');
// Load .env from the backend folder explicitly
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const User = require('../models/User');
const Bank = require('../models/Bank');

async function seedAdminUser() {
    const mongoUrl = process.env.MONGO_URL;
    console.log("MONGO_URL from env:", mongoUrl); // Debug log

    if (!mongoUrl) {
        console.error("Error: MONGO_URL environment variable is not set. Please check your .env file.");
        process.exit(1);
    }

    await mongoose.connect(mongoUrl);

    const bank = await Bank.findOne(); // Pick any bank for testing
    if (!bank) {
        console.log("No banks found. Seed banks first.");
        return;
    }

    const adminEmail = 'admin@example.com';
    const existingAdmin = await User.findOne({ Email: adminEmail });
    if (existingAdmin) {
        console.log('Admin user already exists.');
        return;
    }

    const hashedPassword = await bcryptjs.hash('Admin@1234', 10);

    const adminUser = new User({
        FullName: 'Admin User',
        Email: adminEmail,
        PhoneNumber: '01234567890',
        dateofBirth: new Date(1980, 0, 1),
        BankName: bank._id,
        AccountNumber: '1234567890',
        Password: hashedPassword,
        Role: 'Admin'
    });

    await adminUser.save();
    console.log('Admin user seeded:', adminEmail);
}

seedAdminUser().then(() => mongoose.disconnect());
