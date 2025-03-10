// Express
const express = require("express")
const app = express()

// Importing controllers
const { getTopics } = require("./controllers/topics-controller")
const { handleServerErrors } = require("./controllers/error-controllers")

// API index endpoint
const endpointsList = require("./endpoints.json")
app.get("/api", (req, res) => {
  res.status(200).send({ endpoints: endpointsList })
})

// Endpoints
app.get("/api/topics", getTopics)

// Error handling
app.use(handleServerErrors)

// Catch-all
app.all("*", (req, res) => {
  res.status(404).send({ msg: "That path doesn't exist on this server! :(" })
})

module.exports = app
