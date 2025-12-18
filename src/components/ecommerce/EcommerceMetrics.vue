<template>
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
		<div
			class="flex flex-col items-center rounded-3xl border border-gray-200
             bg-[rgb(211,211,210)]/50 p-6 shadow-sm dark:border-gray-700">
			<img
				src="/images/metric/project-registred.png"
				alt="Proyectos Registrados"
				class="w-18 h-18 object-contain mb-4" />
			<h3 class="text-gray-600 dark:text-gray-300 text-sm font-medium text-center">
				Proyectos Duales Registrados
			</h3>
			<p class="mt-2 font-bold text-2xl text-gray-900 dark:text-white">
				{{ completed_dual_projects }}
			</p>
		</div>

		<div
			class="flex flex-col items-center rounded-3xl border border-gray-200
             bg-[rgb(211,211,210)]/50 p-6 shadow-sm dark:border-gray-700">
			<img
				src="/images/metric/student-registred.png"
				alt="Estudiantes Registrados"
				class="w-18 h-18 object-contain mb-4" />
			<h3 class="text-gray-600 dark:text-gray-300 text-sm font-medium text-center">
				Estudiantes Registrados
			</h3>
			<p class="mt-2 font-bold text-2xl text-gray-900 dark:text-white">
				{{ total_students }}
			</p>
		</div>

		<div
			class="flex flex-col items-center rounded-3xl border border-gray-200
             bg-[rgb(211,211,210)]/50 p-6 shadow-sm dark:border-gray-700">
			<img
				src="/images/metric/org-registred.png"
				alt="Organizaciones Registradas"
				class="w-24 h-26 object-contain mb-4" />
			<h3 class="text-gray-600 dark:text-gray-300 text-sm font-medium text-center">
				Organizaciones Registradas
			</h3>
			<p class="mt-2 font-bold text-2xl text-gray-900 dark:text-white">
				{{ total_organizations }}
			</p>
		</div>
	</div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { getCompletedDualProjects, getTotalStudents, getRegisteredOrganizationsCount } from '../../services/statistics/dashboard'

const completed_dual_projects = ref(0)
const total_students = ref(0)
const total_organizations = ref(0)
const loading = ref(false)

const props = defineProps({
	filters: {
		type: Object,
		default: () => ({})
	}
})

const emit = defineEmits(['loaded'])

const loadData = async () => {
	try {
		loading.value = true

		const [projectsRes, studentsRes, organizationsRes] = await Promise.all([
			getCompletedDualProjects(props.filters),
			getTotalStudents(props.filters),
			getRegisteredOrganizationsCount(props.filters)
		])

		completed_dual_projects.value = projectsRes.data
		total_students.value = studentsRes.data
		total_organizations.value = organizationsRes.data

		console.log('Datos cargados:', {
			projects: completed_dual_projects.value,
			students: total_students.value,
			organizations: total_organizations.value
		})

		emit('loaded')
	} catch (error) {
		console.error('Error cargando datos de métricas:', error)
		completed_dual_projects.value = 0
		total_students.value = 0
		total_organizations.value = 0
	} finally {
		loading.value = false
	}
}

onMounted(() => {
	loadData()
})


watch(() => props.filters, () => {
	loadData()
}, { deep: true })


</script>