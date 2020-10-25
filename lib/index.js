/**
 * @fileoverview Catch logical and conditional errors inside of ternary conditions.
 * @author Che Fisher
 */
'use strict'

const fs = require('fs')
const path = require('path')

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const loadRules = () => {
  const rules = {}
  const dirPath = `${__dirname}/rules`
  fs.readdirSync(dirPath).forEach((filename) => {
    const filepath = path.resolve(path.join(dirPath, filename))
    const basename = path.basename(filename, '.js')
    rules[basename] = require(filepath)
  })
  return rules
}

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------

// import all rules in lib/rules
module.exports.rules = loadRules()

module.exports.configs = {
  recommended: {
    plugins: ['ternary'],
    rules: {
      'operator-linebreak': ['error', 'after', { overrides: { '?': 'before', ':': 'before' } }],
      'no-unneeded-ternary': ['error', { defaultAssignment: false }],
      'ternary/nesting': ['error', { test: false, consequent: true, alternate: false }],
      'ternary/no-dupe': ['error'],
      'ternary/no-unreachable': ['error', { allowDuplicateOrConditions: false }]
    }
  }
}
