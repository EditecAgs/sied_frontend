<template>
	<div class="bg-white rounded-xl shadow-lg overflow-hidden">
		<div class="px-6 py-4 bg-gradient-to-r from-brand-800 to-brand-900">
			<div class="flex justify-between items-center">
				<h2 class="text-xl font-bold text-white">Gestión de Estudiantes</h2>
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
						<th class="px-5 py-3 text-left text-sm font-semibold">No. Control</th>
						<th class="px-5 py-3 text-left text-sm font-semibold">Nombre</th>
						<th class="px-5 py-3 text-left text-sm font-semibold">Apellidos</th>
						<th class="px-5 py-3 text-left text-sm font-semibold">Semestre</th>
						<th class="px-5 py-3 text-left text-sm font-semibold">Institución</th>
						<th class="px-5 py-3 text-left text-sm font-semibold">Carrera</th>
						<th class="px-5 py-3 text-left text-sm font-semibold">Especialidad</th>
						<th class="px-5 py-3 text-left text-sm font-semibold">Género</th>
						<th class="px-5 py-3 text-left text-sm font-semibold">Opciones</th>
					</tr>
					<tr class="bg-brand-800/60 text-white">
						<th class="px-5 py-2">
							<input v-model="filters.control_number" class="w-full bg-white/10 border-none text-white placeholder-white/60 rounded px-3 py-1 text-xs focus:outline-none" placeholder="Buscar No. Control..." />
						</th>
						<th class="px-5 py-2">
							<input v-model="filters.name" class="w-full bg-white/10 border-none text-white placeholder-white/60 rounded px-3 py-1 text-xs focus:outline-none" placeholder="Buscar nombre..." />
						</th>
						<th class="px-5 py-2">
							<input v-model="filters.lastname" class="w-full bg-white/10 border-none text-white placeholder-white/60 rounded px-3 py-1 text-xs focus:outline-none" placeholder="Buscar apellidos..." />
						</th>
						<th class="px-5 py-2">
							<input v-model="filters.semester" type="number" min="1" class="w-full bg-white/10 border-none text-white placeholder-white/60 rounded px-3 py-1 text-xs focus:outline-none" placeholder="Semestre..." />
						</th>
						<th class="px-5 py-2">
							<input v-model="filters.institution" class="w-full bg-white/10 border-none text-white placeholder-white/60 rounded px-3 py-1 text-xs focus:outline-none" placeholder="Buscar institución..." />
						</th>
						<th class="px-5 py-2">
							<input v-model="filters.career" class="w-full bg-white/10 border-none text-white placeholder-white/60 rounded px-3 py-1 text-xs focus:outline-none" placeholder="Buscar carrera..." />
						</th>
						<th class="px-5 py-2">
							<input v-model="filters.specialty" class="w-full bg-white/10 border-none text-white placeholder-white/60 rounded px-3 py-1 text-xs focus:outline-none" placeholder="Buscar especialidad..." />
						</th>
						<th class="px-5 py-2">
							<select v-model="filters.gender" class="w-full bg-white/10 border-none text-white rounded px-3 py-1 text-xs focus:outline-none">
								<option style="color: black" value="">Todos</option>
								<option style="color: black" value="Masculino">Masculino</option>
								<option style="color: black" value="Femenino">Femenino</option>
								<option style="color: black" value="Otro">Otro</option>
							</select>
						</th>
						<th />
					</tr>
				</thead>

				<tbody>
					<tr v-if="isLoading">
						<td colspan="9" class="py-12 text-center">
							<svg class="animate-spin h-8 w-8 text-brand-800 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
							</svg>
							<p class="text-gray-500">Cargando estudiantes...</p>
						</td>
					</tr>

					<tr v-for="(student, index) in paginatedStudents" :key="student.id ?? index" class="border-b border-gray-100 hover:bg-brand-50/30 transition-colors even:bg-gray-50">
						<td class="px-5 py-3 text-sm">{{ student.control_number }}</td>
						<td class="px-5 py-3 text-sm">{{ student.name }}</td>
						<td class="px-5 py-3 text-sm">{{ student.lastname }}</td>
						<td class="px-5 py-3 text-sm">{{ student.semester }}</td>
						<td class="px-5 py-3 text-sm">{{ student.institution?.name }}</td>
						<td class="px-5 py-3 text-sm">{{ student.career?.name }}</td>
						<td class="px-5 py-3 text-sm">{{ student.specialty?.name }}</td>
						<td class="px-5 py-3 text-sm">{{ student.gender }}</td>
						<td class="px-5 py-3 text-sm">
							<div class="flex space-x-2">
								<btnEdit :table="'Estudiante'" :pk="student.id ?? index" @open="(data) => $emit('open', data)" />
								<btnDelete :table="'students'" :pk="student.id ?? index" @open-confirm="(payload) => $emit('open-confirm', payload)" />
							</div>
						</td>
					</tr>

					<tr v-if="!isLoading && filteredStudents.length === 0">
						<td colspan="9" class="px-5 py-8 text-center">
							<p class="text-gray-500">No se encontraron estudiantes registrados</p>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<div v-if="!isLoading" class="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
			<span class="text-xs text-gray-600">
				Mostrando {{ paginatedStudents.length }} de {{ filteredStudents.length }} registros
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
import { getStudents } from '../../../services/dual_projects/students';

const students = ref([]);
const isLoading = ref(false);

const filters = ref({
	control_number: '',
	name: '',
	lastname: '',
	semester: '',
	institution: '',
	career: '',
	specialty: '',
	gender: ''
});

const rowsPerPage = ref(10);
const currentPage = ref(1);

const filteredStudents = computed(() => {
	return students.value.filter(student => {
		return (
			(student.control_number || '').toLowerCase().includes(filters.value.control_number.toLowerCase()) &&
			(student.name || '').toLowerCase().includes(filters.value.name.toLowerCase()) &&
			(student.lastname || '').toLowerCase().includes(filters.value.lastname.toLowerCase()) &&
			(filters.value.semester === '' || String(student.semester) === String(filters.value.semester)) &&
			(student.institution?.name || '').toLowerCase().includes(filters.value.institution.toLowerCase()) &&
			(student.career?.name || '').toLowerCase().includes(filters.value.career.toLowerCase()) &&
			(student.specialty?.name || '').toLowerCase().includes(filters.value.specialty.toLowerCase()) &&
			(filters.value.gender === '' || student.gender === filters.value.gender)
		);
	});
});

const totalPages = computed(() => Math.ceil(filteredStudents.value.length / rowsPerPage.value));
const paginatedStudents = computed(() => {
	const start = (currentPage.value - 1) * rowsPerPage.value;
	return filteredStudents.value.slice(start, start + rowsPerPage.value);
});

watch([filteredStudents, rowsPerPage], () => {
	if (currentPage.value > totalPages.value) {
		currentPage.value = 1;
	}
});

const clearFilters = () => {
	filters.value = {
		control_number: '',
		name: '',
		lastname: '',
		semester: '',
		institution: '',
		career: '',
		specialty: '',
		gender: ''
	};
	currentPage.value = 1;
};

const fetchData = () => {
	isLoading.value = true;
	getStudents()
		.then(({ data }) => {
			students.value = data;
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