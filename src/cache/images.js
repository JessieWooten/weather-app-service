const imageCache = () => {
  const images = {};

  function setImage(key, image) {
    if (!key || !image) {
      throw new Error("[IMAGE CACHE]: Bad input");
    }
    const sixHoursInMs = 21600000;
    images[key] = {
      ...image,
      expiresAt: Date.now() + sixHoursInMs,
    };
  }
  function getCache() {
    return { ...images };
  }
  function removeByKey(key) {
    delete images[key];
  }
  function getImageByKey(key) {
    if (!images[key]) return undefined;
    if (Date.now() > images[key].expiresAt) {
      removeByKey(key);
      return undefined;
    }
    return images[key];
  }

  return {
    getCache,
    getImageByKey,
    removeByKey,
    setImage,
  };
};

module.exports = imageCache;
