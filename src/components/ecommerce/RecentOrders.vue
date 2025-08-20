<template>
	<div
		class="overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
		<div
			class="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
			<h3 class="text-xl font-semibold text-gray-900 dark:text-white">
				Sectores de Proyectos de Modelo Dual
			</h3>

			<nav class="inline-flex rounded-md shadow-sm" role="navigation" aria-label="Pagination">
				<button
					:disabled="currentPage === 1"
					class="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
					aria-label="Previous page"
					@click="fetchPage(currentPage - 1)">
					Anterior
				</button>

				<button
					:disabled="currentPage === lastPage"
					class="relative -ml-px inline-flex items-center rounded-r-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
					aria-label="Next page"
					@click="fetchPage(currentPage + 1)">
					Siguiente
				</button>
			</nav>
		</div>

		<div class="overflow-x-auto">
			<table class="min-w-full table-auto divide-y divide-gray-200 dark:divide-gray-700">
				<thead class="bg-gray-50 dark:bg-gray-800">
					<tr>
						<th
							scope="col"
							class="py-3 px-4 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 max-w-[350px]">
							Sector
						</th>
						<th
							scope="col"
							class="py-3 px-4 text-right text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 w-40">
							Número de Proyectos
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-100 dark:divide-gray-700">
					<tr
						v-for="(item, index) in dual_projects_by_sector"
						:key="index"
						class="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
						<td
							class="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white break-words max-w-[350px]"
							style="word-break: break-word;">
							{{ item.sector_name }}
						</td>
						<td class="py-3 px-4 text-sm text-gray-700 dark:text-gray-300 text-right">
							{{ item.project_count }}
						</td>
					</tr>
					<tr v-if="dual_projects_by_sector.length === 0">
						<td
							colspan="2"
							class="py-4 px-4 text-center text-gray-500 dark:text-gray-400">
							No hay datos disponibles
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<p
			class="mt-4 text-center text-sm text-gray-600 dark:text-gray-400"
			aria-live="polite">
			Página {{ currentPage }} de {{ lastPage }}
		</p>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getProjectsBySector } from '../../services/statistics/dashboard'

const dual_projects_by_sector = ref([])
const currentPage = ref(1)
const lastPage = ref(1)

const fetchPage = async (page) => {
  try {
    const response = await getProjectsBySector(page)
    const result = response.data
    dual_projects_by_sector.value = result.data
    currentPage.value = result.pagination.current_page
    lastPage.value = result.pagination.last_page
  } catch (error) {
    console.error('Error al cargar sectores:', error)
  }
}

onMounted(() => {
  fetchPage(1)
})
</script>
