const { sort } = require("../db/data/test-data/articles")
const {
  fetchArticleById,
  fetchAllArticles,
  fetchArticleComments,
  addCommentToArticle,
  updateArticleVotes,
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
  const { sort_by, order, topic } = req.query

  fetchAllArticles(sort_by, order, topic)
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

exports.patchArticleVotes = (req, res, next) => {
  const { article_id } = req.params
  const votes = req.body.inc_votes
  updateArticleVotes(article_id, votes)
    .then((article) => {
      res.status(201).send(article)
    })
    .catch((err) => {
      next(err)
    })
}
