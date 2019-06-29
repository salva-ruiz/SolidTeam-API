exports.up = function(knex) {
  return knex.schema.createTable('users', function(t) {
    t.increments()
    t.string('user_name', 64).notNullable()
    t.string('full_name', 100).notNullable()
    t.string('email_address', 100).notNullable()
    t.string('time_zone', 100).notNullable()
    t.timestamps(true, true)
    t.unique('user_name')
    t.unique('email_address')
    t.index('created_at')
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('users')
}
