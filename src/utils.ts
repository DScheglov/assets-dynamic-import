export type Fn<A extends any[], R> = (...args: A) => R;
const identity = <T>(x: T) => x;

const withCache =
  <A extends any[], R, K>(
    cache: Map<K, R>,
    fn: Fn<A, R>,
    getKey: Fn<A, K>,
    checkCache: boolean,
  ) =>
  (...args: A): R => {
    const key = getKey(...args);

    if (checkCache && cache.has(key)) return cache.get(key)!;

    const result = fn(...args);
    cache.set(key, result);

    return result;
  };

export const cacheAll = <Args extends any[], R, K = Args[0]>(
  fn: (...args: Args) => R,
  getKey: (...args: Args) => K = identity as unknown as Fn<Args, K>,
): Fn<Args, R> & { force: Fn<Args, R> } => {
  const cache = new Map();

  const cached = withCache(cache, fn, getKey, true) as Fn<Args, R> & {
    force: Fn<Args, R>;
  };
  cached.force = withCache(cache, fn, getKey, false);

  return cached;
};

export const onlyIfFn = <T, D = undefined>(
  value: T,
  def?: D,
): T extends Fn<infer A, infer R> ? Fn<A, R> : D =>
  (typeof value === 'function' ? value : def) as any;

export const onlyIfNotFn = <T, D = undefined>(
  value: T,
  def?: D,
): T extends Fn<any[], any> ? D : T =>
  (typeof value !== 'function' ? value : def) as any;

export const handleWith = <Args extends any[], This>(
  ...handlers: Array<
    ((this: This, ...args: Args) => unknown) | null | undefined
  >
) => {
  const fnHandlers = handlers.filter(
    (handler) => typeof handler === 'function',
  );

  return function polyHandler(this: This, ...args: Args) {
    fnHandlers.forEach((handler) => handler.apply(this, args));
  };
};
