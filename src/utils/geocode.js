const request = require("request");
const { geolocationCache } = require("../app");

/**
 * Accepts a place name and returns geographical coordinates
 * @param {string} place name of location i.e. 'Nashville,Tn'
 * @return {Promise<{ latitude: number, longitude: number, location: string }>} resolves Coordinates or rejects error
 */
const fetchGeocode = (place) => {
  return new Promise((resolve, reject) => {
    place = cleanPlaceName(place);
    const cachedCoordinates = geolocationCache.getItemByKey(place);
    if (cachedCoordinates) return resolve(cachedCoordinates);
    // get Token from env vars
    const TOKEN = process.env.GEOCODE_API_KEY;
    if (!TOKEN) return reject("[Geocode]: No Api key found.");

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json?access_token=${TOKEN}`;
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
      const coordinates = {
        latitude: location.center[1],
        longitude: location.center[0],
        location: location.place_name,
      };
      geolocationCache.setItem(place, coordinates);
      resolve(coordinates);
    });
  });
};

/**
 * accepts a place name and removes excess spaces and converts to lowercase
 * "Nashville,   Tn  " -> "nashville,tn"
 * @param {string} name
 * @returns {string}
 */
function cleanPlaceName(name) {
  return name
    .split(",")
    .map((p) =>
      p
        .trim()
        .toLowerCase()
        .split(" ")
        .filter((w) => !!w.trim())
        .join(" ")
    )
    .join();
}
module.exports = fetchGeocode;
