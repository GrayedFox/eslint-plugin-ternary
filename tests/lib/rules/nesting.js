/**
 * @fileoverview Disallow ternaries to be nested outside of approved positions
 * and enforces a maximum allowed depth, if specified
 * @author Che Fisher
 */
'use strict'

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { rules } = require('../../../lib/index')

const RuleTester = require('eslint').RuleTester
const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6
  }
})

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

ruleTester.run('nesting', rules['nesting'], {
  valid: [
    'isMember ? 2.00 : 3.00;',
    'condition1 ? foo() : condition2 ? bar() : condition3 ? baz() : qux()',
    '5 < 7 ? (5 < 6 ? true : false) : false',
    { code: 'const fn = (x, y) => x ? y ? 1 : 2 : 3', options: [{ alternate: false }] },
    {
      code: 'const fn = (x, y, z) => (x ? true : false) ? (y ? 1 : 2) : (z ? 3 : 4)',
      options: [{ alternate: true, consequent: true, test: true }]
    },
    {
      code: 'const fn = () => a ? b ? c ? d ? e ? f ? 1 : 2 : 3 : 4 : 5 : 6 : g ? 7 : 8',
      options: [{ depth: 6 }]
    },
    {
      code: 'x ? y ? z ? 1 : 2 : 3 : 4',
      options: [{ depth: 3 }]
    },
    {
      code: 'foo() ? 1 : 2',
      options: [{ depth: 0 }]
    }
  ],

  invalid: [
    {
      code: '(isMember ? 1 : 2) ? x : y',
      errors: [
        {
          messageId: 'forbiddenTest',
          type: 'ConditionalExpression'
        }
      ]
    },
    {
      code: '(isMember ? 1 : 2) ? x : y',
      options: [{ consequent: false, alternate: false }],
      errors: [
        {
          messageId: 'forbiddenTest',
          type: 'ConditionalExpression'
        }
      ]
    },
    {
      code: 'const fn = (x, y) => x ? y ? 1 : 2 : 3',
      options: [{ consequent: false }],
      errors: [
        {
          messageId: 'forbiddenCons',
          type: 'ConditionalExpression'
        }
      ]
    },
    {
      code: 'condition ? condition2 ? x : y : z',
      options: [{ consequent: false, alternate: true }],
      errors: [
        {
          messageId: 'forbiddenCons',
          type: 'ConditionalExpression'
        }
      ]
    },
    {
      code: 'const result = condition ? x : condition2 ? y : z',
      options: [{ alternate: false, consequent: true }],
      errors: [
        {
          messageId: 'forbiddenAlt',
          type: 'ConditionalExpression'
        }
      ]
    },
    {
      code: 'const fn = (x, y, z) => (x ? true : false) ? (y ? 1 : 2) : (z ? 3 : 4)',
      options: [{ alternate: false, consequent: false, test: false }],
      errors: [
        {
          messageId: 'forbiddenTest',
          type: 'ConditionalExpression'
        },
        {
          messageId: 'forbiddenCons',
          type: 'ConditionalExpression'
        },
        {
          messageId: 'forbiddenAlt',
          type: 'ConditionalExpression'
        }
      ]
    },
    {
      code: 'x ? y ? z ? 1 : 2 : 3 : 4',
      options: [{ depth: 1 }],
      errors: [
        {
          messageId: 'forbiddenDepth',
          type: 'ConditionalExpression'
        }
      ]
    },
    {
      code: 'x ? 1 ? y ? 2 : z : 3 : 4',
      options: [{ depth: 0 }],
      errors: [
        {
          messageId: 'forbiddenDepth',
          type: 'ConditionalExpression'
        }
      ]
    },
    {
      code: 'a ? b ? c ? d ? e ? f ? g ? 1 : 2 : 3 : 4 : 5 : 6 : 7 : 8',
      options: [{ depth: 5 }],
      errors: [
        {
          messageId: 'forbiddenDepth',
          type: 'ConditionalExpression'
        }
      ]
    },
    {
      code: 'foo() ? bar() ? 1 : 2 : 3',
      options: [{ depth: 0 }],
      errors: [
        {
          messageId: 'forbiddenDepth',
          type: 'ConditionalExpression'
        }
      ]
    }
  ]
})
