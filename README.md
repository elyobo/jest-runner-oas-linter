# jest-runner-oas-linter

A Jest runner for [oas-linter](https://www.npmjs.com/package/oas-linter).

It's easy enough to run something like [speccy](https://www.npmjs.com/package/speccy),
but for integration with CI having something that provides more structured output (e.g.
by using [jest-unit](https://www.npmjs.com/package/jest-junit) and Jest) a more
machine friendly output can be produced and you can take advantage of other useful features
like file watching.

Additionally Speccy [doesn't support JS modules](https://github.com/wework/speccy/pull/344),
which is a pain if you like writing your API documents like that - the underlying `oas-linter`
has no problem though.

Note that this module does not directly support YAML, but can support them by adding
a transformer to the jest config, e.g.

```javascript
module.exports = {
  runner: "oas-linter",
  displayName: "oas-linter",
  transform: {
    "\\.yaml$": "jest-yaml-transform-not-flattened"
  },
  testMatch: ["<rootDir>/api/*.yaml"],
  moduleFileExtensions: ["yaml"]
};
```

## Warning

This is very alpha; no tests have been written, no promises made, YMMV.

## Compatibility

This module is compatible with Node v8.x and upwards. Any incompatibilities with those versions should be reported as bugs.

## Usage

### Install

Install `jest`_(it needs Jest 21+)_ and `jest-runner-oas-linter`

```bash
npm install --save-dev jest jest-runner-oas-linter

# or with Yarn

yarn add --dev jest jest-runner-oas-linter
```

### Add your runner to Jest config

Once you have your Jest runner you can add it to your Jest config. You will almost
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
  runner: "oas-linter",
  displayName: "oas-linter",
  testMatch: [
    "<rootDir>/path/to/your/api/doc.js",
    "<rootDir>/path/to/another/api/doc.js",
    "<rootDir>/path/to/another/api/doc/**/*.js"
  ]
};
```

#### Minimal Steps

These are the more standard steps to set up a test runner

In your `package.json`

```json
{
  "jest": {
    "runner": "oas-linter",
    "testMatch": ["<rootDir>/path/to/your/api/doc.js"]
  }
}
```

Or in `jest.config.js`

```js
module.exports = {
  runner: "oas-linter",
  testMatch: ["<rootDir>/path/to/your/api/doc.js"]
};
```

### Configure OAS Linter

Configuration can be specified in your project root in `.oaslintrc.json`, or in an `oaslintConfig` in the `package.json` file.

Currently the only two options are to specify whether the default rules should be loaded with `loadDefaultRules` and to specify additional rules to be applied.

- `loadDefaultRules` is boolean and defaults to true, [oas-linter default rules](https://github.com/Mermade/oas-kit/blob/master/packages/oas-linter/rules.yaml) can be seen over there
- `rules` is an array of objects, as per oas-linter's [applyRules](https://github.com/Mermade/oas-kit/blob/master/packages/oas-linter/index.js#L12). More details about the format of rules supported can be found over at `oas-kit`'s [linter rules](https://mermade.github.io/oas-kit/linter-rules.html) documentation and the default rules (link above) have many examples.

In your `package.json`

```json
{
  "oaslintConfig": {
    "loadDefaultRules": true,
    "rules": [
      {
        "name": "schema-property-require-description",
        "object": "schema",
        "description": "schema properties must have a description",
        "truthy": "description"
      }
    ]
  }
}
```

Or in `.oaslintrc.json`

```json
{
  "loadDefaultRules": true,
  "rules": [
    {
      "name": "schema-property-require-description",
      "object": "schema",
      "description": "schema properties must have a description",
      "truthy": "description"
    }
  ]
}
```

### Run Jest

```bash
npx jest
# or with Yarn
yarn jest
```
