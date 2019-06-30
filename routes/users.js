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

  /* GET an user */
  .get('/:id(\\d+)', function(req, res, next) {
    knex('users')
      .where('id', req.params['id'])
      .first(['id', 'user_name', 'full_name', 'email_address', 'time_zone'])
      .then(user => {
        if (user)
          res.json(user)
        else
          res.sendStatus(404)
      })
  })

  /* POST a new user */
  .post('/', function(req, res, next) {
    if (Array.isArray(req.body))
      res.sendStatus(400)
    else
      knex('users')
        .insert(req.body, ['id'])
        .then(id => {
          if (id)
            res.json(id)
          else
            res.sendStatus(400)
        })
  })

  /* PUT an existing user */
  .put('/:id(\\d+)', function(req, res, next) {
    knex('users')
      .where('id', req.params['id'])
      .update(req.body, ['id'])
      .then(id => {
        if (id)
          res.sendStatus(200)
        else
          res.sendStatus(404)
      })
  })

  /* DELETE an user */
  .delete('/:id(\\d+)', function(req, res, next) {
    knex('users')
      .where('id', req.params['id'])
      .delete()
      .then(count => {
        if (count)
          res.sendStatus(200)
        else
          res.sendStatus(404)
      })
  })

module.exports = router
