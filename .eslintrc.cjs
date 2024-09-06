/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  env: {
    node: true,
  },
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-prettier/skip-formatting',
    './.eslintrc-auto-import.json'  // 修复 eslint 对于 auto-import api 的 no-undef 警告 
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    "vue/multi-word-component-names": "off"
  }
}
