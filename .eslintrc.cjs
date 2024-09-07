module.exports = {
  env: {
    browser: true,
    es2021: true,
    jquery: true,
  },
  extends: ["standard"],
  parserOptions: {
    // 解析器配置选项
    ecmaVersion: 12, // 指定es版本
    sourceType: "module", // 代码支持es6，使用module
  },
  globals: {
    $: "readonly",
    jQuery: "readonly",
  },
  rules: {
    "comma-dangle": ["error", "only-multiline"],
    quotes: ["error", "single"],
    "space-before-blocks": ["error", "never"],
    "no-unused-vars": ["warn"],
    "no-new": ["warn"],
    "no-case-declarations": "off",
    "space-before-function-paren": [
      "error",
      {
        anonymous: "never",
        named: "never",
        asyncArrow: "always",
      },
    ],

    indent: [
      "warn",
      4,
      {
        SwitchCase: 1,
        VariableDeclarator: "first",
        MemberExpression: 0,
      },
    ],
  },
};
