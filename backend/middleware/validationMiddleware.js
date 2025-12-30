const { plainToInstance } = require('class-transformer');
const { validate } = require('class-validator');

function validationMiddleware(dtoClass) {
    return async (req, res, next) => {
        const dtoObject = plainToInstance(dtoClass, req.body);
        const errors = await validate(dtoObject);
        if (errors.length > 0) {
            const firstError = Object.values(errors[0].constraints)[0];
            return res.status(400).json({ error: firstError });
        }
        req.body = dtoObject;
        next();
    };
}

module.exports = { validationMiddleware };