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
            default: -1
          }
        },
        additionalProperties: false
      }
    ],

    messages: {
      forbiddenTest: "Ternary '{{operator}}' cannot be nested at {{position}} position.",
      forbiddenCons: "Ternary '{{operator}}' cannot be nested at {{position}} position.",
      forbiddenAlt: "Ternary '{{operator}}' cannot be nested at {{position}} position.",
      forbiddenDepth: "Nested ternary has disallowed depth of '{{depth}}'"
    }
  },

  create(context) {
    const options = context.options[0] || {}

    const allowedClauses = {
      test: options.test === true,
      consequent: options.consequent !== false,
      alternate: options.alternate !== false
    }

    const maxDepth = options.depth >= 0 ? options.depth : -1
    let depthReported = false

    const sourceCode = context.getSourceCode()
    const text = sourceCode.getText()

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    /**
     * Check if node is nested in a forbidden position
     *
     * @param  {ASTNode} node The node to report
     * @returns {boolean} True if the node is not allowed to be nested at it's current position
     */
    function isForbiddenNest(node, position) {
      return node.type === 'ConditionalExpression' && !allowedClauses[position]
    }

    /**
     * Check if depth exceeds the maximum allowed ternary nested depth
     *
     * @param {number} depth the depth of the current node
     * @returns {boolean} True if depth is greater than allowed depth
     */
    function isForbiddenDepth(depth) {
      return depth > maxDepth && maxDepth >= 0
    }

    /**
     * Get the nested depth of a node
     *
     * @param {ASTNode[]} nodes An ordered list of nodes from the parent to the current node
     * @param {Number} depth The depth of the node, used for recursion
     * @returns {Number} the depth of the final node in the ternary chain
     */
    function getTernaryDepthFromRoot(nodes, depth = -1) {
      for (const node of nodes) {
        if (node.type === 'ConditionalExpression') {
          return getTernaryDepthFromRoot([node.test, node.consequent, node.alternate], ++depth)
        }
      }

      return depth
    }

    /**
     * Reports a node for violating the rule
     * @param  {ASTNode} node The node to report
     * @param  {string} messageId The id of the message
     * @param  {Object} data the data object
     * @returns {void}
     */
    function reportNode(node, messageId, data) {
      context.report({ node, messageId, data })
    }

    return {
      ConditionalExpression(node) {
        const test = node.test
        const cons = node.consequent
        const alt = node.alternate

        const currentDepth = getTernaryDepthFromRoot([...context.getAncestors(), node])

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

        if (isForbiddenDepth(currentDepth) && !depthReported) {
          depthReported = true
          reportNode(node, 'forbiddenDepth', { depth: currentDepth })
        }
      }
    }
  }
}
