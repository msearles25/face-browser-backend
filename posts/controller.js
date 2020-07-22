const database = require('../config/dbConfig');

const getAllPosts = () => {
    return database('posts')
        .join('users', 'posts.userId', 'users.id')
        .select(
            'posts.id as postId',
            'postContent',
            'userId',
            'userHandle'    
        )
}

const getPostById = id => {
    return database('posts').where({ id }).first();
}

const getPostByUserHandle = userHandle => {
    return database('posts').where({ userHandle })
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

module.exports = {
    getAllPosts,
    getPostById,
    getPostByUserHandle,
    addPost,
    deletePost
}