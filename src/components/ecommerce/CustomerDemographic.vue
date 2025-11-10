<template>
	<div
		class="rounded-2xl border border-gray-200 bg-[rgb(211,211,210)]/50
               p-6 sm:p-4 shadow-md dark:border-gray-700 dark:bg-gray-900/90">
		<div class="mb-6">
			<h3 class="text-lg font-semibold text-gray-600 dark:text-white">
				Proyectos por Institución
			</h3>
			<p class="mt-1 text-gray-500 text-sm dark:text-gray-400">
				Porcentaje de Proyectos de modelo dual por institución
			</p>
		</div>

		<div class="space-y-6">
			<div
				v-for="(item, index) in topTenInstitutions"
				:key="index"
				class="flex items-center justify-between gap-4 hover:bg-gray-200/50 dark:hover:bg-gray-800/70
           p-2 rounded-lg transition-colors">
				<img
					v-if="item.image"
					:src="item.image"
					:alt="item.institution_name"
					class="w-10 h-10 rounded-full object-contain border border-gray-300 dark:border-gray-600" />


				<div
					v-else
					class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-300 dark:bg-gray-700 border border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 14l9-5-9-5-9 5 9 5zm0 7v-7m0 0L3 9m9 5l9-5" />
					</svg>
				</div>

				<div class="flex-1">
					<p class="font-semibold text-gray-900 dark:text-white text-base">
						{{ item.institution_name }}
					</p>
					<span class="block text-gray-600 text-xs dark:text-gray-400">
						{{ item.project_count }} Proyecto(s)
					</span>
				</div>

				<div class="flex items-center gap-3 w-full max-w-[140px]">
					<div class="relative w-full max-w-[100px] h-2 rounded-sm bg-gray-300 dark:bg-gray-700">
						<div
							class="absolute left-0 top-0 h-full rounded-sm bg-brand-500"
							:style="{ width: item.percentage + '%' }" />
					</div>
					<p class="font-medium text-gray-900 dark:text-white text-sm">
						{{ item.percentage }}%
					</p>
				</div>
			</div>

			<div
				v-if="dual_projects_by_institution.length === 0"
				class="text-center py-4 text-gray-500 dark:text-gray-400">
				No hay datos disponibles
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { getProjectsByIntitution } from '../../services/statistics/dashboard'

interface ProjectByInstitution {
	institution_name: string
	project_count: number
	percentage: number
	image?: string
}

const dual_projects_by_institution = ref<ProjectByInstitution[]>([])

getProjectsByIntitution().then((data) => {
	const items = (data.data.data || []) as ProjectByInstitution[]
	items.sort((a, b) => b.percentage - a.percentage)
	dual_projects_by_institution.value = items
})

const topTenInstitutions = computed(() =>
	dual_projects_by_institution.value.slice(0, 10)
)
</script>


