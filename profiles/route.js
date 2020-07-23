const router = require('express').Router();

const Profile = require('./controller');

router.get('/:userHandle', async (req, res) => {
    const { userHandle } = req.params;
    try {
        const profile = await Profile.getSpecificProfile(userHandle)
        return res.status(200).json(profile);
    } 
    catch(err) {
        return res.status(500).json('hahahahah')
    }
}) 

module.exports = router;