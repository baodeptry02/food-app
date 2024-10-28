module.exports = {
  env: {
    es6: true,
    node: true,
    browser: true, // Thêm môi trường browser nếu bạn đang làm việc với frontend
  },
  parserOptions: {
    ecmaVersion: 2020, // Sử dụng phiên bản ECMAScript mới hơn
    sourceType: 'module', // Sử dụng module source type nếu bạn đang sử dụng ES6 modules
  },
  extends: [
    'eslint:recommended',
    'google',
    'plugin:react/recommended', // Thêm plugin React nếu bạn đang làm việc với React
  ],
  plugins: [
    'react', // Thêm plugin React nếu bạn đang làm việc với React
  ],
  rules: {
    'no-restricted-globals': ['error', 'name', 'length'],
    'prefer-arrow-callback': 'error',
    quotes: ['error', 'double', { allowTemplateLiterals: true }],
    semi: ['error', 'always'],
    indent: ['error', 2],
    'no-console': 'warn',
  },
  overrides: [
    {
      files: ['**/*.spec.*'],
      env: {
        mocha: true,
      },
      rules: {},
    },
  ],
  globals: {
    React: 'writable',
  },
};
