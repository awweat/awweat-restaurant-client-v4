<template>
  <div class="row my-5">
    <div class="col">
      <p>
        <font-awesome-icon :icon="['fas', 'map']" />
        {{ address }}
      </p>
      <p>
        <font-awesome-icon :icon="['fas', 'phone']" />
        {{ phone }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RestaurantInfo',
  props: {
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },
}
</script>
