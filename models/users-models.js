const db = require("../db/connection")
const { generatePromiseReject } = require("./model-utils")

exports.fetchUsers = () => {
  return db.query(`SELECT * FROM users`).then(({ rows }) => {
    return rows
  })
}

exports.fetchUserById = (username) => {
  return db.query(`SELECT * FROM users WHERE username = $1`, [username]).then(({ rows }) => {
    console.log(rows)
    if (rows.length === 0) {
      return generatePromiseReject(404, "user")
    }
    return rows
  })
}
