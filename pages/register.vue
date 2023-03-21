<template>
  <div class="container">
    <div class="row">
      <div class="col-md-4 offset-md-4">
        <div class="card">
          <div class="card-content">
            <h1 class="title">Regístrate</h1>
            <Notification v-if="error" :message="error" />
            <form @submit.prevent="handleSubmit">
              <div class="field">
                <label class="label">Nombre de usuario</label>
                <div class="control has-icons-left">
                  <input
                    v-model="user.username"
                    class="input"
                    type="text"
                    required
                  />
                  <span class="icon is-small is-left">
                    <b-icon icon="account"></b-icon>
                  </span>
                </div>
              </div>
              <div class="field">
                <label class="label">Correo electrónico</label>
                <div class="control has-icons-left">
                  <input
                    v-model="user.email"
                    class="input"
                    type="email"
                    required
                  />
                  <span class="icon is-small is-left">
                    <b-icon icon="email"></b-icon>
                  </span>
                </div>
              </div>
              <div class="field">
                <label class="label">Contraseña</label>
                <div class="control has-icons-left">
                  <input
                    v-model="user.password"
                    class="input"
                    type="password"
                    required
                  />
                  <span class="icon is-small is-left">
                    <b-icon icon="lock"></b-icon>
                  </span>
                </div>
              </div>
              <div class="field">
                <div class="control">
                  <button
                    v-if="!loading"
                    class="button is-block is-medium is-danger is-fullwidth is-size-6"
                  >
                    Regístrate
                  </button>
                  <button
                    v-else
                    class="button is-danger is-loading is-block is-medium is-fullwidth is-size-6"
                  >
                    Loading
                  </button>
                </div>
              </div>
            </form>
            <div
              style="padding: 5px 0; text-align: center"
              class="has-text-grey"
            >
              <font style="vertical-align: inherit">
                <font style="vertical-align: inherit">- o -</font>
              </font>
            </div>
            <a
              class="button is-medium is-fullwidth is-size-6"
              href="#"
              disabled
            >
              <span class="icon">
                <img src="img/logo-google.png" alt />
              </span>
              <span class="google-button__text">
                <font style="vertical-align: inherit">
                  <font style="vertical-align: inherit"
                    >Continuar con Google</font
                  >
                </font>
              </span>
            </a>
            <p class="has-text-centered" style="margin: 9px 0">
              <font style="vertical-align: inherit">
                <font style="vertical-align: inherit"
                  >¿Ya tienes una cuenta?</font
                >
              </font>
            </p>
            <nuxt-link
              to="/login"
              class="button is-block is-danger is-medium is-fullwidth is-size-6"
            >
              <font style="vertical-align: inherit">
                <font style="vertical-align: inherit">Iniciar sesión</font>
              </font>
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      user: { username: '', email: '', password: '' },
      error: null,
      loading: false,
    }
  },
  methods: {
    async handleSubmit() {
      try {
        this.loading = true
        await this.$strapi.register(this.user)
        this.$router.push('/')
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  margin-top: 3rem;
}
</style>
