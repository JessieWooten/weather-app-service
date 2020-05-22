const request = require("request");

const fetchForecast = (latitude, longitude) => {
  return new Promise((resolve, reject) => {
    const token = process.env.FORECAST_API_KEY;
    if (!token) return callback("[Weather]: No API key found.");
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
        summary: body.daily.summary,
        icon: body.daily.icon,
        precipProbability: body.currently.precipProbability,
      };
      resolve(forecast);
    });
  });
};

module.exports = fetchForecast;
