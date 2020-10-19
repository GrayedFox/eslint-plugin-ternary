# Control where and how deep ternary operators can be nested (#nesting)

This rule controls at what position a ternary operator can be nested within another ternary
operator.

## Rule Details

This rule requires nested ternary operators appear at a certain position.

All ternary operators have 3 clauses: a test, a consequent, and an alternate.

```js
const result = test ? consequent : alternate
```

## Options

All of the options for this rule can be configured individually or combined.

- `nesting: ["error", { "test": false, "consequent": true, "alternate": true }]` (default) allows
  ternaries to be nested as a consequent or alternate expression
- `nesting: ["error", { "test": false, "consequent": true, "alternate": false }]` (recommended)
  only allow ternaries to be nested as a consequent expression

### test

When set to true, allows ternary operators to be nested at the test position. Note that this is a
very confusing and an uncommon coding pattern.

Examples of **correct** code for this rule:

```js
/*eslint nesting: ["error", { "test": true, "consequent": false, "alternate": false }]*/

const result = (condition ? 1 : 2) ? 'consequent' : 'alternate'
```

Examples of **incorrect** code for this rule:

```js
/*eslint nesting: ["error", { "test": true, "consequent": false, "alternate": false }]*/

const result = condition ? (condition2 ? 1 : 2) : 'alternate'
// Error: cannot nest ternary 'condition2 ? 1 : 2)' as consequent of ternary operator

const result = condition ? 'consequent' : (condition2 ? 1 : 2)
// Error: cannot nest ternary '(condition2 ? 1 : 2)' as alternate of ternary operator
```

### consequent

When set to true allows ternary operators to be nested at the consequent position.

Examples of **correct** code for this rule:

```js
/*eslint nesting: ["error", { "test": false, "consequent": true, "alternate": false }]*/

const result = condition1 ? condition2 ? 1 : 2 : 3
```

Examples of **incorrect** code for this rule:

```js
/*eslint nesting: ["error", { "test": false, "consequent": true, "alternate": false }]*/

const result = condition1 ? 'consequent' : condition2 ? 'consequent' : 'alternate'
// Error: cannot nest ternary 'condition2' as alternate of ternary operator

const result = (condition ? 1 : 2) ? 'consequent' : 'alternate'
// Error: cannot nest ternary '(condition ? 1 : 2)' as test of ternary operator
```

### alternate

When set to true allows ternary operators to be nested at the alternate position.

Examples of **correct** code for this rule:

```js
/*eslint nesting: ["error", { "test": false, "consequent": false, "alternate": true }]*/

const result = condition1 ? 1 : condition2 ? 2 : 3
```

Examples of **incorrect** code for this rule:

```js
/*eslint nesting: ["error", { "test": false, "consequent": false, "alternate": true }]*/

const result = condition1 ? (condition2 ? 'consequent' : 'alternate') : 'alternate'
// Error: cannot nest ternary 'condition2' as consequent of ternary operator

const result = (condition ? 1 : 2) ? 'consequent' : 'alternate'
// Error: cannot nest ternary '(condition ? 1 : 2)' as test of ternary operator
```

## When Not To Use It

If you have no interest or preference for where ternary operators can be nested.
