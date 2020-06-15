type Fn<A extends any[], R> = (...args: A) => R;

export function identity<T>(x: T): T;

export function cacheAll<A extends any[], R, K>(
	fn: Fn<A, R>, 
	getCacheKey?: Fn<A, K>
): Fn<A, R> & { force: Fn<A, R>}

export function onlyIfFn <A extends any[], R, T, D>(value: T, def: D): T extends Fn<A, R> ? Fn<A, R> : D;

export function onlyIfNotFn <A extends any[], R, T, D>(value: T, def: D): T extends Fn<A, R> ? D : Fn<A, R>;

export function handleWith <A extends any[]>(...handlers: Array<Fn<A, any> | null | undefined>): Fn<A, void>
