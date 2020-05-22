module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'prettier',
    'prettier/vue',
    'plugin:prettier/recommended',
    'plugin:nuxt/recommended',
  ],
  plugins: ['prettier'],
  // add your custom rules here
  rules: {
    'global-require': 'off',
    'import/no-dynamic-require': 'off',
    'import/no-unresolved': 'off',
    'no-param-reassign': 'off',
    'lines-between-class-members': 'off',
    'class-methods-use-this': 'off',
    'import/extensions': 'off',
    'vue/no-v-html': 'off',
    'no-plusplus': 'off',
  },
};
