<template>
	<div class="bg-white rounded-xl shadow-lg overflow-hidden">
		<div class="px-6 py-4 bg-gradient-to-r from-brand-800 to-brand-900">
			<div class="flex justify-between items-center">
				<h2 class="text-xl font-bold text-white">Gestión de Organizaciones</h2>
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
						<th class="px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50">Tamaño</th>
						<th class="px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50">Dirección</th>
						<th class="px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50">País</th>
						<th class="px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50">Código Postal</th>
						<th class="px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50">Opciones</th>
					</tr>
					<tr class="bg-brand-800/60 text-white">
						<th class="px-5 py-2 border-b border-brand-700/50">
							<input v-model="filters.name" placeholder="Buscar..." class="w-full bg-white/10 text-white placeholder-white/60 rounded px-3 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-white/50" />
						</th>
						<th class="px-5 py-2 border-b border-brand-700/50">
							<input v-model="filters.size" placeholder="Buscar..." class="w-full bg-white/10 text-white placeholder-white/60 rounded px-3 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-white/50" />
						</th>
						<th class="px-5 py-2 border-b border-brand-700/50">
							<input v-model="filters.street" placeholder="Buscar..." class="w-full bg-white/10 text-white placeholder-white/60 rounded px-3 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-white/50" />
						</th>
						<th class="px-5 py-2 border-b border-brand-700/50">
							<input v-model="filters.country" placeholder="Buscar..." class="w-full bg-white/10 text-white placeholder-white/60 rounded px-3 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-white/50" />
						</th>
						<th class="px-5 py-2 border-b border-brand-700/50">
							<input v-model="filters.postal_code" placeholder="Buscar..." class="w-full bg-white/10 text-white placeholder-white/60 rounded px-3 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-white/50" />
						</th>
						<th class="px-5 py-2 border-b border-brand-700/50" />
					</tr>
				</thead>
				<tbody>
					<tr v-if="isLoading">
						<td colspan="6" class="py-12 text-center">
							<svg class="animate-spin h-8 w-8 text-brand-800 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
							</svg>
							<p class="text-gray-500">Cargando organizaciones...</p>
						</td>
					</tr>
					<tr
						v-for="(org, index) in paginatedOrganizations"
						:key="org.id ?? index"
						class="border-b border-gray-100 hover:bg-brand-50/30 transition-colors even:bg-gray-50">
						<td class="px-5 py-3 text-sm">{{ org.name }}</td>
						<td class="px-5 py-3 text-sm">{{ org.size }}</td>
						<td class="px-5 py-3 text-sm">
							{{ org.street }} {{ org.external_number }}{{ org.internal_number ? ' Int. ' + org.internal_number : '' }}, {{ org.neighborhood }}
						</td>
						<td class="px-5 py-3 text-sm">{{ org.country }}</td>
						<td class="px-5 py-3 text-sm">{{ org.postal_code }}</td>
						<td class="px-5 py-3 text-sm">
							<div class="flex space-x-2">
								<btnEdit :table="'Organización'" :pk="org.id" @open="() => $emit('open', { mode: 'edit', pk: org.id, table: 'organizaciones' })" />
								<btnDelete :table="'organizations'" :pk="org.id ?? index" @open-confirm="(payload) => $emit('open-confirm', payload)" />
							</div>
						</td>
					</tr>
					<tr v-if="!isLoading && filteredOrganizations.length === 0">
						<td colspan="6" class="px-5 py-8 text-center text-gray-500">No se encontraron organizaciones registradas</td>
					</tr>
				</tbody>
			</table>
		</div>

		<div class="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
			<span class="text-xs text-gray-600">Mostrando {{ paginatedOrganizations.length }} de {{ filteredOrganizations.length }} registros</span>
			<div class="flex items-center space-x-2">
				<select v-model="rowsPerPage" class="text-xs border border-gray-300 rounded px-2 py-1 text-gray-700">
					<option value="10">10 por página</option>
					<option value="25">25 por página</option>
					<option value="50">50 por página</option>
				</select>
				<button :disabled="currentPage === 1" @click="currentPage--" class="p-1 rounded-full text-brand-800 hover:bg-brand-100 disabled:opacity-30">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
					</svg>
				</button>
				<button :disabled="currentPage === totalPages" @click="currentPage++" class="p-1 rounded-full text-brand-800 hover:bg-brand-100 disabled:opacity-30">
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
import { getOrganizations } from '../../../services/organizations/organizations.js';
import btnEdit from '../../../components/buttons/btnEdit.vue';
import btnDelete from '../../../components/buttons/btnDelete.vue';

const organizations = ref([]);
const isLoading = ref(false);

const filters = ref({
	name: '',
	size: '',
	street: '',
	country: '',
	postal_code: ''
});

const clearFilters = () => {
	filters.value = {
		name: '',
		size: '',
		street: '',
		country: '',
		postal_code: ''
	};
};

const fetchOrganizations = async () => {
	isLoading.value = true;
	try {
		const res = await getOrganizations();
		organizations.value = res.data;
	} catch (error) {
		console.error('Error al obtener organizaciones:', error);
	} finally {
		isLoading.value = false;
	}
};

const filteredOrganizations = computed(() => {
	const name = filters.value.name.toLowerCase();
	const size = filters.value.size.toLowerCase();
	const street = filters.value.street.toLowerCase();
	const country = filters.value.country.toLowerCase();
	const postal = filters.value.postal_code.toLowerCase();

	return organizations.value.filter(org =>
		org.name.toLowerCase().includes(name) &&
		org.size.toLowerCase().includes(size) &&
		org.street.toLowerCase().includes(street) &&
		org.country.toLowerCase().includes(country) &&
		org.postal_code.toLowerCase().includes(postal)
	);
});

const rowsPerPage = ref(10);
const currentPage = ref(1);
const totalPages = computed(() => Math.ceil(filteredOrganizations.value.length / rowsPerPage.value));
const paginatedOrganizations = computed(() => {
	const start = (currentPage.value - 1) * rowsPerPage.value;
	return filteredOrganizations.value.slice(start, start + rowsPerPage.value);
});

onMounted(fetchOrganizations);
defineExpose({ fetchData: fetchOrganizations });
</script>
