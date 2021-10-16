import Vue from 'vue';
import App from './App.vue';

import VueResource from 'vue-resource';
import VueStorage from 'vue-ls';

import vueCustomElement from 'vue-custom-element';
import 'document-register-element/build/document-register-element';

import { BootstrapVue } from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'vue-material-design-icons/styles.css';

Vue.use(VueStorage);
Vue.use(BootstrapVue);
Vue.use(vueCustomElement);
Vue.use(VueResource);

Vue.customElement('el-chat', App);
