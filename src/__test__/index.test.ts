import {
  describe,
  it,
  expect,
  jest,
  afterEach,
  beforeEach,
} from '@jest/globals';
import { importScript, importStyle, appendScript, appendStyle } from '..';

describe('interface', () => {
  it('contains: importScript, importStyle, appendScript, appendStyle', () => {
    expect(importScript).toBeInstanceOf(Function);
    expect(importStyle).toBeInstanceOf(Function);
    expect(appendScript).toBeInstanceOf(Function);
    expect(appendStyle).toBeInstanceOf(Function);
  });
});

describe('appendScript', () => {
  let nativeConsoleError: any;

  beforeEach(() => {
    document.body.childNodes.forEach((child) =>
      document.body.removeChild(child),
    );
    nativeConsoleError = console.error;
    console.error = () => {}; // suppressing output
  });

  afterEach(() => {
    console.error = nativeConsoleError;
  });

  it('appends script to the body', async () => {
    await appendScript('//domain/script.js');
    expect((document.body.lastChild as any)?.tagName).toMatch(/^script$/i);
    expect((document.body.lastChild as any)?.src).toMatch(
      /^https?:\/\/domain\/script.js$/,
    );
  });

  it('appends script to the body and allows to specify some attributes', async () => {
    await appendScript('//domain/script.js', { id: 'script-1' });
    expect(document.getElementById('script-1')).toBe(document.body.lastChild);
  });

  it('appends script to the body and allows to specify resolver', async () => {
    const moduleSymbol = Symbol('module');
    expect(await appendScript('//domain/script.js', () => moduleSymbol)).toBe(
      moduleSymbol,
    );
  });

  it('appends script to the body and allows to specify attributes and resolver', async () => {
    const moduleSymbol = Symbol('module');
    expect(
      await appendScript(
        '//domain/script.js',
        { id: 'script-1' },
        () => moduleSymbol,
      ),
    ).toBe(moduleSymbol);

    expect(document.getElementById('script-1')).toBe(document.body.lastChild);
  });

  it("throws an exception if script couldn't be loaded", () => {
    expect.assertions(1);
    const res = appendScript('//domain/script.js?deny=true');
    return res.catch((err) => {
      expect(err).toBeInstanceOf(Error);
    });
  });
});

describe('appendStyle', () => {
  let nativeConsoleError: any;

  beforeEach(() => {
    document.head.childNodes.forEach((child) =>
      document.head.removeChild(child),
    );
    nativeConsoleError = console.error;
    console.error = () => {}; // suppressing output
  });

  afterEach(() => {
    console.error = nativeConsoleError;
  });

  it('appends style to the body', async () => {
    await appendStyle('//domain/styles.css');
    expect((document.head.lastChild as any)?.tagName).toMatch(/^link$/i);
    expect((document.head.lastChild as any)?.href).toMatch(
      /^https?:\/\/domain\/styles.css$/,
    );
  });

  it('appends style to the body and allows to specify some atrributes', async () => {
    await appendStyle('//domain/styles.css', { id: 'style-1' });
    expect(document.getElementById('style-1')).toBe(document.head.lastChild);
  });

  it('appends style to the body and allows to specify resolver', async () => {
    const moduleSymbol = Symbol('module');
    expect(await appendStyle('//domain/styles.css', () => moduleSymbol)).toBe(
      moduleSymbol,
    );
  });

  it('appends style to the body and allows to specify attributes and resolver', async () => {
    const moduleSymbol = Symbol('module');
    expect(
      await appendStyle(
        '//domain/styles.css',
        { id: 'style-1' },
        () => moduleSymbol,
      ),
    ).toBe(moduleSymbol);

    expect(document.getElementById('style-1')).toBe(document.head.lastChild);
  });

  it("throws an exception if style couldn't be loaded", () => {
    expect.assertions(1);
    const res = appendStyle('//domain/styles.css?deny=true');
    return res.catch((err) => {
      expect(err).toBeInstanceOf(Error);
    });
  });
});

describe('importScript', () => {
  let nativeConsoleError: any;

  beforeEach(() => {
    document.body.childNodes.forEach((child) =>
      document.body.removeChild(child),
    );
    nativeConsoleError = console.error;
    console.error = () => {}; // suppressing output
  });

  afterEach(() => {
    console.error = nativeConsoleError;
    jest.restoreAllMocks();
  });

  it('caches requests to appendScript', () => {
    const res = importScript('//domain/script.js');

    expect(importScript('//domain/script.js')).toBe(res);

    return res;
  });

  it('caches failed requests', () => {
    const res = importScript('//domain/script.js?deny=true');

    expect(importScript('//domain/script.js?deny=true')).toBe(res);

    return res.catch(() => {});
  });

  it('allows to override cache with .force method', () => {
    const res = importScript('//domain/script-1.js');
    const res2 = importScript.force('//domain/script-1.js');

    expect(importScript('//domain/script-1.js')).toBe(res2);

    return Promise.all([res, res2]);
  });
});

describe('importStyle', () => {
  let nativeConsoleError: any;

  beforeEach(() => {
    document.body.childNodes.forEach((child) =>
      document.body.removeChild(child),
    );
    nativeConsoleError = console.error;
    console.error = () => {}; // suppressing output
  });

  afterEach(() => {
    console.error = nativeConsoleError;
    jest.restoreAllMocks();
  });

  it('caches requests to appendStyle', () => {
    const res = importStyle('//domain/styles.css');

    expect(importStyle('//domain/styles.css')).toBe(res);

    return res;
  });

  it('caches failed requests', () => {
    const res = importStyle('//domain/styles.css?deny=true');

    expect(importStyle('//domain/styles.css?deny=true')).toBe(res);

    return res.catch(() => {});
  });

  it('allows to override cache with .force method', () => {
    const res = importStyle('//domain/styles-1.css');
    const res2 = importStyle.force('//domain/styles-1.css');

    expect(importStyle('//domain/styles-1.css')).toBe(res2);

    return Promise.all([res, res2]);
  });
});
