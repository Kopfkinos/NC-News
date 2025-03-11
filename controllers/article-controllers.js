const {
  fetchArticleById,
  fetchAllArticles,
  fetchArticleComments,
  addCommentToArticle,
} = require("../models/articles-models")

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article })
    })
    .catch((err) => {
      next(err)
    })
}

exports.getAllArticles = (req, res, next) => {
  fetchAllArticles()
    .then((articles) => {
      res.status(200).send({ articles })
    })
    .catch((err) => {
      next(err)
    })
}

exports.getArticleComments = (req, res, next) => {
  const { article_id } = req.params
  fetchArticleComments(article_id)
    .then((comments) => {
      res.status(200).send({ comments })
    })
    .catch((err) => {
      next(err)
    })
}

exports.postCommentToArticle = (req, res, next) => {
  const { article_id } = req.params
  const comment = req.body
  addCommentToArticle(article_id, comment)
    .then((comment) => {
      res.status(201).send({ comment })
    })
    .catch((err) => {
      next(err)
    })
}
