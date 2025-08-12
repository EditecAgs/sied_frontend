<template>
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
		<div
			class="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
			<div
				class="w-12 h-12 flex items-center justify-center rounded-xl bg-red-100 text-red-700 mb-4">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2">
					<circle cx="7" cy="12" r="4" stroke-linecap="round" stroke-linejoin="round" />
					<circle cx="17" cy="12" r="4" stroke-linecap="round" stroke-linejoin="round" />
					<path stroke-linecap="round" stroke-linejoin="round" d="M11 12h2" />
				</svg>
			</div>
			<h3 class="text-gray-600 dark:text-gray-300 text-sm font-medium">
				Proyectos Duales Registrados
			</h3>
			<p class="mt-auto font-bold text-2xl text-gray-900 dark:text-white">
				{{ completed_dual_projects.count }}
			</p>
		</div>

		<div
			class="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
			<div
				class="w-12 h-12 flex items-center justify-center rounded-xl bg-red-200 text-red-800 mb-4">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 20v-1a4 4 0 014-4h4a4 4 0 014 4v1" />
				</svg>
			</div>
			<h3 class="text-gray-600 dark:text-gray-300 text-sm font-medium">
				Estudiantes Registrados
			</h3>
			<p class="mt-auto font-bold text-2xl text-gray-900 dark:text-white">
				{{ total_students.count }}
			</p>
		</div>

		<div
			class="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
			<div
				class="w-12 h-12 flex items-center justify-center rounded-xl bg-red-300 text-red-900 mb-4">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M3 8l9-5 9 5v8l-9 5-9-5V8z" />
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 3v14" />
					<path stroke-linecap="round" stroke-linejoin="round" d="M21 8l-9 5-9-5" />
				</svg>
			</div>
			<h3 class="text-gray-600 dark:text-gray-300 text-sm font-medium">
				Orders
			</h3>
			<p class="mt-auto font-bold text-2xl text-gray-900 dark:text-white">5,359</p>
			<span
				class="inline-flex items-center mt-2 rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
				▲ 9.05%
			</span>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue'
import { getCompletedDualProjects, getTotalStudents } from '../../services/statistics/dashboard'

const completed_dual_projects = ref({ count: 0 })
const total_students = ref({ count: 0 })

getCompletedDualProjects().then((data) => {
  completed_dual_projects.value = data.data
})

getTotalStudents().then((data) => {
  total_students.value = data.data
})
</script>
