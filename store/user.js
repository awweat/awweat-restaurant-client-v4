export const state = () => ({
    user: JSON.parse(localStorage.getItem("store")) ? JSON.parse(localStorage.getItem("store")).user : null // mejorar?:
})

export const getters = {
    user: (state) => state.user,
}

export const actions = {
    setUser({ state, commit }) {
        commit(state)
    }
}

export const mutations = {
    SET_USER_NAME(state, { user }) {
        state.user = user
        localStorage.setItem('store', JSON.stringify(state));

    },
}
