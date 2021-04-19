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
  plugins: [
    'vue'
  ],
  rules: {
  }
}
