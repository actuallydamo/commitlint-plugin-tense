module.exports = {
  extends: ['standard-with-typescript', 'plugin:jest/recommended'],
  parserOptions: {
    project: './tsconfig.json'
  },
  ignorePatterns: ['/dist/'],
  plugins: ['jest']
}
