export default (context, inject) => {
  const socket = require('socket.io-client')(process.env.GATEWAY_URL)

  inject('socket', socket)

  // For Nuxt <= 2.12, also add 👇
  context.$socket = socket
}
