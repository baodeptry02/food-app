module.exports = {
  env: {
    es6: true,
    node: true,
    browser: true, // Thêm môi trường browser nếu bạn đang làm việc với frontend
  },
  parserOptions: {
    ecmaVersion: 2020, // Sử dụng phiên bản ECMAScript mới hơn
    sourceType: 'module', // Sử dụng module source type nếu bạn đang sử dụng ES6 modules
    ecmaFeatures: {
      jsx: true, // Thêm hỗ trợ JSX nếu bạn đang làm việc với React
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended', // Thêm plugin React nếu bạn đang làm việc với React
    'plugin:@typescript-eslint/recommended', // Thêm plugin TypeScript nếu bạn đang làm việc với TypeScript
    'prettier', // Thêm Prettier để tự động định dạng mã
  ],
  plugins: [
    'react', // Thêm plugin React nếu bạn đang làm việc với React
    '@typescript-eslint', // Thêm plugin TypeScript nếu bạn đang làm việc với TypeScript
    'prettier', // Thêm plugin Prettier để tự động định dạng mã
  ],
  rules: {
    'no-restricted-globals': ['error', 'name', 'length'],
    'prefer-arrow-callback': 'error',
    quotes: ['error', 'double', { allowTemplateLiterals: true }],
    semi: ['error', 'always'],
    indent: ['error', 2],
    'no-console': 'warn',
    'prettier/prettier': 'error', // Thêm quy tắc Prettier để tự động định dạng mã
  },
  settings: {
    react: {
      version: 'detect', // Tự động phát hiện phiên bản React
    },
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
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
};
