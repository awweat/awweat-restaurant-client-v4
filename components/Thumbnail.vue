<template>
  <div class="thumbnail">
    <img
      class="lazyload blur-up"
      :data-src="`https://sherepunjabbcn.es:444${src}`"
      :alt="alt"
    />
  </div>
</template>

<script>
export default {
  name: 'Thumbnail',
  props: {
    src: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scped>
.thumbnail {
  img {
    height: 96px;
    object-fit: cover;
  }
}
</style>
