const db = require("../connection")
const format = require("pg-format")
const { convertTimestampToDate, createLookupObj } = require("./utils")

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db.query("DROP TABLE IF EXISTS comments;").then(() => {
    return db
      .query("DROP TABLE IF EXISTS articles;")
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
        return insertTopics(topicData)
      })
      .then(() => {
        return insertArticles(articleData)
      })
      .then((articlesDataWithIds) => {
        return insertComments(articlesDataWithIds, commentData)
      })
  })
}

function createUsers() {
  return db.query(`
    CREATE TABLE users (
      username VARCHAR PRIMARY KEY,
      name VARCHAR (50) NOT NULL,
      avatar_url VARCHAR(1000));`)
}
function createTopics() {
  return db.query(`
    CREATE TABLE topics (
      slug VARCHAR(200) PRIMARY KEY NOT NULL,
      description VARCHAR(100) NOT NULL,
      img_url VARCHAR(1000));`)
}

function createArticles() {
  return db.query(`
    CREATE TABLE articles (
      article_id SERIAL PRIMARY KEY,
      title VARCHAR NOT NULL,
      topic VARCHAR NOT NULL
        CONSTRAINT fk_topic REFERENCES topics(slug),
      author VARCHAR NOT NULL
        CONSTRAINT fk_author REFERENCES users(username),
      body TEXT NOT NULL,
      created_at TIMESTAMP,
      votes INT DEFAULT 0,
      comment_count INT DEFAULT 0,
      article_img_url VARCHAR (1000));`)
}
function createComments() {
  return db.query(`
    CREATE TABLE comments (
      comment_id SERIAL PRIMARY KEY,
      article_id INTEGER
        CONSTRAINT fk_article_id REFERENCES articles(article_id) ON DELETE CASCADE,
      body TEXT,
      votes INT DEFAULT 0,
      author VARCHAR 
        CONSTRAINT fk_author REFERENCES users(username),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(0));`)
}

function insertUsers(userData) {
  const usersArr = userData.map((user) => {
    return [user.username, user.name, user.avatar_url]
  })

  const insertIntoUserStr = format(
    `INSERT INTO users
      (username, name, avatar_url)
        VALUES %L
          RETURNING *`,
    usersArr
  )

  return db.query(insertIntoUserStr).then(({ rows }) => {
    return rows
  })
}

function insertTopics(topicData) {
  const fomrattedTopicData = topicData.map((topic) => {
    return [topic.slug, topic.description, topic.img_url]
  })

  const insertIntoTopicsStr = format(
    `INSERT INTO topics
      (slug, description, img_url)
      VALUES %L`,
    fomrattedTopicData
  )

  return db.query(insertIntoTopicsStr)
}

function insertArticles(articleData) {
  const formattedArticleData = articleData.map((article) => {
    return [
      article.title,
      article.topic, // need to check that topic slug exists?
      article.author, //
      article.body,
      convertTimestampToDate(article).created_at,
      article.votes,
      article.article_img_url,
    ]
  })

  const insertIntoArticlesStr = format(
    `INSERT INTO articles 
      (title, topic, author, body, created_at, votes, article_img_url)
      VALUES %L
      RETURNING *`,
    formattedArticleData
  )

  return db.query(insertIntoArticlesStr).then(({ rows }) => {
    return rows
  })
}

function insertComments(articlesDataWithIds, commentData) {
  const articleLookupObj = createLookupObj(articlesDataWithIds, "title", "article_id")

  const formattedCommentData = commentData.map((comment) => {
    return [
      articleLookupObj[comment.article_title],
      comment.body,
      comment.votes,
      comment.author, // check if the author is an existing user?
      convertTimestampToDate(comment).created_at,
    ]
  })

  const insertIntoCommentsStr = format(
    `INSERT INTO comments 
      (article_id, body, votes, author, created_at)
      VALUES %L`,
    formattedCommentData
  )

  return db.query(insertIntoCommentsStr)
}

module.exports = seed
