const express = require('express')
const router = express.Router()
const knex = require('../knex')

router

  /* GET users listing */
  .get('/', function(req, res, next) {
    knex('users')
      .select(['id', 'user_name', 'full_name', 'email_address', 'time_zone'])
      .then(users => {
        res.json(users)
      })
  })

  /* GET a user */
  .get('/:id(\\d+)', function(req, res, next) {
    knex('users')
      .select(['id', 'user_name', 'full_name', 'email_address', 'time_zone'])
      .where('id', req.params['id'])
      .then(user => {
        if (user.length)
          res.json(user)
        else
          res.send(404)
      })
  })

  /* DELETE a user */
  .delete('/:id(\\d+)', function(req, res, next) {
    knex('users')
      .where('id', req.params['id'])
      .delete()
      .then(count => {
        if (count)
          res.json({message: 'User deleted'})
        else
          res.send(404)
      })
  })

module.exports = router
