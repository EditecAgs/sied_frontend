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
				{{ completed_dual_projects.count }}
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
				{{ total_students.count }}
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
				{{ total_Organizations.count }}
			</p>
		</div>
	</div>
</template>





<script setup>
import { ref } from 'vue'
import { getCompletedDualProjects, getTotalStudents, getRegisteredOrganizationsCount } from '../../services/statistics/dashboard'

const completed_dual_projects = ref({ count: 0 })
const total_students = ref({ count: 0 })
const total_Organizations = ref({count: 0})

const props = defineProps({
  filtersAdd: {
    type: Number,
    default: null 
  }
})

getCompletedDualProjects(props.filtersAdd).then((data) => {
  completed_dual_projects.value = data.data
})

getTotalStudents(props.filtersAdd).then((data) => {
  total_students.value = data.data
})

getRegisteredOrganizationsCount(props.filtersAdd).then((data) => {
	total_Organizations.value = data.data
})
</script>
