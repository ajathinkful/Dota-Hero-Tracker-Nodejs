// ./migrations/20240708200318_alter_match_id_to_bigint.js

exports.up = function(knex) {
  return knex.schema.alterTable('matches', function(table) {
    table.dropUnique('match_id');
  }).then(function() {
    return knex.schema.alterTable('matches', function(table) {
      table.bigint('match_id').notNullable().alter();
      table.unique('match_id');
    });
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('matches', function(table) {
    table.dropUnique('match_id');
  }).then(function() {
    return knex.schema.alterTable('matches', function(table) {
      table.integer('match_id').notNullable().alter();
      table.unique('match_id');
    });
  });
};
