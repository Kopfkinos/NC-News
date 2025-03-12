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
const {
  getArticleById,
  getAllArticles,
  getArticleComments,
  postCommentToArticle,
  patchArticleVotes,
} = require("./controllers/article-controllers")

const { deleteComment } = require("./controllers/comment-controllers")

const { getUsers } = require("./controllers/user-controllers")

// Parse request bodies --> // req.body
app.use(express.json())

// API index endpoint
const endpointsList = require("./endpoints.json")
const { handleCustomErrors } = require("./controllers/error-controllers")
app.get("/api", (req, res) => {
  res.status(200).send({ endpoints: endpointsList })
})

// Endpoints
app.get("/api/users", getUsers)

app.get("/api/topics", getTopics)

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles/:article_id/comments", getArticleComments)

app.get("/api/articles", getAllArticles)
app.post("/api/articles/:article_id", postCommentToArticle)
app.patch("/api/articles/:article_id", patchArticleVotes)

app.delete("/api/comments/:comment_id", deleteComment)

// Error handlers
app.use(handleCustomErrors)
app.use(handlePsqlErrors)
app.use(handleServerErrors)

// Catch-all
app.all("*", handleCatchAllError)

module.exports = app
