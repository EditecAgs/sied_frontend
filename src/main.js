import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import generateRouter from './router';
import './css/index.css';
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import alvue from '@myshell/alvue';
import PrimeVue from 'primevue/config';
import Select from 'primevue/select';

createApp(App)
    .use(router)
    .use(generateRouter())
    .use(alvue)
	.use(PrimeVue)
	.component('Select', Select)
    .mount('#app')
