<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item" href="#">
        <img
          class="nav-icon"
          src="~/assets/img/sherepunjab.jpg"
          width="38"
          height="38"
        />
      </a>
    </div>

    <div class="navbar-menu">
      <div class="navbar-start">
        <!-- <a href="/" class="navbar-item"> Sherepunjab </a> -->
        <a class="navbar-item">
          <router-link to="/"> Sherepunjab </router-link>
        </a>
      </div>

      <!-- <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            <a class="button is-primary">
              <strong>Sign up</strong>
            </a>
            <a class="button is-light"> Log in </a>
          </div>
        </div>
      </div> -->
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Header2',
}
</script>
<style scoped>
.nav-icon {
  border-radius: 10px;
}
</style>