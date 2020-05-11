import appendNodeAsync from './appendNodeAsync';
import cacheAll from './cacheAll';

const createElement = (tagName, nodeProps) => Object.assign(
  global.document.createElement(tagName),
  nodeProps
);

const appendStyle = (href, nodeProps, resolveCallback) => appendNodeAsync(
  global.document.head,
  createElement('link', {
    rel: 'stylesheet',
    href,
    ...nodeProps
  }),
  resolveCallback
);

const appendScript = (src, nodeProps, resolveCallback) => appendNodeAsync(
  global.document.body,
  createElement('script', {
    type: 'text/javascript',
    async: true,
    src,
    ...nodeProps
  }),
  resolveCallback
);

const buildCacheKey = (url, props = null) => `${url}${JSON.stringify(props)}`;

export const importScript = cacheAll(appendScript, buildCacheKey);
export const importStyle = cacheAll(appendStyle, buildCacheKey);
