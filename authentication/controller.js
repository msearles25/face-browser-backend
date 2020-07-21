const database = require('../config/dbConfig');

const find = () => {
    return database('users').select('id', 'handle', 'password');
}

const getUserById = id => {
    return database('users').where({ id }).first();
}
const getUserByHandle = handle => {
    return database('users')
        .where({ handle })
        .first();
}

const getUserBy = filter => {
    return database('users').where(filter).first();
}

const newUser = async user => {
    const [id] = await database('users').returning('id').insert(user);

    return getUserById(id)
} 

const getPostById = id => {
    return database('posts').where({ id }).first();
}

const addPost = async post => {
    const [id] = await database('posts').returning('id').insert(post);

    return getPostById(id);
}

module.exports = {
    newUser,
    find,
    getUserBy,
    getUserById,
    getUserByHandle,
    addPost,
    getPostById
};
