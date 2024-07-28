import { handleWith } from './utils';

export type AssetsNode = HTMLLinkElement | HTMLScriptElement;

const resetLoadHandlers =
  (
    node: AssetsNode,
    onload: AssetsNode['onload'],
    onerror: AssetsNode['onerror'],
  ) =>
  () => {
    node.onload = onload;
    node.onerror = onerror;
  };

export const appendNodeAsync = <T = undefined>(
  target: Node,
  node: AssetsNode,
  resolveCallback?: () => T,
) =>
  new Promise<T>((resolve, reject) => {
    const resetHandlers = resetLoadHandlers(node, node.onload, node.onerror);

    node.onload = handleWith<[ev: Event], GlobalEventHandlers>(
      resetHandlers,
      node.onload,
      () =>
        resolve(
          (typeof resolveCallback === 'function'
            ? resolveCallback()
            : undefined) as T,
        ),
    );

    node.onerror = handleWith<
      Parameters<NonNullable<AssetsNode['onerror']>>,
      unknown
    >(resetHandlers, node.onerror, target.removeChild.bind(target, node), () =>
      reject(
        new Error(
          `Couldn't load ${(node as any).rel || (node as any).tagName} by url: ${(node as any).href || (node as any).src}`,
        ),
      ),
    );

    target.appendChild(node);
  });

export const createElement = <K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  nodeProps?: Partial<HTMLElementTagNameMap[K]>,
): HTMLElementTagNameMap[K] =>
  Object.assign(global.document.createElement(tagName), nodeProps);
