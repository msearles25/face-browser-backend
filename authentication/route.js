const router = require('express').Router();
const bcrypt = require('bcrypt');

const Users = require('./controller');

const { tokenGenerator, authenticate } = require('./util');

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
        handle: req.body.handle,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    }
    
    if(!newUser.handle) {
        return res.status(400).json({ error: 'Handle required.' });
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
                    return res.status(500).json({ error: 'Server error, failed creating account, try again later.' })
            }
        })
})

router.post('/login', (req, res) => {
    const { handle, password } = req.body;

    if(!handle) {
        return res.status(400).json({ error: 'Handle is required.' })
    }
    if(!password) {
        return res.status(400).json({ error: 'Password is required.' })
    }

    Users.getUserByHandle(handle)
        .then(user => {
            if(user && bcrypt.compareSync(password, user.password)) {
                const token = tokenGenerator(user);
                delete user.password;
                return res.status(200).json({ message: `Successfully logged ${handle} in.`, token, user});
            } else {
                console.log(handle)
                return res.status(401).json({ error: 'Invalid credentials, try again.' });
            }
        })
        .catch(err => {
            console.log(err)
            return res.status(500).json({ error: 'Server error, could not log user in, try again later.' });
        })
})

router.post('/posts/:userId', authenticate, (req, res) => {

    const { userId } = req;
    const { postContent } = req.body;
    const newPost = {
        postContent,
        userId
    }

    if(req.userId.toString() === req.params.userId) {
        Users.addPost(newPost).then(post => {
            return res.status(201).json({ message: 'Successfully posted', post })
        }) 
        .catch(err => {
            console.log(err)
            return res.status(500).json({ message: 'Server error, failed to post, try again later.' })
        })
    } else {
        res.status(401).json({ message: 'Unauthorized, get better scrub.' })
    }

})


module.exports = router;