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

router.get('/:userHandle', async (req, res) => {
    const { userHandle } = req.params;
    try {
        const posts = await Posts.getSpecificUsersPosts (userHandle);
        return res.status(200).json(posts);
    } catch {
        return res.status(500).json({ message: 'Error fetching posts from user.' })
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

router.delete('/:postId', async (req, res) => {
    const { postId } = req.params;
    
    try {
        const deletedPost = await Posts.deletePost(postId);
        return res.status(200).json('deleted')
    } catch {
        return res.status(500).json('no')

    }
})

module.exports = router;