import { handleWith } from './utils';

const resetLoadHandlers = (node, onload, onerror) => () => {
  node.onload = onload;
  node.onerror = onerror;
};

export const appendNodeAsync = (target, node, resolveCallback) => new Promise(
  (resolve, reject) => {
    const resetHandlers = resetLoadHandlers(node, node.onload, node.onerror);

    node.onload = handleWith(
      resetHandlers,
      node.onload,
      () => resolve(
        typeof resolveCallback === 'function' ? resolveCallback() : undefined
      )
    );

    node.onerror = handleWith(
      resetHandlers,
      node.onerror,
      target.removeChild.bind(target, node),
      () => reject(new Error(
        `Couldn't load ${node.rel || node.tagName} by url: ${node.href || node.src}`
      ))
    );

    target.appendChild(node);
  });

export const createElement = (tagName, nodeProps) => Object.assign(
  global.document.createElement(tagName),
  nodeProps
);
