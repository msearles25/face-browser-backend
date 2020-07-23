const router = require('express').Router();

const Profile = require('./controller');
const User = require('../authentication/controller');

const { authenticate } = require('../authentication/util');

// getting authed users credentials
router.get('/', authenticate, async (req, res) => {
    const id = req.user.userId;
    
    try {
        const userInfo = await User.getUserById(id);
        delete userInfo.password; // so we don't return the password with everything else
        return res.status(200).json(userInfo);
    }
    catch {
        return res.status(500).json({ message: 'Error retrieving user details, please try again later.' });
    }
})

// getting a specific users profile
router.get('/:userHandle', async (req, res) => {
    const { userHandle } = req.params;
    const user = await User.getUserByUserHandle(userHandle)
    if(!user) return res.status(404).json({ message: 'Error, user does not exist.' })
    try {
        const profile = await Profile.getSpecificProfile(userHandle)
        return res.status(200).json(profile);
    } 
    catch(err) {
        console.log(err)
        return res.status(500).json({ message: 'Error retrieving users profile, try again later.' })
    }
}) 

module.exports = router;