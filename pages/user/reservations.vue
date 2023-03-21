<template>
  <div class="container" style="padding-top: 3rem">
    <div class="level" style="padding: 1.5rem 0">
      <div class="level-left">
        <div class="level-item">
          <h1 class="title">Mis Reservas</h1>
        </div>
      </div>
      <div class="level-right">
        <div class="level-item"></div>
      </div>
    </div>

    <template v-if="reservations.length">
      <div class="row">
        <div
          v-for="reserva in reservations"
          :key="reserva.id"
          class="col-md-6 col-lg-6"
        >
          <div class="restaurant-item card">
            <!-- <nuxt-link :to="`orders/${order.id}`"> -->
            <div class="card-content">
              <div class="content">
                <h2 class="subtitle is-6">🍽️ Reserva #{{ reserva.id }}</h2>
                <p v-if="reserva.arrival_date < Date.now()">
                  expired {{ reserva.arrival_date }}
                </p>
                <article class="message is-dark">
                  <div class="message-header">
                    <p>📅 Fecha de reserva</p>
                  </div>
                  <div class="message-body">
                    Reserva para {{ getOrderDate(reserva.arrival_date) }}
                    <br />
                    <strong>{{ getOrderTime(reserva.arrival_date) }}</strong>
                  </div>
                </article>
                <p>
                  <span class="tag is-dark is-medium"
                    >Numero de personas:
                    {{
                      reserva.num_adults +
                      (reserva.num_kids ? reserva.num_kids : 0)
                    }}</span
                  >
                </p>
                <p>
                  <span class="tag is-dark is-medium"
                    >Mesa: {{ reserva.num_table }}</span
                  >
                </p>

                <article class="message is-dark">
                  <div class="message-header">
                    <p>🏨 Restaurante</p>
                  </div>
                  <div class="message-body">
                    <p>{{ reserva.restaurant.name }}</p>
                    <p>📍 {{ reserva.restaurant.address }}</p>
                    <p>📞 {{ reserva.restaurant.phone }}</p>
                  </div>
                </article>
              </div>
            </div>
            <!-- </nuxt-link> -->
          </div>
        </div>
      </div>
    </template>
    <p v-else>No hay reservas...</p>
    <div
      v-if="reservations.length"
      v-observe-visibility="handleScrolledToBottom"
    />
  </div>
</template>
<script>
export default {
  middleware: 'auth',
  data: () => {
    return {
      reservations: [],
      query: null,
      limit: 4,
      count: 0,
      rTimeFormat: new Intl.RelativeTimeFormat('es', { style: 'narrow' }), // Fecha amigable para el usuario
    }
  },
  fetch() {
    this.countReservations()
    this.fetchReservations()
  },
  fetchOnServe: false,
  methods: {
    async countReservations() {
      try {
        const data = await this.$strapi.count('reservations', {
          user: this.$strapi.user.id,
        })
        this.count = data
      } catch (error) {
        throw new Error(error)
      }
    },
    async fetchReservations() {
      try {
        const reservations = await this.$strapi.find('reservations', {
          user: this.$strapi.user.id,
          _sort: 'createdAt:desc',
          _limit: this.limit,
          _start: 0,
        })
        this.reservations = reservations
      } catch (error) {
        console.error(error)
      }
    },
    handleScrolledToBottom(isVisible) {
      if (!isVisible) return
      if (this.limit < this.count) {
        this.limit += 2
        this.fetchReservations()
      }
    },
    getOrderDate(createdAt) {
      let result = createdAt
      const dateNow = Date.now()
      const diffDays = Math.round(
        (Date.parse(createdAt) - dateNow) / (1000 * 60 * 60 * 24)
      )
      if (diffDays === 0) {
        return 'hoy'
      }
      result = this.rTimeFormat.format(diffDays, 'day')
      return result
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
.restaurant-item {
  margin-bottom: 20px;
}
</style>
