<template>
	<div class="bg-white rounded-xl shadow-lg overflow-hidden">
		<div class="px-6 py-4 bg-gradient-to-r from-brand-800 to-brand-900">
			<div class="flex justify-between items-center">
				<h2 class="text-xl font-bold text-white">Gestión de Clasificaciones Generales del Proyecto Dual</h2>
				<button
					class="flex items-center gap-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm transition-all"
					@click="clearFilters">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
					</svg>
					Limpiar
				</button>
			</div>
		</div>

		<div class="overflow-x-auto">
			<table class="min-w-full">
				<thead>
					<tr class="bg-brand-800/80 text-white">
						<th class="px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50">Nombre</th>
						<th class="px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50">Opciones</th>
					</tr>
					<tr class="bg-brand-800/60 text-white">
						<th class="px-5 py-2 border-b border-brand-700/50">
							<input v-model="filters.name" placeholder="Buscar..." class="w-full bg-white/10 text-white placeholder-white/60 rounded px-3 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-white/50" />
						</th>
						<th class="px-5 py-2 border-b border-brand-700/50" />
					</tr>
				</thead>
				<tbody>
					<tr v-if="isLoading">
						<td colspan="2" class="py-12 text-center">
							<svg class="animate-spin h-8 w-8 text-brand-800 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
							</svg>
							<p class="text-gray-500">Cargando áreas...</p>
						</td>
					</tr>
					<tr
						v-for="(area, index) in paginatedDualAreas"
						:key="area.id ?? index"
						class="border-b border-gray-100 hover:bg-brand-50/30 transition-colors even:bg-gray-50">
						<td class="px-5 py-3 text-sm">{{ area.name }}</td>
						<td class="px-5 py-3 text-sm">
							<div class="flex space-x-2">
								<btnEdit :table="'categoría dual'" :pk="area.id" @open="() => $emit('open', { mode: 'edit', pk: area.id, table: 'dual_areas' })" />
								<btnDelete :table="'categoría dual'" :pk="area.id ?? index" @open-confirm="(payload) => $emit('open-confirm', payload)" />
							</div>
						</td>
					</tr>
					<tr v-if="!isLoading && filteredDualAreas.length === 0">
						<td colspan="2" class="px-5 py-8 text-center text-gray-500">No se encontraron áreas registradas</td>
					</tr>
				</tbody>
			</table>
		</div>

		<div class="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
			<span class="text-xs text-gray-600">Mostrando {{ paginatedDualAreas.length }} de {{ filteredDualAreas.length }} registros</span>
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
import { ref, onMounted, computed } from 'vue';
import { getDualAreas } from '../../../services/dual_projects/dual-areas';
import btnEdit from '../../../components/buttons/btnEdit.vue';
import btnDelete from '../../../components/buttons/btnDelete.vue';

const dualAreas = ref([]);
const isLoading = ref(false);

const filters = ref({
	name: ''
});

const clearFilters = () => {
	filters.value = { name: '' };
};

const fetchDualAreas = async () => {
	isLoading.value = true;
	try {
		const res = await getDualAreas();
		dualAreas.value = res.data;
	} catch (error) {
		console.error('Error al obtener áreas:', error);
	} finally {
		isLoading.value = false;
	}
};

const filteredDualAreas = computed(() => {
	const name = filters.value.name.toLowerCase();
	return dualAreas.value.filter(area =>
		area.name.toLowerCase().includes(name)
	);
});

const rowsPerPage = ref(10);
const currentPage = ref(1);
const totalPages = computed(() => Math.ceil(filteredDualAreas.value.length / rowsPerPage.value));
const paginatedDualAreas = computed(() => {
	const start = (currentPage.value - 1) * rowsPerPage.value;
	return filteredDualAreas.value.slice(start, start + rowsPerPage.value);
});

onMounted(fetchDualAreas);
defineExpose({ fetchData: fetchDualAreas });
</script>
