const models = require("../models/models-index")

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params
  models
    .fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article })
    })
    .catch((err) => {
      next(err)
    })
}

exports.getAllArticles = (req, res, next) => {
  const { sort_by, order, topic, limit, page } = req.query
  models
    .fetchAllArticles(sort_by, order, topic, limit, page)
    .then((articles) => {
      models.fetchTotalArticleCount(topic).then(({ count }) => {
        res.status(200).send({ articles, total_count: count })
      })
    })
    .catch((err) => {
      next(err)
    })
}

exports.getArticleComments = (req, res, next) => {
  const { article_id } = req.params
  const { limit } = req.query
  models
    .fetchArticleComments(article_id, limit)
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
  models
    .addCommentToArticle(article_id, comment)
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
  models
    .updateArticleVotes(article_id, votes)
    .then((article) => {
      res.status(200).send({ article: article[0] })
    })
    .catch((err) => {
      next(err)
    })
}

exports.postArticle = (req, res, next) => {
  const articleObj = req.body
  models
    .addArticle(articleObj)
    .then((article) => {
      res.status(200).send({ article })
    })
    .catch((err) => {
      next(err)
    })
}

exports.deleteArticle = (req, res, next) => {
  const { article_id } = req.params
  models
    .removeArticle(article_id)
    .then(() => {
      res.status(204).send()
    })
    .catch((err) => {
      next(err)
    })
}
