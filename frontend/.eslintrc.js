// frontend/.eslintrc.js
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended"
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    }
  },
  settings: {
    react: {
      version: "detect"
    }
  },
  rules: {
    // disable prop-types rule if you prefer TypeScript for typing later
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off"
  }
};
