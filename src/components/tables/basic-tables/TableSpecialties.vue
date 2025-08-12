<template>
	<div class="bg-white rounded-xl shadow-lg overflow-hidden">
		<div class="px-6 py-4 bg-gradient-to-r from-brand-800 to-brand-900">
			<div class="flex justify-between items-center">
				<h2 class="text-xl font-bold text-white">Gestión de Especialidades</h2>
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
						<th class="px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50 border-r border-brand-700/30 w-4/12">Nombre Especialidad</th>
						<th class="px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50 border-r border-brand-700/30 w-4/12">Carrera</th>
						<th class="px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50 w-4/12">Institución</th>
						<th class="px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50 w-2/12">Opciones</th>
					</tr>
					<tr class="bg-brand-800/60 text-white">
						<th class="px-5 py-2 border-b border-brand-700/50 border-r border-brand-700/30">
							<input v-model="filters.name" class="w-full bg-white/10 border-none text-white placeholder-white/60 rounded px-3 py-1 text-xs focus:outline-none" placeholder="Buscar especialidad..." />
						</th>
						<th class="px-5 py-2 border-b border-brand-700/50 border-r border-brand-700/30">
							<input v-model="filters.career" class="w-full bg-white/10 border-none text-white placeholder-white/60 rounded px-3 py-1 text-xs focus:outline-none" placeholder="Buscar carrera..." />
						</th>
						<th class="px-5 py-2 border-b border-brand-700/50 border-r border-brand-700/30">
							<input v-model="filters.institution" class="w-full bg-white/10 border-none text-white placeholder-white/60 rounded px-3 py-1 text-xs focus:outline-none" placeholder="Buscar institución..." />
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
							<p class="text-gray-500">Cargando Especialidades...</p>
						</td>
					</tr>

					<tr
						v-for="(specialty, index) in paginatedSpecialties"
						:key="specialty.id ?? index"
						class="border-b border-gray-100 hover:bg-brand-50/30 transition-colors even:bg-gray-50">
						<td class="px-5 py-3 text-sm border-r border-gray-100 font-medium text-brand-900">
							{{ specialty.name }}
						</td>
						<td class="px-5 py-3 text-sm border-r border-gray-100 text-gray-700">
							{{ specialty.career_name }}
						</td>
						<td class="px-5 py-3 text-sm border-r border-gray-100 text-gray-700">
							{{ specialty.institution_name }}
						</td>
						<td class="px-5 py-3 text-sm">
							<div class="flex space-x-2">
								<btnEdit :table="'specialties'" :pk="specialty.id ?? index" @open="(data) => $emit('open', data)" />
								<btnDelete :table="'specialties'" :pk="specialty.id ?? index" @open-confirm="(payload) => $emit('open-confirm', payload)" />
							</div>
						</td>
					</tr>

					<tr v-if="!isLoading && filteredSpecialties.length === 0">
						<td colspan="4" class="px-5 py-8 text-center">
							<p class="text-gray-500">No se encontraron especialidades registradas</p>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<div v-if="!isLoading" class="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
			<span class="text-xs text-gray-600">
				Mostrando {{ paginatedSpecialties.length }} de {{ filteredSpecialties.length }} registros
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
import { getSpecialties } from '../../../services/institutions/specialties';
import { getCareers } from '../../../services/institutions/careers';
import { getInstitutions } from '../../../services/institutions/institutions';

const specialties = ref([]);
const careers = ref([]);
const institutions = ref([]);
const isLoading = ref(false);

const filters = ref({
	name: '',
	career: '',
	institution: ''
});

const rowsPerPage = ref(10);
const currentPage = ref(1);

const filteredSpecialties = computed(() => {
	return specialties.value.filter(specialty => {
		return (
			specialty.name.toLowerCase().includes(filters.value.name.toLowerCase()) &&
			specialty.career_name.toLowerCase().includes(filters.value.career.toLowerCase()) &&
			specialty.institution_name.toLowerCase().includes(filters.value.institution.toLowerCase())
		);
	});
});

const totalPages = computed(() => Math.ceil(filteredSpecialties.value.length / rowsPerPage.value));
const paginatedSpecialties = computed(() => {
	const start = (currentPage.value - 1) * rowsPerPage.value;
	return filteredSpecialties.value.slice(start, start + rowsPerPage.value);
});

watch([filteredSpecialties, rowsPerPage], () => {
	if (currentPage.value > totalPages.value) {
		currentPage.value = 1;
	}
});

const clearFilters = () => {
	filters.value = { name: '', career: '', institution: '' };
	currentPage.value = 1;
};

const fetchData = async () => {
	isLoading.value = true;
	try {
		const [
			{ data: specialtiesData },
			{ data: careersData },
			{ data: institutionsData }
		] = await Promise.all([
			getSpecialties(),
			getCareers(),
			getInstitutions()
		]);

		careers.value = careersData;
		institutions.value = institutionsData;

		specialties.value = specialtiesData.map(spec => {
			const career = careersData.find(c => c.id === spec.id_career);
			const institution = institutionsData.find(i => i.id === spec.id_institution);
			return {
				...spec,
				career_name: career ? career.name : 'N/A',
				institution_name: institution ? institution.name : 'N/A'
			};
		});
	} finally {
		isLoading.value = false;
	}
};

onMounted(() => {
	fetchData();
});

defineExpose({ fetchData });
</script>
