const { Router } = require("express")
const knex = require("../knex")
const { check, sanitizeBody, validationResult } = require("express-validator")
const router = Router()


router

  /* GET users list */
  .get("/", function getUsers (req, res, next) {
    knex("users")
      .select(["id", "user_name", "full_name", "email_address", "time_zone"])
      .then(users => {
        res.json(users)
      })
  })

  /* GET an user */
  .get("/:id(\\d+)", function getUser (req, res, next) {
    knex("users")
      .first(["id", "user_name", "full_name", "email_address", "time_zone"])
      .where("id", req.params.id)
      .then(user => {
        if (user)
          res.json(user)
        else
          res.status(404).json({ id: req.params.id, errors: "User not found" })
      })
  })

  /* POST a new user */
  .post("/", [
    check("user_name").trim().not().isEmpty(),
    check("full_name").trim().not().isEmpty(),
    check("email_address").isEmail(),
    check("time_zone").custom(time_zone => {
      return knex("pg_timezone_names")
        .whereRaw("name similar to ?", "(Africa|Antarctica|Asia|Australia|Europe)/%")
        .andWhere("name", time_zone)
        .first("name")
        .then(time_zones => {
          if (!time_zones)
            return Promise.reject("Time zone invalid")
        })
    })
  ], function createUser (req, res, next) {
    const errors = validationResult(req)

    if (Array.isArray(req.body))
      res.status(422).json({ errors: "The request can not be an array" })
    else if (!errors.isEmpty()) 
      res.status(422).json({ errors: errors.array() })
    else
      knex("users")
        .insert(req.body, ["id"])
        .then(users => {
          res.json({ id: users[0].id, message: "User created" })
        })
        .catch(error => {
          res.status(500).json({ errors: error.detail })
        })
  })

  /* PUT an existing user */
  .put("/:id(\\d+)", [
    check("user_name").optional().trim().not().isEmpty(),
    check("full_name").optional().trim().not().isEmpty(),
    check("email_address").optional().isEmail(),
    check("time_zone").optional().custom(time_zone => {
      return knex("pg_timezone_names")
        .whereRaw("name similar to ?", "(Africa|Antarctica|Asia|Australia|Europe)/%")
        .andWhere("name", time_zone)
        .first("name")
        .then(time_zones => {
          if (!time_zones)
            return Promise.reject("Time zone invalid")
        })
    })
  ], function updateUser (req, res, next) {
    const errors = validationResult(req)

    if (Array.isArray(req.body))
      res.status(422).json({ errors: "The request can not be an array" })
    else if (!errors.isEmpty()) 
      res.status(422).json({ errors: errors.array() })
    else
      knex("users")
        .update(req.body, ["id"])
        .where("id", req.params.id)
        .then(users => {
          res.json({ id: users[0].id, message: "User updated" })
        })
        .catch(error => {
          res.status(500).json({ errors: error.detail })
        })
  })

  /* DELETE an user */
  .delete("/:id(\\d+)", function deleteUser (req, res, next) {
    knex("users")
      .delete()
      .where("id", req.params.id)
      .then(count => {
        if (count)
          res.json({ id: req.params.id, message: "User deleted" })
        else
          res.status(404).json({ id: req.params.id, errors: "User not found" })
      })
      .catch(error => {
        res.status(500).json({ errors: error.detail })
      })
  })

module.exports = router
