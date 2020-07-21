
exports.up = function(knex) {
  return knex.schema.createTable('users', table => {
      table.increments();
      table.string('handle', 30)
        .notNullable()
        .unique();
      table.string('email', 128)
        .notNullable()
        .unique();
      table.string('password', 128)
        .notNullable();
      table.dateTime('joinedOn')
        .notNullable()
        .defaultTo(knex.fn.now());
  })
  .createTable('posts', table => {
      table.increments();
      table.text('postContent')
        .notNullable();
      table.integer('userId')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
  })
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('posts')
    .dropTableIfExists('users')
};
