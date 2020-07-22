
exports.up = function(knex) {
  return knex.schema.createTable('posts', table => {
        table.integer('id').unsigned().primary();
        table.text('postContent')
            .notNullable();
        table.integer('userId')
            .unsigned()
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