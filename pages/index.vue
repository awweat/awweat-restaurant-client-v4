<template>
  <div id="dior">
    <Hero :name="restaurant.name" :description="restaurant.description" />
    <div class="container is-fluid">
      <RestaurantInfo :address="restaurant.address" :phone="restaurant.phone" />
      <div v-if="restaurant" class="row">
        <div class="col-lg-8 menu">
          <article
            v-if="restaurant.offers && restaurant.offers.message"
            class="message is-primary"
          >
            <div class="message-header">
              <p>
                <b-icon icon="tag" class="mr-1" />{{
                  restaurant.offers.message.title
                }}
              </p>
            </div>
            <div class="message-body">
              <strong>{{ restaurant.offers.message.description }}</strong>
            </div>
          </article>
          <Categories :categories="allCats" />
          <CategoryList
            v-for="category in restaurant.categories"
            :key="category.id"
            :category="category"
            @addToCart="handleSelectedDish"
          />
        </div>
        <div class="col-lg-4">
          <CartContainer
            :show="modal"
            :modalDish="modalDish"
            :optionSets="optionSets"
            :totalDish="totalDish"
            @clearModalForm="clearModalForm"
          />
        </div>
      </div>
      <div v-else>
        <h1>Oh no 😢 El restaurante no esta dispinible en este momento</h1>
      </div>
    </div>
  </div>
</template>

<script>
import mediaQueryMixin from '~/utils/media-query-mixin.js'

import { parser } from '~/utils/parsers.js'

export default {
  name: 'Home',
  mixins: [mediaQueryMixin],
  data() {
    return {
      modal: false,
      totalDish: 0,
      page: 1,
      allowNewPage: true,
      modalDish: {},
      optionSets: [],
    }
  },
  async asyncData({ $strapi, $config: { restaurantKey } }) {
    let { restaurant } = await $strapi.graphql({
      query: `
      {
        restaurant(id: "1") {
          data {
            attributes {
              name
              description
              address
              phone
              categories (pagination: { page: 1, pageSize: 2 }) {
                data {
                  id
                  attributes {
                    name
                    displayOrder
                    dishes (pagination: { start: 0, limit: 99 }) {
                      data {
                        id
                        attributes {
                          name
                          description
                          displayOrder
                          price
                          optionSetsEnabled
                          optionSets
                          image {
                            data {
                              attributes {
                                formats
                                alternativeText
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              },
              allCatagories:categories(pagination: { start: 0, limit: 99 }){
                data{
                  attributes{
                    name
                  }
                }
              }
            }
          }
        }
      }

      `,
    })
    let allCats = restaurant.data.attributes.allCatagories.data.map(
      (el) => el.attributes.name
    )
    restaurant = parser(restaurant.data.attributes)
    console.log(restaurant)
    return { restaurant, allCats }
  },
  mounted() {
    // document.addEventListener('scroll', this.getVerticalScrollPercentage())
    console.log('gg')
    // console.log(this.asyncDataPartial())
    var self = this
    document.addEventListener(
      'scroll',
      function () {
        if (self.page == -1) {
          return
        }
        let elm = document.body,
          p = elm.parentNode
        let percentage =
          ((elm.scrollTop || p.scrollTop) / (p.scrollHeight - p.clientHeight)) *
          100
        if (percentage > 75.01) {
          if (self.allowNewPage) {
            self.allowNewPage = false
            self.asyncDataPartial()
            console.log('do the ting')
          }
        }
      },
      true
    )
  },
  methods: {
    test() {
      console.log(232)
    },
    async asyncDataPartial() {
      this.page++
      let query = `{
        restaurant(id: "1") {
          data {
            attributes { 
              categories (pagination: { page: ${this.page}, pageSize: 2 }) {
                data {
                  id
                  attributes {
                    name
                    displayOrder
                    dishes (pagination: { start: 0, limit: 99 }) {
                      data {
                        id
                        attributes {
                          name
                          description
                          displayOrder
                          price
                          optionSetsEnabled
                          optionSets
                          image {
                            data {
                              attributes {
                                formats
                                alternativeText
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
`
      fetch(this.$config.strapiURL + '/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query }),
      })
        .then((response) => response.json())
        .then((data) => {
          let restaurant = parser(data.data.restaurant.data.attributes)
          if (restaurant.categories.length == 0) {
            this.page = -1
          }
          // this.restaurant.categories.push(  data.data.restaurant.data.attributes.categories[0])
          this.restaurant.categories = [
            ...this.restaurant.categories,
            ...restaurant.categories,
          ]
          console.log('Success:', restaurant.categories)
          // console.log( [ this.restaurant.categories, restaurant.categories]);
          this.allowNewPage = true
        })
        .catch((error) => {
          console.error('Error:', error)
        })
      // console.log(response)
      return {}
    },
    handleModalForm() {
      const { modalForm } = this.$refs
      const items = Array.from(modalForm.elements)
        .filter(
          (input) =>
            Object.keys(input.dataset).includes('input') && input.checked
        )
        .map((input) => {
          const inputQty = document.querySelector(
            `[data-target="${input.value}"]`
          )
          let qty = 1
          if (inputQty) qty = Number(inputQty.value)
          return {
            id: input.value,
            price: input.dataset.price,
            optionSetId: input.dataset.optionsetid,
            name: input.parentElement.innerText.trim(),
            qty,
          }
        })
      this.selectedModifiers = items
      this.handleOptionSetItemPrice()
    },
    handleSelectedDish({ dish, optionSets, totalDish }) {
      console.log({ dish, optionSets, totalDish });
      this.modalDish = dish
      this.optionSets = optionSets
      this.totalDish = totalDish
      this.modal = true
    },
    clearModalForm() {
      this.modal = false
      this.totalDish = 0
      this.modalDish = {}
      this.totalModifiers = 0
      this.selectedModifiers = []
    },
  },
}
</script>

<style lang="scss" scoped>
.button {
  margin-bottom: 1rem;
}
.card-content {
  animation: glow 2s ease-in-out infinite alternate;
}
.sticky {
  position: sticky;
  top: 20px;
}
</style>
