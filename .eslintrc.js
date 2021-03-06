module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'max-len': 'off',
    'comma-dangle': 'off',
    'semi': 'warn',
    'no-unused-vars': 'warn',
    'prefer-destructuring': 'warn',
    'arrow-parens': ['error', 'as-needed']
  },
};
