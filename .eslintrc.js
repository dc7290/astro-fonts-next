module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    project: ['./tsconfig.json'],
  },
  plugins: ['simple-import-sort'],
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'no-undef': 'off',
    'no-continue': 'off',
    'no-restricted-syntax': 'off',
    'no-console': ['error', { allow: ['warn', 'error'] }],
    "simple-import-sort/imports": "warn",
    "simple-import-sort/exports": "warn"
  },
}
