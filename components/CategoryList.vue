<template>
  <div class="category-list">
    <h3
      :id="`${category.id}`"
      class="title is-3"
      style="
        font-weight: 700;
        font-size: 28px;
        line-height: 36px;
        letter-spacing: -0.02em;
        margin-bottom: 1rem;
      "
    >
      {{ category.name }}
    </h3>
    <div :id="'x' + category.id" class="row">
      <div
        v-for="dish in category.dishes"
        :key="dish.id"
        class="col-md-6"
        style="margin-bottom: 1rem"
      >
        <div
          class="card"
          :class="{
            'card--active': dishesInCart.includes(dish.id),
          }"
          @click="addToCart(dish)"
        >
          <div class="" :class="{ card__content: dish.image != undefined }">
            <div v-if="dish.image" class="content__left">
              <img
                v-if="dish.image"
                :data-src="`${dish.image.formats.thumbnail.url}`"
                class="image lazyload"
                :alt="dish.name"
              />
            </div>
            <div class="content__right">
              <h4 class="subtitle is-5 mb-1" :title="dish.name">
                {{ dish.name }}
              </h4>
              <h5
                v-if="dish.description"
                class="subtitle is-6 has-text-grey line-clamp mb-0"
                :title="dish.description"
              >
                {{ dish.description }}
              </h5>
              <p v-else class="is-hidden"></p>
              <h5 class="subtitle is-5 has-text-grey">
                {{ getParsedPrice(dish.price) }}
              </h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CategoryList',
  props: {
    category: {
      type: Object,
      required: true,
    },
  },
  computed: {
    dishesInCart() {
      return this.$store.state.cart.items.map((dish) => dish.id)
    },
  },
  methods: {
    getParsedPrice(price) {
      return new Intl.NumberFormat(navigator.language, {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 2,
      }).format(price)
    },
    addToCart(dish) {
      if (dish.optionSetsEnabled) {
        this.$emit('addToCart', {
          optionSets:
            typeof dish.optionSets === 'string'
              ? JSON.parse(dish.optionSets)
              : dish.optionSets,
          totalDish: dish.price,
          dish,
        })
      } else {
        this.$store.commit('cart/add', dish)
      }
    },
    getQty(currentId) {
      return this.selectedModifiers.find(({ id }) => id === currentId)
        ? this.selectedModifiers.find(({ id }) => id === currentId).qty
        : 1
    },
    handleClose(isClosed) {
      if (isClosed) {
        this.clearModalForm()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.card {
  width: 100%;
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 3px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.card {
  &--active {
    border: 1px solid #7957d5;
  }

  &__content {
    display: grid;
    grid-template-columns: 30% 70%;
    overflow: hidden;
  }

  .content {
    &__left {
      .image {
        border-radius: 3px;
        width: 100%;
        margin-right: 2px;
        padding: 6px;
        border-radius: 12px;
        aspect-ratio: 1;
        object-fit: cover;
      }
    }
  }

  &:hover {
    box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1),
      0 0px 0 1px rgba(10, 10, 10, 0.02);
  }
}
</style>
