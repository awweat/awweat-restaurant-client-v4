<template>
  <div class="card">
    <div
      class="card-content"
      :class="{
        'p-4': !isGreater('desktop'),
      }"
    >
      <h2 class="subtitle">Detalles de tu pedido</h2>
      <ul v-if="numberOfItems > 0">
        <li
          v-for="(article, index) in cart"
          :key="article.id + index"
          class="cart-item"
        >
          <input
            type="number"
            class="input"
            min="0"
            :value="article.quantity"
            @blur="handleItemCart({ $event, index })"
            @input="handleItemCartExtention($event, index)"
          />
          <div style="padding: 0 1rem">
            <strong class="text-with-limit-150" :title="article.name">{{
              article.name
            }}</strong>
            <p>
              <small
                v-for="modifier in article.selectedModifiers"
                :key="modifier.id"
                class="is-flex"
                >{{ modifier.name }}</small
              >
            </p>
          </div>
          <span>{{ (article.price * article.quantity).toFixed(2) }} €</span>
        </li>
      </ul>
      <article v-else class="message is-info">
        <div class="message-body">Tu carrito está vacío</div>
      </article>
      <button
        class="button is-primary is-fullwidth cart-btn"
        :title="[numberOfItems === 0 ? 'Disabled button' : '']"
        :disabled="numberOfItems === 0"
        @click="handleOrder"
      >
        <template v-if="isGreater('desktop')">
          <span>{{ numberOfItems }}</span>
          <span>Hacer pedido</span>
          <span>{{ price.toFixed(2) }} €</span>
        </template>
        <template v-else>
          <span></span>
          <span>Hacer pedido</span>
          <span></span>
        </template>
      </button>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import mediaQueryMixin from '~/utils/media-query-mixin.js'

export default {
  name: 'Cart',
  mixins: [mediaQueryMixin],
  computed: {
    ...mapGetters({
      cart: 'cart/items',
      price: 'cart/price',
      numberOfItems: 'cart/numberOfItems',
    }),
  },
  methods: {
    ...mapMutations({
      removeFromCart: 'cart/remove',
      handleItemCart: 'cart/handleItemCart',
    }),
    handleOrder() {
      this.$router.push('/order/checkout')
    },
    handleItemCartExtention($event, index) {
      if ($event.target.value > 0) {
        this.handleItemCart({ $event, index })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.card {
  padding: 0 !important;
}
.cart {
  &-item {
    margin-bottom: 0.5rem;
    display: grid;
    grid-template-columns: 25% 50% 25%;
    span {
      justify-self: center;
    }
  }
  &-btn {
    width: 100%;
    display: grid;
    grid-template-columns: 25% 50% 25%;
    span {
      &:nth-child(1) {
        justify-self: start;
      }
      &:nth-child(3) {
        justify-self: end;
      }
    }
  }
}
</style>
