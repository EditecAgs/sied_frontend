<template>
  <div class="bg-white rounded-xl shadow-lg overflow-hidden">
    <div class="px-6 py-4 bg-gradient-to-r from-brand-800 to-brand-900">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-bold text-white">Gestión de Proyectos Duales</h2>
        <button
          class="flex items-center gap-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm transition-all"
          @click="clearFilters">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Limpiar
        </button>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full">
        <thead>
          <tr class="bg-brand-800/80 text-white">
			<th class="px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50 border-r border-brand-700/30">Estudiantes</th>
			<th class="px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50 border-r border-brand-700/30">Institución</th>
			<th class="px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50 border-r border-brand-700/30">País Institución</th>
			<th class="px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50 border-r border-brand-700/30">Ciudad Institución</th>
            <th class="px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50 border-r border-brand-700/30">Nombre</th>
            <th class="px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50 border-r border-brand-700/30">Estatus</th>
            <th class="px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50 border-r border-brand-700/30">Área</th>
            <th class="px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50 border-r border-brand-700/30">Organización</th>
			<th class="px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50 border-r border-brand-700/30">Ciudad Organización</th>
			<th class="px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50 border-r border-brand-700/30">Estado Organización</th>
			<th class="px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50 border-r border-brand-700/30">Sector Organización</th>
			<th class="px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50 border-r border-brand-700/30">Tipo Organización</th> 
             <th class="px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50 border-r border-brand-700/30">Estado Convenio</th>
            <th class="px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50">Opciones</th>
          </tr>

          <tr class="bg-brand-800/60 text-white">
			<th class="px-5 py-2 border-b border-brand-700/50 border-r border-brand-700/30">
              <input v-model="filters.student_name" class="w-full bg-white/10 border-none text-white rounded px-3 py-1 text-xs" />
            </th>
			<th class="px-5 py-2 border-b border-brand-700/50 border-r border-brand-700/30">
              <input v-model="filters.institution_name" class="w-full bg-white/10 border-none text-white rounded px-3 py-1 text-xs" />
            </th>
			<th class="px-5 py-2 border-b border-brand-700/50 border-r border-brand-700/30">
			  <input v-model="filters.institution_state" class="w-full bg-white/10 border-none text-white rounded px-3 py-1 text-xs" />
            </th>
			<th class="px-5 py-2 border-b border-brand-700/50 border-r border-brand-700/30">
              <input v-model="filters.institution_city" class="w-full bg-white/10 border-none text-white rounded px-3 py-1 text-xs" />
            </th>
			<th class="px-5 py-2 border-b border-brand-700/50 border-r border-brand-700/30">
              <input v-model="filters.project_name" class="w-full bg-white/10 border-none text-white rounded px-3 py-1 text-xs" />
            </th>
            <th class="px-5 py-2 border-b border-brand-700/50 border-r border-brand-700/30">
              <input v-model="filters.has_report" class="w-full bg-white/10 border-none text-white rounded px-3 py-1 text-xs" />
            </th>
            <th class="px-5 py-2 border-b border-brand-700/50 border-r border-brand-700/30">
              <input v-model="filters.area" class="w-full bg-white/10 border-none text-white rounded px-3 py-1 text-xs" />
            </th>
            <th class="px-5 py-2 border-b border-brand-700/50 border-r border-brand-700/30">
              <input v-model="filters.organization_name" class="w-full bg-white/10 border-none text-white rounded px-3 py-1 text-xs" />
            </th>
			<th class="px-5 py-2 border-b border-brand-700/50 border-r border-brand-700/30">
			  <input v-model="filters.organization_city" class="w-full bg-white/10 border-none text-white rounded px-3 py-1 text-xs" />
            </th>
			<th class="px-5 py-2 border-b border-brand-700/50 border-r border-brand-700/30">
			  <input v-model="filters.organization_state" class="w-full bg-white/10 border-none text-white rounded px-3 py-1 text-xs" />
            </th>
			<th class="px-5 py-2 border-b border-brand-700/50 border-r border-brand-700/30">
			  <input v-model="filters.organization_sector" class="w-full bg-white/10 border-none text-white rounded px-3 py-1 text-xs" />
            </th>
			<th class="px-5 py-2 border-b border-brand-700/50 border-r border-brand-700/30">
			  <input v-model="filters.organization_type" class="w-full bg-white/10 border-none text-white rounded px-3 py-1 text-xs" />
            </th>
            <th class="px-5 py-2 border-b border-brand-700/50 border-r border-brand-700/30">
              <input v-model="filters.status_document" class="w-full bg-white/10 border-none text-white rounded px-3 py-1 text-xs" />
            </th>
            <th class="px-5 py-2 border-b border-brand-700/50" />
          </tr>
        </thead>

        <tbody>
          <tr v-if="isLoading">
            <td colspan="8" class="py-12 text-center">
              <p class="text-gray-500">Cargando Proyectos Duales...</p>
            </td>
          </tr>

          <tr
            v-for="(project, index) in paginatedProjects"
            :key="project.id ?? index"
            class="border-b border-gray-100 hover:bg-brand-50/30 transition-colors even:bg-gray-50">
		  	<td class="px-5 py-3 text-sm border-r border-gray-100 flex justify-center items-center">
  <template v-if="project.student_name && project.student_name.trim() !== ''">
    <button
      class="px-3 py-1 bg-brand-800 text-white rounded-lg hover:bg-brand-900 transition-colors text-xs font-medium"
      @click="openStudentModal(project)"
      title="Ver estudiantes"
    >
      Ver estudiantes
    </button>
  </template>
  <template v-else>
    <span class="text-gray-500 font-medium text-center">Sin estudiantes</span>
  </template>
</td>
			<td class="px-5 py-3 text-sm border-r border-gray-100">{{ project.institution_name }}</td>
			<td class="px-5 py-3 text-sm border-r border-gray-100">{{ project.institution_state }}</td>
			<td class="px-5 py-3 text-sm border-r border-gray-100">{{ project.institution_city }}</td>
            <td class="px-5 py-3 text-sm border-r border-gray-100">{{ project.project_name }}</td>

            <td class="px-5 py-3 text-sm border-r border-gray-100">
              <span :class="project.has_report ? 'text-green-600 font-semibold' : 'text-yellow-600 font-semibold'">
                {{ project.has_report ? 'Completado' : 'Incompleto' }}
              </span>
            </td>

            <td class="px-5 py-3 text-sm border-r border-gray-100">{{ project.area }}</td>
            <td class="px-5 py-3 text-sm border-r border-gray-100">{{ project.organization_name }}</td>
			<td class="px-5 py-3 text-sm border-r border-gray-100">{{ project.organization_city }}</td>
			<td class="px-5 py-3 text-sm border-r border-gray-100">{{ project.organization_state }}</td>
			<td class="px-5 py-3 text-sm border-r border-gray-100">{{ project.organization_sector }}</td>
			<td class="px-5 py-3 text-sm border-r border-gray-100">{{ project.organization_type }}</td>
            <td class="px-5 py-3 text-sm border-r border-gray-100">{{ project.status_document }}</td>
 

            <td class="px-5 py-3 text-sm">
              <div class="flex space-x-2">
                <template v-if="project.has_report">
                  <btnEdit :table="'dual_projects'" :pk="project.id"
                    @open="() => $emit('open', { mode: 'edit', pk: project.id, table: 'modelo dual' })" />
                </template>
                <template v-else>
                  <button
                    class="text-xs font-medium text-brand-800 hover:text-brand-900 underline underline-offset-2"
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
            <td colspan="8" class="px-5 py-8 text-center text-gray-500">
              No se encontraron proyectos duales registrados.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
      <span class="text-xs text-gray-600">Mostrando {{ paginatedProjects.length }} de {{ filteredProjects.length }} registros</span>
    </div>
  </div>


<div v-if="showStudentModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
  <div class="bg-white rounded-xl p-6 w-3/4 max-w-4xl shadow-xl overflow-x-auto max-h-[80vh]">
    <h3 class="text-lg font-bold mb-3">Datos de los Estudiantes</h3>

    <div class="overflow-x-auto">
      <table class="min-w-full">
        <thead>
          <tr class="bg-brand-800/80 text-white">
            <th class="px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50 border-r border-brand-700/30">Nombre</th>
            <th class="px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50 border-r border-brand-700/30">Carrera</th>
            <th class="px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50">Especialidad</th>
          </tr>
          <tr class="bg-brand-800/60 text-white">
            <th class="px-5 py-2 border-b border-brand-700/50 border-r border-brand-700/30">
              <input v-model="studentFilters.name" placeholder="Filtrar por nombre"
                class="w-full bg-white/10 border-none text-white rounded px-3 py-1 text-xs" />
            </th>
            <th class="px-5 py-2 border-b border-brand-700/50 border-r border-brand-700/30">
              <input v-model="studentFilters.career" placeholder="Filtrar por carrera"
                class="w-full bg-white/10 border-none text-white rounded px-3 py-1 text-xs" />
            </th>
            <th class="px-5 py-2 border-b border-brand-700/50">
              <input v-model="studentFilters.specialty" placeholder="Filtrar por especialidad"
                class="w-full bg-white/10 border-none text-white rounded px-3 py-1 text-xs" />
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(stud, i) in filteredStudents" :key="i"
            class="border-b border-gray-100 hover:bg-brand-50/30 transition-colors even:bg-gray-50">
            <td class="px-5 py-3 text-sm border-r border-gray-100">{{ stud.name }}</td>
            <td class="px-5 py-3 text-sm border-r border-gray-100">{{ stud.career }}</td>
            <td class="px-5 py-3 text-sm">{{ stud.specialty }}</td>
          </tr>

          <tr v-if="filteredStudents.length === 0">
            <td colspan="3" class="px-5 py-8 text-center text-gray-500">No se encontraron alumnos.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <button class="mt-4 px-4 py-2 bg-brand-800 text-white rounded-lg" @click="showStudentModal = false">
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

const dualProjects = ref([]);
const isLoading = ref(false);
const showStudentModal = ref(false);
const selectedStudents = ref([]);

const openStudentModal = (project) => {
  selectedStudents.value = project.student_name
    .split(',')
    .map(str => {
      const [name, career, specialty] = str.split('–').map(s => s.trim());
      return { name, career, specialty };
    });

  showStudentModal.value = true;
};

const filters = ref({
  project_name: '',
  has_report: '',
  institution_name: '',
  institution_state: '',
  institution_city: '',
  area: '',
  organization_name: '',
  organization_state: '',
  organization_city: '',
  organization_sector: '',
  organization_type: '',
  status_document: '',
  student_name: ''
});

const institutionId = JSON.parse(localStorage.getItem("institution"))?.id;
const userType = parseInt(localStorage.getItem("user_type"), 10);

const clearFilters = () => {
  filters.value = {
    project_name: '',
    has_report: '',
    institution_name: '',
	institution_state: '',
	institution_city: '',
    area: '',
    organization_name: '',
	organization_state: '',
	organization_city: '',
	organization_sector: '',
	organization_type: '',
    status_document: '',
    student_name: ''
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
      statusText.includes(f.has_report.toLowerCase()) &&
      project.institution_name.toLowerCase().includes(f.institution_name.toLowerCase()) &&
	  (project.institution_state || '').toLowerCase().includes((f.institution_state || '').toLowerCase()) &&
	  project.institution_city.toLowerCase().includes(f.institution_city.toLowerCase()) &&
      project.area.toLowerCase().includes(f.area.toLowerCase()) &&
      project.organization_name.toLowerCase().includes(f.organization_name.toLowerCase()) &&
	  (project.organization_state || '').toLowerCase().includes((f.organization_state || '').toLowerCase()) &&
	  (project.organization_city || '').toLowerCase().includes((f.organization_city || '').toLowerCase()) &&
	  (project.organization_sector || '').toLowerCase().includes((f.organization_sector || '').toLowerCase()) &&
	  (project.organization_type || '').toLowerCase().includes((f.organization_type || '').toLowerCase()) &&
      project.status_document.toLowerCase().includes(f.status_document.toLowerCase()) &&
      project.student_name.toLowerCase().includes(f.student_name.toLowerCase())
    );
  });
});

const totalPages = computed(() => Math.ceil(filteredProjects.value.length / rowsPerPage.value));
const paginatedProjects = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value;
  return filteredProjects.value.slice(start, start + rowsPerPage.value);
});

const fetchDualProjects = async () => {
  isLoading.value = true;

  try {
    const [reportedRes, unreportedRes] = await Promise.all([
      getReportedDualProjects(),
      getUnreportedDualProjects()
    ]);
	console.log(reportedRes.data);
    const reported = reportedRes.data.map(project => ({
      id: project.id,
      project_name: project.dual_project_reports.name || 'Por definir',
      has_report: true,
      institution_id: project.institution.id,
      institution_name: project.institution.name || 'Por definir',
	  institution_state: project.institution.state?.name || 'Por definir',
	  institution_city: project.institution.city || 'Por definir',
      area: project.dual_project_reports.dual_area?.name || 'Por definir',
      organization_name: project.organization_dual_projects.organization?.name || 'Por definir',
	  organization_state: project.organization_dual_projects.organization?.state?.name || 'Por definir',
	  organization_city: project.organization_dual_projects.organization?.city || 'Por definir',
	  organization_sector: project.organization_dual_projects.organization?.sector?.name || 'Por definir',
	  organization_type: project.organization_dual_projects.organization?.type?.name || 'Por definir',
      status_document: project.dual_project_reports.status_document?.name || 'Por definir',
      student_name: project.dual_project_students
        .map(s => {
          const name = `${s.student?.name ?? ''} ${s.student?.lastname ?? ''}`.trim();
          const career = s.student?.career?.name ?? 'Sin carrera';
          const specialty = s.student?.specialty?.name ?? 'Sin especialidad';
          return `${name} – ${career} – ${specialty}`;
        })
        .join(', ')
    }));

    const unreported = unreportedRes.data.map(project => ({
      id: project.id,
      project_name: 'Por definir',
      has_report: false,
      institution_id: project.institution?.id,
      institution_name: project.institution?.name || 'Por definir',
	  institution_state: project.institution?.state?.name || 'Por definir',
	  institution_city: project.institution?.city || 'Por definir',
      area: 'Por definir',
      organization_name: project.organization_dual_projects?.[0]?.organization?.name || 'Por definir',
	  organization_state: project.organization_dual_projects?.[0]?.organization?.state?.name || 'Por definir',
	  organization_city: project.organization_dual_projects?.[0]?.organization?.city || 'Por definir',
	  organization_sector: project.organization_dual_projects?.[0]?.organization?.sector?.name || 'Por definir',
	  organization_type: project.organization_dual_projects?.[0]?.organization?.type?.name || 'Por definir',
      status_document: 'Por definir',
      student_name: ''
    }));

    dualProjects.value = [...reported, ...unreported];

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
