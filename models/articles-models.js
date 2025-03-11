const db = require("../db/connection")

exports.fetchArticleById = (article_id) => {
  return db.query("SELECT * FROM articles WHERE article_id = $1", [article_id]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "Path not found" })
    }
    return rows
  })
}

exports.fetchAllArticles = () => {
  return db
    .query(
      "SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(articles.article_id) AS comment_count FROM articles  JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id ORDER BY created_at DESC"
    )
    .then(({ rows }) => {
      return rows
    })
}
exports.fetchArticleComments = (article_id) => {
  return db
    .query("SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC", [article_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Path not found" })
      }
      return rows
    })
}

exports.addCommentToArticle = (article_id, comment) => {
  if (typeof comment.username !== "string" || typeof comment.body !== "string") {
    return Promise.reject({ status: 400, msg: "keep those invalid comments to yourself!" })
  }
  return db
    .query("INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3)RETURNING *", [
      article_id,
      comment.username,
      comment.body,
    ])
    .then(({ rows }) => {
      return rows
    })
}
