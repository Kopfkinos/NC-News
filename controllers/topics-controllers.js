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
