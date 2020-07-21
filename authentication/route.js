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

router.post('/register', (req, res) => {
   const newUser = {
        userHandle: req.body.userHandle,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    }
    
    if(!newUser.userHandle) {
        return res.status(400).json({ error: 'Handle is required.' });
    }
    if(!newUser.email) {
        return res.status(400).json({ error: 'Email address is required.' });
    }
    if(!newUser.password) {
        return res.status(400).json({ error: 'Password is required.' });
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
                message: `Account, ${newUser.handle}, created sucessfully.` , token, newUser
            })
        })
        .catch(err => {
            const { constraint } = err;
            switch(constraint){
                case 'users_handle_unique':
                    return res.status(401).json({ error: 'Handle name already exists.' })
                case 'users_email_unique':
                    return res.status(401).json({ error: 'Email already in use.' })
                default:
                    return res.status(500).json({ error: 'Server error, failed creating account. Try again later.' })
            }
        })
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