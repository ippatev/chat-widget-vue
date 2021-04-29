import Vue from "vue";
import App from "./Main.vue";
import VueResource from "vue-resource";
import "vue-material-design-icons/styles.css";
import vueCustomElement from "vue-custom-element";
import "document-register-element/build/document-register-element";
import { BootstrapVue } from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import VueStorage from "vue-ls";
Vue.use(VueStorage);
Vue.use(BootstrapVue);
Vue.use(vueCustomElement);
Vue.use(VueResource);

Vue.customElement("el-chat", App);
