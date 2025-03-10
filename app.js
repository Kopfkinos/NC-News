// Express
const express = require("express")
const app = express()

// Importing controllers
const { getTopics } = require("./controllers/topics-controller")
const {
  handleServerErrors,
  handleCatchAllError,
  handlePsqlErrors,
} = require("./controllers/error-controllers")
const { getArticleById } = require("./controllers/article-controllers")

// API index endpoint
const endpointsList = require("./endpoints.json")
const { handleCustomErrors } = require("./controllers/error-controllers")
app.get("/api", (req, res) => {
  res.status(200).send({ endpoints: endpointsList })
})

// Endpoints
app.get("/api/topics", getTopics)

app.get("/api/articles/:article_id", getArticleById)

// Error handlers
app.use(handleCustomErrors)
app.use(handlePsqlErrors)
app.use(handleServerErrors)

// Catch-all
app.all("*", handleCatchAllError)

module.exports = app
