<template>
	<AdminLayout>
		<PageBreadcrumb :pageTitle="currentPageTitle" />
		<div class="space-y-5 sm:space-y-6">
			<ComponentCard title="Users Table">
				<btn-create table="user" @open="({ mode, pk, table}) => openModal(mode, pk, table)" />
				<mdl-create-user
					:show="showModal"
					:data="modalData"
					@close="closeModal"
					@saved="handleSaved" />
				<BasicTableOne
					ref="tableRef"
					@open="({ mode, pk, table }) => openModal(mode, pk, table)" />
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
import { useModal } from "../../composables/UseModal";

const currentPageTitle = ref("Users");
const { showModal, modalData, openModal, closeModal } = useModal();

const tableRef = ref(null);

const handleSaved = () => {
  closeModal();
  tableRef.value?.fetchData(); 
};
</script>
