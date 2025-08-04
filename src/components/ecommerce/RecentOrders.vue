<template>
	<div class="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
		<div class="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
			<div>
				<h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Sectores de Proyectos de Modelo Dual</h3>
			</div>

			<div class="flex items-center gap-3">
				<button
					:disabled="currentPage === 1"
					class="px-3 py-1 border rounded disabled:opacity-50 dark:bg-gray-700 dark:text-white"
					@click="fetchPage(currentPage - 1)">
					Anterior
				</button>

				<button
					:disabled="currentPage === lastPage"
					class="px-3 py-1 border rounded disabled:opacity-50 dark:bg-gray-700 dark:text-white"
					@click="fetchPage(currentPage + 1)">
					Siguiente
				</button>
			</div>
		</div>

		<div class="max-w-full overflow-x-auto custom-scrollbar">
			<table class="min-w-full">
				<thead>
					<tr class="border-t border-gray-100 dark:border-gray-800">
						<th class="py-3 text-left">
							<p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Sector</p>
						</th>
						<th class="py-3 text-left">
							<p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Número de Proyectos</p>
						</th>
					</tr>
				</thead>
				<tbody>
					<tr
						v-for="(item, index) in dual_projects_by_sector"
						:key="index"
						class="border-t border-gray-100 dark:border-gray-800">
						<td class="py-3 whitespace-nowrap">
							<div class="flex items-center gap-3">
								<div>
									<p class="font-medium text-gray-800 text-theme-sm dark:text-white/90">
										{{ item['sector_name'] }}
									</p>
								</div>
							</div>
						</td>
						<td class="py-3 whitespace-nowrap">
							<p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ item.project_count }}</p>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<div class="mt-4 text-sm text-gray-600 dark:text-gray-400">
			Página {{ currentPage }} de {{ lastPage }}
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getProjectsBySector } from '../../services/statistics/dashboard';

const dual_projects_by_sector = ref([]);
const currentPage = ref(1);
const lastPage = ref(1);

const fetchPage = async (page) => {
	try {
		const response = await getProjectsBySector(page);
		const result = response.data;
		dual_projects_by_sector.value = result.data;
		currentPage.value = result.pagination.current_page;
		lastPage.value = result.pagination.last_page;
	} catch (error) {
		console.error('Error al cargar sectores:', error);
	}
};

onMounted(() => {
	fetchPage(1);
});
</script>
