<template>
	<div class="overflow-hidden rounded-xl border border-gray-200 bg-white">
		<div class="max-w-full overflow-x-auto custom-scrollbar">
			<table class="min-w-full">
				<thead>
					<tr class="border-b border-gray-200 bg-brand-50">
						<th class="px-5 py-3 text-left w-4/12 sm:px-6">
							<p class="font-medium text-brand-900 text-theme-xs">
								Nombre del Periodo
							</p>
						</th>
						<th class="px-5 py-3 text-left w-5/12 sm:px-6">
							<p class="font-medium text-brand-900 text-theme-xs">
								Descripción
							</p>
						</th>
						<th class="px-5 py-3 text-left w-3/12 sm:px-6">
							<p class="font-medium text-brand-900 text-theme-xs">
								Opciones
							</p>
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200 dark:divide-gray-700">
					<tr v-if="isLoading">
						<td colspan="3" class="py-12 text-center">
							<svg class="animate-spin h-8 w-8 text-brand-800 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
							</svg>
							<p class="text-gray-500">Cargando periodos académicos...</p>
						</td>
					</tr>

					<tr
						v-for="(period, index) in academicPeriods"
						v-else
						:key="period.id ?? index"
						class="border-t border-gray-100 dark:border-gray-800">
						<td class="px-5 py-4 sm:px-6">
							<span class="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
								{{ period.name }}
							</span>
						</td>
						<td class="px-5 py-4 sm:px-6">
							<p class="text-gray-500 text-theme-sm dark:text-gray-400">
								{{ period.description }}
							</p>
						</td>
						<td class="px-5 py-4 sm:px-6">
							<div class="flex space-x-2">
								<btnEdit
									:table="'academic_periods'"
									:pk="period.id ?? index"
									@open="(data) => $emit('open', data)" />
								<btnDelete
									:table="'academic-periods'"
									:pk="period.id ?? index"
									@deleted="onPeriodDeleted" />
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import btnEdit from "../../../components/buttons/btnEdit.vue";
import btnDelete from "../../../components/buttons/btnDelete.vue";
import {getAcademicPeriods} from "../../../services/institutions/academic-periods"


const academicPeriods = ref([]);
const isLoading = ref(false);

const fetchAcademicPeriods = async () => {
  isLoading.value = true;
  getAcademicPeriods()
      .then(({data})=>{academicPeriods.value=data})
      .finally(() => { isLoading.value = false })
};

onMounted(() => {
  fetchAcademicPeriods();
});

const onPeriodDeleted = (deletedId) => {
  academicPeriods.value = academicPeriods.value.filter((p) => p.id !== deletedId);
};

defineExpose({
  fetchData: fetchAcademicPeriods,
});
</script>
