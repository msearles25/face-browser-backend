const bcrypt = require('bcrypt');
const { generateId } = require('../../utils/helpers');

exports.seed = async function(knex) {
  // Deletes ALL existing entries
      // Inserts seed entries
    return knex('users').insert([
      {
        id: await generateId('user'),
        userHandle: 'fuck', 
        password: bcrypt.hashSync('fuck', 10), 
        email: 'fuckyou@email.com',},
    ]);
};
