<template>
  <div class="order-switch">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="order-switch__item"
      :class="{ 'order-switch__item--active': item.active }"
      @click="handleClick(item)"
    >
      <div class="order-switch__item-text">{{ item.text }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderSwitch',
  data() {
    return {
      items: [
        {
          text: 'Entrega',
          type: 'delivery',
          active: true,
        },
        {
          text: 'Recoger',
          type: 'pickup',
          active: false,
        },
      ],
    }
  },
  computed: {
    orderType() {
      return this.$store.getters['cart/orderType']
    },
  },
  methods: {
    handleClick(item) {
      this.items.forEach((i) => {
        i.active = false
      })
      item.active = true
      this.$store.commit('cart/orderType', item.type)
    },
  },
}
</script>

<style lang="scss" scoped>
.order-switch {
  display: flex;
  justify-content: space-between;
  padding: 0.33rem;
  background-color: #dadada;
  border-radius: 500px;
  &__item {
    border-radius: 500px;
    padding: 0.33rem 1rem;
    font-weight: bold;
    cursor: pointer;
    flex: 1;
    text-align: center;
    &--active {
      background-color: #fff;
    }
  }
}
</style>
