const router = require('express').Router();

const Users = require('./controller')

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
        return res.status(400).json({ error: 'Username required.' })
    }
    if(!newUser.email) {
       return res.status(400).json({ error: 'Email address required.' })
    }
    if(!newUser.password) {
        return res.status(400).json({ error: 'Password required.' })
    }
    if(newUser.password !== newUser.confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match.' })
    }
    Users.add(newUser)
        .then(newUser => {
            return res.status(201).json({ message: `User, ${newUser.username}, created sucessfully.`, newUser })
        })
        .catch(err => {
            const { constraint }= err;
            switch(constraint){
                case 'users_username_unique':
                    return res.status(400).json({ error: 'Username name already exists.' })
                case 'users_email_unique':
                    return res.status(400).json({ error: 'Email already in use.' })
                default:
                    return res.status(500).json({ error: 'Error creating account, try again later.' })
            }
        })

    // Users.findBy(newUser.username)
    //     .then((username) => {
    //         if(!username && !email) {
    //             if(newUser.password !== newUser.confirmPassword) res.status(400).json('Passwords do not match')
    //             Users.add(newUser)
    //             .then(saved => {
    //                 res.status(201).json(saved)
    //             })

    //         } else if(username) {
    //             console.log(username, email)
    //             res.status(400).json('username already exists, pick another one.')
    //         } else {
    //             res.status(400).json('Email already exists')
    //         }
    //     })
    //     .catch(err => {
    //         console.log(err);
    //         res.status(500).json('Error creating user.');
    //     })

   
})

module.exports = router;