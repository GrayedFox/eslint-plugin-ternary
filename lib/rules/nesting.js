/**
 * @fileoverview Disallow ternaries to be nested outside of approved positions
 * @author Che Fisher
 */
'use strict'

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'problem',

    docs: {
      description: 'disallow ternaries to be nested outside of approved positions',
      category: 'Best Practises'
    },

    schema: [
      {
        type: 'object',
        properties: {
          test: {
            type: 'boolean',
            default: false
          },
          consequent: {
            type: 'boolean',
            default: true
          },
          alternate: {
            type: 'boolean',
            default: true
          },
          depth: {
            type: 'integer',
            min: 1
          }
        },
        additionalProperties: false
      }
    ],

    messages: {
      forbiddenTest: "Ternary '{{operator}}' cannot be nested at {{position}} position.",
      forbiddenCons: "Ternary '{{operator}}' cannot be nested at {{position}} position.",
      forbiddenAlt: "Ternary '{{operator}}' cannot be nested at {{position}} position."
    }
  },

  create(context) {
    const options = context.options[0] || {}
    const allowedClauses = {
      test: options.test === true,
      consequent: options.consequent !== false,
      alternate: options.alternate !== false
    }
    const sourceCode = context.getSourceCode()
    const text = sourceCode.getText()

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    /**
     * Check if
     *
     * @param  {ASTNode} node The node to report
     * @returns {boolean} True if the node is not allowed to be nested at it's current position
     */
    function isForbiddenNest(node, position) {
      return node.type === 'ConditionalExpression' && !allowedClauses[position]
    }

    /**
     * Reports a node for violating the rule
     * @param  {ASTNode} node The node to report
     * @param  {string} messageId The id of the message
     * @param  {Object} data the data object
     * @returns {void}
     */
    function reportNode(node, messageId, data) {
      context.report({
        node,
        messageId,
        data
      })
    }

    return {
      ConditionalExpression(node) {
        const test = node.test
        const cons = node.consequent
        const alt = node.alternate

        if (isForbiddenNest(test, 'test')) {
          reportNode(test, 'forbiddenTest', {
            operator: text.slice(...test.range),
            position: 'test'
          })
        }
        if (isForbiddenNest(cons, 'consequent')) {
          reportNode(cons, 'forbiddenCons', {
            operator: text.slice(...cons.range),
            position: 'consequent'
          })
        }
        if (isForbiddenNest(alt, 'alternate')) {
          reportNode(alt, 'forbiddenAlt', {
            operator: text.slice(...alt.range),
            position: 'alternate'
          })
        }
      }
    }
  }
}
