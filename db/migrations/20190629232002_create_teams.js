exports.up = function(knex) {
  return knex.schema.createTable('teams', function(t) {
    t.increments()
    t.integer('account_id').notNullable().references('accounts')
    t.string('team_name', 64).notNullable()
    t.timestamps(true, true)
    t.unique(['account_id', 'team_name'])
    t.index('account_id')
    t.index('team_name')
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('teams')
}
