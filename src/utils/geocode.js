const request = require("request");

const fetchGeocode = (address) => {
  return new Promise((resolve, reject) => {
    // get Token from env vars
    const TOKEN = process.env.GEOCODE_API_KEY;
    if (!TOKEN) return reject("[Geocode]: No Api key found.");

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${TOKEN}`;
    request.get({ url, json: true }, (err, { statusCode, body }) => {
      // if error
      if (err || body.error) {
        return reject({
          status: statusCode || 500,
          body: { message: "GEOCODE ERROR", error: err || body.error },
        });
      }
      // if not expected shape
      if (!body.hasOwnProperty("features") || body.features.length === 0) {
        return reject({
          status: 404,
          body: { message: "No location found", error: body },
        });
      }

      const location = body.features[0];
      resolve({
        latitude: location.center[1],
        longitude: location.center[0],
        location: location.place_name,
      });
    });
  });
};

module.exports = fetchGeocode;
