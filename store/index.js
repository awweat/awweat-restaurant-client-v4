import { HANDLE_RESTAURANT } from './mutation-types'

export const state = () => ({
  restaurant: null,
})

export const mutations = {
  [HANDLE_RESTAURANT](state, { restaurant }) {
    state.restaurant = restaurant
  },
}

export const actions = {
  nuxtClientInit({ commit }) {
    const cart = JSON.parse(sessionStorage.getItem('cart')) ?? []
    commit('cart/setItems', cart)
  },
}

export const getters = {
  restaurant: (state) => state.restaurant,
}
