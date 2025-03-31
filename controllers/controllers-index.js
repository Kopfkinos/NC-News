module.exports = {
  ...require("./articles-controllers"),
  ...require("./comments-controllers"),
  ...require("./topics-controllers"),
  ...require("./users-controllers"),
  ...require("./errors-controllers"),
  ...require("./api-controller"),
}
