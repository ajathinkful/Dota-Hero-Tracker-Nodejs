// ./migrations/create_matches_table.js

exports.up = function(knex) {
  return knex.schema.createTable('matches', function(table) {
    table.increments('id').primary();
    table.bigint('match_id').notNullable().unique(); // Changed to bigint
    table.integer('player_id').notNullable();
    table.integer('hero_id').notNullable();
    table.boolean('win').notNullable();
    table.timestamps(true, true);
    table.integer('game_mode').notNullable(); // Adding game_mode field
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('matches');
};
