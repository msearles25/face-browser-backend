const router = require('express').Router();
const { authenticate } = require('../authentication/util');
const { generateId } = require('../utils/helpers');

const Posts = require('./controller')

router.get('/', async (req, res) => {
    try {
        const posts = await Posts.getAllPosts();
        return res.status(200).json(posts);
    } catch(err) {
        console.log(err)
        res.status(500).json({ meesage: 'Server error, failed to get posts.' });
    }
})

router.post('/:userId', authenticate, async (req, res) => {
    const { userId } = req.user;
    const { postContent } = req.body;
    const newId = await generateId('post');
    const newPost = {
        id: newId,
        postContent,
        userId
    }

    if(userId.toString() === req.params.userId) {
        try {
            const post = await Posts.addPost(newPost);
            return res.status(201).json({ message: 'Successfully posted.', post });
        } catch(err) {
            console.log(err);
            return res.status(500).json({ message: 'Server error, please try again later' });
        }     
    } else {
        return res.status.json({ message: 'Unauthorized.' });
    }
}) 

module.exports = router;