const database = require('../data/dbConfig');

const find = () => {
    return database('users').select('id', 'username', 'password');
}

const findById = id => {
    return database('users').where({ id }).first();
}

const findBy = filter => {
    return database('users').where(filter).first();
}

const add = async user => {
    const [id] = await database('users').returning('id').insert(user);

    return findById(id)
} 

module.exports = {
    add,
    find,
    findBy,
    findById
};
