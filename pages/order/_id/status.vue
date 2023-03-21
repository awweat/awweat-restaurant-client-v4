<template>
  <div class="container" style="padding-top: 3rem">
    <h1>Hemos recibido su pedido</h1>
    <template v-if="order">
      <p v-if="order.order_state === 'canceled'">
        Su pedido <strong>#{{ order.id }}</strong> ha sido rechazado.
      </p>
      <p v-else-if="order.order_state === 'pending'">
        Su pedido <strong>#{{ order.id }}</strong> está siendo procesado.
      </p>
      <template v-else>
        <p>
          Su pedido <strong>#{{ order.id }}</strong> se ha relizado
          correctamente.
        </p>
        <b-steps
          v-model="activeStep"
          label-position="right"
          :has-navigation="false"
          vertical
        >
          <b-step-item
            step="1"
            :clickable="false"
            label="Pedido recibido"
          ></b-step-item>
          <b-step-item
            step="2"
            :clickable="false"
            label="El restaurante está preparando el pedido"
          ></b-step-item>
          <b-step-item
            step="3"
            :clickable="false"
            label="Su pedido ha sido recogido para su entrega"
          ></b-step-item>
        </b-steps>
      </template>
    </template>
  </div>
</template>

<script>
export default {
  // middleware: 'auth',
  name: 'OrderStatus',
  data() {
    return {
      order: null,
      activeStep: 3,
    }
  },
  computed: {
    dateTime() {
      if (!this.order) return null
      return this.order.order_state !== 'pending' ? Date.now() : null
    },
    orderTypeText() {
      if (!this.order) return null
      switch (this.order.order_state) {
        case 'accepted':
          return 'aceptada'
        case 'pending':
          return 'pendiente'
        case 'canceled':
          return 'rechazada'
        default:
          return null
      }
    },
  },
  mounted() {
    this.fetchOrder()
    this.$socket.on('handleOrder', (type) => {
      this.$set(this.order, 'order_state', type)
    })
  },
  methods: {
    async fetchOrder() {
      try {
        const { orders } = await this.$strapi.graphql({
          query: `
{
  orders(filters: { id: { eq: "${this.$route.params.id}" } }) {
    data {
      id
      attributes {
        amount
        city
        createdAt
        datetime
        dishes
        note
        order_state
        phone
        address
        postal_code
        type
        payment_type
        payment_state
      }
    }
  }
}

            `,
          // query: `
          //     query {
          //       orders(where: { id: "${this.$route.params.id}" }) {
          //         id
          //         amount
          //         city
          //         createdAt
          //         datetime
          //         dishes
          //         note
          //         order_state
          //         phone
          //         address
          //         postal_code
          //         type
          //         payment_type
          //         payment_state
          //         user {
          //           username
          //         }
          //       }
          //     }
          //   `,
        })
        this.order = orders ? orders[0] : null
      } catch (error) {
        throw new Error(error)
      }
    },
  },
}
</script>
