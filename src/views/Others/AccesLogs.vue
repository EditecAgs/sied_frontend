<template>
	<admin-layout>
		<PageBreadcrumb :pageTitle="currentPageTitle" />
		<div
			class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
			<h3 class="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">Registro de Accesos de Usuario</h3>
		</div>
		<access-logs
			ref="tableRef"
			@open="({ mode, pk, table }) => openModal(mode, pk, table)"
			@open-confirm="openDeleteModal" />
	</admin-layout>
</template>

<script setup>
import AdminLayout from '../../components/layouts/AdminLayout.vue'
import PageBreadcrumb from '../../components/common/PageBreadcrumb.vue'
import accessLogs from '../../components/tables/accessLogs.vue'
import { useModal } from '../../composables/UseModal'
const { openModal } = useModal();
import { ref } from 'vue'
//import ProfileCard from '../../components/profile/ProfileCard.vue'
const currentPageTitle = ref('Historial de accesos')
</script>
