const Bank = require('../models/Bank');
const cache = require('../utils/cache');

class BankRepository {
    async findByName(bank_name) {
        const cachedBank = cache.get(bank_name);
        if (cachedBank) {
            console.log(`--- Cache Hit: ${bank_name} found in memory ---`);
            return cachedBank;
        }

        const bank = await Bank.findOne({ bank_name });
        if (bank) {
            cache.set(bank_name, bank);
            console.log(`--- Cache Set: ${bank_name} stored in memory ---`);
        }

        return bank;
    }
}

module.exports = new BankRepository();