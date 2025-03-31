articlesRouter = require("express").Router()

const controllers = require("../controllers/controllers-index")

articlesRouter.get("/", controllers.getAllArticles)

articlesRouter
  .route("/:article_id")
  .get(controllers.getArticleById)
  .post(controllers.postCommentToArticle)
  .patch(controllers.patchArticleVotes)

articlesRouter.get("/:article_id/comments", controllers.getArticleComments)

module.exports = articlesRouter
