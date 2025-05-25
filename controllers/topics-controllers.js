const models = require("../models/topics-models")

exports.getTopics = (req, res, next) => {
  models
    .fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics: topics })
    })
    .catch((err) => {
      next(err)
    })
}

exports.postTopic = (req, res, next) => {
  const { slug, description } = req.body
  models
    .addTopic(slug, description)
    .then((postedTopic) => {
      res.status(200).send({ postedTopic })
    })
    .catch((err) => {
      next(err)
    })
}
