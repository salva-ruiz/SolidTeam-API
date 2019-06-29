exports.up = function(knex) {
  return knex.schema.createTable('team_members', function(t) {
    t.integer('team_id').notNullable().references('teams')
    t.integer('user_id').notNullable().references('users')
    t.primary(['team_id', 'user_id'])
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('team_members')
}
