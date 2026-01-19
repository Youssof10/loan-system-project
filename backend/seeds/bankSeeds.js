const Bank = require('../models/Bank');

const bankSeeds = async () => {
    const banks = [
        'CIB',
        'Ahly',
        'Banque Misr',
        'Alex Bank',
        'QNB',
        'HSBC'
    ];
    for (const bank_name of banks) {
        const existingBank = await Bank.findOne({ bank_name });
        if (!existingBank) {
            const bank = new Bank({ bank_name });
            await bank.save();
            console.log(`Seeded bank: ${bank_name}`);
        } else {
            console.log(`Bank already exists: ${bank_name}`);
        }
    }
};

module.exports = bankSeeds;