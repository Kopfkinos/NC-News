const db = require("../db/connection")
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

exports.fetchAllArticles = (
  sort_by = "created_at",
  order = "desc",
  topic,
  limit = "10",
  page = "1"
) => {
  const whiteList = ["created_at", "topic", "author", "votes", "desc", "asc"]
  const binders = []

  if (typeof limit !== "string") {
    limit = parseInt(limit)
  }
  if (typeof page !== "string") {
    page = parseInt(page)
  }

  if (!whiteList.includes(sort_by) || !whiteList.includes(order)) {
    return generatePromiseReject(400, "query")
  }
  if (isNaN(limit) || limit > 50 || limit < 1) {
    return generatePromiseReject(400, "limit query")
  }
  if (isNaN(page) || page < 1) {
    return generatePromiseReject(400, "page query")
  }

  let queryStr = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT OUTER JOIN comments ON comments.article_id = articles.article_id`

  if (topic) {
    if (topic.length > 200) {
      return generatePromiseReject(400, "topic string query")
    }
    binders.push(topic)
    queryStr += ` WHERE articles.topic = $1`
  }

  queryStr += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order} LIMIT ${limit} OFFSET ${
    (page - 1) * limit
  }`

  return db.query(queryStr, binders).then(({ rows }) => {
    if (rows.length === 0) {
      return generatePromiseReject(404, "Topic")
    }
    return rows
  })
}

exports.fetchTotalArticleCount = (topic) => {
  let queryStr = `SELECT COUNT(article_id) FROM articles`

  const binders = []

  if (topic) {
    binders.push(topic)
    queryStr += ` WHERE topic = $1`
  }

  return db.query(queryStr, binders).then(({ rows }) => {
    return rows[0]
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

exports.addArticle = (articleObj) => {
  const { author, title, body, topic, article_img_url } = articleObj

  if (!author | !title | !body | !topic) {
    return generatePromiseReject(400, "article")
  }

  return db
    .query(
      `INSERT INTO articles (author, title, body, topic, article_img_url) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [author, title, body, topic, article_img_url]
    )
    .then(({ rows }) => {
      return rows
    })
}
