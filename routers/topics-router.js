topicsRouter = require("express").Router()

const controllers = require("../controllers/controllers-index")

topicsRouter.get("/", controllers.getTopics)

module.exports = topicsRouter
