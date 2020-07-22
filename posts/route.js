const router = require('express').Router();
const { authenticate } = require('../authentication/util');
const { generateId } = require('../utils/helpers');

const Posts = require('./controller')

router.get('/', (req, res) => {
    Posts.getAllPosts()
        .then(posts => {
            return res.status(200).json(posts)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ meesage: 'Server error, failed to get posts.' })
        })
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
        Posts.addPost(newPost)
            .then(post => {
                return res.status(201).json({ message: 'Successfully posted.', post });
            }) 
            .catch(err => {
                console.log(err);
                return res.status(500).json({ message: 'Server error, failed to post. Try again later.' })
            })
        } else {
            return res.status(401).json({ message: 'Unauthorized.' })
        }
}) 

module.exports = router;