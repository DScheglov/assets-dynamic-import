const JsdomEnvironment = require('jest-environment-jsdom');
const jsdom = require('jsdom');

const generateScript = url => `(window.__loaded__ = window.__loaded__ || []).push(${JSON.stringify(url)})`;

class ResourceLoader extends jsdom.ResourceLoader {
  fetch (url, options) {
    return /(\?|&)deny=(yes|true|1)/i.test(url)
      ? Promise.reject(new Error(`${url} - not found`))
      : Promise.resolve(Buffer.from(generateScript(url)));
  }
}

class JsDomWithResouceLoaderEnvironment extends JsdomEnvironment {
  constructor (config, context) {
    super({
      ...config,
      testEnvironmentOptions: {
        ...config.testEnvironmentOptions,
        resources: new ResourceLoader()
      }
    }, context);
  }
}

module.exports = JsDomWithResouceLoaderEnvironment;
