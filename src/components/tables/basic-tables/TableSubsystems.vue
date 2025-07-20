<template>
	<div class="overflow-hidden rounded-xl border border-gray-200 bg-white">
		<div class="max-w-full overflow-x-auto custom-scrollbar">
			<table class="min-w-full">
				<thead>
					<tr class="border-b border-gray-200 bg-brand-50">
						<th class="px-5 py-3 text-left w-9/12 sm:px-6">
							<p class="font-medium text-brand-900 text-theme-xs">
								Nombre del Subsystem
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
						<td colspan="2" class="py-12 text-center">
							<svg class="animate-spin h-8 w-8 text-brand-800 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
							</svg>
							<p class="text-gray-500">Cargando subsistemas...</p>
						</td>
					</tr>

					<tr
						v-for="(subsystem, index) in subsystems"
						v-else
						:key="subsystem.id ?? index"
						class="border-t border-gray-100 dark:border-gray-800">
						<td class="px-5 py-4 sm:px-6">
							<span class="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
								{{ subsystem.name }}
							</span>
						</td>
						<td class="px-5 py-4 sm:px-6">
							<div class="flex space-x-2">
								<btnEdit
									:table="'subsystems'"
									:pk="subsystem.id ?? index"
									@open="(data) => $emit('open', data)" />
								<btnDelete
									:table="'subsystems'"
									:pk="subsystem.id ?? index"
									@deleted="onSubsystemDeleted" />
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
import axios from "axios";
import { useAxios } from "../../../axios";

useAxios();

const subsystems = ref([]);
const isLoading = ref(false);

const fetchSubsystems = async () => {
  isLoading.value = true;
  try {
    const res = await axios.get("subsystems");
    subsystems.value = res.data;
  } catch (err) {
    console.error("Error al obtener los subsistemas:", err);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchSubsystems();
});

const onSubsystemDeleted = (deletedId) => {
  subsystems.value = subsystems.value.filter((s) => s.id !== deletedId);
};

defineExpose({
  fetchData: fetchSubsystems,
});
</script>
