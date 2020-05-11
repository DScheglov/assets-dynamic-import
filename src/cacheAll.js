const getFirstArg = arg => arg;

const cacheAll = (pureFn, getKey = getFirstArg) => {
  const cache = new Map();
  return (...args) => {
    const key = getKey(...args);

    if (cache.has(key)) return cache.get(key);

    const result = pureFn(...args);
    cache.set(key, result);

    return result;
  };
};

export default cacheAll;
