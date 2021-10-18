import Vue from 'vue';
import App from './App.vue';
import './styles.css';

import vueCustomElement from 'vue-custom-element';
import 'document-register-element/build/document-register-element';

import { BootstrapVue } from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.use(BootstrapVue);
Vue.use(vueCustomElement);

Vue.customElement('el-chat', App);
