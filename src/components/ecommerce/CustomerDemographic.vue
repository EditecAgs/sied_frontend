<template>
	<div
		class="rounded-2xl border border-gray-200 bg-[#d0d1d1]/40 backdrop-blur-md
               p-6 sm:p-8 shadow-md dark:border-gray-700 dark:bg-gray-900/90">
		<div class="mb-6">
			<h3 class="text-lg font-semibold text-gray-800 dark:text-white">
				Proyectos por Institución
			</h3>
			<p class="mt-1 text-gray-600 text-sm dark:text-gray-400">
				Porcentaje de Proyectos de modelo dual por institución
			</p>
		</div>

		<div class="space-y-6">
			<div
				v-for="(item, index) in dual_projects_by_institution"
				:key="index"
				class="flex items-center justify-between gap-4 hover:bg-gray-200/50 dark:hover:bg-gray-800/70
                       p-2 rounded-lg transition-colors">
				<img
					:src="logosMap[item.id] || defaultLogo"
					:alt="item.institution_name"
					class="w-10 h-10 rounded-full object-contain border border-gray-300 dark:border-gray-600" />

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

<script setup>
import { ref } from 'vue'
import { getProjectsByIntitution } from '../../services/statistics/dashboard'

const dual_projects_by_institution = ref([])

const logosMap = {
	1: '/images/institutionsLogo/logo_ITA.png',
	2: '/images/institutionsLogo/Logo_UAA.svg',
	3: '/images/institutionsLogo/Logo_IPN.png',
	4: '/images/institutionsLogo/logo_UPA.png',
	5: '/images/institutionsLogo/Logo_UNAM.svg'
}

const defaultLogo = ''

getProjectsByIntitution().then((data) => {
	dual_projects_by_institution.value = data.data.data
})
</script>
