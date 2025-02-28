const db = require("../connection")
const format = require("pg-format")
const {convertTimestampToDate} = require("./utils")

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db.query("DROP TABLE IF EXISTS comments;")
    .then(() => {
    return db.query("DROP TABLE IF EXISTS articles;")
  .then(() => {
    return db.query("DROP TABLE IF EXISTS topics")
  })
  .then(() => {
    return db.query("DROP TABLE IF EXISTS users;")
  })
  .then(() => {
    return createUsers()
  })
  .then(() => {
    return createTopics()
  })
  .then(() => {
    return createArticles()
  })
  .then(() => {
    return createComments()
  })
  .then(() => {
    return insertUsers(userData)
  })
  .then(() => {
    return insertTopics(userData, topicData)
  })
  .then(() => {
    return insertArticles(articleData, userData, topicData) 
  })
  .then((articleDataWithIds) => {
    console.log("Last then block has access to this!:", articleDataWithIds)
    // articleData[i].article_id
    return insertComments(userData, articleDataWithIds, commentData)
  })
  })
}

function createUsers () {
  return db.query(`
    CREATE TABLE users (
      username VARCHAR PRIMARY KEY,
      name VARCHAR (50) NOT NULL,
      avatar_url VARCHAR(1000));`)
}
function createTopics () {
  return db.query(`
    CREATE TABLE topics (
      slug VARCHAR(200) PRIMARY KEY NOT NULL,
      description VARCHAR(100) NOT NULL,
      img_url VARCHAR(1000));`)
}
function createArticles () {
  return db.query(`
    CREATE TABLE articles (
      article_id SERIAL PRIMARY KEY,
      title VARCHAR,
      topic VARCHAR,
      author VARCHAR,
      body TEXT,
      created_at TIMESTAMP,
      votes INTEGER,
      article_img_url VARCHAR (1000));`)
}
function createComments () {
  return db.query(`
    CREATE TABLE comments (
      comment_id SERIAL PRIMARY KEY,
      article_id INTEGER,
      body TEXT,
      votes INT,
      author VARCHAR,
      created_at TIMESTAMP);`)
}

function insertUsers (userData) {

  const usersArr = userData.map((user) => {
    return [user.username, user.name, user.avatar_url]
  })

  const insertIntoUserStr = format(
    `INSERT INTO users
      (username, name, avatar_url)
        VALUES %L
          RETURNING *`, usersArr)

  return db.query(insertIntoUserStr)
  .then(({rows}) => {
    return rows
  })
}

function insertTopics (userData, topicData) {

  const fomrattedTopicData = topicData.map((topic) => {
    return [topic.slug, topic.description, topic.img_url]
  })

  const insertIntoTopicsStr = format(
    `INSERT INTO topics
      (slug, description, img_url)
      VALUES %L`, fomrattedTopicData)

  return db.query(insertIntoTopicsStr)
  }

function insertArticles(articleData) {

  const formattedArticleData = articleData.map((article) => {
    return [
      article.title, 
      0, // dynamically lookup topic
      0, // dynamically lookup author
      article.body,
      convertTimestampToDate(article).created_at,
      article.votes,
      article.img_url
    ]
  })

  const insertIntoArticlesStr = format(
    `INSERT INTO articles 
      (title, topic, author, body, created_at, votes, article_img_url)
      VALUES %L
      RETURNING *`, formattedArticleData)

  return db.query(insertIntoArticlesStr)
  .then(({rows}) => {
    return rows
  }
)
}

function insertComments (userData, articleDataWithIds, commentData) {
  const formattedCommentData = commentData.map((comment) => {
    return [
      0, // article_id - via lookupObj that pairs article_ids and titles
      comment.body,
      comment.votes,
      comment.author, // function that checks if the author === an existing user? 
      convertTimestampToDate(comment).created_at 
    ]
  })

  const insertIntoCommentsStr = format(
    `INSERT INTO comments 
      (article_id, body, votes, author, created_at)
      VALUES %L`, formattedCommentData)

  return db.query(insertIntoCommentsStr)

}

module.exports = seed;
