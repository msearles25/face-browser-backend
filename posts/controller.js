const database = require('../config/dbConfig');

const getAllPosts = () => {
    return database('posts')
        .join('users', 'posts.userId', 'users.id')
        .select(
            'posts.id as postId',
            'postContent',
            'userId',
            'handle'    
        )
}

const getPostById = id => {
    return database('posts').where({ id }).first();
}

const getPostByUserHandle = () => {
    
}

const addPost = async post => {
    const [id] = await database('posts')
        .returning('id')
        .insert(post);
    return getPostById(id); 
}

module.exports = {
    getAllPosts,
    getPostById,
    addPost
}