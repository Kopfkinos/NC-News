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
