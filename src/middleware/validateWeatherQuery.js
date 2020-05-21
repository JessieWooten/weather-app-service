function validateWeatherQuery(req, res, next) {
  if (!req.query.address && !(req.query.latitude && req.query.latitude)) {
    return res.status(400).send({ message: "Must provide location" });
  }
  next();
}

module.exports = validateWeatherQuery;
