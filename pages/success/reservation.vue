<template>
  <div class="container">
    <div class="row">
      <div class="col-md-4">
          <br>
        <div class="card">
          <div
            :class="[
              resereva.status != 'succeeded' ? 'is-danger' : 'is-primary',
              'notification',
              'is-light',
            ]"
          >
            <button class="delete"></button>

            <p>Reserva creada cn éxito!</p>

            
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
      resereva: {
         status: 'succeeded', 
      },
    }
}
}
</script> 