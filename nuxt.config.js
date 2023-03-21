export default {
  ssr: false,
  target: 'static',
  /* Headers of the page */
  head: {
    title: 'Sherepunjab',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'La mejor comida india en Barcelona',
      },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/icon.jpg' },
      {
        rel: 'stylesheet',
        type: 'text/css',
        href:
          'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.0/css/bootstrap-grid.min.css',
      },
      // {
      //   rel: 'stylesheet',
      //   type: 'text/css',
      //   href:
      //     'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.0-2/css/all.min.css',
      // },
      {
        rel: 'stylesheet',
        type: 'text/css',
        href: 'https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css',
      },
    ],
    script: [
      // { src: 'https://js.stripe.com/v3', defer: true },
      { src: 'https://afarkas.github.io/lazysizes/lazysizes.min.js' },
    ],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#f50' },

  // Scan and auto import components
  components: true,

  /*
   ** Global CSS
   */
  css: ['~/assets/css/main.css'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/socket.client',
    // '~/plugins/nuxt-client-init.client',
    '~/plugins/observe-visibility.client',
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ['@nuxtjs/dotenv', '@nuxtjs/svg', '@nuxtjs/fontawesome'],

  fontawesome: {
    icons: {
      solid: true,
    },
  },
  /*
   ** Nuxt.js modules
   */
  // modules: ['@nuxtjs/strapi', ['nuxt-buefy'], '~/modules/scrapeCustomHtml'
  modules: ['@nuxtjs/strapi', 'nuxt-buefy'],

  strapi: {
    url: process.env.STRAPI_URL,
    prefix: '/api',
    version: 'v4',
    cookie: {},
  },

  publicRuntimeConfig: {
    restaurantKey: process.env.RESTAURANT_KEY,
    serverURL: process.env.SERVER_URL,
    strapiURL: process.env.STRAPI_URL,
  },

  /*
   ** Build configuration
   */
  build: {},
  server: {
    port: 3001, // default: 3000
  },
  generate: {
    fallback: true,
  },
}
