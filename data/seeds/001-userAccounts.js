const bcrypt = require('bcrypt');
const { generateId } = require('../../utils/helpers');

exports.seed = async function(knex) {
  // Deletes ALL existing entries
      // Inserts seed entries
    return knex('users').insert([
      {
        // id: await generateId('user'),
        id: generateId('user'),
        userHandle: 'test', 
        password: bcrypt.hashSync('test', 10), 
        email: 'test@email.com',},
    ]);
};
