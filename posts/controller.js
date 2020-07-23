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
}

const getPostById = id => {
    return database('posts').where({ id }).first();
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