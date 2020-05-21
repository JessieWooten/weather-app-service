const request = require("request");

const forecast = (lat, long, location, callback) => {
  const token = process.env.FORECAST_API_KEY;
  if (!token) return callback("[Weather]: No API key found.");
  const url = `https://api.darksky.net/forecast/${token}/${lat},${long}`;
  request.get({ url, json: true }, (error, { body }) => {
    if (error) {
      callback("FORECAST ERROR");
      // console.error('Get Weather Errror: ', err);
    } else if (body.error) {
      callback("Couldnt get weather");
    } else {
      const data = body;
      const { summary } = data.daily;
      let msg = `It is currently ${data.currently.temperature} degrees and there is a ${data.currently.precipProbability}% chance of rain in ${location}.`;
      callback(undefined, summary + "\n" + msg);
    }
  });
};

module.exports = forecast;
