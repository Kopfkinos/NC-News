const db = require("../db/connection")

const { generatePromiseReject } = require("./model-utils")

exports.removeComment = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [comment_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return generatePromiseReject(404, "comment")
      } else return
    })
}

exports.updateCommentVotes = (comment_id, inc_votes) => {
  return db
    .query(`UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *`, [
      inc_votes,
      comment_id,
    ])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return generatePromiseReject(404, "comment")
      }
      return rows
    })
}
