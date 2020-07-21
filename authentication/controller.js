const database = require('../config/dbConfig');

const getAllUsers = () => {
    return database('users').select('id', 'handle', 'password');
}

const getUserById = id => {
    return database('users').where({ id }).first();
}
const getUserByUserHandle = handle => {
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

module.exports = {
    newUser,
    getAllUsers,
    getUserBy,
    getUserById,
    getUserByUserHandle,
};
