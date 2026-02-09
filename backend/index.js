const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const loanRoutes = require('./routes/loanRoutes');
const adminRoutes = require('./routes/adminRoutes');
const seedLoanStatuses = require('./seeds/statusSeeds');
const seedBanks = require('./seeds/bankSeeds');
require('reflect-metadata');



dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.use('/api/users', userRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
    res.send('API is running....');
});

mongoose.connect(process.env.MONGO_URL)
    .then(async () => {
        console.log('Connected to MongoDB');

        await seedLoanStatuses();
        await seedBanks();

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}/`);
        });
    }).catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });





