<script setup lang="ts">
import { defineProps, defineEmits, reactive, ref, onMounted, watch, watchEffect } from 'vue';
import axios from 'axios';
import { getStates } from '../../../services/location/states.js';
import { getMunicipalities } from '../../../services/location/municipalities.js';
import { showOrganization } from '../../../services/organizations/organizations';
import { getTypes } from '../../../services/organizations/types.js';
import { getSectors } from '../../../services/organizations/sectors.js';
import { getClusters } from '../../../services/organizations/clusters.js';

const emit = defineEmits(['close', 'saved']);
const isLoading = ref(false);
const alvRoute = ref();
const alvMethod = ref('POST');

// eslint-disable-next-line vue/valid-define-props
const props = defineProps<{
	show: boolean,
	data: {
		mode: 'create' | 'edit',
		pk: number | null,
		table: string
	}
}>();

const form = reactive({
	name: '',
	id_type: '',
	id_sector: '',
	size: '',
	id_cluster: '',
	street: '',
	external_number: '',
	internal_number: '',
	neighborhood: '',
	postal_code: '',
	id_state: '',
	id_municipality: '',
	country: 'México',
	city: '',
	scope: ''
});

const states = ref([]);
const municipalities = ref([]);
const allMunicipalities = ref([]);
const types = ref([]);
const sectors = ref([]);
const clusters = ref([]);

const loadDependents = async () => {
	try {
		const [statesRes, municipalitiesRes, typesRes, sectorsRes, clustersRes] = await Promise.all([
			getStates(),
			getMunicipalities(),
			getTypes(),
			getSectors(),
			getClusters()
		]);

		states.value = statesRes.data;
		allMunicipalities.value = municipalitiesRes.data;
		types.value = typesRes.data;
		sectors.value = sectorsRes.data;
		clusters.value = clustersRes.data;
	} catch (error) {
		console.error('Error cargando datos:', error);
	}
};

watch(() => form.id_state, (newState) => {
	municipalities.value = allMunicipalities.value.filter(m => m.id_state === newState);
});

watchEffect(() => {
	if (props.data.mode === 'edit' && props.data.pk !== null) {
		alvRoute.value = `${axios.defaults.baseURL}organizations/${props.data.pk}`;
		alvMethod.value = 'PUT';
		isLoading.value = true;

		showOrganization(props.data.pk).then(({ data }) => {
			Object.keys(form).forEach(key => {
				if (data[key] !== undefined) form[key] = data[key];
			});

			if (data.id_state) {
				municipalities.value = allMunicipalities.value.filter(m => m.id_state === data.id_state);
			}
		}).finally(() => {
			isLoading.value = false;
		});

	} else if (props.data.mode === 'create') {
		alvRoute.value = `${axios.defaults.baseURL}organizations`;
		alvMethod.value = 'POST';
		Object.keys(form).forEach(key => form[key] = key === 'country' ? 'México' : '');
		municipalities.value = [];
	}
});

onMounted(loadDependents);

const afterDone = () => {
	emit('saved');
	emit('close');
};

const afterError = (res: any) => {
	console.error('Error al guardar:', res);
};
</script>

<template>
	<transition name="fade-scale">
		<div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" style="margin-top: 0px" @click.self="emit('close')">
			<div
				class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-8 relative max-h-[90vh] flex flex-col overflow-hidden"
				style="background-image: url('/images/background/bg-white-flores.png');">
				<div class="flex items-center justify-between bg-brand-900 -mx-8 -mt-8 px-8 py-4 rounded-t-2xl">
					<h4 class="text-xl font-semibold text-white">
						{{ data.mode === 'create' ? `Crear ${data.table}` : `Editar ${data.table}` }}
					</h4>

					<div class="flex items-center gap-4">
						<div
							v-if="isLoading"
							class="w-6 h-6 border-4 border-white/40 border-t-white rounded-full animate-spin" />

						<button
							class="text-white/80 hover:text-white text-2xl font-bold leading-none"
							@click="emit('close')">
							&times;
						</button>
					</div>
				</div>

				<alv-form
					id="OrganizationForm"
					:action="alvRoute"
					:method="alvMethod"
					:data-object="form"
					:input-parent-selector="'.form-error'"
					:spinner="true"
					:enable-button-on-done="true"
					class="overflow-y-auto pr-2 flex-grow"
					@after-done="afterDone"
					@after-error="afterError">

					<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 mt-5">
						<div class="form-error">
							<label class="block text-sm font-medium text-gray-700 mb-1">Nombre*</label>
							<input v-model="form.name" name="name" required class="w-full px-3 py-2 border rounded-md" />
						</div>

						<div class="form-error">
							<label class="block text-sm font-medium text-gray-700 mb-1">Tamaño*</label>
							<select v-model="form.size" name="size" required class="w-full px-3 py-2 border rounded-md">
								<option value="">Selecciona tamaño</option>
								<option value="Micro (1 a 10 trabajadores)">Micro (1 a 10 trabajadores)</option>
								<option value="Pequeña (11 a 50 trabajadores)">Pequeña (11 a 50 trabajadores)</option>
								<option value="Mediana (51 a 100 trabajadores)">Mediana (51 a 100 trabajadores)</option>
								<option value="Grande (Más de 100 trabajadores)">Grande (Más de 100 trabajadores)</option>
							</select>
						</div>

						<div class="form-error">
							<label class="block text-sm font-medium text-gray-700 mb-1">Tipo*</label>
							<select v-model="form.id_type" name="id_type" required class="w-full px-3 py-2 border rounded-md">
								<option value="">Selecciona tipo</option>
								<option v-for="type in types" :key="type.id" :value="type.id">{{ type.name }}</option>
							</select>
						</div>

						<div class="form-error">
							<label class="block text-sm font-medium text-gray-700 mb-1">Sector*</label>
							<select v-model="form.id_sector" name="id_sector" required class="w-full px-3 py-2 border rounded-md">
								<option value="">Selecciona sector</option>
								<option v-for="sector in sectors" :key="sector.id" :value="sector.id">{{ sector.name }}</option>
							</select>
						</div>

						<div class="form-error">
							<label class="block text-sm font-medium text-gray-700 mb-1">Cluster</label>
							<select v-model="form.id_cluster" name="id_cluster" class="w-full px-3 py-2 border rounded-md">
								<option value="">Selecciona cluster</option>
								<option v-for="cluster in clusters" :key="cluster.id" :value="cluster.id">{{ cluster.name }}</option>
							</select>
						</div>


						<div class="form-error">
							<label class="block text-sm font-medium text-gray-700 mb-1">Alcance*</label>
							<select v-model="form.scope" name="scope" required class="w-full px-3 py-2 border rounded-md">
								<option value="">Selecciona alcance</option>
								<option value="Municipal">Municipal</option>
								<option value="Federal">Estatal</option>
								<option value="Estatal">Federal</option>
								<option value="Internacional">Internacional</option>
							</select>
						</div>
					</div>

					<div class="border-t pt-4 mb-6">
						<h5 class="text-md font-semibold text-brand-800 mb-3">Dirección</h5>
						<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div class="form-error">
								<label class="block text-sm font-medium text-gray-700 mb-1">Calle*</label>
								<input v-model="form.street" name="street" required class="w-full px-3 py-2 border rounded-md" />
							</div>
							<div class="form-error">
								<label class="block text-sm font-medium text-gray-700 mb-1">Número Exterior*</label>
								<input v-model="form.external_number" name="external_number" required class="w-full px-3 py-2 border rounded-md" />
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">Número Interior</label>
								<input v-model="form.internal_number" name="internal_number" class="w-full px-3 py-2 border rounded-md" />
							</div>
							<div class="form-error">
								<label class="block text-sm font-medium text-gray-700 mb-1">Colonia*</label>
								<input v-model="form.neighborhood" name="neighborhood" required class="w-full px-3 py-2 border rounded-md" />
							</div>
							<div class="form-error">
								<label class="block text-sm font-medium text-gray-700 mb-1">Código Postal*</label>
								<input v-model="form.postal_code" name="postal_code" required class="w-full px-3 py-2 border rounded-md" />
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
								<input v-model="form.city" name="city" class="w-full px-3 py-2 border rounded-md" />
							</div>
						</div>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
						<div class="form-error">
							<label class="block text-sm font-medium text-gray-700 mb-1">Estado*</label>
							<select v-model="form.id_state" name="id_state" class="w-full px-3 py-2 border rounded-md">
								<option value="">Selecciona tu Estado</option>
								<option v-for="state in states" :key="state.id" :value="state.id">{{ state.name }}</option>
							</select>
						</div>
						<div class="form-error">
							<label class="block text-sm font-medium text-gray-700 mb-1">Municipio*</label>
							<select v-model="form.id_municipality" name="id_municipality" class="w-full px-3 py-2 border rounded-md">
								<option value="">Selecciona tu Municipio</option>
								<option v-for="municipalitie in municipalities" :key="municipalitie.id" :value="municipalitie.id">{{ municipalitie.name }}</option>
							</select>
						</div>
					</div>

					<div class="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 sticky bottom-0 bg-transparent z-10">
						<button type="button" class="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200" :disabled="isLoading" @click="emit('close')">
							Cancelar
						</button>
						<button form="OrganizationForm" class="px-6 py-2 rounded-lg bg-gradient-to-r from-brand-700 to-brand-900 text-white font-semibold hover:brightness-110" :disabled="isLoading">
							{{ data.mode === 'create' ? 'Crear' : 'Guardar' }}
						</button>
					</div>
				</alv-form>
			</div>
		</div>
	</transition>
</template>

<style scoped>
.fade-scale-enter-active,
.fade-scale-leave-active {
	transition: all 0.3s ease;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
	opacity: 0;
	transform: scale(0.95);
}
.fade-scale-enter-to,
.fade-scale-leave-from {
	opacity: 1;
	transform: scale(1);
}
</style>
