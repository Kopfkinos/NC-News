topicsRouter = require("express").Router()

const controllers = require("../controllers/controllers-index")

topicsRouter.get("/", controllers.getTopics)
topicsRouter.post("/", controllers.postTopic)

module.exports = topicsRouter
