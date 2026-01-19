const express = require('express');
const loanController = require('../controllers/loanController');
const router = express.Router();
const { validationMiddleware } = require('../middleware/validationMiddleware');
const { authMiddleware } = require('../middleware/authMiddleware');
const { LoanDto } = require('../dtos/authDto');

router.post('/apply', authMiddleware, validationMiddleware(LoanDto), loanController.applyForLoan);

module.exports = router;

