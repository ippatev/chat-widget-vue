import Vue from 'vue'
import Vuex from 'vuex'
// import App from './Main.vue'
import id from "element-ui/src/locale/lang/id";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        dialogs:[]
    },
    mutations: {
        // setDialog(state, payload){
        //     state.dialogs.push({id: payload.id, token: payload.token})
        // }
    },
    actions: {

    }
})

