const router = require('express').Router();
const bcrypt = require('bcrypt');

const Users = require('./controller');

const { tokenGenerator } = require('./util');
const { Router } = require('express');

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

router.post('/register', (req, res) => {
   const newUser = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    }
    
    if(!newUser.username) {
        return res.status(400).json({ error: 'Username required.' });
    }
    if(!newUser.email) {
        return res.status(400).json({ error: 'Email address required.' });
    }
    if(!newUser.password) {
        return res.status(400).json({ error: 'Password required.' });
    }
    if(!newUser.confirmPassword) {
        return res.status(400).json({ error: 'Please confirm your password.' });
    }
    if(newUser.password !== newUser.confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match.' });
    }

    newUser.password = bcrypt.hashSync(newUser.password, 10);
    delete newUser.confirmPassword;

    Users.newUser(newUser)
        .then(newUser => {
            const token = tokenGenerator(newUser)
            delete newUser.password;
            return res.status(201).json({ 
                message: `Account, ${newUser.username}, created sucessfully.` , token, newUser
            })
        })
        .catch(err => {
            const { constraint } = err;
            switch(constraint){
                case 'users_username_unique':
                    return res.status(401).json({ error: 'Username name already exists.' })
                case 'users_email_unique':
                    return res.status(401).json({ error: 'Email already in use.' })
                default:
                    return res.status(500).json({ error: 'Error creating account, try again later.' })
            }
        })
})

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    Users.getUserByUsername(username)
        .then(user => {
            if(user && bcrypt.compareSync(password, user.password)) {
                const token = tokenGenerator(user);
                delete user.password;
                return res.status(200).json({ message: 'Successfully logged user in.', token, user});
            } else {
                return res.status(401).json({ error: 'Invalid credentials, try again.' });
            }

        })
        .catch(err => {
            console.log(err)
            return res.status(500).json({ error: 'Server error, could not log user in.' });
        })


})


module.exports = router;