import { appendNodeAsync, createElement } from './dom-ops';
import { cacheAll, onlyIfNotFn, onlyIfFn } from './utils';

export const appendStyle: {
  (href: string): Promise<void>;
  (
    href: string,
    nodeProps: Partial<HTMLElementTagNameMap['link']>,
  ): Promise<void>;
  <T>(href: string, resolveCallback: () => T): Promise<T>;
  <T>(
    href: string,
    nodeProps: Partial<HTMLElementTagNameMap['link']>,
    resolveCallback: () => T,
  ): Promise<T>;
} = (
  href: string,
  nodeProps?: Partial<HTMLElementTagNameMap['link']> | (() => void),
  resolveCallback: (() => void) | undefined = onlyIfFn(nodeProps),
) =>
  appendNodeAsync(
    global.document.head,
    createElement('link', {
      rel: 'stylesheet',
      href,
      ...onlyIfNotFn(nodeProps),
    }),
    resolveCallback,
  );

export const appendScript: {
  (src: string): Promise<void>;
  (
    src: string,
    nodeProps: Partial<HTMLElementTagNameMap['script']>,
  ): Promise<void>;
  <T>(src: string, resolveCallback: () => T): Promise<T>;
  <T>(
    src: string,
    nodeProps: Partial<HTMLElementTagNameMap['script']>,
    resolveCallback: () => T,
  ): Promise<T>;
} = (
  src: string,
  nodeProps?: Partial<HTMLElementTagNameMap['script']> | (() => void),
  resolveCallback: (() => void) | undefined = onlyIfFn(nodeProps),
) =>
  appendNodeAsync(
    global.document.body,
    createElement('script', {
      type: 'text/javascript',
      async: true,
      src,
      ...onlyIfNotFn(nodeProps),
    }),
    resolveCallback,
  );

export const importScript: typeof appendScript & {
  force: typeof appendScript;
} = cacheAll(appendScript) as any;

export const importStyle: typeof appendStyle & {
  force: typeof appendStyle;
} = cacheAll(appendStyle) as any;

export { appendNodeAsync, cacheAll, createElement };
