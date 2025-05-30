const endpointsJson = require("../endpoints.json")

const request = require("supertest")
const app = require("../app")

const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data")
const db = require("../db/connection")

beforeEach(() => {
  return seed(data)
})

afterAll(() => {
  return db.end()
})

describe("/api", () => {
  describe("GET: /api", () => {
    test("200: Responds with an object detailing the documentation for each endpoint", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body: { endpoints } }) => {
          expect(endpoints).toEqual(endpointsJson)
        })
    })
  })
})

describe("/api/topics", () => {
  describe("GET /api/topics", () => {
    test("200: Responds with array of topic objects", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          topics.forEach((topic) => {
            expect(typeof topic.slug).toBe("string")
            expect(typeof topic.description).toBe("string")
          })
        })
    })
    test("404: Responds with 404 error when trying to access non-existant endpoint", () => {
      return request(app)
        .get("/api/tapicss")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Sorry, but that path doesn't exist on this server.")
        })
    })
  })
  describe("POST /api/topics", () => {
    test("200: responds with newly added topic obj containing slug and description and img url", () => {
      const newTopic = {
        slug: "divas",
        description: "who's your favourite divalicious diva?",
      }

      return request(app)
        .post("/api/topics")
        .send(newTopic)
        .expect(200)
        .then(({ body: { postedTopic } }) => {
          expect(postedTopic[0].slug).toBe("divas")
          expect(postedTopic[0].description).toBe("who's your favourite divalicious diva?")
          expect(postedTopic[0].img_url).toBe(null)
        })
    })
    test("400: responds with error msg if topic already exists", () => {
      return request(app)
        .post("/api/topics")
        .send({
          topic: "i love testing!!",
        })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid topic!")
        })
    })
  })
})

describe("/api/articles", () => {
  describe("GET /api/articles", () => {
    test("200: returns an array of all article objs in the database", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const articles = body.articles
          articles.forEach((article) => {
            expect(typeof article.author).toBe("string")
            expect(typeof article.title).toBe("string")
            expect(typeof article.article_id).toBe("number")
            expect(typeof article.topic).toBe("string")
            expect(typeof article.created_at).toBe("string")
            expect(typeof article.votes).toBe("number")
            expect(typeof article.article_img_url).toBe("string")
          })
        })
    })
    test("200: articles objs in arr do not contain body property", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const articles = body.articles
          articles.forEach((article) => {
            expect(typeof article.body).toBe("undefined")
          })
        })
    })
    test("200: article objs sorted in desc order by date", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const articles = body.articles
          expect(articles).toBeSorted({ key: "created_at", descending: true })
        })
    })
    test("200: article objs contain a comment_count", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const articles = body.articles
          articles.forEach((article) => {
            expect(typeof Number(article.comment_count)).toBe("number")
            expect(isNaN(Number(article.comment_count))).toBe(false)
          })
        })
    })
    test("404: responds with 404 if user enters wrong address", () => {
      return request(app)
        .get("/api/artocles")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Sorry, but that path doesn't exist on this server.")
        })
    })
  })
  describe("GET /api/articles (sorting queries)", () => {
    test("200: ?sort_by=topic sorts the articles by topic in descending order", () => {
      return request(app)
        .get(`/api/articles?sort_by=topic`)
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSorted({ key: "topic", descending: "true" })
        })
    })
    test("200: ?sort_by=author sorts the articles by author in descending order", () => {
      return request(app)
        .get(`/api/articles?sort_by=author`)
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSorted({ key: "author", descending: "true" })
        })
    })
    test("200: ?sort_by=votes sorts the articles by votes in descending order", () => {
      return request(app)
        .get(`/api/articles?sort_by=votes`)
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSorted({ key: "votes", descending: "true" })
        })
    })
    test("200: ?order=asc sorts the articles by created_at in ascending order", () => {
      return request(app)
        .get(`/api/articles?order=asc`)
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSorted({ key: "created_at" })
        })
    })
    test("200: ?sort_by=author&order=asc sorts the articles by author in ascending order", () => {
      return request(app)
        .get(`/api/articles?sort_by=author&order=asc`)
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSorted({ key: "author" })
        })
    })
    test("200: ?sort_by=votes&order=desc sorts the articles by author in descending order", () => {
      return request(app)
        .get(`/api/articles?sort_by=votes&order=desc`)
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSorted({ key: "votes", descending: "true" })
        })
    })
    test("400: invalid sort query responds with custom error", () => {
      return request(app)
        .get(`/api/articles?sort_by=chickens`)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe(
            "There are no bad questions, but there are bad queries, much like the one you just entered."
          )
        })
    })
    test("400: invalid order query responds with custom error", () => {
      return request(app)
        .get(`/api/articles?sort_by=votes&order=flatline`)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe(
            "There are no bad questions, but there are bad queries, much like the one you just entered."
          )
        })
    })
  })
  describe("GET /api/articles (topic query)", () => {
    test("200: responds with arr of only article objs with 'mitch' topic", () => {
      return request(app)
        .get(`/api/articles?topic=mitch`)
        .expect(200)
        .then(({ body: { articles } }) => {
          articles.forEach((article) => {
            expect(article.topic).toBe("mitch")
          })
        })
    })
    test("404: responds with path not found error when querying a topic that doesn't exist", () => {
      return request(app)
        .get(`/api/articles?topic=diva`)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Topic doesn't exist! (yet...)")
        })
    })
    test("400: responds with bad request error when passed a topic query that is longer than 200 chars", () => {
      const tooLongQuery =
        "tyuuoedgtfmzdgxiedeuhjzgrmnklewwohscakdocqnflrbkuraaudgxjugkgnupxlatogqkejgryqfcrnwhznwrqnybejfqjsxewerpkqliwebtsermzyivujbyjmjtagbbxtbmeqrfohwwlbwmbvdpzewagcawrhthadutffwquwrpqstsmbafkdrgoontyhdpnnovdo"

      return request(app)
        .get(`/api/articles?topic=${tooLongQuery}`)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid topic string query!")
        })
    })
  })
  describe("GET /api/articles/:article_id", () => {
    test("200: responds with a article obj when a get request is sent to endpoint with the article ID", () => {
      return request(app)
        .get("/api/articles/3")
        .expect(200)
        .then(({ body }) => {
          const articleObj = body.article[0]
          expect(articleObj.article_id).toBe(3)
          expect(typeof articleObj.author).toBe("string")
          expect(typeof articleObj.title).toBe("string")
          expect(typeof articleObj.body).toBe("string")
          expect(typeof articleObj.topic).toBe("string")
          expect(typeof articleObj.created_at).toBe("string")
          expect(typeof articleObj.votes).toBe("number")
          expect(typeof articleObj.article_img_url).toBe("string")
        })
    })
    test("404: responds with not found error when article_id is valid but does not exist", () => {
      return request(app)
        .get("/api/articles/1999")
        .expect(404)
        .then(({ body: msg }) => {
          expect(msg.msg).toBe("article doesn't exist! (yet...)")
        })
    })
    test("400: responds with invalid path error when article_id is invalid", () => {
      return request(app)
        .get("/api/articles/agazilliontrillion")
        .expect(400)
        .then(({ body: msg }) => {
          expect(msg.msg).toBe("You are valid, but that path you entered is not.")
        })
    })
  })
  describe("GET /api/articles/:article_id/comments", () => {
    test("200: responds with array with comment objs for specified article", () => {
      return request(app)
        .get("/api/articles/3/comments")
        .expect(200)
        .then(({ body }) => {
          const { comments } = body
          comments.forEach((comment) => {
            expect(typeof comment.comment_id).toBe("number")
            expect(typeof comment.votes).toBe("number")
            expect(typeof comment.created_at).toBe("string")
            expect(typeof comment.author).toBe("string")
            expect(typeof comment.body).toBe("string")
            expect(comment.article_id).toBe(3)
          })
        })
    })
    test("200: comments arr is ordered by most recent first", () => {
      return request(app)
        .get("/api/articles/3/comments")
        .expect(200)
        .then(({ body }) => {
          const { comments } = body
          expect(comments).toBeSorted({ key: "created_at", descending: true })
        })
    })
    test("404: when non-existant article id is given", () => {
      return request(app)
        .get("/api/articles/1991/comments")
        .expect(404)
        .then(({ body: msg }) => {
          expect(msg.msg).toBe("article doesn't exist! (yet...)")
        })
    })
    test("400: invalid request error when invalid article id is given", () => {
      return request(app)
        .get("/api/articles/kissykissy/comments")
        .expect(400)
        .then(({ body: msg }) => {
          expect(msg.msg).toBe("You are valid, but that path you entered is not.")
        })
    })
  })
  describe("POST /api/articles/:articles/comments", () => {
    test("201: comment body is added to comments table", () => {
      const newComment = {
        username: "lurker",
        body: "out of the shadows and into...the dust",
      }
      return request(app)
        .post("/api/articles/1")
        .send(newComment)
        .expect(201)
        .then(() => {
          return db
            .query(`SELECT * FROM comments WHERE body = $1`, [newComment.body])
            .then(({ rows }) => {
              expect(rows.length === 1).toBe(true)
            })
        })
    })
    test("201: new comment in comments table has article_id, votes (defaulted to 0), author and created_at (with current date/time) properties", () => {
      const newComment = {
        username: "lurker",
        body: "out of the shadows and into...the dust",
      }
      return request(app)
        .post("/api/articles/1")
        .send(newComment)
        .expect(201)
        .then(() => {
          return db
            .query(`SELECT * FROM comments WHERE body = $1`, [newComment.body])
            .then(({ rows }) => {
              const comment = rows[0]
              expect(typeof comment.comment_id).toBe("number")
              expect(comment.article_id).toBe(1)
              expect(comment.votes).toBe(0)
              expect(comment.author).toBe(newComment.username)
              expect(typeof comment.created_at).toBe("object")
            })
        })
    })
    test("201: responds with the posted comment", () => {
      const newComment = {
        username: "lurker",
        body: "goodness, it's loud out here. sod it, I'm going back in the cave.",
      }
      return request(app)
        .post("/api/articles/1")
        .send(newComment)
        .expect(201)
        .then((response) => {
          const postedComment = JSON.parse(response.text).comment[0]
          expect(typeof postedComment.comment_id).toBe("number")
          expect(postedComment.article_id).toBe(1)
          expect(postedComment.body).toBe(newComment.body)
          expect(postedComment.votes).toBe(0)
          expect(postedComment.author).toBe(newComment.username)
          expect(typeof postedComment.created_at).toBe("string")
        })
    })
    test("400: responds with error when sent an empty request body", () => {
      const newComment = {}
      return request(app)
        .post("/api/articles/1")
        .send(newComment)
        .expect(400)
        .then(({ body: response }) => {
          expect(response.msg).toBe("Keep invalid comments to yourself")
        })
    })
    test("400: responds with error when sent request body without a username", () => {
      const newComment = {
        body: "wait, who am I???",
      }
      return request(app)
        .post("/api/articles/1")
        .send(newComment)
        .expect(400)
        .then(({ body: response }) => {
          expect(response.msg).toBe("Keep invalid comments to yourself")
        })
    })
    test("400: responds with error when sent request body without a body", () => {
      const newComment = {
        username: "butter_bridge",
      }
      return request(app)
        .post("/api/articles/1")
        .send(newComment)
        .expect(400)
        .then(({ body: response }) => {
          expect(response.msg).toBe("Keep invalid comments to yourself")
        })
    })
    test("400: responds with error when sent username/body values that are not strings", () => {
      const newComment = {
        username: 31121999,
        body: { trojan: "horse" },
      }
      return request(app)
        .post("/api/articles/1")
        .send(newComment)
        .expect(400)
        .then(({ body: response }) => {
          expect(response.msg).toBe("Keep invalid comments to yourself")
        })
    })
  })
  describe("PATCH /api/articles/:articles", () => {
    test("200: updates article with +100 votes when sent inc_votes object with value of 100", async () => {
      // Tried out using async/await in a test that would otherwise have three levels of nesting. But I actually think it looks messier?

      const votesToAdd = { inc_votes: 100 }
      const articleToUpdate = 1

      const { rows } = await db.query(`SELECT votes FROM articles WHERE article_id = $1`, [
        articleToUpdate,
      ])
      const oldVotes = rows[0].votes

      await request(app).patch(`/api/articles/${articleToUpdate}`).send(votesToAdd).expect(200)

      const updatedResponse = await db.query(`SELECT votes FROM articles WHERE article_id = $1`, [
        articleToUpdate,
      ])

      const updatedVotes = updatedResponse.rows[0].votes
      expect(updatedVotes === oldVotes + 100).toBe(true)
    })
    test("200: responds with updated article obj", () => {
      const votesToAdd = { inc_votes: 100 }

      return request(app)
        .patch(`/api/articles/1`)
        .send(votesToAdd)
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article.article_id).toBe(1)
          expect(typeof article.author).toBe("string")
          expect(typeof article.title).toBe("string")
          expect(typeof article.body).toBe("string")
          expect(typeof article.topic).toBe("string")
          expect(typeof article.created_at).toBe("string")
          expect(typeof article.votes).toBe("number")
          expect(typeof article.article_img_url).toBe("string")
        })
    })
    test("404: article_id valid but doesn't exist", () => {
      const votesToAdd = { inc_votes: 100 }

      return request(app)
        .patch(`/api/articles/1991`)
        .send(votesToAdd)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("article doesn't exist! (yet...)")
        })
    })
    test("400: votes obj has invalid key", () => {
      const votesToAdd = { colusion: 100 }

      return request(app)
        .patch(`/api/articles/1991`)
        .send(votesToAdd)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe(
            "The sent vote obj was invalid. Did someone say election interference?"
          )
        })
    })
    test("400: votes obj has value that is not a number", () => {
      const votesToAdd = { inc_votes: "onehundred" }

      return request(app)
        .patch(`/api/articles/1991`)
        .send(votesToAdd)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe(
            "The sent vote obj was invalid. Did someone say election interference?"
          )
        })
    })
  })
  describe("GET /api/articles/:article_id (includes comment count)", () => {
    test("200: article response obj contains comment_count", () => {
      return request(app)
        .get(`/api/articles/9`)
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article[0].comment_count).toBe("2")
        })
    })
  })
  describe("POST /api/articles (post new article)", () => {
    test("200: responds with created article + the newly assigned article_id, votes, created_at and comment_count", () => {
      const testArticle = {
        author: "lurker",
        title: "how do I paint my hedgehog blue?",
        body: "like can I just use normal paint or should I use a tinted moisturiser or something??",
        topic: "mitch",
        article_img_url: "https://cdn.pixabay.com/photo/2019/08/10/17/15/hedgehog-4397351_1280.jpg",
      }

      return request(app)
        .post("/api/articles")
        .send(testArticle)
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article.author).toBe("lurker")
          expect(article.title).toBe("how do I paint my hedgehog blue?")
          expect(article.body).toBe(
            "like can I just use normal paint or should I use a tinted moisturiser or something??"
          )
          expect(article.topic).toBe("mitch")
          expect(article.article_img_url).toBe(
            "https://cdn.pixabay.com/photo/2019/08/10/17/15/hedgehog-4397351_1280.jpg"
          )
          expect(typeof Number(article.article_id)).toBe("number")
          expect(isNaN(Number(article.article_id))).toBe(false)
          expect(Number(article.votes)).toBe(0)
          expect(Number(article.comment_count)).toBe(0)
          expect(typeof article.created_at).toBe("object")
        })
    })
    test("400: returns error if author not provided", () => {
      const testArticle = {
        title: "how do I paint my hedgehog blue?",
        body: "like can I just use normal paint or should I use a tinted moisturiser or something??",
        topic: "mitch",
      }

      return request(app)
        .post("/api/articles")
        .send(testArticle)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid article!")
        })
    })
    test("400: returns error if title not provided", () => {
      const testArticle = {
        body: "like can I just use normal paint or should I use a tinted moisturiser or something??",
        topic: "mitch",
        author: "lurker",
      }

      return request(app)
        .post("/api/articles")
        .send(testArticle)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid article!")
        })
    })
    test("400: returns error if body not provided", () => {
      const testArticle = {
        title: "tiggly tollies",
        topic: "mitch",
        author: "lurker",
      }
      return request(app)
        .post("/api/articles")
        .send(testArticle)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid article!")
        })
    })
    test("400: returns error if topic not provided", () => {
      const testArticle = {
        title: "tiggly tollies",
        author: "lurker",
        body: "like can I just use normal paint or should I use a tinted moisturiser or something??",
      }
      return request(app)
        .post("/api/articles")
        .send(testArticle)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid article!")
        })
    })
  })
  describe("PAGINATION /api/articles", () => {
    test("returns an array of 10 articles when passed no limit and no page values", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).toBe(10)
        })
    })
    test("returns an array of 5 articles when query provides a string limit of 5", () => {
      return request(app)
        .get("/api/articles")
        .query({
          limit: "5",
        })
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).toBe(5)
        })
    })
    test("returns an array of 6 articles when query provides an INT limit of 6", () => {
      return request(app)
        .get("/api/articles")
        .query({
          limit: 6,
        })
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).toBe(6)
        })
    })
    test("returns array of 5 articles with limit 5 and page 1, following query of page 2 contains the next 5 articles ", () => {
      return request(app)
        .get("/api/articles")
        .query({
          limit: 5,
          page: 1,
        })
        .expect(200)
        .then(({ body: { articles } }) => {
          const lastArticleTimeStampPage1 = articles[4].created_at
          return request(app)
            .get("/api/articles")
            .query({
              limit: 5,
              page: 2,
            })
            .expect(200)
            .then(({ body: { articles } }) => {
              const lastArticleTimeStampPage2 = articles[4].created_at
              expect(lastArticleTimeStampPage1 > lastArticleTimeStampPage2)
            })
        })
    })
    test("returns total_count property on the return object containing the full number of articles when no topic filters applied", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { total_count } }) => {
          expect(total_count).toBe("13")
        })
    })
    test("returns total_count property when topic filter is applied", () => {
      return request(app)
        .get("/api/articles")
        .query({ topic: "mitch" })
        .expect(200)
        .then(({ body: { total_count } }) => {
          expect(total_count).toBe("12")
        })
    })
  })
  describe("PAGINATION /api/articles/:article_id/comments", () => {
    test("responds with array of 10 comments when passed no limit", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments.length).toBe(10)
        })
    })
    test("responds with array of 5 comments when passed a limit of 5", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .query({
          limit: 5,
        })
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments.length).toBe(5)
        })
    })
    test("returns array of 5 comments with limit 5 and page 1, following query of page 2 contains the next 5 comments with an older created_at stamp", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .query({
          limit: 5,
          page: 1,
        })
        .expect(200)
        .then(({ body: { comments } }) => {
          const lastCommentTimeStampPage1 = comments[4].created_at
          return request(app)
            .get("/api/articles/1/comments")
            .query({
              limit: 5,
              page: 2,
            })
            .expect(200)
            .then(({ body: { comments } }) => {
              const lastCommentTimeStampPage2 = comments[4].created_at
              expect(lastCommentTimeStampPage1 > lastCommentTimeStampPage2)
            })
        })
    })
    test("400: returns error when page number queried is beyond the available number of comments", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .query({ limit: 5, page: 5 })
        .then(({ body: { comments } }) => {})
    })
  })
  describe("DELETE /api/articles/:article_id", () => {
    test("204: responds with a 204 status and no content", () => {
      return request(app)
        .delete("/api/articles/1")
        .expect(204)
        .then(({ body }) => {
          expect(body).toEqual({})
        })
    })
    test("204: article has been successfully removed from database", () => {
      return request(app)
        .delete("/api/articles/2")
        .expect(204)
        .then((response) => {
          return request(app)
            .get("/api/articles/2")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("article doesn't exist! (yet...)")
            })
        })
    })
    test("404: responds with not found error if article id doesn't exist", () => {
      return request(app)
        .delete("/api/articles/1991")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("article doesn't exist! (yet...)")
        })
    })
  })
})

describe("/api/comments", () => {
  describe("DELETE /api/comments/:comment_id", () => {
    test("receives a 204 status and no content", () => {
      const comment_id = 1

      return request(app)
        .delete(`/api/comments/1`)
        .expect(204)
        .then((response) => {})
    })
    test("removes comment with specified comment_id from db", () => {
      const comment_id = 1
      return request(app)
        .delete(`/api/comments/1`)
        .expect(204)
        .then(() => {
          db.query(`SELECT * FROM comments where comment_id = ${comment_id}`).then(({ rows }) => {
            expect(rows.length).toBe(0)
          })
        })
    })
    test("comment_id is valid but doesn't exist", () => {
      return request(app)
        .delete(`/api/comments/1991`)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("comment doesn't exist! (yet...)")
        })
    })
  })
  describe("PATCH /api/comments/:comment_id", () => {
    test("responds with comment obj with updated vote value for the comment with specified comment_id ", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: 4 })
        .expect(200)
        .then(({ body: { updatedComment } }) => {
          expect(updatedComment.comment_id).toBe(1)
          expect(updatedComment.votes).toBe(20)
        })
    })
  })
})

describe("/api/users", () => {
  describe("GET /api/users", () => {
    test("200: responds with an array containing ALL user objs", () => {
      let userCount = 0

      return db.query(`SELECT * FROM users`).then(({ rows }) => {
        userCount = rows.length
        return request(app)
          .get(`/api/users`)
          .expect(200)
          .then(({ body: { users } }) => {
            expect(users.length).toBe(userCount)
          })
      })
    })
    test("200: user objs have username, name, avatar_url properties", () => {
      return request(app)
        .get(`/api/users`)
        .expect(200)
        .then(({ body: { users } }) => {
          users.forEach((user) => {
            expect(typeof user.username).toBe("string")
            expect(typeof user.name).toBe("string")
            expect(typeof user.avatar_url).toBe("string")
          })
        })
    })
  })
  describe("GET /api/users/:username", () => {
    test("200: responds with username object for the specified username containing username, avatar_url and name", () => {
      const lurkerAvatarUrl =
        "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png"

      return request(app)
        .get("/api/users/lurker")
        .expect(200)
        .then(({ body: { user } }) => {
          expect(user.username).toBe("lurker")
          expect(user.avatar_url).toBe(lurkerAvatarUrl)
          expect(user.name).toBe("do_nothing")
        })
    })
    test("404: responds with not found error if username doesn't exist", () => {
      return request(app)
        .get("/api/users/sonicderirreigel")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("user doesn't exist! (yet...)")
        })
    })
  })
})
