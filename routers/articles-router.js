articlesRouter = require("express").Router()

const controllers = require("../controllers/controllers-index")

articlesRouter.get("/", controllers.getAllArticles).post("/", controllers.postArticle)

articlesRouter
  .route("/:article_id")
  .get(controllers.getArticleById)
  .post(controllers.postCommentToArticle)
  .patch(controllers.patchArticleVotes)
  .delete(controllers.deleteArticle)

articlesRouter.get("/:article_id/comments", controllers.getArticleComments)

module.exports = articlesRouter
