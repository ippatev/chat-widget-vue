import Vue from 'vue';
import App from './App.vue';
import './styles.css';

import vueCustomElement from 'vue-custom-element';
import 'document-register-element/build/document-register-element';

import vClickOutside from 'v-click-outside';

Vue.use(vueCustomElement);
Vue.use(vClickOutside);

Vue.customElement('loyams-chat', App);
