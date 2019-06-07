'use strict'

const { pass, fail } = require('create-jest-runner')
const { default: toTestResult } = require('create-jest-runner/build/toTestResult')
const validator = require('oas-validator') 
const linter = require('oas-linter') 

const warningToTest = (duration, testPath) => (warning) => {
  const {
    ruleName,
    message,
    pointer,
  } = warning

  return {
    duration,
    errorMessage: message, // Does not seem to be used in reporters
    testPath,
    title: `${message} - ${pointer} (${ruleName})`,
  }
}

const run = ({ testPath, config, globalConfig }) => {
  console.log({ config, globalConfig })
  const schema = require(testPath)
  const test = {
    path: testPath,
    title: 'OAS Linter',
  }
  const result = {
    start: Date.now(),
    test,
  }

  if (!schema || typeof schema !== 'object') {
    return fail({
      ...result,
      end: Date.now(),
      test: {
        ...test,
        errorMessage: `${testPath} does not resolve to an object, cannot be a valid schema`
      },
    })
  }

  // TODO configurable
  /**/
  linter.applyRules({
    rules: [
      {
        name: 'schema-property-require-description',
        object: 'schema',
        description: 'schema properties should have an example',
        truthy: 'description'
      },
    ],
  })
  /**/
  
  return new Promise((resolve, reject) => {
    validator.validate(schema, {
      skip: false,
      lint: true,
      linter: linter.lint,
      linterResults: linter.getResults,
      prettify: true,
      verbose: false,
    }, (error, options) => {
      const { context, warnings, valid } = options || error.options
      result.end = Date.now()

      // All is well
      if (valid && !warnings.length) return resolve(pass(result))

      // Schema is not a valid schema
      if (!valid) {
        return resolve(fail({
          ...result,
          errorMessage: 'Not a valid OpenAPI schema.',
        }))
      }

      // Schema is valid, but warnings (lint failures) were present
      // console.log({ context, warnings, valid })
      const bad = toTestResult({
        errorMessage: 'Schema is valid, but linting errors were present.',
        stats: {
          failures: warnings.length,
          pending: 0,
          passes: 0,
          todo: 0,
          start: result.start,
          end: result.end,
        },
        tests: warnings.map(warningToTest(result.end - result.start, testPath)),
        jestTestPath: testPath,
      })

      // console.log(bad)

      return resolve(bad)
    })
  })
}

module.exports = run
