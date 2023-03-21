<template>
  <div class="container" :class="{ 'is-fluid': isMobile }">
    <div v-if="restaurant" class="row">
      <div class="col-md-8 col-lg-9 menu">
        <h1 class="title">Reserva</h1>

        <div class="row">
          <TableMap />
        </div>
      </div>
      <div class="col-md-4 col-lg-3 cart">
        <div class="card">
          <div class="card-content">
            <h2 class="subtitle">Detalles de tu Reserva</h2>
            <form @submit.prevent="sendReservation">
              <div class="field has-addons">
                <p class="control">
                  <a class="button is-static">Nº de mesa </a>
                </p>
                <p class="control">
                  <input
                    v-model="reservationInfo.numTable"
                    class="input"
                    type="text"
                    min="1"
                    max="7"
                  />
                </p>
              </div>

              <div class="field">
                <p class="control has-icons-left">
                  <input
                    v-model="reservationInfo.date"
                    class="input"
                    type="date"
                  />
                  <span class="icon is-small is-left">
                    <b-icon icon="calendar"></b-icon>
                  </span>
                </p>
              </div>
              <div class="field">
                <p class="control has-icons-left">
                  <input
                    v-model="reservationInfo.time"
                    class="input"
                    type="time"
                    required
                  />
                  <span class="icon is-small is-left">
                    <b-icon icon="clock"></b-icon>
                  </span>
                </p>
              </div>

              <div class="field">
                <p class="control has-icons-left">
                  <input
                    v-model="reservationInfo.NumPeople"
                    class="input"
                    type="number"
                    min="1"
                    max="30"
                    placeholder="nº de personas"
                  />
                  <span class="icon is-small is-left">
                    <b-icon icon="account-plus"></b-icon>
                  </span>
                </p>
              </div>

              <button class="button is-primary is-fullwidth cart-btn">
                <span>Reservar</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <h1>Oh no 😢 El restaurante no esta dispinible en este momento</h1>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import TableMap from '~/static/img/table_map.svg?inline'

import mediaQueryMixin from '~/utils/media-query-mixin.js'

export default {
  name: 'Reservation',
  components: { TableMap },
  mixins: [mediaQueryMixin],
  middleware: 'auth',
  async asyncData({ $strapi, $config: { restaurantKey } }) {
    const { restaurant } = await $strapi.graphql({
      query: `
          query {
            restaurant(id:  "${restaurantKey}") {
            name
          }
        }
      `,
    })
    return { restaurant }
  },
  data() {
    return {
      reservationInfo: {
        NumPeople: 1,
        numTable: 1,
        date: '2021-03-16',
        time: '15:57',
      },
    }
  },
  mounted() {
    const tableList = document.querySelectorAll('.svgTable')
    for (let i = 0; i < tableList.length; i++) {
      tableList[i].onclick = (e) => {
        const selectedTables = document.getElementsByClassName('svgTableFilled')
        if (selectedTables.length > 0) {
          selectedTables[0].classList.remove('svgTableFilled')
        }
        const tableRect = e.target.parentElement.getElementsByTagName('rect')[0]
        tableRect.classList.add('svgTableFilled')
        this.reservationInfo.numTable = parseInt(
          tableRect.parentElement.parentElement.id.replace(/[^\d]/g, ''),
          10
        )
      }
    }
  },
  methods: {
    ...mapMutations({
      addToCart: 'cart/add',
    }),
    createSlug(name) {
      return name.toLowerCase().split(' ').join('-')
    },
    async sendReservation() {
      const arrTime = new Date(
        this.reservationInfo.date + ' ' + this.reservationInfo.time
      )
      const reservationData = {
        restaurant: this.$store.getters.restaurant.id,
        reserve_date: Date.now(),
        num_adults: this.reservationInfo.NumPeople,
        arrival_date: arrTime,
        num_table: this.reservationInfo.numTable,
        num_kids: 0,
        user: this.$strapi.user.id,
      }
      try {
        await this.$strapi.create('reservations', reservationData)
        this.$router.push('/success/reservation')
      } catch (error) {
        console.error(error)
      }
    },
  },
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}
.menu .svgTable:hover rect {
  stroke: #65cf89;
  stroke-width: 2px;
  cursor: pointer;
}
.menu .svgTableFilled {
  fill: #65cf89;
}
.menu .card {
  width: 100%;
  height: 150px;
  margin-bottom: 1rem;
  box-shadow: none;
  border-radius: 3px;
  background-color: #fff;
  transition: all 0.3s ease;
  cursor: pointer;
}
.menu .card:hover {
  box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1),
    0 0px 0 1px rgba(10, 10, 10, 0.02);
}
.menu .card .media-left img {
  border-radius: 3px;
}
.menu .card .media-content {
  overflow: hidden;
}
.menu .card .description {
  text-overflow: ellipsis;
  width: calc(230px - 1.5rem);
  white-space: nowrap;
  overflow: hidden;
}
.cart-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 5vh;
  background: #00d1b2;
  display: flex;
  justify-items: center;
}
.cart-bottom__icon {
  position: relative;
}
.cart-bottom__icon span:not(.icon) {
  background: #000;
  position: absolute;
  top: 0;
  transform: translateY(-100%);
}
input[type='date'] input[type='time'] {
  position: relative;
}
/* make the native arrow invisible and stretch it over the whole field so you can click anywhere in the input field to trigger the native datepicker*/
input[type='date']::-webkit-calendar-picker-indicator {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: auto;
  height: auto;
  color: transparent;
  background: transparent;
}
input[type='time']::-webkit-calendar-picker-indicator {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: auto;
  height: auto;
  color: transparent;
  background: transparent;
}
/* adjust increase/decrease button */
input[type='date']::-webkit-inner-spin-button {
  z-index: 1;
}
/* adjust clear button */
input[type='date']::-webkit-clear-button {
  z-index: 1;
}
</style>
