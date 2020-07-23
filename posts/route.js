const router = require('express').Router();
const { authenticate } = require('../authentication/util');
const { generateId } = require('../utils/helpers');

const Posts = require('./controller')

// get all the posts
router.get('/', async (req, res) => {
    try {
        const posts = await Posts.getAllPosts();
        return res.status(200).json(posts);
    } catch(err) {
        console.log(err)
        res.status(500).json({ meesage: 'Server error, failed to get posts.' });
    }
})

// get a specific post, so later when comments are added we can do more
router.get('/:postId', async (req, res) => {
    const { postId } = req.params;
    try {
        const post = await Posts.getPostById(postId);
        return res.status(200).json(post);
    } catch {
        return res.status(500).json({ message: 'Error fetching posts from user.' })
    }
})

// allows the authed user to post
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
        return res.status(403).json({ message: 'Unauthorized.' });
    }
})

// allows the authed user to delete a certain post
router.delete('/:postId', authenticate, async (req, res) => {
    const { postId } = req.params;
    const { userId } = req.user;
    const postInfo = await Posts.getPostById(postId);

    if(!postInfo) return res.status(404).json({ message: 'Post not found.' })
    if(userId !== postInfo.userId) return res.status(403).json({ message: 'Unauthorized.' })

    try {
        const deletedPost = await Posts.deletePost(postId);
        return res.status(200).json(deletedPost);
    } catch {
        return res.status(500).json({ message: 'The server says no, try again later.' });
    }
})

module.exports = router;