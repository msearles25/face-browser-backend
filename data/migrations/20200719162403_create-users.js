
exports.up = function(knex) {
  return knex.schema.createTable('users', table => {
      table.bigInteger('id').primary();
      table.string('userHandle')
        .notNullable()
        .unique();
      table.string('email')
        .notNullable()
        .unique();
      table.string('password')
        .notNullable();
      table.timestamp('joinedOn')
        .notNullable()
        .defaultTo(knex.fn.now());
  })
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('posts')
    .dropTableIfExists('users')
};