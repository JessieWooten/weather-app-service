// const sixHoursInMs = 21600000;
const fiveMinutes = 300000;
const generateCache = (entityName, cacheDuration = fiveMinutes) => {
  const repo = {};
  const name = entityName;

  function setItem(key, item) {
    if (!key || !item) {
      throw new Error("[CACHE]: Bad input");
    }
    repo[key] = {
      ...item,
      expiresAt: Date.now() + cacheDuration,
    };
  }
  function getCache() {
    return { ...repo };
  }
  function removeByKey(key) {
    delete repo[key];
  }
  function getItemByKey(key) {
    if (!repo[key]) return undefined;
    if (Date.now() > repo[key].expiresAt) {
      removeByKey(key);
      return undefined;
    }
    return repo[key];
  }
  function getName() {
    return name;
  }

  return {
    getCache,
    getItemByKey,
    removeByKey,
    setItem,
    getName,
  };
};
/**
 *
 * @param {Array} - keys an array of children repo names to be initialized into an parent cache
 * @returns {object}
 */
const createAppCache = (slices = []) => {
  return slices.reduce((obj, slice) => {
    const { key, duration } = slice;
    if (key) obj[key] = generateCache(key, duration);
    return obj;
  }, {});
};

module.exports = createAppCache;
