<template>
	<admin-layout>
		<PageBreadcrumb :pageTitle="currentPageTitle" />
		<tutorials
			ref="tableRef"
			@open="({ mode, pk, table }) => openModal(mode, pk, table)"
			@open-confirm="openDeleteModal" />
	</admin-layout>
</template>

<script setup>
import AdminLayout from '../../components/layouts/AdminLayout.vue'
import PageBreadcrumb from '../../components/common/PageBreadcrumb.vue'
import tutorials from '../../components/resource/tutorials.vue';
import { useModal } from '../../composables/UseModal'
const { openModal } = useModal();
import { ref } from 'vue'
//import ProfileCard from '../../components/profile/ProfileCard.vue'
const currentPageTitle = ref('Tutoriales')
</script>
