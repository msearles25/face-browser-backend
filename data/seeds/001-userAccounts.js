const bcrypt = require('bcrypt');
const { generateId } = require('../../utils/helpers');

exports.seed = function(knex) {
  // Deletes ALL existing entries
      // Inserts seed entries
    return knex('users').insert([
      {
        id: generateId(),
        userHandle: 'fuck', 
        password: bcrypt.hashSync('fuck', 10), 
        email: 'fuckyou@email.com',},
    ]);
};
