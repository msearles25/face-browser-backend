const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || 'super-secret';

const tokenGenerator = user => {
    const payload = {
        subject: user.id,
        email: user.email,
        handle: user.handle
    };

    const options = {
        expiresIn: '1d'
    };

    return jwt.sign(payload, secret, options)
}

const authenticate = (req, res, next) => {
    const token = req.headers.authorization;

    if(token) {
        jwt.verify(token, secret, (err, decodedToken) => {
            if(err) return res.status(401).json({ message: 'Log in expired, please log in again.' });
            req.userId = decodedToken.subject;
            return next();
        })
    } else {
        return res.status(401).json({ message: 'Please log in to continue.'})
    }

}

module.exports = {
    tokenGenerator,
    authenticate
}