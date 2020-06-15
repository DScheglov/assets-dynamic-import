import { appendNodeAsync, createElement } from './dom-ops';
import { cacheAll, onlyIfNotFn, onlyIfFn } from './utils';

export const appendStyle = (href, nodeProps, resolveCallback = onlyIfFn(nodeProps)) =>
  appendNodeAsync(
    global.document.head,
    createElement('link', {
      rel: 'stylesheet', href, ...onlyIfNotFn(nodeProps)
    }),
    resolveCallback
  );

export const appendScript = (src, nodeProps, resolveCallback = onlyIfFn(nodeProps)) =>
  appendNodeAsync(
    global.document.body,
    createElement('script', {
      type: 'text/javascript', async: true, src, ...onlyIfNotFn(nodeProps)
    }),
    resolveCallback
  );

export const importScript = cacheAll(appendScript);

export const importStyle = cacheAll(appendStyle);

export {
  appendNodeAsync,
  cacheAll,
  createElement
};
