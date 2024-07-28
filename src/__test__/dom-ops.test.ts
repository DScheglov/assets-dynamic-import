import {
  describe,
  it,
  expect,
  jest,
  afterEach,
  beforeEach,
} from '@jest/globals';
import { appendNodeAsync, createElement } from '../dom-ops';

describe('appendNodeAsync', () => {
  let nativeConsoleError: any;

  beforeEach(() => {
    nativeConsoleError = console.error;
    console.error = () => {}; // suppressing console output
  });

  afterEach(() => {
    jest.restoreAllMocks();
    console.error = nativeConsoleError;
    nativeConsoleError = null;
  });

  it('appends node and returns promise', async () => {
    const target = document.body;
    const node = document.createElement('script');
    node.src = '//domain/script.js';

    jest.spyOn(target, 'appendChild');

    const res = appendNodeAsync(target, node);

    expect(res).toBeInstanceOf(Promise);
    expect(target.appendChild).toHaveBeenCalledWith(node);

    await res;

    expect((window as any).__loaded__).toContain(node.src);
    expect(target.children).toContain(node);
  });

  it('calls node.onload', async () => {
    const target = document.body;
    const node = document.createElement('script');
    node.src = '//domain/script.js';
    node.onload = jest.fn();

    await appendNodeAsync(target, node);
    expect(node.onload).toHaveBeenCalledTimes(1);
  });

  it('returns promise that resolves to callback result', async () => {
    const result = Symbol('result');
    const callback = jest.fn(() => result);
    const target = document.body;
    const node = document.createElement('script');
    node.src = '//domain/script.js';

    const res = await appendNodeAsync(target, node, callback);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(res).toBe(result);
  });

  it('returns promise that rejects with error if loading is failed', async () => {
    expect.assertions(2);
    const target = document.body;
    const node = document.createElement('script');
    node.src = '//domain/script.js?deny=true';

    const res = appendNodeAsync(target, node);

    await res.catch((err) => {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toMatch(
        /^Couldn't load script by url: https?:\/\/domain\/script.js\?deny=true$/i,
      );
    });
  });

  it('calls node.onerror if loading is failed', async () => {
    expect.assertions(2);
    const target = document.body;
    const node = document.createElement('script');
    node.src = '//domain/script.js?deny=true';
    node.onerror = jest.fn();

    const res = appendNodeAsync(target, node);

    await res.catch((err) => {
      expect(err).toBeInstanceOf(Error);
      expect(node.onerror).toHaveBeenCalledTimes(1);
    });
  });

  it("doesn't call back if loading is failed", async () => {
    expect.assertions(2);
    const callback = jest.fn();
    const target = document.body;
    const node = document.createElement('script');
    node.src = '//domain/script.js?deny=true';

    const res = appendNodeAsync(target, node, callback);

    await res.catch((err) => {
      expect(err).toBeInstanceOf(Error);
      expect(callback).not.toHaveBeenCalled();
    });
  });
});

describe('createElement', () => {
  it('creates a DOM Element (script) and allows to specify src attribute', () => {
    const scriptNode = createElement('script', { src: '//domain/script.js' });

    expect(scriptNode).toBeInstanceOf(HTMLElement);
    expect(scriptNode.src).toMatch(/https?:\/\/domain\/script.js$/);
  });
});
