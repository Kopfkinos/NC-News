const cors = require("cors")

// Express
const express = require("express")
const app = express()

// Importing controllers

const controllers = require("./controllers/controllers-index")

// Parse request bodies --> // req.body
app.use(cors())
app.use(express.json())

// Routers
const apiRouter = require("./routers/api-router")
app.use("/api", apiRouter)

// Error handlers
app.use(controllers.handleCustomErrors)
app.use(controllers.handlePsqlErrors)
app.use(controllers.handleServerErrors)

// Catch-all
app.all("*", controllers.handleCatchAllError)

module.exports = app
