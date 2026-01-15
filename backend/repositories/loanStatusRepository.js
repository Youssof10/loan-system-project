const LoanStatus = require('../models/LoanStatus');

class LoanStatusRepository {
    async getStatusByName(statusName) {
        return await LoanStatus.findOne({ status_name: statusName });
    }
}

module.exports = new LoanStatusRepository();