# oas-linter-runner

A Jest runner for [oas-linter](https://www.npmjs.com/package/oas-linter).

It's easy enough to run something like [speccy](https://www.npmjs.com/package/speccy),
but for integration with CI having something that provides more structured output (e.g.
by using [jest-unit](https://www.npmjs.com/package/jest-junit) and Jest) a more
machine friendly output can be produced.

Additionally Speccy doesn't like JS modules, which is a pain if you like writing your
API documents like that.

Note that this module does not directly support YAML, but can by adding a wrapper
file that parses your YAML and linting that instead, e.g. install [yaml](https://www.npmjs.com/package/yaml)
and then create an `api.js` to lint, e.g.

```javascript
const fs = require('fs')
const YAML = require('yaml')

const file = fs.readFileSync('./file.yml', 'utf8')
module.exports = YAML.parse(file)
```

## Usage

### Install

Install `jest`_(it needs Jest 21+)_ and `oas-linter-runner`

```bash
npm install --save-dev jest oas-linter-runner

# or with Yarn

yarn add --dev jest oas-linter-runner
```

### Add your runner to Jest config

Once you have your Jest runner you can add it to your Jest config.  You will almost
certainly want to configure separate Jest [projects](https://jestjs.io/docs/en/configuration#projects-array-string-projectconfig)
and only use this runner on modules that export an OpenAPI document.

#### Recommended Steps

Create separate configuration files for each "project" (e.g. tests, eslint, and
api document linting) and then reference them in your `package.json`.

In your `package.json`

```json
{
  "jest": {
    "projects": [
      "<rootDir>/jest-test.config.js",
      "<rootDir>/jest-eslint.config.js",
      "<rootDir>/jest-oas-linter.config.js"
    ]
  }
}
```

In your `jest-oas-linter.config.js`

```js
module.exports = {
  runner: 'oas-linter-runner',
  displayName: 'oas-linter',
  testMatch: [
    '<rootDir>/path/to/your/api/doc.js',
    '<rootDir>/path/to/another/api/doc.js',
    '<rootDir>/path/to/another/api/doc/**/*.js',
  ],
}
```

#### Minimal Steps

These are the more standard steps to set up a test runner

In your `package.json`

```json
{
  "jest": {
    "runner": "oas-linter-runner",
    "testMatch": ["<rootDir>/path/to/your/api/doc.js"]
  }
}
```

Or in `jest.config.js`

```js
module.exports = {
  runner: require.resolve('oas-linter-runner'),
  testMatch: ['<rootDir>/path/to/your/api/doc.js'],
};
```


### Run Jest

```bash
npx jest
# or with Yarn
yarn jest
```
