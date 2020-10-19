# eslint-plugin-ternary

Catch logical and conditional errors inside ternary expressions. Enforce best practises for
JavaScript ternary operators.

The recommended config of this plugin sets default values on some existing core ESLint rules to
enforce a consistent ternary style. Developers are free to tweak and overwrite any settings
recommended by this plugin.

[![npm version](https://badge.fury.io/js/eslint-plugin-ternary.svg)](https://badge.fury.io/js/eslint-plugin-ternary)
[![Dependencies](https://david-dm.org/grayedfox/eslint-plugin-ternary.svg)](https://david-dm.org/grayedfox/eslint-plugin-ternary)
[![devDependencies](https://david-dm.org/grayedfox/eslint-plugin-ternary/dev-status.svg)](https://david-dm.org/grayedfox/eslint-plugin-ternary?type=dev)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

- [Installation](#installation)
- [Usage](#usage)
- [Rules](#rules)
  - [Recommended Config](#recommended-config)
- [Maintainers](#maintainers)
- [License](#license)

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm install eslint --save-dev
```

Next, install `eslint-plugin-ternary`:

```
$ npm install eslint-plugin-ternary --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must
also install `eslint-plugin-ternary` globally.

## Usage

Add `ternary` to the plugins section of your `.eslintrc` configuration file. You can omit the
`eslint-plugin-` prefix:

```json
{
    "plugins": [ "ternary" ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "ternary/no-dupe": "warn",
        "ternary/no-unreachable": "error"
    }
}
```

or start with the recommended rule set:

```json
{
  "extends": ["plugin:ternary/recommended"]
}
```

### Recommended Config

The recommended plugin configuration will:

- forbid the use of ternary operators for default assignment
- forbid identical left and right-hand ternary expressions
- forbid equivalent and superfluous ternary conditions (test statements)
- warn when nested ternaries are not in the truthy/left-hand/consequent position

Here's why:

```js
let isYes = answer === 1 ? true : false
// Error: unnecessary ternary. The above can be automatically fixed to:
let isYes = answer === 1

// Here, user.isMember can be truthy or falsy and the returned value will still be 2.00
const getFee = user => user.isMember ? 2.00 : 2.00
// Error: identical left and right-hand expressions '2.00'. What was probably meant:
const getFee = user => user.isMember = 2.00 : 3.00

// Here the value 'y' is unreachable code and will thus never be returned
condition1 && condition2 ? condition2 ? 'x' : 'y' : 'z'
// Error: duplicate ternary conditions 'condition2'. What was perhaps meant:
condition1 ? condition2 ? 'x' : 'y' : 'z'

// Here each ternary test is logically equivalent.
const result = condition1 || condition2 ? condition2 || condition1 ? 'x' : 'y' : 'z';
// Error: equivalent OR ternary conditions 'condition2 || condition1'

// Here condition2 is superfluous, although this does not technically result in unreachable code
const thing = condition1 || condition2 ? condition2 || condition3 ? 'x' : 'y' : 'z';
// Error: duplicate ternary OR conditions 'condition2'. What was perhaps meant:
const thing = condition1 || condition2 ? condition3 ? 'x' : 'y' : 'z';

// Here, we have a ternary nested as the right-hand value of a parent ternary:
const fn = (x, y) => x ? 1 : y ? 2 : 3
// Error: nested ternary conditions should appear as consequent (truthy) clause. Prefer:
const fn = (x, y) => x ? y ? 1 : 2 : 3
```

It might at first seem strange to prefer that nested (or chained) ternary conditions appear
consequentially but there are several good reasons for this:

1. All of the test conditions are grouped on the left
2. All possible return values are grouped on the right
3. It makes one-line ternary chains more readable/understandable and opinionated
4. It forces us to think about test condition order. The 1st condition being tested inside a
   condition chain should be the most determinate (i.e early on conditions should matter the most)

This is also why it is common practise to handle errors at the beginning of a code block.

For a more detailed explanation of this recommended setting (one that includes data structures)
checkout [this fiddle][1].

## Rules

| rule                                                     | description                                                                      | recommended | fixable  |
| -------------------------------------------------------- | -------------------------------------------------------------------------------- | ----------- | -------- |
| [`no-dupe`][no-dupe]                                     | Forbid identical left and right-hand ternary expressions.                        | :bangbang:  |          |
| [`no-unreachable`][no-unreachable]                       | Forbid equivalent nested ternary conditions which causes unreachable code.       | :bangbang:  |          |
| [`no-unneeded`][no-unneeded]                             | Forbid ternary operators that are strictly unnecessary.                          | :bangbang:  | :wrench: |
| [`nested`][nested]                                       | Control where nested ternary operators can appear inside of a parent ternary     | :bangbang:  |          |

**Key**

| icon       | description                                     |
| ---------- | ----------------------------------------------- |
| :bangbang: | Reports as error in recommended configuration   |
| :warning:  | Reports as warning in recommended configuration |
| :wrench:   | Rule is fixable with `eslint --fix`             |

## To Do

- Write a rule that mimics the behaviour of operator line breaks but only for ternary operators

## Maintainers

- Che Fisher - [@GrayedFox][]

## License

- (c) 2020 Che Fisher <mailto:che.fisher@gmail.com> - ISC license.

## Further Reading

Read Eric Elliot's ['Nested Ternaries are Great'][0] for an excellent explanation of the difference
between an if statement and if expression and why nested ternaries are not as bad as they are often
made out to be.

[0]: https://medium.com/javascript-scene/nested-ternaries-are-great-361bddd0f340
[1]: https://jsfiddle.net/fxL5wchd/5/

[no-dupe]: docs/rules/no-dupe.md
[no-unreachable]: docs/rules/no-unreachable.md
[no-unneeded]: https://eslint.org/docs/rules/no-unneeded-ternary
[nested]: https://github.com/getify/eslint-plugin-proper-ternary#then-nesting
[operator-linebreaks]: https://eslint.org/docs/rules/operator-linebreak
