
exports.up = function(knex) {
    return knex.schema.createTable('comments', table => {
        table.bigInteger('id')
            .primary();
        table.text('body')
            .notNullable();
        table.bigInteger('postId')
            .notNullable()
            .references('id')
            .inTable('posts')
            .onUpdate('CASCADE')
            .onDelete('CASCADE')
            .notNullable();
        table.bigInteger('userId')
            .notNullable()
            .references('id')
            .inTable('users')
            .onUpdate('CASCADE')
            .onDelete('CASCADE')
            .notNullable();
        table.timestamp('createOn')
            .defaultTo(knex.fn.now())
            .notNullable();
    })
};

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists('comments');
};
