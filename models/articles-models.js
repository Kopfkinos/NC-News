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
      console.log(rows)
      return rows
    })
}
