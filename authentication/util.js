const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || 'super-secret';

const tokenGenerator = user => {
    const payload = {
        subject: user.id,
        email: user.email,
        username: user.username
    };

    const options = {
        expiresIn: '7d'
    };

    return jwt.sign(payload, secret, options)
}

module.exports = {
    tokenGenerator
}