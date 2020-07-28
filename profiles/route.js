const router = require('express').Router();

const Profile = require('./controller');
const User = require('../authentication/controller');

const { authenticate } = require('../authentication/util');

// getting authed users credentials
router.get('/', authenticate, async (req, res) => {
    try {
        const id = req.user.userId;
        const userInfo = await Profile.getProfileInfo(id);
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

// update the currently authed users profile
// allows you to add the bio, location or website
router.put('/:userId', authenticate, async (req, res) => {
    const id = req.params.userId;
    const updatedInfo = req.body;
    const user = await User.getUserById(id);
    if(!user) return res.status(404).json({ error: 'Error, user does not exist.'})
    try{
        const updated = await Profile.updateProfile(updatedInfo, id)
        return res.status(200).json(updated);
    }
    catch(err){
        console.log(err)
        return res.status(500).json({ message: 'Error updating informaiton, try again later.' })
    }
})

module.exports = router;