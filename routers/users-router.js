usersRouter = require("express").Router()

const controllers = require("../controllers/controllers-index")

usersRouter.get("/", controllers.getUsers)
usersRouter.get("/:username", controllers.getUserById)

module.exports = usersRouter
