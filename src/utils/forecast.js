const request = require("request");
const { forecastCache } = require("../app");
const token = process.env.FORECAST_API_KEY;

/**
 * accepts latitude and longitude and returns a weather forecast for the area
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise} resolves as Forecast object {temperature: number,summary: string,icon: string,precipProbability: number} or rejects error
 */
const fetchForecast = (latitude, longitude) => {
  return new Promise((resolve, reject) => {
    const forcastCacheKey = createForecastCacheKey(latitude, longitude);
    const cachedForecast = forecastCache.getItemByKey(forcastCacheKey);
    if (cachedForecast) return resolve(cachedForecast);

    if (!token)
      return reject({
        status: 500,
        body: {
          message: "FORECAST ERROR",
          error: "[Weather]: No API key found.",
        },
      });
    const url = `https://api.darksky.net/forecast/${token}/${latitude},${longitude}`;

    request.get({ url, json: true }, (error, { statusCode, body }) => {
      // if request error
      if (error || body.error) {
        return reject({
          status: statusCode || 500,
          body: {
            message: error ? "FORECAST ERROR" : "Couldnt get weather",
            error: error || body.error,
          },
        });
      }
      // if shape is incorrect
      if (!body.daily) {
        return reject({
          status: 404,
          body: {
            message: "Couldnt get daily weather for location",
            error: body,
          },
        });
      }
      const forecast = {
        temperature: body.currently.temperature,
        summary: body.currently.summary,
        icon: body.currently.icon,
        precipProbability: body.currently.precipProbability,
      };
      forecastCache.setItem(forcastCacheKey, forecast);
      resolve(forecast);
    });
  });
};

/**
 * takes lat and long and returns string to be used as cache key
 * @param {number} latitude ex 111111
 * @param {number} longitude ex 222222
 * @returns {string} ex "111111,222222"
 */
function createForecastCacheKey(latitude, longitude) {
  return `${latitude},${longitude}`;
}

module.exports = fetchForecast;
