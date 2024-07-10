exports.up = function(knex) {
  return knex.schema.table('matches', function(table) {
    table.integer('gpm');
    table.integer('kills');
    table.integer('deaths');
    table.integer('assists');
  });
};

exports.down = function(knex) {
  return knex.schema.table('matches', function(table) {
    table.dropColumn('gpm');
    table.dropColumn('kills');
    table.dropColumn('deaths');
    table.dropColumn('assists');
  });
};
