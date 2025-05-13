import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Import router
import store from './store'; // Import Vuex Store

const app = createApp(App);

app.use(router); // Gunakan router
app.use(store); // Gunakan Vuex
app.mount('#app');
