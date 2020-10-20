/**
 * @fileoverview Common utils for AST.
 * @author Gyandeep Singh and Che Fisher
 */

'use strict'

/**
 * Gets the parenthesized text of a node. This is similar to sourceCode.getText(node)
 * but it also includes any parentheses surrounding the node.
 * @param {SourceCode} sourceCode The source code object
 * @param {ASTNode} node An expression node
 * @returns {string} The text representing the node, with all surrounding parentheses included
 */
function getParenthesisedText(sourceCode, node) {
  let leftToken = sourceCode.getFirstToken(node)
  let rightToken = sourceCode.getLastToken(node)

  while (
    sourceCode.getTokenBefore(leftToken) &&
    sourceCode.getTokenBefore(leftToken).type === 'Punctuator' &&
    sourceCode.getTokenBefore(leftToken).value === '(' &&
    sourceCode.getTokenAfter(rightToken) &&
    sourceCode.getTokenAfter(rightToken).type === 'Punctuator' &&
    sourceCode.getTokenAfter(rightToken).value === ')'
  ) {
    leftToken = sourceCode.getTokenBefore(leftToken)
    rightToken = sourceCode.getTokenAfter(rightToken)
  }

  return sourceCode.getText().slice(leftToken.range[0], rightToken.range[1])
}

/**
 * Gets the unparenthesised text of a node by constructing a string that consists only of
 * necessary parens and operators, so (const result = !(!(!(foo(x, y))))) becomes const result = !!!foo(x,y)
 *
 * @param  {ASTNode} node The node to operate on
 * @param {string} text The string that is recursively built upon as needed
 * @returns {string} The resulting string representation minus punctuating parens
 * @public
 */
function getUnparenthesisedText(node, text = '') {
  const type = node.type

  if (type === 'UnaryExpression') {
    const operator = node.operator === 'typeof' ? 'typeof ' : node.operator
    return getUnparenthesisedText(node.argument, `${operator}${text}`)
  }

  if (type === 'LogicalExpression' || type === 'BinaryExpression') {
    return (text += `${getUnparenthesisedText(node.left)} ${node.operator} ${getUnparenthesisedText(
      node.right
    )}`)
  }

  if (type === 'CallExpression') {
    text += `${node.callee.name}(${node.arguments.map((a) => a.name).join(', ')})`
  }

  if (type === 'MemberExpression') {
    const value = node.property.name ? `.${node.property.name}` : `[${node.property.value}]`
    text += `${node.object.name}${value}`
  }

  if (type === 'Identifier') {
    text += node.name
  }

  if (type === 'Literal') {
    text += node.raw
  }

  return text
}

module.exports = {
  /**
   * Checks if two tokens are identical
   *
   * @param  {Token} tokenA the first token
   * @param  {Token} tokenB the second token
   * @returns {boolean} True if the tokens are identical
   */
  identicalTokens(tokenA, tokenB) {
    return (
      tokenA &&
      tokenB &&
      tokenA.range[0] === tokenB.range[0] &&
      tokenA.range[1] === tokenB.range[1] &&
      tokenA.type === tokenB.type
    )
  },

  /**
   * Checks if the given token is an opening parenthesis token or not.
   * @param {Token} token The token to check.
   * @returns {boolean} `true` if the token is an opening parenthesis token.
   */
  isOpeningParenToken(token) {
    return token.value === '(' && token.type === 'Punctuator'
  },

  /**
   * Checks if the given token is a closing parenthesis token or not.
   * @param {Token} token The token to check.
   * @returns {boolean} `true` if the token is a closing parenthesis token.
   */
  isClosingParenToken(token) {
    return token.value === ')' && token.type === 'Punctuator'
  },

  /**
   * Checks if the given token is an opening square bracket token or not.
   * @param {Token} token The token to check.
   * @returns {boolean} `true` if the token is an opening square bracket token.
   */
  isOpeningBracketToken(token) {
    return token.value === '[' && token.type === 'Punctuator'
  },

  /**
   * Checks if the given token is a closing square bracket token or not.
   * @param {Token} token The token to check.
   * @returns {boolean} `true` if the token is a closing square bracket token.
   */
  isClosingBracketToken(token) {
    return token.value === ']' && token.type === 'Punctuator'
  },

  /**
   * Checks if the given token is an opening brace token or not.
   * @param {Token} token The token to check.
   * @returns {boolean} `true` if the token is an opening brace token.
   */
  isOpeningBraceToken(token) {
    return token.value === '{' && token.type === 'Punctuator'
  },

  /**
   * Checks if the given token is a closing brace token or not.
   * @param {Token} token The token to check.
   * @returns {boolean} `true` if the token is a closing brace token.
   */
  isClosingBraceToken(token) {
    return token.value === '}' && token.type === 'Punctuator'
  },

  /**
   * Determines whether two adjacent tokens are on the same line.
   * @param {Object} left The left token object.
   * @param {Object} right The right token object.
   * @returns {boolean} Whether or not the tokens are on the same line.
   */
  isTokenOnSameLine(left, right) {
    return left.loc.end.line === right.loc.start.line
  },

  getParenthesisedText,
  getUnparenthesisedText
}
