<template>
	<div class="bg-white rounded-xl shadow-lg overflow-hidden">
		<div class="px-6 py-4 bg-gradient-to-r from-brand-800 to-brand-900">
			<div class="flex justify-between items-center">
				<h2 class="text-xl font-bold text-white">Gestión de Usuarios</h2>
				<button
					class="flex items-center gap-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm transition-all"
					@click="clearFilters">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
					</svg>
					Limpiar
				</button>
			</div>
		</div>

		<div class="overflow-x-auto custom-scrollbar">
			<table class="min-w-full">
				<thead>
					<tr class="bg-brand-800/80 text-white">
						<th class="px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50 border-r border-brand-700/30">Nombre</th>
						<th class="px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50 border-r border-brand-700/30">Apellido</th>
						<th class="px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50 border-r border-brand-700/30">E-mail</th>
						<th class="px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50 border-r border-brand-700/30">Institución</th>
						<th class="px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50">Opciones</th>
					</tr>
					<tr class="bg-brand-800/60 text-white">
						<th class="px-5 py-2 border-b border-brand-700/50 border-r border-brand-700/30">
							<input v-model="filters.name" class="w-full bg-white/10 border-none text-white placeholder-white/60 rounded px-3 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-white/50" placeholder="Nombre" />
						</th>
						<th class="px-5 py-2 border-b border-brand-700/50 border-r border-brand-700/30">
							<input v-model="filters.lastname" class="w-full bg-white/10 border-none text-white placeholder-white/60 rounded px-3 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-white/50" placeholder="Apellido" />
						</th>
						<th class="px-5 py-2 border-b border-brand-700/50 border-r border-brand-700/30">
							<input v-model="filters.email" class="w-full bg-white/10 border-none text-white placeholder-white/60 rounded px-3 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-white/50" placeholder="Correo" />
						</th>
						<th class="px-5 py-2 border-b border-brand-700/50 border-r border-brand-700/30">
							<input v-model="filters.institution" class="w-full bg-white/10 border-none text-white placeholder-white/60 rounded px-3 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-white/50" placeholder="Institución" />
						</th>
						<th class="px-5 py-2 border-b border-brand-700/50" />
					</tr>
				</thead>

				<tbody>
					<tr v-if="isLoading">
						<td colspan="5" class="py-12 text-center">
							<svg class="animate-spin h-8 w-8 text-brand-800 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
							</svg>
							<p class="text-gray-500">Cargando Usuarios...</p>
						</td>
					</tr>

					<tr v-for="(user, index) in paginatedUsers" :key="user.id ?? index" class="border-b border-gray-100 hover:bg-brand-50/30 transition-colors even:bg-gray-50">
						<td class="px-5 py-3 text-sm border-r border-gray-100">
							<span class="block font-medium text-gray-800">{{ user.name }}</span>
						</td>
						<td class="px-5 py-3 text-sm border-r border-gray-100 text-gray-600">
							{{ user.lastname }}
						</td>
						<td class="px-5 py-3 text-sm border-r border-gray-100 text-gray-600">
							{{ user.email }}
						</td>
						<td class="px-5 py-3 text-sm border-r border-gray-100 text-gray-600">
							{{ user.institution?.name }}
						</td>
						<td class="px-5 py-3 text-sm">
							<div class="flex space-x-2">
								<btnEdit :table="'usuario'" :pk="user.id ?? index" @open="(data) => $emit('open', data)" />
								<btnDelete :table="'users'" :pk="user.id ?? index" @open-confirm="(payload) => $emit('open-confirm', payload)" />
							</div>
						</td>
					</tr>

					<tr v-if="!isLoading && filteredUsers.length === 0">
						<td colspan="5" class="px-5 py-8 text-center">
							<p class="text-gray-500">No se encontraron usuarios</p>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<div class="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
			<span class="text-xs text-gray-600">
				Mostrando {{ paginatedUsers.length }} de {{ filteredUsers.length }} registros
			</span>
			<div class="flex items-center space-x-2">
				<select v-model="rowsPerPage" class="text-xs border border-gray-300 rounded px-2 py-1 text-gray-700">
					<option value="10">10 por página</option>
					<option value="25">25 por página</option>
					<option value="50">50 por página</option>
				</select>
				<button :disabled="currentPage === 1" class="p-1 rounded-full text-brand-800 hover:bg-brand-100 disabled:opacity-30" @click="currentPage--">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
					</svg>
				</button>
				<button :disabled="currentPage === totalPages" class="p-1 rounded-full text-brand-800 hover:bg-brand-100 disabled:opacity-30" @click="currentPage++">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
					</svg>
				</button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import btnEdit from "../../../components/buttons/btnEdit.vue";
import btnDelete from "../../../components/buttons/btnDelete.vue";
import { getUsers } from "../../../services/users/users";

const users = ref([]);
const isLoading = ref(false);

const filters = ref({
	name: "",
	lastname: "",
	email: "",
	institution: ""
});

const rowsPerPage = ref(10);
const currentPage = ref(1);

const filteredUsers = computed(() => {
	const name = filters.value.name.trim().toLowerCase();
	const lastname = filters.value.lastname.trim().toLowerCase();
	const email = filters.value.email.trim().toLowerCase();
	const institution = filters.value.institution.trim().toLowerCase();

	return users.value.filter(user => {
		const userName = (user.name ?? "").toLowerCase();
		const userLastname = (user.lastname ?? "").toLowerCase();
		const userEmail = (user.email ?? "").toLowerCase();
		const userInstitution = (user.institution?.name ?? "").toLowerCase();

		return (
			userName.includes(name) &&
			userLastname.includes(lastname) &&
			userEmail.includes(email) &&
			userInstitution.includes(institution)
		);
	});
});

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / rowsPerPage.value));

const paginatedUsers = computed(() => {
	const start = (currentPage.value - 1) * rowsPerPage.value;
	return filteredUsers.value.slice(start, start + rowsPerPage.value);
});

const clearFilters = () => {
	filters.value = {
		name: "",
		lastname: "",
		email: "",
		institution: ""
	};
	currentPage.value = 1;
};

const fetchData = async () => {
	isLoading.value = true;
	try {
		const { data } = await getUsers();
		users.value = data;
	} finally {
		isLoading.value = false;
	}
};

onMounted(() => {
	fetchData();
});

defineExpose({
	fetchData
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
	height: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
	background: #f1f1f1;
	border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
	background: #82181a;
	border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
	background: #460809;
}
</style>
