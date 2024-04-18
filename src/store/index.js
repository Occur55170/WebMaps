import { createStore } from 'vuex'

export default createStore({
    strict: false,
    namespaced: false,
    state: {
        test: 'store',
        isInit: true,
        // FIXME: isInit，test
        isInit: false,
        currentWidth: 0
    },
    actions: {
        updateLayerStatus(context, status){
            context.commit('SETOVERLAYERSTATUS', status)
        },
        updateWindowWidth(context, status){
            context.commit('SETWINDOWSWIDTH', status)
        },
    },
    mutations: {
        SETOVERLAYERSTATUS(state, payload){
            state.isInit = payload
        },
        SETWINDOWSWIDTH(state, payload){
            state.currentWidth = payload
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
