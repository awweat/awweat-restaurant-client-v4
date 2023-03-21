<template>
  <div class="box is-clipped">
    <h2 class="subtitle mb-1">Menú</h2>
    <a
      v-for="(category, index) in categories"
      :key="index"
      class="mb-1 has-text-grey"
      :class="{
        'px-3': index && index !== categories.length - 1,
      }"
      :href="`#${index}`"
      >#{{ category }}
    </a>
  </div>
</template>

<script>
export default {
  name: 'Categories',
  props: {
    categories: {
      type: Array,
      required: true,
    },
  },
}
</script>
