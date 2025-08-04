<template>
	<div class="bg-white rounded-xl shadow-lg overflow-hidden">
		<div class="px-6 py-4 bg-gradient-to-r from-brand-800 to-brand-900">
			<div class="flex justify-between items-center">
				<h2 class="text-xl font-bold text-white">Gestión de Instituciones</h2>
				<button
					class="flex items-center gap-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm transition-all"
					@click="clearFilters">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
					</svg>
					Limpiar Filtros
				</button>
			</div>
		</div>

		<div class="overflow-x-auto">
			<table class="min-w-full">
				<thead>
				<tr class="bg-brand-800/80 text-white">
					<th class="px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50 border-r border-brand-700/30 w-2/12">Nombre</th>
					<th class="px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50 border-r border-brand-700/30 w-2/12">Dirección</th>
					<th class="px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50 border-r border-brand-700/30 w-1/12">Tipo</th>
					<th class="px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50 border-r border-brand-700/30 w-1/12">Subsistema</th>
					<th class="px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50 border-r border-brand-700/30 w-2/12">Ciudad/Estado</th>
					<th class="px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50 border-r border-brand-700/30 w-1/12">Código Postal</th>
					<th class="px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50 w-2/12">Opciones</th>
				</tr>
				<tr class="bg-brand-800/60 text-white">
					<th class="px-5 py-2 border-b border-brand-700/50 border-r border-brand-700/30">
						<input v-model="filters.name" class="w-full bg-white/10 border-none text-white placeholder-white/60 rounded px-3 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-white/50" placeholder="Buscar..." />
					</th>
					<th class="px-5 py-2 border-b border-brand-700/50 border-r border-brand-700/30">
						<input v-model="filters.address" class="w-full bg-white/10 border-none text-white placeholder-white/60 rounded px-3 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-white/50" placeholder="Buscar..." />
					</th>
					<th class="px-5 py-2 border-b border-brand-700/50 border-r border-brand-700/30">
						<div class="relative">
							<select v-model="filters.type" class="w-full bg-white/10 border-none text-white rounded px-3 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-white/50 appearance-none">
								<option value="">Todos</option>
								<option value="Pública" class="text-gray-900">Pública</option>
								<option value="Privada" class="text-gray-900">Privada</option>
								<option value="Mixta" class="text-gray-900">Mixta</option>
							</select>
							<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
								<svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
									<path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
								</svg>
							</div>
						</div>
					</th>
					<th class="px-5 py-2 border-b border-brand-700/50 border-r border-brand-700/30">
						<input v-model="filters.subsystem" class="w-full bg-white/10 border-none text-white placeholder-white/60 rounded px-3 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-white/50" placeholder="Buscar..." />
					</th>
					<th class="px-5 py-2 border-b border-brand-700/50 border-r border-brand-700/30">
						<input v-model="filters.location" class="w-full bg-white/10 border-none text-white placeholder-white/60 rounded px-3 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-white/50" placeholder="Buscar..." />
					</th>
					<th class="px-5 py-2 border-b border-brand-700/50 border-r border-brand-700/30">
						<input v-model="filters.postal_code" class="w-full bg-white/10 border-none text-white placeholder-white/60 rounded px-3 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-white/50" placeholder="Buscar..." />
					</th>
					<th class="px-5 py-2 border-b border-brand-700/50" />
				</tr>
				</thead>

				<tbody>
				<tr v-if="isLoading">
					<td colspan="7" class="py-12 text-center">
						<svg class="animate-spin h-8 w-8 text-brand-800 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
						</svg>
						<p class="text-gray-500">Cargando Instituciones...</p>
					</td>
				</tr>

				<tr
					v-for="(institution, index) in paginatedInstitutions"
					:key="institution.id ?? index"
					class="border-b border-gray-100 hover:bg-brand-50/30 transition-colors even:bg-gray-50">
					<td class="px-5 py-3 text-sm border-r border-gray-100 font-medium text-brand-900">
						{{ institution.name }}
					</td>
					<td class="px-5 py-3 text-sm border-r border-gray-100">
						<p class="text-gray-700">
							{{ institution.street }} {{ institution.external_number }}
							{{ institution.internal_number ? `Int. ${institution.internal_number}` : '' }}
						</p>
						<p class="text-gray-500 text-xs mt-1">{{ institution.neighborhood }}</p>
					</td>
					<td class="px-5 py-3 text-sm border-r border-gray-100">
							<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="getTypeClass(institution.type)">
								{{ institution.type || 'N/A' }}
							</span>
					</td>
					<td class="px-5 py-3 text-sm border-r border-gray-100 text-gray-500">
						{{ institution.subsystem?.name || 'N/A' }}
					</td>
					<td class="px-5 py-3 text-sm border-r border-gray-100 text-gray-700">
						{{ institution.city }}, {{ institution.state?.name }}
					</td>
					<td class="px-5 py-3 text-sm border-r border-gray-100 text-gray-500">
						{{ institution.postal_code }}
					</td>
					<td class="px-5 py-3 text-sm">
						<div class="flex space-x-2">
							<btnEdit :table="'institutions'" :pk="institution.id ?? index" @open="(data) => $emit('open', data)" />
							<btnDelete :table="'institutions'" :pk="institution.id ?? index" @open-confirm="(payload) => $emit('open-confirm', payload)" />
						</div>
					</td>
				</tr>

				<tr v-if="!isLoading && filteredInstitutions.length === 0">
					<td colspan="7" class="px-5 py-8 text-center">
						<p class="text-gray-500">No se encontraron instituciones registradas</p>
					</td>
				</tr>
				</tbody>
			</table>
		</div>

		<div v-if="!isLoading" class="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
			<span class="text-xs text-gray-600">
				Mostrando {{ paginatedInstitutions.length }} de {{ filteredInstitutions.length }} registros
			</span>
			<div class="flex items-center space-x-2">
				<select v-model="rowsPerPage" class="text-xs border border-gray-300 rounded px-2 py-1 text-gray-700">
					<option value="10">10 por página</option>
					<option value="25">25 por página</option>
					<option value="50">50 por página</option>
				</select>
				<button :disabled="currentPage === 1" class="p-1 rounded-full text-brand-800 hover:bg-brand-100 disabled:opacity-30" @click="currentPage--">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
					</svg>
				</button>
				<button :disabled="currentPage === totalPages" class="p-1 rounded-full text-brand-800 hover:bg-brand-100 disabled:opacity-30" @click="currentPage++">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
					</svg>
				</button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import btnEdit from "../../../components/buttons/btnEdit.vue";
import btnDelete from "../../../components/buttons/btnDelete.vue";
import { getInstitutions } from '../../../services/institutions/institutions';

const institutions = ref([]);
const isLoading = ref(false);

const filters = ref({
	name: '',
	address: '',
	type: '',
	subsystem: '',
	location: '',
	postal_code: ''
});

const rowsPerPage = ref(10);
const currentPage = ref(1);

const institutionTypes = {
	'Pública': 'bg-blue-100 text-blue-800',
	'Privada': 'bg-purple-100 text-purple-800',
	'Mixta': 'bg-green-100 text-green-800'
};

const filteredInstitutions = computed(() => {
	return institutions.value.filter(inst => {
		return (
			inst.name.toLowerCase().includes(filters.value.name.toLowerCase()) &&
			`${inst.street} ${inst.external_number} ${inst.internal_number || ''} ${inst.neighborhood || ''}`.toLowerCase()
				.includes(filters.value.address.toLowerCase()) &&
			(filters.value.type === '' || inst.type === filters.value.type) &&
			(inst.subsystem?.name.toLowerCase().includes(filters.value.subsystem.toLowerCase()) || filters.value.subsystem === '') &&
			`${inst.city || ''} ${inst.state?.name || ''}`.toLowerCase().includes(filters.value.location.toLowerCase()) &&
			inst.postal_code.toString().includes(filters.value.postal_code)
		);
	});
});

const totalPages = computed(() => Math.ceil(filteredInstitutions.value.length / rowsPerPage.value));
const paginatedInstitutions = computed(() => {
	const start = (currentPage.value - 1) * rowsPerPage.value;
	return filteredInstitutions.value.slice(start, start + rowsPerPage.value);
});

watch([filteredInstitutions, rowsPerPage], () => {
	if (currentPage.value > totalPages.value) {
		currentPage.value = 1;
	}
});

const getTypeClass = (type) => {
	return institutionTypes[type] || 'bg-gray-100 text-gray-800';
};

const clearFilters = () => {
	filters.value = {
		name: '',
		address: '',
		type: '',
		subsystem: '',
		location: '',
		postal_code: ''
	};
	currentPage.value = 1;
};

const fetchData = () => {
	isLoading.value = true;
	getInstitutions()
		.then(({ data }) => {
			institutions.value = data;
		})
		.finally(() => {
			isLoading.value = false;
		});
};

onMounted(() => {
	fetchData();
});

defineExpose({
	fetchData: fetchData,
});
</script>
