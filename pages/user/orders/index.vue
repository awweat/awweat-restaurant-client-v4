<template>
  <div class="container" style="padding-top: 3rem">
    <div class="level" style="padding: 1.5rem 0">
      <div class="level-left">
        <div class="level-item">
          <h1 class="title">Mis pedidos</h1>
        </div>
      </div>
      <div class="level-right">
        <div class="level-item">
          <div class="field has-addons">
            <p class="control">
              <a class="button is-static"> Pedidos por página </a>
            </p>
            <div class="control">
              <input
                v-model="perPageTemp"
                class="input"
                type="number"
                placeholder="Pedidos por página"
              />
            </div>
            <div class="control">
              <button
                type="button"
                class="button is-info"
                @click="fetchOrders(0, perPageTemp)"
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template v-if="ordersToShow.length">
      <div class="row">
        <div
          v-for="order in ordersToShow"
          :key="order.id"
          class="col-md-6 col-lg-6"
        >
          <div
            class="restaurant-item card"
            :class="{
              orderAccepted: order.order_state == 'accepted',
              orderPending: order.order_state == 'pending',
              orderCanceled: order.order_state == 'canceled',
            }"
          >
            <div class="card-content">
              <div class="content">
                <h2
                  class="subtitle is-5 is-flex is-justify-content-space-between is-align-content-center"
                >
                  Pedido #{{ order.id }}
                  <div v-html="getOrdeState(order.order_state)"></div>
                </h2>
                <p>
                  {{ getOrderTypeText(order.type) }}
                </p>
                <p>Realizado {{ getOrderDate(order.createdAt) }}</p>
                <p>
                  <span class="has-text-weight-bold"
                    >{{ order.amount.toFixed(2) }}€</span
                  >
                </p>
                <p class="buttons">
                  <nuxt-link :to="`orders/${order.id}`" class="button is-small">
                    Ver detalle</nuxt-link
                  >
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <nav class="pagination" role="navigation" aria-label="pagination">
        <ul class="pagination-list">
          <li>
            <button
              type="button"
              class="pagination-previous"
              :disabled="currPage == 1"
              @click="changePage(currPage - 1)"
            >
              Previous
            </button>
          </li>
          <li v-for="index in numPages" :key="index">
            <button
              v-if="index === currPage"
              type="button"
              class="pagination-link is-current"
              :aria-label="'Page ' + index"
              aria-current="page"
            >
              {{ index }}
            </button>
            <button
              v-else
              type="button"
              class="pagination-link"
              :aria-label="'Page ' + index"
              @click="changePage(index)"
            >
              {{ index }}
            </button>
          </li>
          <li>
            <button
              type="button"
              class="pagination-next"
              :disabled="currPage === numPages"
              @click="changePage(currPage + 1)"
            >
              Next page
            </button>
          </li>
        </ul>
      </nav>
    </template>
    <p v-else>No hay pedidos...</p>
  </div>
</template>

<script>
export default {
  middleware: 'auth',
  data: () => {
    return {
      orders: [],
      totalOrders: 0, // count Total de orders para calcular total de paginas.
      currPage: 1, // empieza con 1 (no 0)
      perPage: 4, // cantidad de pedidos en cada pág
      perPageTemp: 4,
      fetchedPages: [], // Se guardan los numeros de paginas que ya estan descargadas. Para no volver a descargarlas cuando se cambi de pagina.
      rTimeFormat: new Intl.RelativeTimeFormat('es', { style: 'narrow' }), // Fecha amigable para el usuario
    }
  },
  fetch() {
    this.fetchOrders(0, this.perPage) // primero se descargaran solo los pedidos de primera página
  },
  computed: {
    numPages() {
      return Math.ceil(this.totalOrders / this.perPage)
    },
    ordersToShow() {
      return this.orders.slice(
        this.perPage * this.currPagePos(),
        this.perPage * this.currPagePos() + this.perPage
      )
    },
  },
  methods: {
    async fetchOrders(pStart, pLimit) {
      try {
        const data = await this.$strapi.find('orders', {
          user: this.$strapi.user.id,
          _sort: 'datetime:desc',
          _limit: pLimit,
          _start: pStart,
        })

        const totalOrders = await this.$strapi.count('orders', {
          user: this.$strapi.user.id,
        })
        this.totalOrders = totalOrders
        this.orders = data
        for (let i = 0; i < totalOrders - this.perPage; i++) {
          this.orders.push(0)
        }
        this.fetchedPages.push(1)
        this.perPage = pLimit
        this.fetchedPages = []
      } catch (error) {
        console.error(error)
      }
    },
    getOrdeState(state) {
      switch (state) {
        case 'pending':
          return `<span class="tag is-warning is-pulled-right">Pendiente de acceptar</span>`
        case 'accepted':
          return `<span class="tag is-success is-pulled-right">Acceptado</span>`
        case 'canceled':
          return `<span class="tag is-danger is-pulled-right">Rechazado por restaurante</span>`
      }
    },
    getOrderTypeText(type) {
      switch (type) {
        case 'delivery':
          return 'Pedido para entregar'
        case 'pickup':
          return 'Pedido para recoger'
      }
    },
    getOrderDate(createdAt) {
      const dateNow = Date.now()
      const diffDays = Math.round(
        (Date.parse(createdAt) - dateNow) / (1000 * 60 * 60 * 24)
      )
      return this.rTimeFormat.format(diffDays, 'day')
    },
    currPagePos() {
      return this.currPage - 1
    },
    async changePage(index) {
      console.log('mie' + index)
      try {
        if (this.fetchedPages.includes(index)) {
          console.log('skipped')
        } else {
          const data = await this.$strapi.find('orders', {
            user: this.$strapi.user.id,
            _sort: 'datetime:desc',
            _limit: this.perPage,
            _start: (index - 1) * this.perPage,
          })
          const arr = this.orders
          Array.prototype.splice.apply(
            arr,
            [(index - 1) * this.perPage, data.length].concat(data)
          )
          console.log(arr)
          this.fetchedPages.push(index)
        }

        this.currPage = index
      } catch (e) {
        console.log(e)
      }
    },
  },
}
</script>

<style scoped>
.restaurant-item {
  margin-bottom: 20px;
}
</style>
