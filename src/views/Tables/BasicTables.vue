<template>
	<AdminLayout>
		<PageBreadcrumb :pageTitle="currentPageTitle" />
		<div class="space-y-5 sm:space-y-6">
			<ComponentCard title="Users Table">
				<btn-create :table="'user'" @open="openModal" />
				<mdl-create-user :show="showModal" @close="closeModal" />
				<BasicTableOne />
			</ComponentCard>
		</div>
	</AdminLayout>
</template>

<script setup>
import { ref } from "vue";
import PageBreadcrumb from "../../components/common/PageBreadcrumb.vue";
import AdminLayout from "../../components/layouts/AdminLayout.vue";
import ComponentCard from "../../components/common/componentCard.vue";
import BasicTableOne from "../../components/tables/basic-tables/BasicTableOne.vue";
import btnCreate from "../../components/buttons/btnCreate.vue";
import MdlCreateUser from '../../components/modals/mdlCreateUser.vue';

const currentPageTitle = ref("Users");

// Controla si el modal se muestra o no
const showModal = ref(false)

const openModal = () => {
	showModal.value = true
}

const closeModal = () => {
	showModal.value = false
}
</script>
