const endpointsJson = require("../endpoints.json")

const request = require("supertest")
/* Set up your test imports here */
const app = require("../app")

const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data")
const db = require("../db/connection")

/* Set up your beforeEach & afterAll functions here */
beforeEach(() => {
  return seed(data)
})

afterAll(() => {
  return db.end()
})

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson)
      })
  })
})

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

describe("/api/articles/:article_id", () => {
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
        expect(msg.msg).toBe("Path not found")
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
describe("/api/articles", () => {
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

describe("/api/articles/:article_id/comments", () => {
  test("200: responds with array with comment objs for specified article", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body
        console.log(body.comments)
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
        expect(msg.msg).toBe("Path not found")
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
