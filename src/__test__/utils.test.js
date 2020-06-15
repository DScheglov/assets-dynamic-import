import { cacheAll, onlyIfFn, onlyIfNotFn, handleWith } from '../utils';

describe('cacheAll', () => {
  it('returns a function', () => {
    expect(cacheAll(x => x)).toBeInstanceOf(Function);
  });

  it('caches function calls', () => {
    const fn = jest.fn(x => x + 1);
    const cachedFn = cacheAll(fn);

    expect(cachedFn(1)).toBe(2);
    expect(cachedFn(1)).toBe(2);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('allows to specify custom key generator', () => {
    const fn = jest.fn((a, b) => a + b);
    const cachedFn = cacheAll(fn, (...args) => JSON.stringify(args));

    expect(cachedFn(1, 2)).toBe(3);
    expect(cachedFn(1, 2)).toBe(3);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('has a force version to overwrite cached value', () => {
    let b = 2;
    const fn = jest.fn(a => a + b);
    const cachedFn = cacheAll(fn);

    expect(cachedFn(1)).toBe(3);
    b = 3;

    expect(cachedFn.force(1)).toBe(4);
    expect(cachedFn(1)).toBe(4);

    expect(fn).toHaveBeenCalledTimes(2);
  });
});

describe('onlyIfFn', () => {
  it('returns first argument if it is a function', () => {
    expect(onlyIfFn(onlyIfFn)).toBe(onlyIfFn);
  });

  it('returns second argument if the first argument is not a function', () => {
    expect(onlyIfFn('string', Symbol.for('IS NOT A FUNCTION'))).toBe(Symbol.for('IS NOT A FUNCTION'));
  });

  it('returns undefined if the firtst argument is not a function and the second argument is not specified', () => {
    expect(onlyIfFn('string')).toBeUndefined();
  });

  it('returns second argument if the first argument is null', () => {
    expect(onlyIfFn(null, Symbol.for('IS NOT A FUNCTION'))).toBe(Symbol.for('IS NOT A FUNCTION'));
  });

  it('returns undefined if the firtst argument is null and the second argument is not specified', () => {
    expect(onlyIfFn(null)).toBeUndefined();
  });

  it('returns second argument if the first argument is undefined', () => {
    expect(onlyIfFn(undefined, Symbol.for('IS NOT A FUNCTION'))).toBe(Symbol.for('IS NOT A FUNCTION'));
  });

  it('returns undefined if the firtst argument is undefined and the second argument is not specified', () => {
    expect(onlyIfFn(undefined)).toBeUndefined();
  });
});

describe('onlyIfNotFn', () => {
  it('returns first argument if it is not a function', () => {
    expect(onlyIfNotFn('string')).toBe('string');
  });

  it('returns second argument if the first argument is a function', () => {
    expect(onlyIfNotFn(() => {}, Symbol.for('is a function'))).toBe(Symbol.for('is a function'));
  });

  it('returns undefined if the firtst argument is a function and the second argument is not specified', () => {
    expect(onlyIfNotFn(() => {})).toBeUndefined();
  });

  it('returns first argument if it is null', () => {
    expect(onlyIfNotFn(null, Symbol.for('is a function'))).toBe(null);
  });

  it('returns undefined if the firtst argument is undefined', () => {
    expect(onlyIfNotFn(null)).toBeNull();
  });

  it('returns first argument if it is undefined', () => {
    expect(onlyIfNotFn(undefined, Symbol.for('is a function'))).toBeUndefined();
  });

  it('returns undefined if the firtst argument is undefined', () => {
    expect(onlyIfNotFn(undefined)).toBeUndefined();
  });
});

describe('handleWith', () => {
  it('creates a new function', () => {
    expect(handleWith()).toBeInstanceOf(Function);
  });

  it('creates a new function that calls a single function passed as parameter', () => {
    const fn = jest.fn();
    const handler = handleWith(fn);

    handler(1, 2, 3);
    expect(fn).toHaveBeenCalledWith(1, 2, 3);
  });

  it('creates a new function that calls two function passed as parameters', () => {
    const fn1 = jest.fn();
    const fn2 = jest.fn();
    const handler = handleWith(fn1, fn2);

    handler(1, 2, 3);
    expect(fn1).toHaveBeenCalledWith(1, 2, 3);
    expect(fn2).toHaveBeenCalledWith(1, 2, 3);
  });

  it('creates a new function that calls three function passed as parameters', () => {
    const fn1 = jest.fn();
    const fn2 = jest.fn();
    const fn3 = jest.fn();
    const handler = handleWith(fn1, fn2, fn3);

    handler(1, 2, 3);
    expect(fn1).toHaveBeenCalledWith(1, 2, 3);
    expect(fn2).toHaveBeenCalledWith(1, 2, 3);
    expect(fn3).toHaveBeenCalledWith(1, 2, 3);
  });

  it('creates a new function that calls handred function passed as parameters', () => {
    const fns = Array.from({ length: 100 }, () => jest.fn());
    const handler = handleWith(...fns);

    handler(1, 2, 3);

    fns.forEach(
      fn => expect(fn).toHaveBeenCalledWith(1, 2, 3)
    );
  });

  it('creates a new function that ignores a non-function arguments', () => {
    const cb = jest.fn();
    const fns = Array.from({ length: 100 }, (_, index) => index & 1 && jest.fn(cb));
    const handler = handleWith(...fns);

    handler(1, 2, 3);

    expect(cb).toHaveBeenCalledTimes(50);
  });
});
