export const state = () => ({
  items: [],
  orderType: 'delivery',
})

export const mutations = {
  setItems(state, items) {
    state.items = items
  },
  add(state, item) {
    const record = state.items.find(
      (i) => i.id === item.id && i.price === item.price
    )
    if (!record) {
      state.items.unshift({
        quantity: 1,
        ...item,
      })
    } else record.quantity++
    sessionStorage.setItem('cart', JSON.stringify(state.items))
  },
  remove(state, item) {
    const record = state.items.find((i) => i.id === item.id)

    if (record.quantity > 1) {
      record.quantity--
    } else {
      const index = state.items.findIndex((i) => i.id === item.id)
      state.items.splice(index, 1)
    }
    sessionStorage.setItem('cart', JSON.stringify(state.items))
  },
  emptyList(state) {
    state.items = []
    sessionStorage.setItem('cart', JSON.stringify(state.items))
  },
  handleItemCart(state, { $event, index }) {
    const { target } = $event
    state.items[index].quantity = Number(target.value)
    if (Number(target.value) === 0) state.items.splice(index, 1)
    sessionStorage.setItem('cart', JSON.stringify(state.items))
  },
  orderType(state, type) {
    state.orderType = type
  },
}

export const getters = {
  items: (state) => state.items,
  price: (state) => {
    return state.items.reduce(
      (accumulator, item) => accumulator + item.price * item.quantity,
      0
    )
  },
  numberOfItems: (state) => {
    return state.items.reduce(
      (accumulator, item) => accumulator + item.quantity,
      0
    )
  },
  orderType: (state) => state.orderType,
}
