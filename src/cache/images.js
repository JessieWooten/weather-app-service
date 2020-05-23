const imageCache = (expiresAt) => {
  const images = {};

  function setImage(key, image) {
    if (!key || !image) {
      throw new Error("[IMAGE CACHE]: Bad input");
    }
    // const sixHoursInMs = 21600000;
    const fiveMinutes = 300000;
    images[key] = {
      ...image,
      expiresAt: Date.now() + fiveMinutes,
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
