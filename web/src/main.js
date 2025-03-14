// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser, faHome } from '@fortawesome/free-solid-svg-icons';

// Vue Toastification
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

// Bootstrap 5 (para Vue 3)
import 'bootstrap/dist/css/bootstrap.css'; 
import 'bootstrap'; 

// Agrega los iconos de Font Awesome a la librería
library.add(faUser, faHome);

// Crea la aplicación Vue
const app = createApp(App);

// Usa el enrutador
app.use(router);

// Registra el componente de Font Awesome globalmente
app.component('font-awesome-icon', FontAwesomeIcon);

// Usa Vue Toastification
app.use(Toast);

// Monta la aplicación
app.mount('#app');