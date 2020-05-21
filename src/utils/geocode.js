const request = require("request");

const geocode = (address, callback) => {
  const token = process.env.GEOCODE_API_KEY;
  if (!token) return callback("[Geocode]: No Api key found.");
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    address
  )}.json?access_token=${token}`;
  request.get({ url, json: true }, (err, { body }) => {
    if (err) {
      callback("GEOCODE ERROR", undefined);
    } else if (
      body.error ||
      !body.hasOwnProperty("features") ||
      body.features.length === 0
    ) {
      console.log(body);
      callback("No location found", undefined);
    } else {
      let data = body.features[0];
      callback(undefined, {
        latitude: data.center[1],
        longitude: data.center[0],
        location: data.place_name,
      });
    }
  });
};

module.exports = geocode;
