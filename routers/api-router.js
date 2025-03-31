const apiRouter = require("express").Router()

// Import Routers
const usersRouter = require("./users-router")
const topicsRouter = require("./topics-router")
const articlesRouter = require("./articles-router")
const commentsRouter = require("./comments-router")

// Import controllers
const controllers = require("../controllers/controllers-index")

// Api Root Endpoint
apiRouter.get("/", controllers.getEndPointsList)

// Subrouters
apiRouter.use("/users", usersRouter)
apiRouter.use("/topics", topicsRouter)
apiRouter.use("/articles", articlesRouter)
apiRouter.use("/comments", commentsRouter)

module.exports = apiRouter
