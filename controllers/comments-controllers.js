const models = require("../models/models-index")

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params
  models
    .removeComment(comment_id)
    .then(() => {
      res.status(204).send()
    })
    .catch((err) => {
      next(err)
    })
}

exports.patchCommentVotes = (req, res, next) => {
  const { comment_id } = req.params
  const { inc_votes } = req.body
  models
    .updateCommentVotes(comment_id, inc_votes)
    .then((updatedComment) => {
      res.status(200).send({ updatedComment: updatedComment[0] })
    })
    .catch((err) => {
      next(err)
    })
}
