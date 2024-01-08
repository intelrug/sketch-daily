// eslint-disable-next-line nuxt/no-cjs-in-config
module.exports = {
  mode: 'spa',
  ssr: false,
  /*
   ** Headers of the page
   */
  head: {
    title: 'SketchDaily',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      // {
      //   'http-equiv': 'Content-Security-Policy',
      //   content: "default-src * 'unsafe-inline' 'unsafe-eval'; img-src * file:; media-src *",
      // },
      // {
      //   hid: 'description',
      //   name: 'description',
      //   content: process.env.npm_package_description || '',
      // },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap',
      },
    ],
    script: process.env.NODE_ENV === 'development' ? [{ src: 'http://localhost:8098' }] : [],
    htmlAttrs: {
      class: ['page page_theme_dark page_theme_blue'],
    },
    bodyAttrs: {
      class: ['page__body grid grid_type_default'],
    },
  },
  /*
   ** Customize the progress-bar color
   */
  loading: false,
  /*
   ** Global CSS
   */
  css: [],
  styleResources: {
    stylus: ['~/assets/stylus/variables.styl', '~/assets/stylus/mixins.styl'],
  },
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['~/plugins/nuxt-client-init.client.ts'],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/dotenv',
    '@nuxtjs/router',
    '@nuxtjs/style-resources',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: ['@nuxtjs/svg-sprite'],
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    extend(config, ctx) {},
  },
  svgSprite: {
    input: '~/assets/icons/',
  },
};
