const request = require("request");
const { imageCache } = require("../app");
const TOKEN = process.env.IMAGE_API_KEY;

/**
 * accepts a keyword and returns a related image.
 * @param {string} keyword
 * @returns {Promise} resolves as Forecast object {id: string, imgUrl: string, photographer: string} or rejects error
 */
const fetchImageByKeyword = (keyword) => {
  return new Promise((resolve, reject) => {
    if (!keyword) {
      return reject({
        status: statusCode || 400,
        body: { message: "Bad input" },
      });
    }

    keyword = encodeURIComponent(keyword.split("-").join(" "));
    //check cache
    const cachedImage = imageCache.getItemByKey(keyword);
    if (cachedImage) return resolve(cachedImage);

    // no cached results, fetch from api
    if (!TOKEN) return reject("[Geocode]: No Api key found.");
    const url = `https://api.unsplash.com/search/photos?page=1&query=${keyword}&orientation=landscape&client_id=${TOKEN}`;
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
          body: {
            message: "Image response is misformed",
            error: { image, results },
          },
        });
      }

      // Success
      const imageObj = {
        id: image.id,
        imgUrl: image.urls.regular,
        photographer: image.user.name,
      };

      imageCache.setItem(keyword, imageObj);
      resolve(imageObj);
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
