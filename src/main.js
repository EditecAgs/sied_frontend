import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import generateRouter from './router';
import './css/index.css';
//import alvue from '@myshell/alvue';

createApp(App)
    .use(router)
    .use(generateRouter())
    //.use(alvue)
    .mount('#app')
