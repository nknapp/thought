module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true
  },
  extends: ['standard', 'prettier'],
  plugins: ['promise'],
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
    "no-var": "error",
    "prefer-const": "warn",
    "no-console": "warn"
  },
  overrides: [
    {
      files: ['**/test/*-spec.js'],
      env: {
        mocha: true
      }
    },
    {
      files: ['examples/**/*.js'],
      rules: {
        'no-console': 'off'
      }
    }
  ]
}
