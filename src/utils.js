const identity = x => x;

const withCache = (cache, fn, getKey, checkCache) => (...args) => {
  const key = getKey(...args);

  if (checkCache && cache.has(key)) return cache.get(key);

  const result = fn(...args);
  cache.set(key, result);

  return result;
};

export const cacheAll = (fn, getKey = identity) => {
  const cache = new Map();

  const cached = withCache(cache, fn, getKey, true);
  cached.force = withCache(cache, fn, getKey, false);

  return cached;
};

export const onlyIfFn = (value, def) => typeof value === 'function' ? value : def;

export const onlyIfNotFn = (value, def) => typeof value !== 'function' ? value : def;

export const handleWith = (...handlers) => {
  const fnHandlers = handlers.filter(handler => typeof handler === 'function');

  return function polyHandler (...args) {
    fnHandlers.forEach(handler => handler.apply(this, args));
  };
};
