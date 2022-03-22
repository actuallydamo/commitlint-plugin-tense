# Commitlint Plugin Tense

A commitlint plugin that checks tense

## Getting Started

```shell
npm install --save-dev commitlint-plugin-tense
```

And configure `commitlint.config.js` to use the tense plugin.

```js
module.exports = {
  plugins: ['commitlint-plugin-tense'],
  rules: {
    'tense/subject-tense': [1, 'always']
  }
}
```

#### subject-tense
* **condition**: `subject` is verbalized in tense present in `allowedTenses`
```js
'tense/subject-tense': [severity, when, options]
```
* **severity**: `0` disable, `1` warning, or `2` error
* **when**: `always` or `never`
* **options**
```js
{
  // Array of tenses allowed
  allowedTenses: ['present-imperative'],
  // Check the first verb only or all verbs
  // Accuracy is low when checking all verbs, use with warning level only
  firstOnly: true,
  // A list of additional allowed words
  allowlist: [],
}
```

#### Tenses
```js
[
  'past-participle', // done
  'past-tense', // did
  'present-imperative', // do
  'present-participle', // doing
  'present-third-person' // does
]
```

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/actuallydamo/commitlint-plugin-tense
