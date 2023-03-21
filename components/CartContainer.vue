<template>
  <div class="card-container">
    <div class="modal" :class="[show ? 'is-active' : null]">
      <div class="modal-background" @click="clearModalForm"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">{{ modalDish.name }}</p>
          <button
            class="delete"
            aria-label="close"
            @click="clearModalForm"
          ></button>
        </header>
        <section class="modal-card-body">
          <div class="columns is-flex is-centered">
            <img
              v-if="modalDish.image && modalDish.image.formats"
              :src="modalDish.image.formats.small.url"
              :alt="modalDish.image.alternativeText"
            />
          </div>
          <p class="my-3">{{ modalDish.description }}</p>
          <form ref="modalForm" @change="handleModalForm">
            <div
              class="option-sets"
              v-for="(set, index) in optionSets"
              :key="set.id"
            >
              <p
                class="has-text-weight-semibold mb-3"
                :class="index ? 'mt-3' : null"
              >
                {{ set.name }}
              </p>
              <div
                v-for="item in set.optionSetitems"
                :key="item.id"
                class="
                  field
                  is-flex
                  is-justify-content-space-between
                  is-align-content-center
                "
              >
                <label :class="getOptionSetType(set.type)">
                  <input
                    :type="getOptionSetType(set.type)"
                    :name="set.type === 'single' ? set.id : `${set.id}[]`"
                    :value="item.id"
                    :required="set.required =='true'"
                    :data-price="item.price"
                    :data-optionSetId="set.id"
                  />
                  <span class="ml-2">{{ item.name }}</span>
                </label>
                <div
                  class="
                    is-flex
                    is-justify-content-space-between
                    is-align-content-center
                  "
                >
                  <div
                    v-if="
                      set.type === 'multiple' &&
                      selectedModifiers.find(({ id }) => id === item.id)
                    "
                    class="mr-2"
                    style="max-width: 150px"
                  >
                    <b-field>
                      <b-numberinput
                        v-model="
                          selectedModifiers.find(({ id }) => id === item.id).qty
                        "
                        :data-parent="set.id"
                        :data-target="item.id"
                        size="is-small"
                        min="1"
                        :max="item.maxQty"
                        @input="handleOptionSetItemPrice"
                      ></b-numberinput>
                    </b-field>
                  </div>
                  <span v-if="item.price"
                    >{{
                      (Number(item.price) * getQty(item.id)).toFixed(2)
                    }}
                    €</span
                  >
                </div>
              </div>
            </div>
          </form>
        </section>
        <footer class="modal-card-foot">
          <button type="button" class="button mt-3" @click="clearModalForm">
            Cancelar
          </button>
          <button
            type="button"
            class="button is-primary mt-3"
            @click="saveModalForm"
          >
            Total {{ Number(totalModifiers + totalDish).toFixed(2) }} €
          </button>
        </footer>
      </div>
    </div>
    <lazy-cart v-if="isGreater('desktop')"></lazy-cart>
    <lazy-cart-bottom v-if="isSmaller('desktop')"></lazy-cart-bottom> 
  </div>
</template>

<script>
import mediaQueryMixin from '~/utils/media-query-mixin.js'

export default {
  mixins: [mediaQueryMixin],
  name: 'CartContainer',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    modalDish: {
      type: Object,
      default: () => ({}),
    },
    optionSets: {
      type: Array,
      default: () => [],
    },
    totalDish: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      selectedModifiers: [],
      totalModifiers: 0,
    }
  },
  methods: {
    handleModalFormx() {
      debugger
      const { modalForm } = this.$refs
      const selected = Object.fromEntries(new FormData(modalForm))
      const items = Object.keys(selected).map((key) => {
        const item = this.optionSets.find((set) => set.id === key)
        const selectedItem = item.optionSetitems.find(
          (item) => item.id === selected[key]
        )
        return {
          id: selectedItem.id,
          name: selectedItem.name,
          price: selectedItem.price,
          optionSetId: item.id,
          qty: 1,
        }
      })
      this.selectedModifiers = items
      console.log(items)

      this.handleOptionSetItemPrice()
    },
    handleModalForm() {
      const { modalForm } = this.$refs
      const selected = Object.fromEntries(new FormData(modalForm))
      let items = []

      this.optionSets.forEach((set) => {
        // if (set.type == 'single') {
        //   items.push[]
        // } else {
        // }

        // console.log(set.id)
        // console.log(modalForm.elements['EK4zlNS[]'])
        items = items.concat(
          [...modalForm.elements[set.id + (set.type == 'single' ? '' : '[]')]]
            .filter((el) => el.checked)
            .map((el) => {
              const selectedItem = set.optionSetitems.find(
                (item) => item.id === el.value
              )

              return {
                id: selectedItem.id,
                name: selectedItem.name,
                price: selectedItem.price,
                optionSetId: set.id,
                qty: 1,
              }
            })
        )
      })
      console.log(items)
      this.selectedModifiers = items
      this.handleOptionSetItemPrice()
    },
    saveModalForm() {
      const { modalForm } = this.$refs
      if (modalForm.checkValidity()) {
        this.$store.commit('cart/add', {
          ...this.modalDish,
          selectedModifiers: this.selectedModifiers,
          price: this.totalDish + this.totalModifiers,
        })
        this.clearModalForm()
      } else modalForm.reportValidity()
    },
    clearModalForm() {
      this.$emit('clearModalForm')
    },
    getOptionSetType(type) {
      return type === 'single' ? 'radio' : 'checkbox'
    },
    getModifierName(optionSet) {
      const inputType = this.getOptionSetType(optionSet.type)
      if (inputType === 'radio') {
        return optionSet.id
      }
      return null
    },
    handleOptionSetItemPrice() {
      this.selectedModifiers = [...this.selectedModifiers].map((i) => {
        return {
          ...i,
          total: i.price * i.qty,
        }
      })
      this.totalModifiers = this.selectedModifiers
        .map((i) => Number(i.total))
        .reduce((a, b) => a + b, 0)
    },
    getQty(currentId) {
      return 1
      return this.selectedModifiers.find(({ id }) => id === currentId)
        ? this.selectedModifiers.find(({ id }) => id === currentId).qty
        : 1
    },
  },
}
</script>

<style lang="scss" scoped>
.modal {
  &-card {
    width: 85%;
    @media (min-width: 768px) {
      width: 45%;
    }
  }
  &-content {
    width: 76vw;
  }
  img {
    border-radius: 10px;
    width: auto;
    height: 249px;
    @media (max-width: 768px) {
      width: 100%;
      height: auto;
    }
    object-fit: cover;
    aspect-ratio: 4/3;
  }
}

.option-sets {
  display: flex;
  justify-content: space-between;
  // align-items: center;
  flex-direction: column;
}
</style>
