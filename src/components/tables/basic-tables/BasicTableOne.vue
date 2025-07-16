<template>
	<div
		class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
		<div class="max-w-full overflow-x-auto custom-scrollbar">
			<table class="min-w-full">
				<thead>
					<tr class="border-b border-gray-200 dark:border-gray-700">
						<th class="px-5 py-3 text-left w-3/11 sm:px-6">
							<p
								class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
								Nombre
							</p>
						</th>
						<th class="px-5 py-3 text-left w-2/11 sm:px-6">
							<p
								class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
								Apellido
							</p>
						</th>
						<th class="px-5 py-3 text-left w-2/11 sm:px-6">
							<p
								class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
								E-mail
							</p>
						</th>
						<th class="px-5 py-3 text-left w-2/11 sm:px-6">
							<p
								class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
								Institucion
							</p>
						</th>
						<th class="px-5 py-3 text-left w-2/11 sm:px-6">
							<p
								class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
								Opciones
							</p>
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200 dark:divide-gray-700">
					<tr v-if="isLoading">
						<td colspan="5" class="py-12 text-center">
							<svg class="animate-spin h-8 w-8 text-blue-600 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
							</svg>
							<p class="text-gray-500 dark:text-gray-400">Cargando usuarios...</p>
						</td>
					</tr>

					<tr
						v-for="(user, index) in users"
						v-else
						:key="user.id ?? index"
						class="border-t border-gray-100 dark:border-gray-800">
						<td class="px-5 py-4 sm:px-6">
							<span
								class="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
								{{ user.name }}
							</span>
						</td>
						<td class="px-5 py-4 sm:px-6">
							<p class="text-gray-500 text-theme-sm dark:text-gray-400">
								{{ user.lastname }}
							</p>
						</td>
						<td class="px-5 py-4 sm:px-6">
							<p class="text-gray-500 text-theme-sm dark:text-gray-400">
								{{ user.email }}
							</p>
						</td>
						<td class="px-5 py-4 sm:px-6">
							<p class="text-gray-500 text-theme-sm dark:text-gray-400">
								{{ user.institution?.name }}
							</p>
						</td>
						<td class="px-5 py-4 sm:px-6">
							<div class="flex space-x-2">
								<btnEdit
									:table="'users'"
									:pk="user.id ?? index"
									@open="(data) => $emit('open', data)" />
								<btnDelete
									:table="'users'"
									:pk="user.id ?? index"
									@deleted="onUserDeleted" />
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

const users = ref([]);
const isLoading = ref(false);

const fetchUsers = async () => {
  isLoading.value = true;
  try {
    const res = await axios.get("users");
    users.value = res.data;
  } catch (err) {
    console.error("Error al obtener los usuarios:", err);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchUsers();
});

const onUserDeleted = (deletedId) => {
  users.value = users.value.filter((user) => user.id !== deletedId);
};

defineExpose({
  fetchData: fetchUsers,
});
</script>
