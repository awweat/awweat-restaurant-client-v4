<template>
  <div class="container" style="padding-top: 3rem">
    <div class="level" style="padding: 1.5rem 0">
      <div class="level-left">
        <div class="level-item">
          <h1 class="title">Detalle del pedido</h1>
        </div>
      </div>
      <div class="level-right">
        <div class="level-item">
          <nuxt-link to="/user/orders" type="button" class="button is-small"
            >Volver Al Historial De Pedidos</nuxt-link
          >
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6 offset-md-3">
        <div style="border: 1px solid #dbdbdb">
          <div
            class="level p-3"
            :class="{
              'has-background-warning': order.order_state === 'pending',
              'has-background-success': order.order_state === 'accepted',
              'has-background-danger': order.order_state === 'canceled',
            }"
          >
            <div class="level-left">
              <p class="subtitle is-5 has-text-white">
                <small>{{ getOrdeState(order.order_state) }}</small>
                <strong class="has-text-white">{{
                  getOrderDate(order.createdAt)
                }}</strong>
              </p>
            </div>
          </div>
          <div class="row p-3">
            <div class="col-6">
              <p>
                <span class="is-flex">
                  {{ order.type === 'pickup' ? 'Recoger en' : 'Desde' }}
                </span>
                <strong> {{ order.restaurant.name }}</strong>
                <span class="is-flex">{{ order.restaurant.address }}</span>
                <span class="is-flex">{{ order.restaurant.municipality }}</span>
                <span class="is-flex">{{ order.restaurant.phone }}</span>
              </p>
            </div>
            <div v-if="order.type === 'delivery'" class="col-6">
              <p>
                <span class="is-flex">A</span>
                <strong> {{ order.user.username }}</strong>
                <span class="is-flex">{{ order.address }}</span>
                <span class="is-flex">{{ order.city }}</span>
                <span class="is-flex">{{ order.phone }}</span>
              </p>
            </div>
          </div>
          <hr />
          <div class="p-3">
            <p class="title is-4 is-flex" :title="`Pedido #${order.id}`">
              <span class="mr-1">Pedido</span> #<span id="order-number">{{
                order.id
              }}</span>
            </p>
          </div>
          <table class="table is-fullwidth">
            <thead>
              <tr>
                <th colspan="3" style="border-width: 0 0 1px"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(dish, index) in order.dishes" :key="dish.id + index">
                <td>{{ dish.quantity }}x</td>
                <td>
                  <strong>{{ dish.name }}</strong>
                  <p>
                    <small
                      v-for="modifier in dish.selectedModifiers"
                      :key="modifier.id"
                      class="is-flex"
                      >{{ modifier.name }}</small
                    >
                  </p>
                </td>
                <td class="has-text-right">
                  {{ Number(dish.price).toFixed(2) }} €
                </td>
              </tr>
              <tr>
                <td><b>Total</b></td>
                <td colspan="2" class="has-text-right">
                  <strong>{{ Number(price).toFixed(2) }} €</strong>
                </td>
              </tr>
            </tbody>
          </table>
          <template v-if="order.order_state === 'accepted'">
            <hr class="m-0" />
            <div class="p-3">
              <button type="button" class="button" @click="printOrder">
                Descargar Comprobante
              </button>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  middleware: 'auth',
  async asyncData({ $strapi, params }) {
    const order = await $strapi.findOne('orders', params.id)
    return { order }
  },
  data: () => {
    return {
      rTimeFormat: new Intl.RelativeTimeFormat('es', { style: 'narrow' }), // Fecha amigable para el usuario
    }
  },
  computed: {
    price() {
      return this.order.dishes.reduce(
        (accumulator, item) => accumulator + item.price * item.quantity,
        0
      )
    },
    domain() {
      return window.location.origin
    },
  },
  created() {
    if (process.browser) {
      // eslint-disable-next-line nuxt/no-globals-in-created
      const recaptchaScript = document.createElement('script')
      recaptchaScript.setAttribute('src', '../../../../jspdf-template.js')
      // eslint-disable-next-line nuxt/no-globals-in-created
      document.head.appendChild(recaptchaScript)
    }
  },
  methods: {
    getOrderDate(createdAt) {
      const dateNow = Date.now()
      const diffDays = Math.round(
        (Date.parse(createdAt) - dateNow) / (1000 * 60 * 60 * 24)
      )
      return this.rTimeFormat.format(diffDays, 'day')
    },
    getOrdeState(state) {
      switch (state) {
        case 'pending':
          return `Pendiente de acceptar`
        case 'accepted':
          return `Aceptado`
        case 'canceled':
          return `Rechazado por restaurante`
      }
    },
    printOrder() {
      this.createPDF()
    },
    createPDF() {
      const props = {
        outputType: 'save', // save, datauristring, datauri, dataurlnewwindow
        fileName: 'awweat-order-receipt ' + this.order.id,
        orientationLandscape: false,
        logo: {
          src: '../../../../img/AwweatMed.jpg',
          width: 53, // aspect ratio = width/height
          height: 13.37,
        },
        business: {
          name: this.order.restaurant.name,
          address: this.order.restaurant.address,
          phone: this.order.restaurant.phone + ' ',
          email: this.order.restaurant.email,
          email_1: this.domain,
          website: '',
        },
        contact: {
          label: 'Factura emitida para:',
          name: this.$strapi.user.username + '',
          address: this.order.address,
          phone: this.order.phone + '',
          email: this.$strapi.user.email,
          otherInfo: ' ',
        },
        invoice: {
          label: 'Factura #',
          invTotalLabel: 'Total:',
          num: this.order.id,
          invDate: 'Fecha de pago: ' + this.getOrderTime(this.order.createdAt),
          invGenDate: 'Fecha de la factura: ' + this.getOrderTime(Date.now()),
          header: ['#', 'Descripción', 'Precio', 'Cantidad', ' ', ' '],
          headerBorder: false,
          tableBodyBorder: false,
          table: Array.from(this.order.dishes, (item, index) => ({
            num: index + 1,
            desc: item.name,
            price: item.price,
            quantity: item.quantity,
            unit: ' ',
            total: ' ',
          })),
          invTotal: this.order.amount + '',
          invCurrency: '€',
          invDescLabel: 'Nota: ',
          invDesc: this.order.note,
        },
        footer: {
          text:
            'La factura ha sido creada en una computadora y tiene válidez sin la firma y el sello.',
        },
        pageEnable: true,
        pageLabel: 'Página ',
      }
      // eslint-disable-next-line no-undef
      jsPDFInvoiceTemplate.default(props)
    },
    getOrderTime(date) {
      return new Intl.DateTimeFormat('es-ES', {
        dateStyle: 'full',
        timeStyle: 'long',
      }).format(new Date(date))
    },
  },
}
</script>

<style scoped>
#order-number {
  width: 200px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
