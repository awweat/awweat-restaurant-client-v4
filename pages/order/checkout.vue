<template>
  <div class="container" style="padding-top: 3rem">
    <LoaderOverlay
      :show-loader="showLoadingOverlay"
      :payment-link="paymentLink"
    />
    <form @submit.prevent="sendOrder">
      <div class="row">
        <div class="col-md-4 mb-5">
          <!-- <button
            class="button is-primary is-fullwidth"
            tag="nuxt-link"
            to="/"
            icon-left="arrow-left"
            expanded
          >
            Seguir comprando
          </button>  -->
          <router-link :to="'/'">
            <a class="button is-primary" href="/">
            <font-awesome-icon :icon="['fas', 'arrow-left']" style="margin-right: 7px"/>
              Seguir comprando </a>
          </router-link>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <div class="card">
            <div class="card-content">
              <h2 class="subtitle is-1">Detalles de entrega</h2>
              <div class="row mb-3">
                <div class="col-md-6">
                  <div class="field">
                    <label class="label">Tipo de pedido</label>
                    <div class="control">
                      <OrderSwitch />
                    </div>
                  </div>
                </div>
              </div>
              <template v-if="orderType === 'delivery'">
                <div class="field">
                  <label class="label">Dirección</label>
                  <div class="control">
                    <input
                      v-model="order.address"
                      class="input"
                      type="text"
                      required
                    />
                  </div>
                  <p class="help">Incluye tu calle y bloque</p>
                </div>
                <div class="row">
                  <div class="col-md-4">
                    <div class="field">
                      <label class="label">Ciudad / Localidad</label>
                      <div class="control">
                        <input
                          v-model="order.city"
                          class="input"
                          type="text"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="field">
                      <label class="label">Código postal</label>
                      <div class="control">
                        <input
                          v-model="order.postal_code"
                          class="input"
                          :class="{
                            'is-danger':
                              order.postal_code && !isSpanishPostalCode,
                          }"
                          type="text"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="field">
                      <label class="label">Número teléfono</label>
                      <div class="control">
                        <input
                          v-model="order.phone"
                          class="input"
                          type="tel"
                          :pattern="phoneValidator"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <div v-else class="field">
                <label class="label">Número teléfono</label>
                <div class="control">
                  <input
                    v-model="order.phone"
                    class="input"
                    type="tel"
                    :pattern="phoneValidator"
                    required
                  />
                </div>
              </div>
              <div v-if="!$strapi.user" class="field">
                <label class="label">Email</label>
                <div class="control">
                  <input
                    v-model="order.email"
                    class="input"
                    type="email"
                    placeholder="Correo electrónico"
                    required
                  />
                </div>
                <p class="help">Para enviar factura</p>
              </div>

              <div
                v-if="orderType === 'delivery' && showMap"
                class="field mt-4"
              >
                <div class="gmap_canvas">
                  <iframe
                    width="100%"
                    height="305"
                    :src="mapUrl"
                    frameborder="0"
                    scrolling="no"
                    marginheight="0"
                    marginwidth="0"
                  ></iframe>
                </div>
              </div>
              <div class="field">
                <label class="label">Nota para el restaurante</label>
                <div class="control">
                  <textarea
                    v-model="order.note"
                    class="textarea"
                    placeholder='Por ejemplo: "El timbre no funciona". No incluyas detalles sobre alergias aquí.'
                  ></textarea>
                </div>
                <p class="help">
                  Deja una nota para el restaurante con cualquier cosa que
                  necesiten saber (por ejemplo, el timbre no funciona). No
                  incluyas detalles sobre alergias.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-5 offset-md-1 my-2 my-md-0">
          <div class="card">
            <div class="card-content">
              <h2 class="subtitle is-1">Cesta</h2>
              <table class="table is-fullwidth">
                <thead>
                  <tr>
                    <th colspan="3"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(dish, index) in order.dishes"
                    :key="dish.id + index"
                  >
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
                      {{ Number(dish.price).toFixed(2) }}€
                    </td>
                  </tr>
                  <tr
                    v-if="couponObj.messageType == 'success'"
                    class="has-text-success"
                  >
                    <td></td>
                    <td>Descuento</td>
                    <td class="has-text-right">-{{ discount }}€</td>
                  </tr>
                  <tr>
                    <td><b>Total</b></td>
                    <td colspan="2" class="has-text-right">
                      <b
                        :class="{
                          'aww-line-through':
                            couponObj.messageType == 'success',
                          'is-size-7': couponObj.messageType == 'success',
                        }"
                        >{{ Number(price).toFixed(2) }}€</b
                      >
                      <b
                        v-if="couponObj.messageType == 'success'"
                        class="has-text-success"
                      >
                        {{ (Number(price).toFixed(2) - discount).toFixed(2) }}€
                      </b>
                    </td>
                  </tr>
                </tbody>
              </table>

              <transition name="slide">
                <div v-if="orderType">
                  <label class="label">Elegir el método de pago</label>
                  <div class="payment">
                    <div
                      class="payment-item"
                      @click="setPaymentType($event, 'cash')"
                    >
                      <img src="~/assets/img/cash.png" />
                    </div>
                    <!-- <div
                      class="payment-item"
                      @click="setPaymentType($event, 'paypal')"
                    >
                      <img src="~/assets/img/paypal.png" />
                    </div> -->
                    <div
                      class="payment-item"
                      @click="setPaymentType($event, 'card')"
                    >
                      <img src="~/assets/img/card.png" />
                    </div>
                  </div>
                </div>
              </transition>

              <div class="row">
                <!-- <div class="col-md-12 mb-2 mb-md-0">
                  <div class="field has-addons">
                    <p class="control is-expanded">
                      <input
                        v-model="order.coupon"
                        class="input is-fullwidth"
                        type="text"
                        placeholder="Aplicar un cupón"
                        @blur="handleCouponBlur"
                      />
                    </p>
                    <p class="control">
                      <button
                        class="button is-primary is-fullwidth"
                        :disabled="!order.coupon"
                        icon-left="check-all"
                        @click="checkCoupon"
                      ></button>
                    </p>
                  </div>
                </div> -->
                <div v-if="couponObj.messageType" class="col-md-12">
                  <article
                    class="message mb-0"
                    :class="{
                      'is-success': couponObj.messageType === 'success',
                      'is-danger': couponObj.messageType === 'error',
                      'is-warning': couponObj.messageType === 'warning',
                    }"
                  >
                    <div class="message-body">
                      <span v-for="item in couponObj.message" :key="item">
                        {{ item }} <br />
                      </span>
                    </div>
                  </article>
                  <br />
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-2 mb-md-0">
                  <button
                    class="button is-primary is-fullwidth"
                    :disabled="!orderType || !order.payment_type"
                    :title="!orderType ? 'Debes elegir el tipo de pedido' : ''"
                  >
                    Realizar pedido
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
/* eslint-disable no-case-declarations */
import { mapGetters } from 'vuex'

export default {
  name: 'Checkout',
  data() {
    return {
      order: {
        address: '',
        postal_code: '',
        dishes: null,
        amount: null,
        datetime: null,
        type: 'pickup',
        order_state: null,
        city: '',
        phone: 692314247,
        note: null,
        restaurant: null,
        payment_type: null,
        payment_state: null,
        coupon: null,
        email: 'sitbyte@gmail.com',
      },
      couponObj: {},
      showLoadingOverlay: false,
      directions: [],
      showDirections: false,
      paymentLink: null,
      phoneValidator:
        '(([+]?34) ?)?(6(([0-9]{8})|([0-9]{2} [0-9]{6})|([0-9]{2} [0-9]{3} [0-9]{3}))|9(([0-9]{8})|([0-9]{2} [0-9]{6})|([1-9] [0-9]{7})|([0-9]{2} [0-9]{3} [0-9]{3})|([0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2})))',
    }
  },
  computed: {
    ...mapGetters({
      orderType: 'cart/orderType',
      price: 'cart/price',
    }),
    orderTypeText() {
      const messages = {
        delivery: 'para entregar',
        pickup: 'para recoger',
      }
      return messages[this.orderType]
    },
    showMap() {
      return this.order.address.match('^(.*?)(0|[1-9][0-9]*)')
    },
    mapUrl() {
      if (this.order.address.length < 9) {
        return 'https://maps.google.com/maps?q=barcelona&t=&z=13&ie=UTF8&iwloc=&output=embed'
      }

      const address = this.order.address.replace(' ', '%20')

      return `https://maps.google.com/maps?q=${address}&t=&z=15&ie=UTF8&iwloc=&output=embed`
    },
    isSpanishPostalCode() {
      return this.order.postal_code.match(/^[0-9]{5}$/)
    },
    discount() {
      if (!Object.keys(this.couponObj).length) return 0
      if (this.couponObj.discountType === 'fixedAmount') {
        return Number(this.couponObj.discount).toFixed(2)
      }
      return Number((this.price * this.couponObj.discount) / 100).toFixed(2)
    },
  },
  watch: {
    orderType() {
      this.checkCoupon()
    },
  },
  async created() {
    this.order.dishes = [...this.$store.state.cart.items].map(
      ({ id, name, price, quantity, selectedModifiers }) => {
        return {
          id,
          name,
          price,
          quantity,
          selectedModifiers,
        }
      }
    )
    // prefill coupon field if needed
    if (!this.$store.getters.restaurant && this.order.coupon) {
      const restaurant = await this.$strapi.findOne(
        'restaurants',
        this.$config.restaurantKey
      )
      this.$store.commit('HANDLE_RESTAURANT', { restaurant })

      const offers = this.$store.getters.restaurant.offers

      if (offers && offers.preFilledCoupon) {
        this.order.coupon = offers.preFilledCoupon
      }

      this.checkCoupon()
    }
  },
  methods: {
    sendOrder() {
      this.showLoadingOverlay = true

      const isValidPhoneNumber = (value) => {
        const str = value.toString().replace(/\s/g, '')
        return str.length === 9 && /^[679]{1}[0-9]{8}$/.test(str)
      }

      if (!isValidPhoneNumber(this.order.phone)) {
        return alert('El teléfono no es válido')
      }

      const token = this.$strapi.getToken()

      this.order.type = this.orderType
      this.order.datetime = new Date().toISOString()
      this.order.order_state = 'pending'
      this.order.payment_state = 'pending'
      this.order.amount = this.price
      this.order.restaurant = 1
      // this.order.restaurant = this.$store.getters.restaurant.id

      let guestUser
      if (this.$strapi.user) {
        this.order.user = this.$strapi.user.id
        guestUser = false
      } else {
        guestUser = {
          email: this.order.email,
        }
      }

      if (this.couponObj != null) {
        this.order.coupon = this.couponObj.id
      }

      fetch(this.$config.serverURL + '/order', {
        method: 'POST', // or 'PUT'
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order: this.order,
          token,
          domainName: window.location.origin,
          guestUser: guestUser,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data)
          if (data.info == 'success') {
            //If user has selected card payment method. Redirect to the strapi link that will be generated in following code...
            if (this.order.payment_type == 'card') {
              // var stripe = Stripe(
              //   'pk_test_51IJ5ipBgybhiXBJFmy6NRkcStsWXC0wleaf4CKPhFjawaitZ0PuPueQkxCyUSKZBRF5fcbhzQAqkFAKx4Alnxpg500xGK4MhAJ'
              // )
              // this.showLoadingOverlay = false
              // return stripe.redirectToCheckout({ sessionId: data.strapiPI })
              window.open(data.strapiURL, '_self')
              this.paymentLink = data.strapiURL
            } else if (this.order.payment_type == 'paypal') {
              this.showLoadingOverlay = false
              window.open(
                'https://www.sandbox.paypal.com/checkoutnow?token=' +
                  data.paypalId +
                  '&email=sb-v56zu3607764@personal.example.com&pass=nIPG4n<6',
                '_self'
              )
            } else {
              this.$router.push(`/order/${data.orderId}/status`)
            }
          }
        })
        .catch((error) => {
          console.log('Error:', error)
        })
    },
    setPaymentType({ target }, type) {
      const classStyle = 'payment-item--selected'

      // Remove class
      this.getSiblings(target).forEach((sibling) => {
        if (sibling.classList.contains(classStyle)) {
          sibling.classList.remove(classStyle)
        }
      })

      target.classList.add(classStyle)

      this.order.payment_type = type
    },
    getSiblings(e) {
      return Array.prototype.filter.call(
        e.parentNode.children,
        function (child) {
          return child !== e
        }
      )
    },
    handleCouponBlur() {
      if (this.order.coupon) this.checkCoupon()
    },
    async checkCoupon() {
      return //todo
      try {
        const { coupons } = await this.$strapi.graphql({
          query: `
              query {
                coupons(where:  { code: "${this.order.coupon}" }) {
                  restaurant {
                    id
                  }
                  id
                  name
                  code
                  discountType
                  discount
                  totalMinimum
                  redemptions
                  customerRedemptions
                  validity
                  validityData
                  orderRestriction
                  description
                  status
                }
              }
            `,
        })
        if (coupons.length) {
          this.couponObj = { ...coupons[0], message: ['Cupón válido'] }
          // verify the restaurant on the coupon is the same as the current restaurant
          if (
            this.couponObj.restaurant.id !== this.$store.getters.restaurant.id
          ) {
            this.couponObj = {
              message: ['El cupón no es válido para este restaurante'],
              messageType: 'error',
            }
          } else this.useCoupon()
        } else {
          this.couponObj = {
            message: ['Cupón no encontrado'],
            messageType: 'error',
          }
        }
      } catch (error) {
        console.error(error)
      }
    },
    useCoupon() {
      if (!this.couponObj.status) {
        this.couponObj = {
          message: ['El cupón no esta activo en este momento'],
          messageType: 'error',
        }
        return false
      }
      if (this.couponObj.validity !== 'forever') {
        const dNow = new Date()
        const dNowTime = dNow.toLocaleString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
        })
        switch (this.couponObj.validity) {
          case 'fixed':
            const d1 = new Date(this.couponObj.validityData.fixedDate)
            if (
              d1.getDay() !== dNow.getDay() ||
              d1.getMonth() !== dNow.getMonth() ||
              d1.getFullYear() !== dNow.getFullYear()
            ) {
              this.couponObj = {
                message: ['El cupón no esta activo en esta fecha'],
                messageType: 'error',
              }
              return false
            } else if (
              dNowTime < this.couponObj.validityData.fromTime ||
              this.couponObj.validityData.untilTime < dNowTime
            ) {
              this.couponObj = {
                message: ['El cupón no esta activo en esta hora'],
                messageType: 'error',
              }
              return false
            }
            break
          case 'period':
            const dNowFormatted = this.formatDate(dNow)
            const fromDate = this.couponObj.validityData.fromDate
            const untilDate = this.couponObj.validityData.untilDate
            if (fromDate > dNowFormatted || untilDate < dNowFormatted) {
              this.couponObj = {
                message: [
                  'El cupón no esta activo en esta fecha.',
                  'Solo es válido desde ' +
                    fromDate +
                    ' hasta ' +
                    untilDate +
                    '.',
                ],
                messageType: 'error',
              }
              return false
            }
            break
          case 'recurring':
            const dNowWeekday = dNow.toLocaleString('en-GB', {
              weekday: 'long',
            })
            if (this.couponObj.validityData.day !== dNowWeekday) {
              this.couponObj = {
                message: ['El cupón no está activo en este día de la semana.'],
                messageType: 'error',
              }
              return false
            } else if (
              dNowTime < this.couponObj.validityData.fromTime ||
              this.couponObj.validityData.untilTime < dNowTime
            ) {
              this.couponObj = {
                message: [
                  'El cupón no esta activo en esta hora.',
                  'Solo es válido desde ' +
                    this.couponObj.validityData.fromTime +
                    'h hasta ' +
                    this.couponObj.validityData.untilTime +
                    'h.',
                ],
                messageType: 'error',
              }
              return false
            }
            break
        }
      }
      // check if the coupon is valid for the current order, using orderRestriction
      if (this.couponObj.orderRestriction !== `${this.orderType}Only`) {
        this.couponObj = {
          message: [
            'El cupón no es válido para este tipo de pedido.',
            this.couponObj.orderRestriction,
          ],
          messageType: 'error',
        }
        return false
      }
      if (this.price >= this.couponObj.totalMinimum) {
        this.couponObj.message[1] = 'Aplicado con éxito'
        this.couponObj.messageType = 'success'
      } else {
        this.couponObj.message[1] =
          'Añade ' +
          (this.couponObj.totalMinimum - this.price).toString() +
          '€ para aplicar el cupón'
        this.couponObj.messageType = 'warning'
      }
    },
    formatDate(date) {
      const d = new Date(date)
      let month = '' + (d.getMonth() + 1)
      let day = '' + d.getDate()
      const year = d.getFullYear()
      if (month.length < 2) month = '0' + month
      if (day.length < 2) day = '0' + day
      return [year, month, day].join('-')
    },
    handleSelectDirection(item) {
      this.order.address = item.properties.name
      this.order.city = item.properties.city
      this.order.postal_code = item.properties.postcode
      this.showDirections = false
    },
  },
}
</script>

<style scoped>
.select {
  width: 100%;
}
select {
  width: 100%;
}
.table thead td,
.table thead th,
.table th {
  border: none;
}
.payment {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 0.5rem;
  margin: 0.5rem auto;
}
.payment-item {
  padding: 0.5rem;
  box-shadow: 0 1px 0 #ddd;
  background: #eee;
  cursor: pointer;
  border-radius: 4px;
  box-sizing: border-box;
}
.payment-item:hover {
  box-shadow: 0 0 0 2px #00d1b2;
}
.payment-item--selected {
  box-shadow: 0 0 0 2px #00d1b2;
  background-color: #f0fffd;
}
.payment-item img {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: contain;
  pointer-events: none;
}
/* Payment transition */
.slide-enter-active {
  transition: all 0.3s ease;
}
.slide-enter-from {
  transform: translate(100%);
  opacity: 0;
}
.slide-enter-to {
  transform: translateY(0%);
  opacity: 1;
}

.aww-line-through {
  text-decoration-line: line-through;
}

.datalist-ul {
  position: absolute;
  margin: 5px 0 0 0;
  width: 100%;
  max-height: 250px;
  top: 100%;
  left: 0;
  list-style: none;
  overflow: hidden;
  overflow-y: auto;
  z-index: 100;
  background: #fff;
  box-shadow: 0 2px 4px rgb(0 0 0 / 8%);
}

.datalist-li {
  padding: 8px 16px;
  border-bottom: 1px solid white;
  box-shadow: inset 0 1px 0 rgb(0 0 0 / 8%);
  cursor: pointer;
}

.datalist-li:hover {
  background-color: #f9fafa;
}

.datalist-li:first-child {
  box-shadow: none;
}
</style>
