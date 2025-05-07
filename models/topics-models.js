const db = require("../db/connection")
const { generatePromiseReject } = require("./model-utils")

exports.fetchTopics = () => {
  return db.query(`SELECT * from topics`).then(({ rows }) => {
    return rows
  })
}

exports.addTopic = (slug, description) => {
  let queryStr = `INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING *`

  return db
    .query(queryStr, [slug, description])
    .then(({ rows }) => {
      console.log("then")
      return rows
    })
    .catch((err) => {
      return generatePromiseReject(400, "topic")
    })
}
