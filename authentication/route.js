const router = require('express').Router();
const bcrypt = require('bcrypt');

const Users = require('./controller');

const { tokenGenerator } = require('./util');

router.get('/', (req, res) => {
    Users.find()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json('Error getting users.')
        })
})

router.post('/register', async (req, res) => {
    const { userHandle, email, password, confirmPassword } = req.body;
    const errors = {}
    
    const isEmpty = input => {
        if (!input) return true;
        return false;
    }
    const isValidLength = (input, length, condition) => {
        switch(condition) {
            case 'greaterOrEqual':
                return input.length >= length;
            case 'lessOrEqual':
            default:
                return input.length <= length;
        }
    }
    const isValidHandle = input => {
        const regex = /^[a-zA-Z0-9-_]+$/;
        if (input.match(regex)) return true;
        return false;
    }
    const handleExists = userHandle => {
        const exists = Users.getUserBy({ userHandle });
        return exists;
    }
    const isValidEmail = input => {
        const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (input.match(regex)) return true;
        return false
    }
    const emailExists = async email => {
        const exists = await Users.getUserBy({ email });
        return exists;
    }

    // validating the users handle
    if (isEmpty(userHandle)) {
        errors.userHandle = 'Handle must be at least 1 character.';
    } else if (!isValidHandle(userHandle)) {
        errors.userHandle = 'This handle is invalid. Characters must be: A-Z, a-z, 0-9, - or _';
    } else if (await handleExists(userHandle)) {
        errors.userHandle = `Sorry, ${userHandle} already exists. Please chose another handle.`
    } else if (!isValidLength(userHandle, 20, 'lessOrEqual')) {
        errors.userHandle = 'Handle must be 20 characters or less.'
    }

    // validating the users email
    if (isEmpty(email)) {
        errors.email = 'Email is required.';
    } else if (!isValidEmail(email)) {
        errors.email = 'Please enter a valid email.'
    } else if (await emailExists(email)){
        errors.email = 'That email is already in use.'
    } 

    // validating the users password
    if (isEmpty(password)) {
        errors.password = 'Password is required.'; 
    } else if (!isValidLength(password, 6, 'greaterOrEqual') || !isValidLength(password, 14, 'lessOrEqual')) { 
        errors.password = 'Password must be between 6 and 14 characters.'; 
    }
    if (password !== confirmPassword) errors.confirmPassword = 'Passwords must match.';

    if (Object.keys(errors).length > 0) {
        return res.status(401).json(errors)
    }

    try {
        const hashed = bcrypt.hashSync(password, 15);
        const user = await Users.newUser({
            userHandle,
            email,
            password: hashed
        })
        const token = tokenGenerator(user)
        delete user.password;
        return res.status(201).json({
            message: 'Created',
            token,
            user
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'The server fucked up.' });
    }
})

router.post('/login', (req, res) => {
    const { userHandle, password } = req.body;

    if(!userHandle) {
        return res.status(400).json({ error: 'Handle is required.' })
    }
    if(!password) {
        return res.status(400).json({ error: 'Password is required.' })
    }

    Users.getUserByUserHandle(userHandle)
        .then(user => {
            if(user && bcrypt.compareSync(password, user.password)) {
                const token = tokenGenerator(user);
                delete user.password;
                return res.status(200).json({ message: `Successfully logged ${userHandle} in.`, token, user});
            } else {
                return res.status(401).json({ error: 'Invalid credentials, try again.' });
            }
        })
        .catch(err => {
            console.log(err)
            return res.status(500).json({ error: 'Server error, could not log user in. Try again later.' });
        })
})

module.exports = router;