const database = require('../config/dbConfig');

const find = () => {
    return database('users').select('id', 'username', 'password');
}

const getUserById = id => {
    return database('users').where({ id }).first();
}
const getUserByUsername = username => {
    return database('users')
        .where({ username })
        .first();
}

const findBy = filter => {
    return database('users').where(filter).first();
}

const newUser = async user => {
    const [id] = await database('users').returning('id').insert(user);

    return getUserById(id)
} 

module.exports = {
    newUser,
    find,
    findBy,
    getUserById,
    getUserByUsername
};
