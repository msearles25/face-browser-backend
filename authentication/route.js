const router = require('express').Router();
const bcrypt = require('bcrypt');

const Users = require('./controller');

const { tokenGenerator } = require('./util');
const { validateRegister } = require('../utils/helpers');

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
    
    const { errors, isValid } = validateRegister({
        userHandle,
        email,
        password,
        confirmPassword
    }) 

    if(!isValid) return res.status(400).json({ message: { ...errors } })

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
            message: `Welcome, ${userHandle}!`,
            token,
            user
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'The server doesn\'t want to work right now, come back later.' });
    }
})

router.post('/login', async (req, res) => {
    const { userHandle, password } = req.body;

    if(!userHandle) {
        return res.status(400).json({ message: 'Handle is required.' })
    }
    if(!password) {
        return res.status(400).json({ message: 'Password is required.' })
    }

    try {
        const user = await Users.getUserByUserHandle(userHandle);
        if (user && bcrypt.compareSync(password, user.password)) {
            const token = tokenGenerator(user);
            delete user.password;
            return res.status(200).json({ 
                message: `Welcome, ${user.userHandle}!`,  
                token,
                user
            })
        } else {
            return res.status(401).json({ message: 'Invalid credentials, try again.' });
        }

    } catch(err) {
        console.log(err)
        return res.status(500).json({ message: 'The server decided to have a fit, try again later.' })
    }

    // Users.getUserByUserHandle(userHandle)
    //     .then(user => {
    //         if(user && bcrypt.compareSync(password, user.password)) {
    //             const token = tokenGenerator(user);
    //             delete user.password;
    //             return res.status(200).json({ message: `Successfully logged ${userHandle} in.`, token, user});
    //         } else {
    //             return res.status(401).json({ error: 'Invalid credentials, try again.' });
    //         }
    //     })
    //     .catch(err => {
    //         console.log(err)
    //         return res.status(500).json({ error: 'Server error, could not log user in. Try again later.' });
    //     })
})

module.exports = router;