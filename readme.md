# assets-dynamic-import
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

```js
import { importScript, importStyle } from 'assets-dynamic-import';

const loadAssets = () =>
  Promise.all([
    importScript(
      'https://code.jquery.com/jquery-3.5.1.slim.min.js',
      {
        integrity: 'sha256-4+XzXVhsDmqanXGHaHvgh1gMQKX40OUvDEBTu8JcmNs=',
        crossOrigin: 'anonymous'
      },
      () => global.jQuery
    ),
    importStyle(
      'https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css'
    ),
    importStyle('https://getbootstrap.com/docs/4.4/examples/sign-in/signin.css')
  ]).then(([$]) => $);

const renderLoginForm = $ => {
  $("body").addClass("text-center");
  $("body").html(`
    <form class="form-signin">
      <img class="mb-4" src="https://getbootstrap.com/docs/4.4/assets/brand/bootstrap-solid.svg" alt="" width="72" height="72">
      <h1 class="h3 mb-3 font-weight-normal">Please sign in</h1>
      <label for="inputEmail" class="sr-only">Email address</label>
      <input type="email" id="inputEmail" class="form-control" placeholder="Email address" required="" autofocus="">
      <label for="inputPassword" class="sr-only">Password</label>
      <input type="password" id="inputPassword" class="form-control" placeholder="Password" required="">
      <div class="checkbox mb-3">
        <label>
          <input type="checkbox" value="remember-me"> Remember me
        </label>
      </div>
      <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
      <p class="mt-5 mb-3 text-muted">© 2017-2019</p>
    </form>
  `);
};

const btnLoad = document.getElementById('btn-load');

btnLoad.onclick = async () => {
  btnLoad.innerHTML = 'Loading ...';
  const $ = await loadAssets();
  renderLoginForm($);
};
```

## Specification

The main idea of the library to provide our users with minimal tool set that allows to
work with external (to application bundle) assets.

| Function       | Target | Child    | Cache | Description                                               |
|:--------------:|:------:|:--------:|:-----:|:----------------------------------------------------------|
| [importScript](#importscriptsrc-nodeprops-resolvecallback-promise) | `body` | `script` |  yes  | Imports javascript-assets preventing duplicated requests  |
| [importStyle](#importstylehref-nodeprops-resolvecallback-promise) | `head` | `link`   |  yes  | Imports CSS-assets preventing duplicated requests         |
| `appendScript` | `body` | `script` |  no   | Creates a script-node and appends it to the document body |
| `appendStyle`  | `head` | `link`   |  no   | Creates a link-node and appends it to the document head   |
| `appendNodeAsync` | any | any | no | Assigns `onload` and `onerror` event lesteners of the `Child` and appends it to the `Target` |
| `cacheAll` | n/a | n/a | n/a | Memoization function decorator |

----
### `importScript(src[, nodeProps][, resolveCallback]): Promise`

Creates `<script>` node assigns it with `src`, `type` attributes from `nodeProps` and then appends it to the document `<body>`.

Function returns promise.

`importScript` could be safely called several times with the same set of `src` and `nodeProps`. It effects only on DOMNode to be added, so only one time script will be loaded.


**Arguments**:

|  Argument |   Type   | Mandatory | Description             |
|:---------:|:--------:|:---------:|:------------------------|
| **src**  | `string` |  **yes**  | url to load javascript from |
| **nodeProps** | `WritableAttribures<HTMLScriptElement>` | _no_ | object with attributes of `<script>` element |
| **resolveCallback** | <T>() => T | _no_ | callback to resolve some js interface after script is loaded |

**Return value**:
- `Promise<T>` - that resolves with result of `resolveCallback` (if specified otherwise with `undefined`) or rejects with `Error` and message: 'Couldn't load script by <url>'.

**Example**:

```js
import { importScript } from 'assets-dynamic-import';

export default () => importScript(
  "https://code.jquery.com/jquery-3.5.1.slim.min.js",
  {
    integrity: "sha256-4+XzXVhsDmqanXGHaHvgh1gMQKX40OUvDEBTu8JcmNs=",
    crossOrigin: "anonymous"
  },
  () => global.jQuery
);
```


----

### `importStyle(href[, nodeProps][, resolveCallback]): Promise`

Creates `<link>` node assigns it with `href`, `rel`, attributes from `nodeProps` and then appends it to the document `<head>`.

Function returns promise.

`importStyle` could be safely called several times with the same set of `href` and `nodeProps`. It effects only on DOMNode to be added, so only one time stylesheet will be loaded.

**Arguments**:

|  Argument |   Type   | Mandatory | Description             |
|:---------:|:--------:|:---------:|:------------------------|
| **href**  | `string` |  **yes**  | url to load styles from |
| **nodeProps** | `HTMLLinkElement` | _no_ | object with attributes of `<link>` element |
| **resolveCallback** | <T>() => T | _no_ | callback to resolve some js interface after styles are loaded |

**Return value**:
- `Promise<T>` - that resolves with result of `resolveCallback` (if specified otherwise with `undefined`) or rejects with `Error` and message: 'Couldn't load stylesheet by <url>'