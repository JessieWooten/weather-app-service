const request = require("request");
const COLOR_MAP = {
  "clear-day": "blue",
  "clear-night": "purple",
  rain: "blue",
  snow: "white",
  sleet: "white",
  wind: "black_and_white",
  fog: "black_and_white",
  cloudy: "black_and_white",
  "partly-cloudy-day": "blue",
  "partly-cloudy-night": "black",
  hail: "white",
  thunderstorm: "yellow",
  tornado: "red",
};

const fetchImageByKeyword = (keyword) => {
  return new Promise((resolve, reject) => {
    if (!keyword) {
      return reject({
        status: statusCode || 400,
        body: { message: "Bad input" },
      });
    }
    const color = COLOR_MAP[keyword.replace("cold ", "")];
    keyword = encodeURIComponent(keyword.split("-").join(" "));
    // get Token from env vars
    const TOKEN = process.env.IMAGE_API_KEY;
    if (!TOKEN) return reject("[Geocode]: No Api key found.");
    const url = `https://api.unsplash.com/search/photos?page=1&query=${keyword}&color=${color}&orientation=landscape&client_id=${TOKEN}`;
    request.get({ url, json: true }, (err, { statusCode, body }) => {
      // if error
      if (err || body.error) {
        return reject({
          status: statusCode || 500,
          body: { message: "IMAGE ERROR", error: err || body.error },
        });
      }
      const { results } = body;
      const image = getRandomImage(results);
      // if not expected shape
      if (!image || !image.urls) {
        return reject({
          status: 404,
          body: { message: "Image response is misformed", error: image },
        });
      }

      resolve({
        id: image.id,
        imgUrl: image.urls.regular,
        photographer: image.user ? image.user.name : "",
      });
    });
  });
};

module.exports = fetchImageByKeyword;

function getRandomImage(images) {
  const limit = images.length;
  if (limit < 2) return images[0];

  const index = Math.floor(Math.random() * limit);
  return images[index];
}
