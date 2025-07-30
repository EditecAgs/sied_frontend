import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import generateRouter from './router';
import './css/index.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import alvue from '@myshell/alvue';
import PrimeVue from 'primevue/config';
import Select from 'primevue/select';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup'; // optional
import Row from 'primevue/row';
import Aura from '@primeuix/themes/aura';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';

createApp(App)
	.use(router)
	.use(generateRouter())
	.use(alvue)
	.use(PrimeVue, {
		theme: {
			preset: Aura,
		},
	})
	.component('Select', Select)
	.component('DataTable', DataTable)
	.component('Column', Column)
	.component('ColumnGroup', ColumnGroup)
	.component('Row', Row)
	.component('IconField', IconField)
	.component('InputIcon', InputIcon)
	.component('InputText', InputText)

	.mount('#app');
