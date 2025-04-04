module.exports = {
  extends: [
    'airbnb-base',
    'plugin:prettier/recommended', // 💥 Enables prettier rules
  ],
  plugins: ['prettier'],
  rules: {
    camelcase: 'off',
    'prettier/prettier': 'error',
    'no-console': 'off',
    // your other overrides
    quotes: ['error', 'single'],
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
};
