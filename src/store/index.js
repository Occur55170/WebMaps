import { createStore } from 'vuex'

export default createStore({
    strict: false,
    namespaced: false,
    state: {
        test: 'store',
        isInit: true
    },
    actions: {
        updateLayerStatus(context, status){
            context.commit('SetOverLayerStatus', status)
        },
    },
    mutations: {
        SetOverLayerStatus(state, payload){
            state.isInit = payload
        }
    },
    getters: {
        // isEmbedded: (state, getters, rootState) => {
        //     return window.location === window.parent.location
        // }
    },
    modules: {
        // general,
    },
})
