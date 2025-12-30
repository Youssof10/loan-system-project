const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();
const { validationMiddleware } = require('../middleware/validationMiddleware');
const { RegisterDto, LoginDto } = require('../dtos/authDto');

router.post('/signup', validationMiddleware(RegisterDto), userController.registerUser);
router.post('/login', validationMiddleware(LoginDto), userController.loginUser);

module.exports = router;