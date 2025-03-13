const db = require("../db/connection")
const { sort } = require("../db/data/test-data/articles")
const { generatePromiseReject } = require("./model-utils")

exports.fetchArticleById = (article_id) => {
  return db
    .query(
      "SELECT articles.*, COUNT(articles.article_id) AS comment_count FROM articles JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id",
      [article_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return generatePromiseReject(404, "article")
      }
      return rows
    })
}

exports.fetchAllArticles = (sort_by = "created_at", order = "desc", topic) => {
  const whiteList = ["created_at", "topic", "author", "votes", "desc", "asc"]
  const binders = []

  let queryStr = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(articles.article_id) AS comment_count FROM articles JOIN comments ON comments.article_id = articles.article_id `

  if (topic) {
    if (topic.length > 200) {
      return generatePromiseReject(400, "topic string query")
    }
    binders.push(topic)
    queryStr += `WHERE TOPIC = $1 `
  }

  if (!whiteList.includes(sort_by) || !whiteList.includes(order)) {
    return generatePromiseReject(400, "query")
  }

  queryStr += `GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`

  return db.query(queryStr, binders).then(({ rows }) => {
    if (rows.length === 0) {
      return generatePromiseReject(404, "Topic")
    }
    return rows
  })
}

exports.fetchArticleComments = (article_id) => {
  return db
    .query("SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC", [article_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return generatePromiseReject(404, "article")
      }
      return rows
    })
}

exports.addCommentToArticle = (article_id, comment) => {
  if (typeof comment.username !== "string" || typeof comment.body !== "string") {
    return generatePromiseReject(400, "comment")
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
    return generatePromiseReject(400, "vote")
  }
  return db
    .query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`, [
      votes,
      article_id,
    ])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return generatePromiseReject(404, "article")
      }
      return rows
    })
}
