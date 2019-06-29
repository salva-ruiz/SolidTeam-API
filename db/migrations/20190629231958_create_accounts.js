exports.up = function(knex) {
  return knex.schema.createTable('accounts', function(t) {
    t.increments()
    t.integer('owner_id').notNullable().references('users')
    t.string('account_name', 64).notNullable()
    t.timestamps(true, true)
    t.unique(['owner_id', 'account_name'])
    t.index('owner_id')
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('accounts')
}
