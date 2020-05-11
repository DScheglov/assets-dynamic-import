type Fn<A extends any[], R> = (...args: A) => R;

declare function cacheAll<A extends any[], R>(pureFn: Fn<A, R>, getKey: Fn<A, any>): Fn<A, R>;

export default cacheAll;
