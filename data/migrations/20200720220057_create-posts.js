
exports.up = function(knex) {
  return knex.schema.createTable('posts', table => {
        table.bigInteger('id')
            .primary();
        table.text('postContent')
            .notNullable();
        table.bigInteger('userId')
            .notNullable()
            .unsigned()
            .references('id')
            .inTable('users')
            .onUpdate('CASCADE')
            .onDelete('CASCADE');
        table.timestamp('createdOn')
            .defaultTo(knex.fn.now())
            .notNullable();
  })
};

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists('posts')
};