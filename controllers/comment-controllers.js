const { removeComment } = require("../models/comments-models")

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params
  console.log(comment_id)
  removeComment(comment_id)
    .then(() => {
      res.status(204).send()
    })
    .catch((err) => {
      next(err)
    })
}
