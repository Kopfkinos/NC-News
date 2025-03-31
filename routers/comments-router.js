commentsRouter = require("express").Router()

const controllers = require("../controllers/controllers-index")

commentsRouter
  .route("/:comment_id")
  .delete(controllers.deleteComment)
  .patch(controllers.patchCommentVotes)

module.exports = commentsRouter
