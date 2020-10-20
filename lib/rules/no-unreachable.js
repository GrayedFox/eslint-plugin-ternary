/**
 * @fileoverview Disallow unreachable expressions within nested ternary operators
 * @author Che Fisher
 */
'use strict'

const astUtils = require('../utils/ast-utils')

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'problem',

    docs: {
      description: 'disallow unreachable expressions within nested ternary operators',
      category: 'Possible Errors'
    },

    schema: [
      {
        type: 'object',
        properties: {
          allowDuplicateOrConditions: {
            type: 'boolean',
            default: true
          }
        },
        additionalProperties: false
      }
    ],

    messages: {
      duplicateCondition: "Duplicate ternary conditions '{{condition}}'.",
      duplicateInvertedCondition: "Duplicate inverted ternary conditions '{{condition}}'.",
      equivalentOrCondition: "Equivalent ternary OR conditions '{{condition}}'.",
      duplicateOrCondition: "Duplicate ternary OR conditions '{{condition}}'."
    }
  },

  create(context) {
    const options = context.options[0] || {}
    const allowDuplicateOrConditions = options.allowDuplicateOrConditions !== false
    const ternaryConditions = []
    const ternaryOrConditions = []
    const invertedTernaryConditions = []

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    /**
     * Creates a boolean inverse string representation of a condition
     * @param {string} condition A pre-formatted test condition in string form
     * @returns {string} A string representing the inverted test condition
     */
    function invertExpression(condition) {
      return condition[0] === '!' ? condition.slice(1) : `!(${condition})`
    }

    /**
     * Recursively splits the given node by the logical and (&&) operator.
     * @param {ASTNode} node The node to split.
     * @returns {ASTNode[]} Array of conditions that makes the node when joined by the operator.
     */
    function splitByAnd(node) {
      const operator = '&&'

      if (node.type === 'LogicalExpression' && node.operator === operator) {
        return [...splitByAnd(node.left), ...splitByAnd(node.right)]
      }
      return [node]
    }

    /**
     * Splits a string representation of a test expression by the logical (||) operator.
     * @param  {string} condition The test condition in string form
     * @returns {string[]} An array of whitespace trimmed strings
     */
    function splitByOr(condition) {
      return condition.split('||').map((e) => e.trim())
    }

    /**
     * Populates the ternary condition arrays
     * @param {string} condition The test condition in string form
     * @returns {void}
     */
    function populateConditions(condition) {
      const splitOrs = splitByOr(condition)
      ternaryConditions.push(condition)
      invertedTernaryConditions.push(invertExpression(condition))

      if (splitOrs.length > 1) {
        ternaryOrConditions.push(splitOrs)
      }
    }

    /**
     * Determines if arrA is a subset of arrB
     * @param  {Array} arrA The array to compare from
     * @param  {Array} arrB The array to compare against
     * @returns {boolean} True if arrB contains all elements of arrA
     */
    function isSubsetOf(arrA, arrB) {
      return arrA.every((a) => arrB.some((b) => a === b))
    }

    /**
     * Determins if arrA has any of the same elements as arrB
     * @param  {Array} arrA The array to compare from
     * @param  {Array} arrB The array to compare against
     * @returns {type} True if arrA and arrB share any of the same elements
     */
    function containsDuplicates(arrA, arrB) {
      return arrA.some((a) => arrB.includes(a))
    }

    /**
     * Gets the test condition and strictly necessary operators minus any unneeded enclosing parens
     * @param  {ASTNode} node The node we will extract a basic test condition from
     * @returns {string} The test condition with necessary operators only
     */
    function getBasicTestCondition(node) {
      const condition = astUtils.getUnparenthesisedText(node)
      const notOperands = [...condition].filter((c) => c === '!')
      return notOperands.length % 2 === 0
        ? condition.slice(notOperands.length)
        : condition.slice(notOperands.length - 1)
    }

    /**
     * Determines if a node is a child of an and (&&) test condition
     * @param  {ASTNode} node The node to determine
     * @returns {boolean} True if the node's parent is an and condition
     */
    function isAndChild(node) {
      return node.parent.type === 'LogicalExpression' && node.parent.operator === '&&'
    }

    /**
     * Checks if we have already encountered this condition before
     * @param  {string} condition The test conditon in string form
     * @returns {boolean} True if we have already seen this exact condition before
     */
    function isDuplicate(condition) {
      return ternaryConditions.includes(condition)
    }

    /**
     * Checks if we have already encountered this condition in its inverted form
     * @param  {string} condition The test conditon in string form
     * @returns {boolean} True if we have already seen the inverted form of this condition
     */
    function isInvertedDuplicate(condition) {
      return invertedTernaryConditions.includes(condition)
    }

    /**
     * Checks if we have already encountered this OR condition in any of its equivalent forms
     * @param  {string} condition The test condition in string form
     * @returns {boolean} True if we have already seen this condition in any of it's equivalent forms
     */
    function isOrEquivalent(condition) {
      const splitOrs = splitByOr(condition)

      for (const priorOrCondition of ternaryOrConditions) {
        if (isSubsetOf(splitOrs, priorOrCondition)) {
          return true
        }
      }
      return false
    }

    /**
     * Checks if we have already encountered this condition inside of another OR condition
     * @param  {string} condition The test condition in string form
     * @returns {boolean} True if this condition forms part of another OR condition
     */
    function isOrDuplicate(condition) {
      const splitOrs = splitByOr(condition)

      for (const priorOrCondition of ternaryOrConditions) {
        if (containsDuplicates(splitOrs, priorOrCondition)) {
          return true
        }
      }
      return false
    }

    /**
     * Get the first encountered duplicate OR condition
     * @param  {string} condition The test condition in string form
     * @returns {string} The duplicate, if present, or an empty string
     */
    function getOrDuplicate(condition) {
      const splitOrs = splitByOr(condition)

      for (const priorOrArray of ternaryOrConditions) {
        for (const orCondition of splitOrs) {
          if (priorOrArray.includes(orCondition)) {
            return orCondition
          }
        }
      }
    }

    /**
     * Reports a node for violating the rule
     * @param  {ASTNode} node The node to report
     * @param  {string} messageId The id of the message
     * @param  {Object} data An object containing an expression property
     * @returns {void}
     */
    function reportNode(node, messageId, data) {
      context.report({ node, messageId, data })
    }

    return {
      ConditionalExpression(node) {
        const test = node.test
        const conditionNodes = splitByAnd(test)

        for (const conditionNode of conditionNodes) {
          const condition = getBasicTestCondition(conditionNode)
          const invertedCondition = invertExpression(condition)

          if (isDuplicate(condition) || isInvertedDuplicate(invertedCondition)) {
            reportNode(node, 'duplicateCondition', { condition })
          }
          if (isInvertedDuplicate(condition) || isDuplicate(invertedCondition)) {
            reportNode(node, 'duplicateInvertedCondition', { condition })
          }
          if (!isAndChild(conditionNode) && isOrEquivalent(condition)) {
            reportNode(node, 'equivalentOrCondition', { condition })
          } else if (
            !isAndChild(conditionNode) &&
            !allowDuplicateOrConditions &&
            isOrDuplicate(condition)
          ) {
            reportNode(node, 'duplicateOrCondition', { condition: getOrDuplicate(condition) })
          }
          populateConditions(condition)
        }
      }
    }
  }
}
