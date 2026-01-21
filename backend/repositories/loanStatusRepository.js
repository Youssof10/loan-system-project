const LoanStatus = require('../models/LoanStatus');
const cache = require('../utils/cache');

class LoanStatusRepository {
    async getStatusByName(statusName) {
        const cachedStatus = cache.get(statusName);
        if (cachedStatus) {
            console.log(`--- Cache Hit: ${statusName} found in memory ---`);
            return cachedStatus;
        }
        const status = await LoanStatus.findOne({ name: statusName });
        if (status) {
            cache.set(statusName, status);
            console.log(`--- Cache Set: ${statusName} stored in memory ---`);
        }
        return status;
    }
}

module.exports = new LoanStatusRepository();