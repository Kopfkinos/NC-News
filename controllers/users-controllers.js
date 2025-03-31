const models = require("../models/users-models")

exports.getUsers = (req, res, next) => {
  models.fetchUsers().then((users) => {
    res.status(200).send({ users })
  })
}

exports.getUserById = (req, res, next) => {
  const { username } = req.params
  models
    .fetchUserById(username)
    .then((user) => {
      res.status(200).send({ user: user[0] })
    })
    .catch((err) => {
      next(err)
    })
}
