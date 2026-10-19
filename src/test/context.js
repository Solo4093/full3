import { cleanup } from '@testing-library/react';
import JasmineDOM from '@testing-library/jasmine-dom/dist';

beforeAll(() => {
  jasmine.addMatchers(JasmineDOM);
});

afterEach(() => {
  cleanup();
  localStorage.clear();
});

const specs = require.context('.', true, /\.spec\.jsx?$/);
specs.keys().forEach(specs);

const codigoApp = require.context('..', true, /^\.\/(App|components\/.*|pages\/.*|data\/.*)\.jsx?$/);
codigoApp.keys().forEach(codigoApp);
