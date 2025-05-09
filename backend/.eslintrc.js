// backend/.eslintrc.js
module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true
  },
  extends: [
    "eslint:recommended"
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "script"
  },
  rules: {
    // allow lexical declarations in case blocks
    "no-case-declarations": "off"
  }
};
