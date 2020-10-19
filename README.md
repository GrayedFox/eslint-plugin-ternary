# eslint-plugin-ternary

Catch logical and conditional errors inside of ternary conditions.

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-ternary`:

```
$ npm install eslint-plugin-ternary --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must
also install `eslint-plugin-promise` globally.

## Usage

Add `ternary` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

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

## Rules

| rule                                                     | description                                                                      | recommended | fixable  |
| -------------------------------------------------------- | -------------------------------------------------------------------------------- | ----------- | -------- |
| [`no-dupe`][no-dupe]                                     | Forbid identical left and right-hand ternary expressions.                        | :bangbang:  |          |
| [`no-unreachable`][no-unreachable]                       | Forbid equivalent nested ternary conditions which causes unreachable code.       | :bangbang:  |          |

**Key**

| icon       | description                                     |
| ---------- | ----------------------------------------------- |
| :bangbang: | Reports as error in recommended configuration   |
| :warning:  | Reports as warning in recommended configuration |
| :wrench:   | Rule is fixable with `eslint --fix`             |
