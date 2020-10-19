'use strict'

module.exports = {
  /**
   * Gets the parenthesized text of a node. This is similar to sourceCode.getText(node), but it also includes any parentheses
   * surrounding the node.
   * @param {SourceCode} sourceCode The source code object
   * @param {ASTNode} node An expression node
   * @returns {string} The text representing the node, with all surrounding parentheses included
   */
  getParenthesisedText(sourceCode, node) {
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
}
