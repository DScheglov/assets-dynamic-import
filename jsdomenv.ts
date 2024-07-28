import { EnvironmentContext, JestEnvironmentConfig } from '@jest/environment';
import JsdomEnvironment from 'jest-environment-jsdom';
import jsdom, { AbortablePromise } from 'jsdom';

const generateScript = (url: string) =>
  `(window.__loaded__ = window.__loaded__ || []).push(${JSON.stringify(url)})`;

class ResourceLoader extends jsdom.ResourceLoader {
  fetch(url: string) {
    const promise = /(\?|&)deny=(yes|true|1)/i.test(url)
      ? Promise.reject(new Error(`${url} - not found`))
      : Promise.resolve(Buffer.from(generateScript(url)));

    (promise as unknown as AbortablePromise<Buffer>).abort = () => {};
    return promise as unknown as AbortablePromise<Buffer>;
  }
}

class JsDomWithResourceLoaderEnvironment extends JsdomEnvironment {
  constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
    super(
      {
        ...config,
        projectConfig: {
          ...config.projectConfig,
          testEnvironmentOptions: {
            ...config.projectConfig.testEnvironmentOptions,
            resources: new ResourceLoader(),
          },
        },
      },
      context,
    );
  }
}

module.exports = JsDomWithResourceLoaderEnvironment;
