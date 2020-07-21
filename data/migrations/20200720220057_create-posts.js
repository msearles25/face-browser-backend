
exports.up = function(knex) {
  return knex.schema.createTable('posts', table => {
        table.increments();
        table.text('postContent')
            .notNullable();
        table.integer('userId')
            .notNullable()
            .unsigned()
            .references('id')
            .inTable('users')
            .onUpdate('CASCADE')
            .onDelete('CASCADE');
  })
};

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists('posts')
};