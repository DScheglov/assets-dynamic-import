import appendNodeAsync from './appendNodeAsync';
import cacheAll from './cacheAll';

const createElement = (tagName, nodeProps) => Object.assign(
  global.document.createElement(tagName),
  nodeProps
);

const onlyIfFn = (value, def) => typeof value === 'function' ? value : def;
const onlyIfNotFn = (value, def) => typeof value !== 'function' ? value : def;

const appendStyle = (href, nodeProps, resolveCallback = onlyIfFn(nodeProps)) => appendNodeAsync(
  global.document.head,
  createElement('link', {
    rel: 'stylesheet',
    href,
    ...onlyIfNotFn(nodeProps)
  }),
  resolveCallback
);

const appendScript = (src, nodeProps, resolveCallback = onlyIfFn(nodeProps)) => appendNodeAsync(
  global.document.body,
  createElement('script', {
    type: 'text/javascript',
    async: true,
    src,
    ...onlyIfNotFn(nodeProps)
  }),
  resolveCallback
);

const buildCacheKey = (url, props = null) => `${url}${JSON.stringify(onlyIfNotFn(props, ''))}`;

export const importScript = cacheAll(appendScript, buildCacheKey);
export const importStyle = cacheAll(appendStyle, buildCacheKey);
