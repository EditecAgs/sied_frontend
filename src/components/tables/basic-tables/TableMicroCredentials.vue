<template>
	<div class="bg-white rounded-xl shadow-lg overflow-hidden">
		<div class="px-6 py-4 bg-gradient-to-r from-brand-800 to-brand-900">
			<div class="flex justify-between items-center">
				<h2 class="text-xl font-bold text-white">Gestión de Microcredenciales</h2>
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
						<th class="px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50 border-r border-brand-700/30 w-3/12">Nombre</th>

						<th class="px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50 border-r border-brand-700/30 w-2/12">Organización</th>

						<th class="px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50 border-r border-brand-700/30 w-4/12">Descripción</th>

						<th class="px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50 border-r border-brand-700/30 w-2/12">Tipo</th>

						<th class="px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50 border-r border-brand-700/30 w-2/12">Horas</th>

						<th class="px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50 w-2/12">Opciones</th>

					</tr>
					<tr class="bg-brand-800/60 text-white">
						<th class="px-5 py-2 border-b border-brand-700/50 border-r border-brand-700/30">
							<input v-model="filters.name" class="w-full bg-white/10 border-none text-white placeholder-white/60 rounded px-3 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-white/50" placeholder="Buscar..." />
						</th>
						<th class="px-5 py-2 border-b border-brand-700/50 border-r border-brand-700/30">
							<input v-model="filters.organization" class="w-full bg-white/10 border-none text-white placeholder-white/60 rounded px-3 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-white/50" placeholder="Buscar..." />
						</th>
						<th class="px-5 py-2 border-b border-brand-700/50 border-r border-brand-700/30">
							<input v-model="filters.description" class="w-full bg-white/10 border-none text-white placeholder-white/60 rounded px-3 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-white/50" placeholder="Buscar..." />
						</th>
						<th class="px-5 py-2 border-b border-brand-700/50 border-r border-brand-700/30">
							<input v-model="filters.type" class="w-full bg-white/10 border-none text-white placeholder-white/60 rounded px-3 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-white/50" placeholder="Buscar..." />
						</th>
						<th class="px-5 py-2 border-b border-brand-700/50 border-r border-brand-700/30">
							<input v-model="filters.hours" class="w-full bg-white/10 border-none text-white placeholder-white/60 rounded px-3 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-white/50" placeholder="Buscar..." />
						</th>
						<th class="px-5 py-2 border-b border-brand-700/50" />
					</tr>
				</thead>

				<tbody>
					<tr v-if="isLoading">
						<td colspan="4" class="py-12 text-center">
							<svg class="animate-spin h-8 w-8 text-brand-800 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
							</svg>
							<p class="text-gray-500">Cargando microcredenciales...</p>
						</td>
					</tr>

					<tr
						v-for="(micro, index) in paginatedMicroCredentials"
						:key="micro.id ?? index"
						class="border-b border-gray-100 hover:bg-brand-50/30 transition-colors even:bg-gray-50">
						<td class="px-5 py-3 text-sm border-r border-gray-100 font-medium text-brand-900">
							{{ micro.name }}
						</td>
						<td class="px-5 py-3 text-sm border-r border-gray-100 text-gray-700">
							{{ micro.organization || 'N/A' }}
						</td>
						<td class="px-5 py-3 text-sm border-r border-gray-100 text-gray-500">
							{{ micro.description || 'Sin descripción' }}
						</td>
						<td class="px-5 py-3 text-sm border-r border-gray-100 text-gray-500">
							{{ micro.type == 'academic' ? 'Académico' : 'No Académico' }}	
						</td>
						<td class="px-5 py-3 text-sm border-r border-gray-100 text-gray-700">
							{{ micro.hours || 0 }}
						</td>
						<td class="px-5 py-3 text-sm">
							<div class="flex space-x-2">
								<btnEdit :table="'Microcredencial'" :pk="micro.id ?? index" @open="(data) => $emit('open', data)" />
								<btnDelete :table="'micro-credentials'" :pk="micro.id ?? index" @open-confirm="(payload) => $emit('open-confirm', payload)" />
							</div>
						</td>
					</tr>

					<tr v-if="!isLoading && filteredMicroCredentials.length === 0">
						<td colspan="4" class="px-5 py-8 text-center">
							<p class="text-gray-500">No se encontraron microcredenciales registradas</p>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<div v-if="!isLoading" class="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
			<span class="text-xs text-gray-600">
				Mostrando {{ paginatedMicroCredentials.length }} de {{ filteredMicroCredentials.length }} registros
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
import { getMicroCredentials } from '../../../services/dual_projects/micro-credentials';

const microCredentials = ref([]);
const isLoading = ref(false);

const filters = ref({
	name: '',
	organization: '',
	description: '',
	type: '',
	hours: ''
});

const rowsPerPage = ref(10);
const currentPage = ref(1);

const filteredMicroCredentials = computed(() => {
	return microCredentials.value.filter(micro => {
		return (
			micro.name.toLowerCase().includes(filters.value.name.toLowerCase()) &&
			(micro.organization || '').toLowerCase().includes(filters.value.organization.toLowerCase()) &&
			(micro.description || '').toLowerCase().includes(filters.value.description.toLowerCase()) &&
			(micro.type || '').toLowerCase().includes(filters.value.type.toLowerCase()) &&

			(filters.value.hours === '' 
				? true 
				: String(micro.hours ?? '').includes(filters.value.hours)
			)
		);
	});
});
const totalPages = computed(() => Math.ceil(filteredMicroCredentials.value.length / rowsPerPage.value));
const paginatedMicroCredentials = computed(() => {
	const start = (currentPage.value - 1) * rowsPerPage.value;
	return filteredMicroCredentials.value.slice(start, start + rowsPerPage.value);
});

watch([filteredMicroCredentials, rowsPerPage], () => {
	if (currentPage.value > totalPages.value) {
		currentPage.value = 1;
	}
});

const clearFilters = () => {
	filters.value = {
		name: '',
		organization: '',
		description: '',
		type: '',
		hours: ''
	};
	currentPage.value = 1;
};

const fetchData = () => {
	isLoading.value = true;
	getMicroCredentials()
		.then(({ data }) => {
			microCredentials.value = data;
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
