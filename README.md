# dynamic-assets-import
Simple way to dynamicly import some external assets in the runtime.

## Installation

```shell
npm install --save dynamic-assets-import
```

## Usage

```js
import { importScript } from 'dynamic-assets-import';

const processSomeData = async data => {
  const { someFnFromMyLib } = await importScript(
    '//some.path.to/script.js',
    () => global.someGlobalLibraryName
  );

  return someFnFormMyLib(data);
}
```

See **Login Form** sample with `jQuery` in live [Sandbox](https://codesandbox.io/s/dynamic-assets-import-li87q?file=/index.js)


## Specification

----
### `importScript(src, [nodeProps, [resolveCallback]]): Promise`

Creates `<script>` node assigns it with `src`, `type` and attributes from `nodeProps` and then appends it to the document `<body>`.

Function returns promise.

`importScript` could be safely called several times with the same set of `src` and `nodeProps`. It effects only on DOMNode to be added, so only one time script will be loaded.


```ts
function importScript<T = void>(src: string, nodeProps?: HTMLScriptElement, resolveCallback?: () => T): Promise<T>;
```

**Arguments**:

|  Argument |   Type   | Mandatory | Description             |
|:---------:|:--------:|:---------:|:------------------------|
| **src**  | `string` |  **yes**  | url to load javascript from |
| **nodeProps** | `HTMLLinkElement` | _no_ | object with attributes of `<link>` element |
| **resolveCallback** | <T>() => T | _no_ | callback to resolve some js interface after script is loaded |

**Return value**:
- `Promise<T>` - that resolves with result of `resolveCallback` (if specified otherwise with `undefined`) or rejects with `Error` and message: "Couldn't load script by <url>".

----

### `importStyle(href, [nodeProps, [resolveCallback]]): Promise`

Creates `<link>` node assigns it with `href`, `rel` and attributes from `nodeProps` and then appends it to the document `<head>`.

Function returns promise.

`importStyle` could be safely called several times with the same set of `href` and `nodeProps`. It effects only on DOMNode to be added, so only one time stylesheet will be loaded.

```ts
function importStyle<T = void>(href: string, nodeProps?: HTMLLinkElement, resolveCallback?: () => T): Promise<T>;
```

**Arguments**:

|  Argument |   Type   | Mandatory | Description             |
|:---------:|:--------:|:---------:|:------------------------|
| **href**  | `string` |  **yes**  | url to load styles from |
| **nodeProps** | `HTMLLinkElement` | _no_ | object with attributes of `<link>` element |
| **resolveCallback** | <T>() => T | _no_ | callback to resolve some js interface after styles are loaded |

**Return value**:
- `Promise<T>` - that resolves with result of `resolveCallback` (if specified otherwise with `undefined`) or rejects with `Error` and message: "Couldn't load stylesheet by <url>"