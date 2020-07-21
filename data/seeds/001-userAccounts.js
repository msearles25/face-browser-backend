const bcrypt = require('bcrypt');

exports.seed = function(knex) {
  // Deletes ALL existing entries
      // Inserts seed entries
    return knex('users').insert([
      {
        id: 1, 
        userHandle: 'fuck', 
        password: bcrypt.hashSync('fuck', 10), 
        email: 'fuckyou@email.com',},
    ]);
};
