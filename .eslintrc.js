module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    'standard'
  ],
  // globals: {
  //   Atomics: 'readonly',
  //   SharedArrayBuffer: 'readonly'
  // },
  parserOptions: {
    parser: 'babel-eslint'
  },
  plugins: ['vue'],
  rules: {
    // 不允许在函数名称和左括号之间留出空格。
    'func-call-spacing': ['error', 'never'],
    // 函数名称或 function 关键字与开头括号之间不允许有空格
    'space-before-function-paren': [2, 'never'],
    'no-unused-vars': 'warn',
    'vue/no-unused-vars': 'warn'
  }
}
