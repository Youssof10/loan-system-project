const userService = require('../services/userService');

class UserController {
    async registerUser(req, res){
        try {
            const userData = req.body;
            const newUser = await userService.registerUser(userData);
            res.status(201).json({message: "User registered successfully", user: newUser});
        } catch (error) {
            res.status(400).json({error: error.message});
        }
    }
}

module.exports = new UserController();