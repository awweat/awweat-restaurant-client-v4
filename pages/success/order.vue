<template>
  <div class="container">
    <div class="row">
      <div class="col-md-4">
        <div class="card">
          <div
            :class="[
              order.payment_status != 'succeeded' ? 'is-danger' : 'is-primary',
              'notification',
              'is-light',
            ]"
          >
            <button class="delete"></button>

            <p>{{ order.order_message }}</p>
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
      order: {
        payment_status: 'succeeded',
        order_message: '⌛ Espera...',
      },
    }
  },
  async mounted() {
    try {
      await fetch(
        this.$config.serverURL +
          '/check-order-status?orderId=' +
          this.$route.query.id,
        {
          method: 'GET', // or 'PUT'
          // headers: {
          //   'Content-Type': 'application/json',
          // },
        }
      )
        .then((response) => response.json())
        .then((paymentInfo) => {
          //if pedido no pagado, click aqui para pagarlo
          console.log(paymentInfo)
          if (paymentInfo.payment_type == 'cash') {
            this.order.order_message =
              'Estado del pedido:' + paymentInfo.order_state
          } else {
            if (paymentInfo.paid == true) {
              this.order.order_message = 'Pedido pagado con exito! Llamanos si tienes alguna duda. 662019120'
            } else {
              this.order.payment_status = 'error'
              this.order.order_message = 'Pedido NO pagado'
            }
          }

          return
          if (data.payment_type === 'card') {
            if (data.info === 'success') {
              // If user has selected card payment method. Redirect to the strapi link that will be generated in following code...
              this.order.payment_status = data.status
              if (data.status === 'succeeded') {
                this.order.order_message = 'Pedido pagado con exito!'
              } else if (data.status === 'requires_payment_method') {
                this.order.order_message = 'Pedido NO creado'
              }
            }
          } else if (data.payment_type === 'paypal') {
            if (data.info === 'success') {
              // If user has selected card payment method. Redirect to the strapi link that will be generated in following code...
              this.order.payment_status = 'succeeded'
              if (data.status === 'COMPLETED') {
                this.order.order_message = 'Pedido pagado con exito!'
              }
            } else if (data.info === 'error') {
              if (data.status === 'ORDER_ALREADY_CAPTURED') {
                this.order.payment_status = 'succeeded'
                this.order.order_message = 'Pedido ya ha estado pagado'
              } else {
                this.order.payment_status = 'error'
                this.order.order_message = 'Pedido NO pagado'
              }
            }
          } else {
            this.order.payment_status = 'succeeded'
            this.order.order_message = 'Pedido pagado con exito!'
          }
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.log('Error:', error)
        })

      // ----
      // if (order.payment_type === 'card') {
      //   await fetch(this.$config.serverURL + '/check-order-status', {
      //     method: 'POST', // or 'PUT'
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify({
      //       // strapiPI: order.payment_data.strapiPI, //to delete
      //       orderId: this.$route.query.id,
      //       // token: token,
      //     }),
      //   })
      //     .then((response) => response.json())
      //     .then((data) => {
      //       console.log('Success:', data)

      //       if (data.info === 'success') {
      //         //If user has selected card payment method. Redirect to the strapi link that will be generated in following code...
      //         this.order.payment_status = data.status
      //         if (data.status === 'succeeded') {
      //           this.order.order_message = 'Pedido pagado con exito!'
      //         } else if (data.status === 'requires_payment_method') {
      //           this.order.order_message = 'Pedido NO creado'
      //         }
      //       }
      //     })
      //     .catch((error) => {
      //       console.log('Error:', error)
      //     })
      // } else if (order.payment_type === 'paypal') {
      //   await fetch(this.$config.serverURL + '/check-order-status', {
      //     method: 'POST', // or 'PUT'
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify({
      //       orderId: this.$route.query.id,
      //       token: token,
      //     }),
      //   })
      //     .then((response) => response.json())
      //     .then((data) => {
      //       console.log('Success:', data)

      //       if (data.info === 'success') {
      //         //If user has selected card payment method. Redirect to the strapi link that will be generated in following code...
      //         this.order.payment_status = 'succeeded'
      //         if (data.status === 'COMPLETED') {
      //           this.order.order_message = 'Pedido pagado con exito!'
      //         }
      //       } else if (data.info === 'error') {
      //         if (data.status === 'ORDER_ALREADY_CAPTURED') {
      //           this.order.payment_status = 'succeeded'
      //           this.order.order_message = 'Pedido ya ha estado pagado'
      //         } else {
      //           this.order.payment_status = 'error'
      //           this.order.order_message = 'Pedido NO pagado'
      //         }
      //       }
      //     })
      //     .catch((error) => {
      //       console.log('Error:', error)
      //     })
      // } else {
      //   console.log('nigg')
      //   this.order.payment_status = 'succeeded'
      //   this.order.order_message = 'Pedido pagado con exito!'
      // }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error)
      this.order.order_message = 'Pedido no encontrado'
      this.error = error
    }
  },
}
</script>

<style lang="scss" scoped>
.container {
  margin-top: 3rem;
}
</style>
