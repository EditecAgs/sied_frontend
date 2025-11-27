<template>
	<div class="bg-white rounded-xl shadow-lg overflow-hidden">
		<div class="px-6 py-4 bg-gradient-to-r from-brand-800 to-brand-900">
			<div class="flex justify-between items-center">
				<h2 class="text-xl font-bold text-white">Gestión de Proyectos Duales</h2>
				<div class="flex items-center gap-2">
					<!-- Botón para mostrar/ocultar selector de columnas -->
					<button
						class="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm transition-all border border-white/20"
						@click="showColumnSelector = !showColumnSelector">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
						</svg>
						Columnas
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-3 w-3 transition-transform duration-200"
							:class="{ 'rotate-180': showColumnSelector }"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
						</svg>
					</button>
					<button
						class="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm transition-all border border-white/20"
						@click="clearFilters">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
						</svg>
						Limpiar Filtros
					</button>
				</div>
			</div>
		</div>
		
		<div v-if="showColumnSelector" class="px-6 py-4 bg-gradient-to-r from-brand-700/90 to-brand-800/90 border-b border-brand-600/50">
			<div class="mb-3">
				<h3 class="text-sm font-semibold text-white/90 mb-2 flex items-center gap-2">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
					</svg>
					Seleccionar Columnas Visibles
				</h3>
				<p class="text-xs text-white/70">Selecciona las columnas que deseas mostrar en la tabla</p>
			</div>

			<div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-4">
				<div
					v-for="column in availableColumns"
					:key="column.key"
					class="flex items-center p-2 bg-white/10 rounded-lg border border-white/20 hover:bg-white/15 transition-colors"
					:class="{ 'bg-white/20 border-white/30': visibleColumns.includes(column.key) }">
					<label class="flex items-center space-x-2 cursor-pointer w-full">
						<input
							type="checkbox"
							:checked="visibleColumns.includes(column.key)"
							class="rounded border-white/30 bg-white/10 text-brand-800 focus:ring-brand-800 focus:ring-2 focus:ring-offset-1 focus:ring-offset-brand-800"
							@change="toggleColumn(column.key)" />
						<span class="text-sm text-white font-medium">{{ column.label }}</span>
					</label>
				</div>
			</div>

			<div class="flex items-center justify-between pt-2 border-t border-white/20">
				<div class="flex items-center space-x-2">
					<button
						class="flex items-center gap-1 px-3 py-1 text-xs bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors border border-white/30"
						@click="showAllColumns">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
						</svg>
						Mostrar Todas
					</button>
					<button
						class="flex items-center gap-1 px-3 py-1 text-xs bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors border border-white/20"
						@click="hideAllColumns">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
						</svg>
						Ocultar Todas
					</button>
				</div>
				<div class="flex items-center space-x-2">
					<span class="text-xs text-white/70 bg-white/10 px-2 py-1 rounded border border-white/20">
						{{ visibleColumns.length }} de {{ availableColumns.length }} columnas visibles
					</span>
				</div>
			</div>
		</div>

		<div class="overflow-x-auto custom-scrollbar">
			<div class="min-w-max">
				<table class="w-full">
					<thead>
						<tr class="bg-gradient-to-r from-brand-800 to-brand-900 text-white">
							<!-- Columnas dinámicas -->
							<th
								v-for="column in visibleHeaderColumns"
								:key="column.key"
								:class="[
									'px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50 border-r border-brand-700/30 whitespace-nowrap',
									{ 'border-r-0': column.key === 'options' }
								]">
								{{ column.label }}
							</th>
						</tr>

						<tr class="bg-gradient-to-r from-brand-700/80 to-brand-800/80 text-white">
							<!-- Filtros dinámicos -->
							<th
								v-for="column in visibleHeaderColumns"
								:key="column.key"
								:class="[
									'px-5 py-2 border-b border-brand-700/50 border-r border-brand-700/30',
									{ 'border-r-0': column.key === 'options' }
								]">
								<input
									v-if="column.filterable"
									v-model="filters[column.key]"
									:placeholder="`Filtrar...`"
									class="w-full bg-white/10 border-none text-white rounded px-3 py-1 text-xs placeholder-white/70 focus:bg-white/20 focus:ring-1 focus:ring-white/50 transition-all" />
								<span v-else class="inline-block w-full h-8" />
							</th>
						</tr>
					</thead>

					<tbody>
						<tr v-if="isLoading">
							<td :colspan="visibleHeaderColumns.length" class="py-12 text-center">
								<svg class="animate-spin h-8 w-8 text-brand-800 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
									<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
									<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
								</svg>
								<p class="text-gray-500">Cargando Proyectos Duales...</p>
							</td>
						</tr>

						<tr
							v-for="(project, index) in paginatedProjects"
							:key="project.id ?? index"
							class="border-b border-gray-100 hover:bg-brand-50/30 transition-colors even:bg-gray-50">
							<!-- Columna: Estatus -->
							<td v-if="isColumnVisible('status')" class="px-5 py-3 text-sm border-r border-gray-100 whitespace-nowrap">
								<span
									:class="[
										'font-semibold px-2 py-1 rounded-full text-xs',
										project.has_report
											? 'bg-green-100 text-green-800 border border-green-200'
											: 'bg-yellow-100 text-yellow-800 border border-yellow-200'
									]">
									{{ project.has_report ? 'Completado' : 'Incompleto' }}
								</span>
							</td>

							<!-- Columna: Estudiantes -->
							<td v-if="isColumnVisible('students')" class="px-5 py-3 text-sm border-r border-gray-100 whitespace-nowrap">
								<template v-if="project.student_name && project.student_name.trim() !== ''">
									<button
										class="px-3 py-1 bg-gradient-to-r from-brand-800 to-brand-900 text-white rounded-lg hover:from-brand-700 hover:to-brand-800 transition-all text-xs font-medium shadow-sm"
										title="Ver estudiantes"
										@click="openStudentModal(project)">
										Ver estudiantes
									</button>
								</template>
								<template v-else>
									<span class="text-gray-500 font-medium text-center">Sin estudiantes</span>
								</template>
							</td>

							<!-- Datos Institución -->
							<td v-if="isColumnVisible('institution_name')" class="px-5 py-3 text-sm border-r border-gray-100 whitespace-nowrap">{{ project.institution_name }}</td>
							<td v-if="isColumnVisible('institution_state')" class="px-5 py-3 text-sm border-r border-gray-100 whitespace-nowrap">{{ project.institution_state }}</td>
							<td v-if="isColumnVisible('institution_city')" class="px-5 py-3 text-sm border-r border-gray-100 whitespace-nowrap">{{ project.institution_city }}</td>

							<!-- Datos Organización -->
							<td v-if="isColumnVisible('organization_name')" class="px-5 py-3 text-sm border-r border-gray-100 whitespace-nowrap">{{ project.organization_name }}</td>
							<td v-if="isColumnVisible('organization_state')" class="px-5 py-3 text-sm border-r border-gray-100 whitespace-nowrap">{{ project.organization_state }}</td>
							<td v-if="isColumnVisible('organization_city')" class="px-5 py-3 text-sm border-r border-gray-100 whitespace-nowrap">{{ project.organization_city }}</td>
							<td v-if="isColumnVisible('organization_sector')" class="px-5 py-3 text-sm border-r border-gray-100 whitespace-nowrap">{{ project.organization_sector }}</td>
							<td v-if="isColumnVisible('organization_type')" class="px-5 py-3 text-sm border-r border-gray-100 whitespace-nowrap">{{ project.organization_type }}</td>

							<!-- Datos Proyecto -->
							<td v-if="isColumnVisible('education_type')" class="px-5 py-3 text-sm border-r border-gray-100 whitespace-nowrap">{{ project.education_type }}</td>
							<td v-if="isColumnVisible('project_name')" class="px-5 py-3 text-sm border-r border-gray-100 whitespace-nowrap">{{ project.project_name }}</td>
							<td v-if="isColumnVisible('agreement')" class="px-5 py-3 text-sm border-r border-gray-100 whitespace-nowrap">
								<span :class="getAgreementClass(project.agreement)">
									{{ project.agreement }}
								</span>
							</td>
							<td v-if="isColumnVisible('project_status')" class="px-5 py-3 text-sm border-r border-gray-100 whitespace-nowrap">
								<span :class="getStatusClass(project.project_status)">
									{{ project.project_status }}
								</span>
							</td>
							<td v-if="isColumnVisible('grade')" class="px-5 py-3 text-sm border-r border-gray-100 whitespace-nowrap">
								<span :class="getGradeClass(project.grade)">
									{{ project.grade }}
								</span>
							</td>
							<td v-if="isColumnVisible('certifications')" class="px-5 py-3 text-sm border-r border-gray-100 whitespace-nowrap">
								<template v-if="project.certifications && project.certifications.length > 0">
									<button
										class="px-3 py-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded text-xs hover:from-blue-500 hover:to-blue-600 transition-all shadow-sm"
										@click="openCertificationsModal(project)">
										Ver ({{ project.certifications.length }})
									</button>
								</template>
								<template v-else>
									<span class="text-gray-500 text-xs">Sin certificaciones</span>
								</template>
							</td>
							<td v-if="isColumnVisible('area')" class="px-5 py-3 text-sm border-r border-gray-100 whitespace-nowrap">{{ project.area }}</td>

							<!-- Columna: Opciones -->
							<td v-if="isColumnVisible('options')" class="px-5 py-3 text-sm whitespace-nowrap">
								<div class="flex space-x-2">
									<template v-if="project.has_report">
										<btnEdit
											:table="'dual_projects'" :pk="project.id"
											@open="() => $emit('open', { mode: 'edit', pk: project.id, table: 'modelo dual' })" />
									</template>
									<template v-else>
										<button
											class="text-xs font-medium text-brand-800 hover:text-brand-900 underline underline-offset-2 transition-colors"
											@click="$emit('open', { mode: 'complete', pk: project.id, table: 'modelo dual' })">
											Completar
										</button>
									</template>
									<btnDelete
										:table="'dual_projects'"
										:pk="project.id ?? index"
										@open-confirm="(payload) => $emit('open-confirm', payload)" />
								</div>
							</td>
						</tr>

						<tr v-if="!isLoading && filteredProjects.length === 0">
							<td :colspan="visibleHeaderColumns.length" class="px-5 py-8 text-center text-gray-500">
								<div class="flex flex-col items-center justify-center">
									<svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
									<p class="text-gray-500 font-medium">No se encontraron proyectos duales registrados.</p>
									<p class="text-gray-400 text-sm mt-1">Intenta ajustar los filtros o verificar los datos.</p>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>

		<div class="px-6 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 flex justify-between items-center">
			<span class="text-xs text-gray-600 font-medium">Mostrando {{ paginatedProjects.length }} de {{ filteredProjects.length }} registros</span>
			<span class="text-xs text-gray-500 bg-white px-2 py-1 rounded border border-gray-200">
				{{ visibleHeaderColumns.length }} columnas visibles
			</span>
		</div>
	</div>

	<div v-if="showStudentModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
		<div class="bg-white rounded-xl p-6 w-3/4 max-w-4xl shadow-xl overflow-x-auto max-h-[80vh]">
			<h3 class="text-lg font-bold mb-3">Datos de los Estudiantes</h3>
			<div class="overflow-x-auto">
				<table class="min-w-full">
					<thead>
						<tr class="bg-gradient-to-r from-brand-800 to-brand-900 text-white">
							<th class="px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50 border-r border-brand-700/30">Nombre</th>
							<th class="px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50 border-r border-brand-700/30">Carrera</th>
							<th class="px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50">Especialidad</th>
						</tr>
						<tr class="bg-gradient-to-r from-brand-700/80 to-brand-800/80 text-white">
							<th class="px-5 py-2 border-b border-brand-700/50 border-r border-brand-700/30">
								<input
									v-model="studentFilters.name" placeholder="Filtrar por nombre"
									class="w-full bg-white/10 border-none text-white rounded px-3 py-1 text-xs placeholder-white/70 focus:bg-white/20 focus:ring-1 focus:ring-white/50 transition-all" />
							</th>
							<th class="px-5 py-2 border-b border-brand-700/50 border-r border-brand-700/30">
								<input
									v-model="studentFilters.career" placeholder="Filtrar por carrera"
									class="w-full bg-white/10 border-none text-white rounded px-3 py-1 text-xs placeholder-white/70 focus:bg-white/20 focus:ring-1 focus:ring-white/50 transition-all" />
							</th>
							<th class="px-5 py-2 border-b border-brand-700/50">
								<input
									v-model="studentFilters.specialty" placeholder="Filtrar por especialidad"
									class="w-full bg-white/10 border-none text-white rounded px-3 py-1 text-xs placeholder-white/70 focus:bg-white/20 focus:ring-1 focus:ring-white/50 transition-all" />
							</th>
						</tr>
					</thead>
					<tbody>
						<tr
							v-for="(stud, i) in filteredStudents" :key="i"
							class="border-b border-gray-100 hover:bg-brand-50/30 transition-colors even:bg-gray-50">
							<td class="px-5 py-3 text-sm border-r border-gray-100">{{ stud.name }}</td>
							<td class="px-5 py-3 text-sm border-r border-gray-100">{{ stud.career }}</td>
							<td class="px-5 py-3 text-sm">{{ stud.specialty }}</td>
						</tr>
						<tr v-if="filteredStudents.length === 0">
							<td colspan="3" class="px-5 py-8 text-center text-gray-500">
								<div class="flex flex-col items-center justify-center">
									<svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
									</svg>
									<p class="text-gray-500">No se encontraron alumnos.</p>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<button class="mt-4 px-4 py-2 bg-gradient-to-r from-brand-800 to-brand-900 text-white rounded-lg hover:from-brand-700 hover:to-brand-800 transition-all shadow-sm" @click="showStudentModal = false">
				Cerrar
			</button>
		</div>
	</div>

	<!-- Modal de Certificaciones -->
	<div v-if="showCertificationsModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
		<div class="bg-white rounded-xl p-6 w-1/2 max-w-2xl shadow-xl">
			<h3 class="text-lg font-bold mb-3">Certificaciones y Microcredenciales</h3>
			<div class="space-y-2 max-h-96 overflow-y-auto">
				<div
					v-for="(cert, index) in selectedCertifications"
					:key="index"
					class="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
					<h4 class="font-semibold text-brand-800">{{ cert.name }}</h4>
					<p class="text-sm text-gray-600">{{ cert.type }}</p>
					<p class="text-xs text-gray-500">Emitido: {{ cert.issue_date }}</p>
				</div>
			</div>
			<button class="mt-4 px-4 py-2 bg-gradient-to-r from-brand-800 to-brand-900 text-white rounded-lg hover:from-brand-700 hover:to-brand-800 transition-all shadow-sm" @click="showCertificationsModal = false">
				Cerrar
			</button>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import btnEdit from '../../../components/buttons/btnEdit.vue';
import btnDelete from '../../../components/buttons/btnDelete.vue';
import { getReportedDualProjects, getUnreportedDualProjects } from '../../../services/dual_projects/dual_projects';

// Estado para mostrar/ocultar columnas
const showColumnSelector = ref(false);
const visibleColumns = ref([
	'status', 'students', 'institution_name', 'organization_name',
	'project_name', 'agreement', 'project_status', 'options'
]);

// Definición de todas las columnas disponibles
const availableColumns = [
	{ key: 'status', label: 'Estatus', filterable: true },
	{ key: 'students', label: 'Estudiantes', filterable: true },
	{ key: 'institution_name', label: 'Institución', filterable: true },
	{ key: 'institution_state', label: 'Estado Institución', filterable: true },
	{ key: 'institution_city', label: 'Ciudad Institución', filterable: true },
	{ key: 'organization_name', label: 'Organización', filterable: true },
	{ key: 'organization_state', label: 'Estado Organización', filterable: true },
	{ key: 'organization_city', label: 'Ciudad Organización', filterable: true },
	{ key: 'organization_sector', label: 'Sector Organización', filterable: true },
	{ key: 'organization_type', label: 'Tipo Organización', filterable: true },
	{ key: 'education_type', label: 'Tipo Educación Dual', filterable: true },
	{ key: 'project_name', label: 'Nombre Proyecto', filterable: true },
	{ key: 'agreement', label: 'Convenio', filterable: true },
	{ key: 'project_status', label: 'Estatus Proyecto', filterable: true },
	{ key: 'grade', label: 'Calificación', filterable: true },
	{ key: 'certifications', label: 'Certificaciones', filterable: true },
	{ key: 'area', label: 'Clasificación General', filterable: true },
	{ key: 'options', label: 'Opciones', filterable: false }
];

// Funciones para manejar columnas
const toggleColumn = (columnKey) => {
	const index = visibleColumns.value.indexOf(columnKey);
	if (index > -1) {
		visibleColumns.value.splice(index, 1);
	} else {
		visibleColumns.value.push(columnKey);
	}
};

const showAllColumns = () => {
	visibleColumns.value = availableColumns.map(col => col.key);
};

const hideAllColumns = () => {
	visibleColumns.value = ['status', 'students', 'options']; // Columnas mínimas
};

const isColumnVisible = (columnKey) => {
	return visibleColumns.value.includes(columnKey);
};

// Columnas del header filtradas por visibilidad
const visibleHeaderColumns = computed(() => {
	return availableColumns.filter(col => visibleColumns.value.includes(col.key));
});

const dualProjects = ref([]);
const isLoading = ref(false);
const showStudentModal = ref(false);
const showCertificationsModal = ref(false);
const selectedStudents = ref([]);
const selectedCertifications = ref([]);

const openStudentModal = (project) => {
	selectedStudents.value = project.student_name
		.split(',')
		.map(str => {
			const [name, career, specialty] = str.split('–').map(s => s.trim());
			return { name, career, specialty };
		});
	showStudentModal.value = true;
};

const openCertificationsModal = (project) => {
	selectedCertifications.value = project.certifications || [];
	showCertificationsModal.value = true;
};

// Filters se actualiza para incluir todas las columnas
const filters = ref({
	status: '',
	students: '',
	institution_name: '',
	institution_state: '',
	institution_city: '',
	organization_name: '',
	organization_state: '',
	organization_city: '',
	organization_sector: '',
	organization_type: '',
	education_type: '',
	project_name: '',
	agreement: '',
	project_status: '',
	grade: '',
	certifications: '',
	area: ''
});

const institutionId = JSON.parse(localStorage.getItem("institution"))?.id;
const userType = parseInt(localStorage.getItem("user_type"), 10);

const clearFilters = () => {
	filters.value = {
		status: '',
		students: '',
		institution_name: '',
		institution_state: '',
		institution_city: '',
		organization_name: '',
		organization_state: '',
		organization_city: '',
		organization_sector: '',
		organization_type: '',
		education_type: '',
		project_name: '',
		agreement: '',
		project_status: '',
		grade: '',
		certifications: '',
		area: ''
	};
};

const rowsPerPage = ref(10);
const currentPage = ref(1);

const filteredProjects = computed(() => {
	const f = filters.value;

	return dualProjects.value.filter(project => {
		const statusText = project.has_report ? 'completado' : 'incompleto';
		const institutionMatch = userType === 0 || project.institution_id === institutionId;

		return (
			institutionMatch &&
			project.project_name.toLowerCase().includes(f.project_name.toLowerCase()) &&
			statusText.includes(f.status.toLowerCase()) &&
			project.institution_name.toLowerCase().includes(f.institution_name.toLowerCase()) &&
			(project.institution_state || '').toLowerCase().includes((f.institution_state || '').toLowerCase()) &&
			project.institution_city.toLowerCase().includes(f.institution_city.toLowerCase()) &&
			project.area.toLowerCase().includes(f.area.toLowerCase()) &&
			project.organization_name.toLowerCase().includes(f.organization_name.toLowerCase()) &&
			(project.organization_state || '').toLowerCase().includes((f.organization_state || '').toLowerCase()) &&
			(project.organization_city || '').toLowerCase().includes((f.organization_city || '').toLowerCase()) &&
			(project.organization_sector || '').toLowerCase().includes((f.organization_sector || '').toLowerCase()) &&
			(project.organization_type || '').toLowerCase().includes((f.organization_type || '').toLowerCase()) &&
			(project.education_type || '').toLowerCase().includes((f.education_type || '').toLowerCase()) &&
			(project.agreement || '').toLowerCase().includes((f.agreement || '').toLowerCase()) &&
			(project.project_status || '').toLowerCase().includes((f.project_status || '').toLowerCase()) &&
			(project.grade || '').toLowerCase().includes((f.grade || '').toLowerCase()) &&
			(JSON.stringify(project.certifications) || '').toLowerCase().includes((f.certifications || '').toLowerCase()) &&
			project.student_name.toLowerCase().includes(f.students.toLowerCase())
		);
	});
});

const totalPages = computed(() => Math.ceil(filteredProjects.value.length / rowsPerPage.value));
const paginatedProjects = computed(() => {
	const start = (currentPage.value - 1) * rowsPerPage.value;
	return filteredProjects.value.slice(start, start + rowsPerPage.value);
});

const getAgreementClass = (agreement) => {
	const agreementLower = agreement?.toLowerCase() || '';
	if (agreementLower.includes('activo') || agreementLower.includes('vigente')) {
		return 'text-green-600 font-semibold';
	} else if (agreementLower.includes('vencido') || agreementLower.includes('expirado')) {
		return 'text-red-600 font-semibold';
	} else if (agreementLower.includes('pendiente') || agreementLower.includes('proceso')) {
		return 'text-yellow-600 font-semibold';
	}
	return 'text-gray-600';
};

const getStatusClass = (status) => {
	const statusLower = status?.toLowerCase() || '';
	if (statusLower.includes('completado') || statusLower.includes('finalizado')) {
		return 'text-green-600 font-semibold';
	} else if (statusLower.includes('en progreso') || statusLower.includes('activo')) {
		return 'text-blue-600 font-semibold';
	} else if (statusLower.includes('pendiente') || statusLower.includes('iniciar')) {
		return 'text-yellow-600 font-semibold';
	} else if (statusLower.includes('cancelado') || statusLower.includes('suspendido')) {
		return 'text-red-600 font-semibold';
	}
	return 'text-gray-600';
};

const getGradeClass = (grade) => {
	if (!grade) return 'text-gray-600';

	const numericGrade = parseFloat(grade);
	if (numericGrade >= 90) return 'text-green-600 font-semibold';
	if (numericGrade >= 80) return 'text-blue-600 font-semibold';
	if (numericGrade >= 70) return 'text-yellow-600 font-semibold';
	return 'text-red-600 font-semibold';
};

const fetchDualProjects = async () => {
	isLoading.value = true;

	try {
		const [reportedRes, unreportedRes] = await Promise.all([
			getReportedDualProjects(),
			getUnreportedDualProjects()
		]);

		console.log('Datos de proyectos reportados:', reportedRes.data);
		console.log('Datos de proyectos no reportados:', unreportedRes.data);

		const reported = reportedRes.data.map(project => {
			const institutionData = project.institution || {};
			const reportData = project.dual_project_reports || {};
			const organizationData = project.organization_dual_projects?.organization || {};
			const certifications = reportData.certifications || [];
			const microCredentials = reportData.micro_credentials || [];
			const diplomas = reportData.diplomas || [];

			const allCredentials = [
				...certifications.map(c => ({ ...c, type: 'Certificación' })),
				...microCredentials.map(m => ({ ...m, type: 'Microcredencial' })),
				...diplomas.map(d => ({ ...d, type: 'Diploma' }))
			];

			const projectStatus = reportData.is_concluded === 1 ? 'Concluido' : 'En progreso';

			return {
				id: project.id,
				project_name: reportData.name || 'Por definir',
				has_report: true,
				institution_id: institutionData.id,
				institution_name: institutionData.name || 'Por definir',
				institution_state: institutionData.state?.name || 'Por definir',
				institution_city: institutionData.city || 'Por definir',
				area: reportData.dual_area?.name || 'Por definir',
				organization_name: organizationData.name || 'Por definir',
				organization_state: organizationData.state?.name || 'Por definir',
				organization_city: organizationData.city || organizationData.municipality?.name || 'Por definir',
				organization_sector: organizationData.sector?.name || 'Por definir',
				organization_type: organizationData.type?.name || 'Por definir',
				education_type: reportData.dual_type?.name || 'Por definir',
				agreement: reportData.status_document?.name || 'Por definir',
				project_status: projectStatus,
				grade: reportData.qualification || 'N/A',
				certifications: allCredentials,
				status_document: reportData.status_document?.name || 'Por definir',
				student_name: project.dual_project_students
					.map(s => {
						const name = `${s.student?.name ?? ''} ${s.student?.lastname ?? ''}`.trim();
						const career = s.student?.career?.name ?? 'Sin carrera';
						const specialty = s.student?.specialty?.name ?? 'Sin especialidad';
						return `${name} – ${career} – ${specialty}`;
					})
					.join(', ')
			};
		});

		const unreported = unreportedRes.data.map(project => {
			const institutionData = project.institution || {};
			const organizationData = project.organization_dual_projects?.organization || {};

			return {
				id: project.id,
				project_name: 'Por definir',
				has_report: false,
				institution_id: institutionData.id,
				institution_name: institutionData.name || 'Por definir',
				institution_state: institutionData.state?.name || 'Por definir',
				institution_city: institutionData.city || 'Por definir',
				area: 'Por definir',
				organization_name: organizationData.name || 'Por definir',
				organization_state: organizationData.state?.name || 'Por definir',
				organization_city: organizationData.city || organizationData.municipality?.name || 'Por definir',
				organization_sector: organizationData.sector?.name || 'Por definir',
				organization_type: organizationData.type?.name || 'Por definir',
				education_type: 'Por definir',
				agreement: 'Por definir',
				project_status: 'Por definir',
				grade: 'N/A',
				certifications: [],
				status_document: 'Por definir',
				student_name: ''
			};
		});

		dualProjects.value = [...reported, ...unreported];
		console.log('Proyectos combinados:', dualProjects.value);

	} catch (error) {
		console.error('Error al obtener los proyectos duales:', error);
	} finally {
		isLoading.value = false;
	}
};

const studentFilters = ref({
	name: '',
	career: '',
	specialty: ''
});

const filteredStudents = computed(() => {
	return selectedStudents.value.filter(stud => {
		return (
			stud.name.toLowerCase().includes(studentFilters.value.name.toLowerCase()) &&
			stud.career.toLowerCase().includes(studentFilters.value.career.toLowerCase()) &&
			stud.specialty.toLowerCase().includes(studentFilters.value.specialty.toLowerCase())
		);
	});
});

onMounted(fetchDualProjects);
defineExpose({ fetchData: fetchDualProjects });
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
	height: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
	background: #f1f1f1;
	border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
	background: #82181a;
	border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
	background: #460809;
}
</style>