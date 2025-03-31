const endpointsList = require("../endpoints.json")

exports.getEndPointsList = (req, res, next) => {
  res.status(200).send({ endpoints: endpointsList })
}
