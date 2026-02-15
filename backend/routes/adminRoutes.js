const express = require('express');
const adminController = require('../controllers/adminController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { adminMiddleware } = require('../middleware/adminMiddleware');
const router = express.Router();

router.get('/loans', authMiddleware, adminMiddleware, adminController.getAllLoanRequests);
router.patch('/loans/:id/approve', authMiddleware, adminMiddleware, adminController.approveLoan);

module.exports = router;
