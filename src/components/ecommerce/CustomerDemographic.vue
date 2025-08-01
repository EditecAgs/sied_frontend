<template>
	<div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
		<div class="flex justify-between">
			<div>
				<h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Proyectos por Institución</h3>
				<p class="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">Porcentaje de Proyectos de modelo dual por institución</p>
			</div>
		</div>
		<div
			v-for="(item, index) in dual_projects_by_institution"
			class="space-y-5 mt-6"
			:key="index">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-3">
					<div>
						<p class="font-semibold text-gray-800 text-lg dark:text-white/90">{{ item.institution_name }}</p>
						<span class="block text-gray-500 text-theme-xs dark:text-gray-400">{{ item.project_count }} Proyecto(s)</span>
					</div>
				</div>

				<div class="flex w-full max-w-[140px] items-center gap-3">
					<div class="relative block h-2 w-full max-w-[100px] rounded-sm bg-gray-200 dark:bg-gray-800">
						<div
							class="absolute left-0 top-0 flex h-full items-center justify-center rounded-sm bg-brand-500 text-xs font-medium text-white"
							:style="{ width: item.percentage + '%' }" />
					</div>
					<p class="font-medium text-gray-800 text-theme-sm dark:text-white/90">{{ item.percentage }}%</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import { getProjectsByIntitution } from '../../services/statistics/dashboard';

const dual_projects_by_institution = ref([]);

getProjectsByIntitution().then((data) => {
	dual_projects_by_institution.value = data.data.data;
});
</script>
