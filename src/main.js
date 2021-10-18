import Vue from 'vue';
import App from './App.vue';
import './styles.css';

import vueCustomElement from 'vue-custom-element';
import 'document-register-element/build/document-register-element';

Vue.use(vueCustomElement);

Vue.customElement('el-chat', App);
