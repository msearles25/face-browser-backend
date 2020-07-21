const router = require('express').Router();
const bcrypt = require('bcrypt');

const Users = require('./controller');

const { tokenGenerator } = require('./util');
const { verify } = require('jsonwebtoken');

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
//    const newUser = {
//         userHandle: req.body.userHandle,
//         email: req.body.email,
//         password: req.body.password,
//         confirmPassword: req.body.confirmPassword
//     }
    
    const { userHandle, email, password, confirmPassword } = req.body;

    // if(!newUser.userHandle) {
    //     return res.status(400).json({ error: 'Handle is required.' });
    // }
    // if(!newUser.email) {
    //     return res.status(400).json({ error: 'Email address is required.' });
    // }
    // if(!newUser.password) {
    //     return res.status(400).json({ error: 'Password is required.' });
    // }
    // if(!newUser.confirmPassword) {
    //     return res.status(400).json({ error: 'Please confirm your password.' });
    // }
    // if(newUser.password !== newUser.confirmPassword) {
    //     return res.status(400).json({ error: 'Passwords do not match.' });
    // }

    const errors = {}
    
    const isEmpty = input => {
        if (!input) return true;
        return false;
    }
    const isValidHandle = input => {
        const regex = /^[a-zA-Z0-9-_]+$/;
        if (input.match(regex)) return true;
        return false;
    }
    const isValidEmail = input => {
        const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (input.match(regex)) return true;
        return false
    }

    // if(!userHandle) {
    //     return res.status(400).json({ error: 'Handle is required.' });
    // }
    // if(!email) {
    //     return res.status(400).json({ error: 'Email address is required.' });
    // }
    // if(!password) {
    //     return res.status(400).json({ error: 'Password is required.' });
    // }
    // if(!confirmPassword) {
    //     return res.status(400).json({ error: 'Please confirm your password.' });
    // }
    // if(password !== confirmPassword) {
    //     return res.status(400).json({ error: 'Passwords do not match.' });
    // }

    if (isEmpty(userHandle)) {
        errors.userHandle = 'Handle is required.';
    } else if (!isValidHandle(userHandle)) {
        errors.userHandle = 'This handle is invalid. Characters must be: A-Z, a-z, 0-9, - or _';
    }
    if (isEmpty(email)) {
        errors.email = 'Email is required.';
    } else if (!isValidEmail(email)) {
        errors.email = 'Must be a valid email.'
    }
    if (isEmpty(password)) errors.password = 'Password is required.';
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


    // const begin = Date.now();
    // newUser.password = bcrypt.hashSync(newUser.password, 15);
    // const end = Date.now();
    // delete newUser.confirmPassword;

    // Users.newUser(newUser)
    //     .then(newUser => {
    //         const token = tokenGenerator(newUser)
    //         delete newUser.password;
    //         return res.status(201).json({ 
    //             message: `Account, ${newUser.handle}, created sucessfully.` , token, newUser, totalTimeToHash: `${(end - begin) / 1000} seconds to hash`
    //         })
    //     })
    //     .catch(err => {
    //         const { constraint } = err;
    //         console.log(err)
    //         switch(constraint){
    //             case 'users_userhandle_unique':
    //                 return res.status(401).json({ error: 'Handle name already exists.' })
    //             case 'users_email_unique':
    //                 return res.status(401).json({ error: 'Email already in use.' })
    //             default:
    //                 return res.status(500).json({ error: 'Server error, failed creating account. Try again later.' })
    //         }
    //     })
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