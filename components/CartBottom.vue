<template >
  <div ref="test1" class="cart-mobile" v-if="price" :style="style">
    <template v-if="showCart">
      <div
        class="cart-mobile__background"
        :style="style"
        @click="showCart = false"
      />
      <lazy-cart :style="cartStyle"></lazy-cart>
    </template>
    <div ref="cartBottom" class="cart-mobile__content">
      <div
        v-if="numberOfItems > 0"
        class="cart-mobile__wrapper"
        @click="showCart = !showCart"
      >
        <span class="cart-mobile__quantity">{{ numberOfItems }}</span>
        <span class="cart-mobile__title">Ver pedido</span>
        <span class="cart-mobile__price">{{ price.toFixed(2) }} €</span>
      </div>
      <article v-else class="message is-info" style="width: 100%">
        <div class="message-body">Tu carrito está vacío</div>
      </article>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'

export default {
  name: 'CartBottom',
  data: () => {
    return {
      showCart: false,
      style: { top: 0, zIndex: 40 },
      cartStyle: {
        position: 'fixed',
        width: '100%',
        boxShadow: 'none',
        borderRadius: 0,
        zIndex: 41,
      },
    }
  },
  computed: {
    ...mapGetters({
      cart: 'cart/items',
      price: 'cart/price',
      numberOfItems: 'cart/numberOfItems',
    }),
  },
  watch: {
    showCart(showCart) {
      this.handleCartStyle(showCart)
    },
  },
  mounted() {
    this.handleCartStyle(this.showCart)
  },
  methods: {
    ...mapMutations({
      removeFromCart: 'cart/remove',
      handleItemCart: 'cart/handleItemCart',
    }),
    handleOrder() {
      this.$router.push('/order/checkout')
    },
    handleCartStyle(showCart) {
      if (!this.$refs.cartBottom) return // porque si no esta visible el Cart, va ser undefined. 

      const { height } = this.$refs.cartBottom.getBoundingClientRect()
      this.$set(this.cartStyle, 'bottom', `${height}px`)
      this.$set(
        this.cartStyle,
        'animation',
        !showCart ? 'slideDown 0.3s ease' : 'slideUp 0.3s ease'
      )
      this.style = !showCart
        ? {
            bottom: 0,
            height: `${height}px`,
            zIndex: 'inherit',
          }
        : { top: 0, zIndex: 40 }
    },
  },
}
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.cart-mobile {
  position: fixed;
  left: 0;
  width: 100vw;
  height: 100vh;
  &__background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(10, 10, 10, 0.86);
  }
  &__content {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 42;
    display: flex;
    justify-items: center;
    background: #fff;
    padding: 1rem 1.5rem;
    box-shadow: 0px -3px 6px -2px rgb(0 0 0 / 7%);
  }
  &__wrapper {
    display: grid;
    grid-template-columns: 15% auto 20%;
    width: 100%;
    padding: 0.75rem;
    border-radius: 4px;
    background: #00d1b2;
    span {
      color: #fff;
      font-weight: bold;
      align-self: center;
      justify-self: center;
    }
  }
  &__quantity {
    padding: 5px 10px;
    border-radius: 4px;
    background-color: rgba(46, 51, 51, 0.1);
  }
}
</style>
