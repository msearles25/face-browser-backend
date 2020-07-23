const database = require('../config/dbConfig');

const getAllPosts = () => {
    return database('posts')
        .join('users', 'posts.userId', 'users.id')
        .select(
            'posts.id as postId',
            'userHandle',   
            'postContent',
            'createdOn'
        )
        .orderBy('createdOn', 'desc');
}

const getPostById = async id => {
    const post = await database('posts')
        .join('users', 'posts.userId', 'users.id')
        .select(
            'posts.id',
            'userHandle',
            'postContent',
            'createdOn'
        )
        .where({ 'posts.id': id })
        .first();
    const comments = await database('comments')
        .join('posts', 'comments.postId', 'posts.id')
        .join('users',  'comments.userId', 'users.id')
        .select(
            'comments.id',
            'postId',
            'body',
            'userHandle',
            'comments.createdOn'
        )
        .orderBy('createdOn', 'desc')
        .where({ postId: id })

    return {
        ...post,
        comments
    }
}

const getSpecificUsersPosts = userHandle => {
    return database('posts')
        .join('users', 'posts.userId', 'users.id')
        .select(
            'posts.id as postId',
            'userHandle',
            'postContent',
            'createdOn'
        )
        .where({ userHandle })
}

const addPost = async post => {
    const [id] = await database('posts')
        .returning('id')
        .insert(post);
    return getPostById(id); 
}

const deletePost = id => {
    return database('posts')
        .where({ id })
        .del();
}

// comment controllers
const getCommentById = id => {
    return database('comments')
        .where({ id })
        .first();
}
const addComment = async comment => {
    const [id] = await database('comments')
        .returning('id')
        .insert(comment);
    return getCommentById(id)
}

module.exports = {
    getAllPosts,
    getPostById,
    getSpecificUsersPosts,
    addPost,
    deletePost,
    getCommentById,
    addComment
}