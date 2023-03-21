<template>
  <div class="hero">
    <div class="container is-fluid has-text-white pb-5">
      <h1 class="title is-1 has-text-white">{{ name }}</h1>
      <span class="header-description">
        {{ description }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Hero',
  props: {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.hero {
  position: relative;
  height: 35vh;
  background-image: url('https://previews.123rf.com/images/baibakova/baibakova1908/baibakova190800091/129009842-assorted-indian-food-on-black-background-indian-cuisine-top-view-with-copy-space.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;

  > div {
    height: 100%;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    justify-content: flex-end;
  }
}

.header-description {
  background: #00000091;
  padding: 0.25rem 1.25rem;
  border-radius: 6px;
}
</style>
