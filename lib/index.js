/**
 * @fileoverview Catch logical and conditional errors inside of ternary conditions.
 * @author Che Fisher
 */
'use strict'

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const requireIndex = require('requireindex')

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------

// import all rules in lib/rules
module.exports.rules = requireIndex(__dirname + '/rules')

module.exports.configs = {
  recommended: {
    plugins: ['ternary'],
    rules: {
      'no-unneeded-ternary': ['error', { defaultAssignment: false }],
      'ternary/nesting': ['error', { test: false, consequent: true, alternate: false }],
      'ternary/no-dupe': ['error'],
      'ternary/no-unreachable': ['error', { allowDuplicateOrConditions: false }]
    }
  }
}
