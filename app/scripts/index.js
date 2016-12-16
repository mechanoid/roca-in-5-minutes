
/* global SystemJS */
'use strict'

SystemJS.config({
  baseURL: '/',
  map: {
    'plugin-babel': 'systemjs-plugin-babel/plugin-babel.js',
    'systemjs-babel-build': 'systemjs-plugin-babel/systemjs-babel-browser.js'
  },
  transpiler: 'plugin-babel',
  meta: {
    'scripts/*.js': {
      loader: 'plugin-babel'
    }
  }
})

const polyfills = {
  Promise: 'bluebird/js/browser/bluebird.core.min.js',
  fetch: 'whatwg-fetch/fetch.js'
}

const dependencies = Object.keys(polyfills)
  .map(polyfill => typeof window[polyfill] === 'function' ? SystemJS : SystemJS.import(polyfills[polyfill]))

Promise.all(dependencies)
  .then(() => SystemJS.import('scripts/app.js'))
  .then(app => app.default())
