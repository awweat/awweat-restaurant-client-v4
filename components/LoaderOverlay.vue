<template>
  <div class="loader-wrapper" :class="{ 'is-active': showLoader }">
    <article v-if="paymentLink" class="message is-primary">
      <div class="message-body">
        <strong>Para pagar</strong>, <a :href="paymentLink">haga clic aquí </a>👈
      </div>
    </article>

    <div class="loader is-loading"></div>
  </div>
</template>
<script>
export default {
  props: {
    showLoader: {
      type: Boolean,
    },
    paymentLink: {
      type: String,
    },
  },
}
</script>
<style scoped>
.loader-wrapper {
  position: fixed;
  flex-direction: column;
  /* position: absolute; */
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: #fff;
  opacity: 0;
  z-index: -1;
  transition: opacity 0.3s;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
}
.loader-wrapper .loader {
  height: 80px;
  width: 80px;
}
.loader-wrapper.is-active {
  opacity: 1;
  z-index: 6;
}

.is-loading {
  position: relative;
}

body {
  background: #ededed;
  min-height: 100vh;
}

.box {
  padding: 40px;
  position: relative;
}
.box h2 {
  text-align: center;
  font-family: 'Montserrat', sans-serif;
  padding: 1.5rem 0;
}
.box .button {
  padding: 0;
  height: 40px;
  min-width: 160px;
  transition: all 0.3s;
}
.box .button:hover {
  background: #ff4f8f;
  border-color: #ff4f8f;
  color: #fff;
}

.link-button {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #6dacff;
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.4s;
}
.link-button img {
  width: 32px;
  height: 32px;
  display: block;
}
.link-button:hover {
  transform: scale(1.1) rotate(180deg);
  background: #ff4f8f;
}
</style>