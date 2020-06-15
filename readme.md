# assets-dynamic-import &middot; [![Build Status](https://travis-ci.org/DScheglov/assets-dynamic-import.svg?branch=master)](https://travis-ci.org/DScheglov/assets-dynamic-import) [![Coverage Status](https://coveralls.io/repos/github/DScheglov/assets-dynamic-import/badge.svg?branch=master)](https://coveralls.io/github/DScheglov/assets-dynamic-import?branch=master) [![npm version](https://img.shields.io/npm/v/assets-dynamic-import.svg?style=flat-square)](https://www.npmjs.com/package/assets-dynamic-import) [![npm downloads](https://img.shields.io/npm/dm/assets-dynamic-import.svg?style=flat-square)](https://www.npmjs.com/package/assets-dynamic-import) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/DScheglov/assets-dynamic-import/blob/master/LICENSE)
Simple way to dynamicly import some external assets in the runtime.

## Installation

```shell
npm install --save assets-dynamic-import
```

## Usage

```js
import { importScript } from 'assets-dynamic-import';

const processSomeData = async data => {
  const { someFnFromMyLib } = await importScript(
    '//some.path.to/script.js',
    () => global.someGlobalLibraryName
  );

  return someFnFromMyLib(data);
}
```

```ts
import { importScript, importStyle } from 'assets-dynamic-import';

export interface Recurly {
  token(form: HTMLFormElement, cb: (err: Error | null, token: string) => void): void;
}

export default () => Promise.all([
    () => importScript('https://js.recurly.com/v4/recurly.js'),
    () => importStyle('https://js.recurly.com/v4/recurly.css'),
])
  .then(() => {
    const recurly = (window as any).recurly as Recurly;
    return {
      token: (form: HTMLFormElement): Promise<string> => new Promise(
        (resolve, reject) => recurly.token(form, (err: Error | null, token: string) => (
          err == null ? resolve(token) : reject(err)
        )
      )),
    };
  });
```

## Motivation

The main idea of the library to provide users with minimal tool set that allows to
work with external (to application bundle) assets.

The library is developed considering following use cases:

  1. to use extrnal libraries in single-page appliction preventing excess loading of
     not-used of them for major of pages (aka 
     [recurly](https://developers.recurly.com/reference/recurly-js/),
     [stripe](https://stripe.com/docs/js/including),
     [pdf.js](https://cdnjs.com/libraries/pdf.js)
     etc.)

  2. integrate separetelly deployed SPA's to one large single page application.

  ```js
  import React from 'react';
  import { importScript } from 'assets-dynamic-import';
  import { BrowserRouter, Switch, Route } from 'react-router-dom';
  import { CDN } from './config';

  const ViewerApplication = React.lazy(
    () => importScript(
      `${CDN}/viewer.bundle.js`, 
      () => global.viewerLib.default,
    )
  );

  const MyAccountApplication = React.lazy(
    () => importScript(
      `${CDN}/myaccount.bundle.js`,
      () => global.accountLib.default,
    )
  );

  const App = () => (
    <BrowserRouter>
      <Switch>
        <Route path="/viewer" component={ViewerApplication} />
        <Route component={MyAccountApplication}> />
      </Switch>
    </BrowserRouter>
  );

  export default App;
  ```

## Specification

The library exports the following functions:

| Function       | Target | Child    | Cache | Description                                               |
|:--------------:|:------:|:--------:|:-----:|:----------------------------------------------------------|
| [importScript](#importscriptsrc-nodeprops-resolvecallback-promise) | `body` | `script` | yes | Imports javascript-assets and caches such imports |
| [appendScript](#appendscriptsrc-nodeprops-resolvecallback-promise) | `body` | `script` | no | Creates a script-node and appends it to the document body that initiats resourse loading |
| [importStyle](#importstylehref-nodeprops-resolvecallback-promise) | `head` | `link` | yes | Imports CSS-assets and caches such imports |
| [appendStyle](#appendstylehref-nodeprops-resolvecallback-promise)  | `head` | `link` | no | Creates a link-node and appends it to the document head that initiats resource loading |
| [createElement](#createelementtag-nodeprops-htmlelement) | n/a | n/a | no | Creates DOMNode and assigns its properties |
| [appendNodeAsync](appendnodetarget-node-resolvecallback-promise) | any | any | no | Assigns `onload` and `onerror` event lesteners of the `Child` and appends it to the `Target` |
| [cacheAll](#cacheallfn--getkey-function) | n/a | n/a | n/a | Memoization function decorator |

----
### `importScript(src[, nodeProps][, resolveCallback]): Promise`

Creates `<script>` node assigns it with `src`, `type` attributes from `nodeProps` and then appends it to the document `<body>`.

Function returns promise.

`importScript` could be safely called several times with the same `src`. 
Each further call of `importScript` results with the same promise as the first call.


**Arguments**:

|  Argument |   Type   | Mandatory | Description             |
|:---------:|:--------:|:---------:|:------------------------|
| **src**  | `string` |  **yes**  | url to load javascript from |
| **nodeProps** | `WritableAttribures<HTMLScriptElement>` | _no_ | object with attributes of `<script>` element |
| **resolveCallback** | <T>() => T | _no_ | callback to resolve some js interface after script is loaded |

**Return value**:
- `Promise<T>` - that resolves with result of `resolveCallback` (if specified otherwise with `undefined`) or rejects with `Error` and message: 'Couldn't load script by <url>'.

**Example 1. "Recurly"**:

**./recurly.ts**

```ts
import { importScript, importStyle } from 'assets-dynamic-import';

export interface Recurly {
  token(form: HTMLFormElement, cb: (err: Error | null, token: string) => void): void;
}

export default () => Promise.all([
    () => importScript('https://js.recurly.com/v4/recurly.js'),
    () => importStyle('https://js.recurly.com/v4/recurly.css'),
])
  .then(() => {
    const recurly = (window as any).recurly as Recurly;
    return {
      token: (form: HTMLFormElement): Promise<string> => new Promise(
        (resolve, reject) => recurly.token(form, (err: Error | null, token: string) => (
          err == null ? resolve(token) : reject(err)
        )
      )),
    };
  });
```

And then we can easily import recurly where we need and call promisified token method

```ts
import importRecurly from './recurly.ts';

const getToken = (form: HTMLFormElement) => importRecurly()
  .then(
    recurly => recurly.token(form)
  )
;

```

**Example 2."Integrity and Credential policy"**

```js
    importScript(
      'https://some-domain.come/some-script.js',
      {
        integrity: 'sha256-4+XzXVhsDmqanXGHaHvgh1gMQKX40OUvDEBTu8JcmNs=',
        crossOrigin: 'anonymous'
      },
      () => global.jQuery
    ),
```

----

### `appendScript(src[, nodeProps][, resolveCallback]): Promise`

Creates `<script>` node assigns it with `src`, `type` attributes from `nodeProps` and then appends it to the document `<body>`.

Function returns promise.

Each call of `appendScript` results in a new `<script>` tag appended to the body, so it initiates script loading and running each time.

The main reason to expose this function is to allows library users to customise memoization for that in their own way tailored to their tasks.

Actaully `importScript` is a momoized version of `appenScript` that caches its calls by `src`.

**Arguments**:

|  Argument |   Type   | Mandatory | Description             |
|:---------:|:--------:|:---------:|:------------------------|
| **src**  | `string` |  **yes**  | url to load javascript from |
| **nodeProps** | `WritableAttribures<HTMLScriptElement>` | _no_ | object with attributes of `<script>` element. `nodeProps.src` overrides value of `src` |
| **resolveCallback** | <T>() => T | _no_ | callback to resolve some js interface after script is loaded |

**Return value**:
- `Promise<T>` - that resolves with result of `resolveCallback` (if specified otherwise with `undefined`) or rejects with `Error` and message: 'Couldn't load script by <url>'.

**Example**:

**./cached-import.ts**

```ts
import { appendScript, appendStyle } from 'assets-dynamic-import';


global.__moduleCache = (global.__moduleCache  as Map<string, any>)
  || new Map<string, any>();

const memoize = <A extends any[], R>(fn: (key: string, ...args: A) => R) 
  => (key: string, ...args: A): R => {
    if (global.__moduleCache.has(key)) return global.__moduleCache.get(key);
  
  const result = fn(key, ...args);
  global.__moduleCache.set(key, result);

  return result;
}

export const importScript = memoize(appendScript);
export const importStyle = memoize(appendStyle);
```

And then we can use new memoized importing function in any bundle that works
in the same browser tab.

```ts
import { importScript, importStyle } from './cached-import.ts';

// ...
```

----
### `importStyle(href[, nodeProps][, resolveCallback]): Promise`

Creates `<link>` node assigns it with `href`, `rel`, attributes from `nodeProps` and then appends it to the document `<head>`.

Function returns promise.

`importStyle` could be safely called several times with the same `href`.
Each further call of `importStyle` results with the same promise as the first call.

**Arguments**:

|  Argument |   Type   | Mandatory | Description             |
|:---------:|:--------:|:---------:|:------------------------|
| **href**  | `string` |  **yes**  | url to load styles from |
| **nodeProps** | `WritableAttribures<HTMLLinkElement>` | _no_ | object with attributes of `<link>` element. `nodeProp.href` overrides `href` |
| **resolveCallback** | <T>() => T | _no_ | callback to resolve some js interface after styles are loaded |

**Return value**:
- `Promise<T>` - that resolves with result of `resolveCallback` (if specified otherwise with `undefined`) or rejects with `Error` and message: 'Couldn't load stylesheet by <url>'

**How to import**:

```js
import { importStyle } from 'assets-dynamic-import`;
```


----
### `appendStyle(href[, nodeProps][, resolveCallback]): Promise`

Creates `<link>` node assigns it with `href`, `rel`, attributes from `nodeProps` and then appends it to the document `<head>`.

Function returns promise.

Each call of `appendStyle` results in a new `<link>` tag appended to the head, so it initiates style loading each time.

The main reason to expose this function is to allows library users to customise memoization for it in their own way tailored to their tasks.

Actaully `importStyle` is a momoized version of `appenStyle` that caches its calls by `href`.

**Arguments**:

|  Argument |   Type   | Mandatory | Description             |
|:---------:|:--------:|:---------:|:------------------------|
| **href**  | `string` |  **yes**  | url to load styles from |
| **nodeProps** | `WritableAttribures<HTMLLinkElement>` | _no_ | object with attributes of `<link>` element |
| **resolveCallback** | <T>() => T | _no_ | callback to resolve some js interface after styles are loaded |

**Return value**:
- `Promise<T>` - that resolves with result of `resolveCallback` (if specified otherwise with `undefined`) or rejects with `Error` and message: 'Couldn't load stylesheet by <url>'

**How to import**:

```js
import { appendStyle } from 'assets-dynamic-import`;
```

----
### `createElement(tag, nodeProps): HTMLElement`

Creates a DOM node with `tag` and assigns its props, specified as `nodeProps`:

**Arguments**:

|  Argument |   Type   | Mandatory | Description             |
|:---------:|:--------:|:---------:|:------------------------|
| **tag**  | `string` |  **yes**  | the html tag to create DOM node with |
| **nodeProps** | `WritableAttribures<HTMLElement[tag]>` | _no_ | object with attributes of element |

**Returns**

- `HTNLElement[tag]` - created DOM node.

**How to import**:

```js
import { createElement } from 'assets-dynamic-import`;
```

----
### `appendNode(target, node[, resolveCallback]): Promise`

Assigns loading hooks of `node` (`onload` and `onerror`) and appends it to the `target`.
If `node` has some content to be loaded, the function returns Promise that will be resolved
after the content will be loaded.

**Arguments**:

|  Argument |   Type   | Mandatory | Description             |
|:---------:|:--------:|:---------:|:------------------------|
| **target**  | `HTMLElement` |  **yes**  | the DOM node to append `node` as its child |
| **node** | `HTMLElement` | _no_ | the DOM node to be appended to the `target` node |
| **resolveCallback** | <T>() => T | _no_ | callback to resolve some js interface after node will be appended and its content will be loaded |

**Returns**
- `Promise<T>` - that resolves with result of `resolveCallback` (if specified otherwise with `undefined`) or rejects with `Error`.

**How to import**:

```js
import { appendNodeAsync } from 'assets-dynamic-import`;
```

---
### `cacheAll(fn [, getKey]): Function`

```ts
type Fn<A extends any[], R> = (...args: A) => R;

export function cacheAll<A extends any[], R, K>(
	fn: Fn<A, R>, 
	getCacheKey?: Fn<A, K>
): Fn<A, R> & { force: Fn<A, R>}
```

**How to import**:

```js
import { cacheAll } from 'assets-dynamic-import`;
```