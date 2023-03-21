<template>
  <div>
    <Header2 />
    <Nuxt />
  </div>
</template>

<script>
export default {
  async fetch() {
    // const restaurant = await this.$strapi.findOne(
    //   'restaurants',
    //   this.$config.restaurantKey
    // )

    //unused?:
    // const response = await fetch(
    //   'https://strapix.sherepunjabbcn.es/api/restaurants/1'
    // )
    // const restaurants = await response.json()

    // console.log('  restaurants.data.attributes')
    // console.log(restaurants.data.attributes)
    // const restaurant = await restaurants.data.attributes
    // this.$store.commit('HANDLE_RESTAURANT', { restaurant })
    // if (this.$strapi.user) {
    //   this.$store.commit(
    //     'cart/setItems',
    //     JSON.parse(sessionStorage.getItem('cart')) ?? []
    //   )
    // }
  },
  mounted() {
    this.$store.commit('HANDLE_RESTAURANT', {
      restaurant: {
        image: {},
        name: '',
        description: '',
      },
    })
  },
}
</script>

<style lang="scss">
.blur-up {
  filter: blur(5px);
  transition: filter 400ms, -webkit-filter 400ms;
  &.lazyloaded {
    filter: blur(0);
  }
}
@keyframes slideUp {
  from {
    transform: translateY(140%);
  }
  to {
    transform: translateY(0%);
  }
}
@keyframes slideDown {
  from {
    transform: translateY(0%);
  }
  to {
    transform: translateY(140%);
  }
}
</style>
