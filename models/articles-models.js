const db = require("../db/connection")
const { sort } = require("../db/data/test-data/articles")

exports.fetchArticleById = (article_id) => {
  return db.query("SELECT * FROM articles WHERE article_id = $1", [article_id]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "Path not found" })
    }
    return rows
  })
}

exports.fetchAllArticles = (sort_by = "created_at", order = "desc") => {
  const whiteList = ["created_at", "topic", "author", "votes", "desc", "asc"]

  let queryStr = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(articles.article_id) AS comment_count FROM articles  JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id `

  if (!whiteList.includes(sort_by) || !whiteList.includes(order)) {
    return Promise.reject({
      status: 400,
      msg: "There are no bad questions, but there are bad queries, much like the one you just entered.",
    })
  }

  queryStr += `ORDER BY ${sort_by} ${order}`

  return db.query(queryStr).then(({ rows }) => {
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

exports.updateArticleVotes = (article_id, votes) => {
  if (votes === undefined || typeof votes !== "number") {
    return Promise.reject({
      status: 400,
      msg: "The sent vote obj was invalid. Did someone say election interference?",
    })
  }
  return db
    .query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`, [
      votes,
      article_id,
    ])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "That article doesn't exist (yet...?)" })
      }
      return rows
    })
}
