const resetLoadHandlers = (node, onload, onerror) => () => {
  node.onload = onload;
  node.onerror = onerror;
};

const handleWith = (...handlers) => {
  const fnHandlers = handlers.filter(handler => typeof handler === 'function');

  return function polyHandler (...args) {
    fnHandlers.forEach(handler => handler.apply(this, ...args));
  };
};

const appendNodeAsync = (target, node, resolveCallback) => new Promise(
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
      () => reject(new Error(
        `Couldn't load ${node.rel || node.tagName} by url: ${node.href || node.src}`
      ))
    );

    target.appendChild(node);
  });

export default appendNodeAsync;
