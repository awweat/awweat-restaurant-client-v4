<template>
  <b-navbar>
    <template #brand>
      <router-link :to="'/'">
        {{ restaurant ? restaurant.name : null }}
      </router-link>
    </template>
    <template #end>
      <b-navbar-dropdown
        v-if="$store.getters.restaurant.user"
        :label="$store.getters.restaurant.user.username"
        right
      >
        <b-navbar-item tag="nuxt-link" to="/user/orders"
          >Historial de pedidos</b-navbar-item
        ><b-navbar-item tag="nuxt-link" to="/user/reservations"
          >Reservas</b-navbar-item
        >
        <b-navbar-item @click.prevent="handleLogout()"
          >Cerrar sesión</b-navbar-item
        >
      </b-navbar-dropdown>
      <div v-else class="navbar-item">
        <div class="buttons">
          <nuxt-link to="/register" class="button is-danger">
            <strong>Regístrate</strong>
          </nuxt-link>
          <nuxt-link to="/login" class="button is-light"
            >Iniciar sesión</nuxt-link
          >
        </div>
      </div>
    </template>
  </b-navbar>
</template>

<script>
import mediaQueryMixin from '~/utils/media-query-mixin.js'

export default {
  name: 'Header',
  mixins: [mediaQueryMixin],
  data() {
    return {
      navbar: {
        visible: false,
      },
    }
  },
  async mounted() {
    // console.log('this.$store.getters.restaurant')
    // console.log(await this.$store.getters)
    // console.log(await this.$store.getters.restaurant)
  },
  computed: {
    restaurant() {
      return {
        name: 'Sherepunjabx',
        description: 'comida digestiblex',
        address: 'Carrer de Mèxic, 17, , Barcelonax',
        postal_code: '08004',
        status: true,
        phone: '936783626x',
        province: '08',
        municipality: '08101',
        currency: 'EUR',
        email: 'sherepunjab2015@gmail.comx',
        createdAt: '2022-03-15T14:00:56.724Z',
        updatedAt: '2022-03-22T12:18:28.701Z',
        publishedAt: '2022-03-15T14:00:57.922Z',
        wait_time: {
          max: '41',
          min: '11',
          normal: '31',
        },
      }
      return this.$store.getters.restaurant
    },
  },
  methods: {
    handleLogout() {
      this.$strapi.logout()
      // The cart is currently in session and should be emptied when you log out.
      this.$store.commit('cart/setItems', [])
      this.$router.push('/')
    },
    handleBurgerClick() {
      this.$set(this.navbar, 'visible', !this.navbar.visible)
    },
  },
}
</script>