const LoanStatus = require('../models/LoanStatus');

class LoanStatusRepository {
    async getStatusByName(statusName) {
        return await LoanStatus.findOne({ name: statusName });
    }
}

module.exports = new LoanStatusRepository();