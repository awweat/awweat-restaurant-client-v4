<template>
  <p>
    404 not found<br />
    Esta pagina no exite, redidigiendote a la página principal
  </p>
</template>

<script>
export default {
  asyncData({ redirect }) {
    return redirect('/')
  },
}
</script>
 