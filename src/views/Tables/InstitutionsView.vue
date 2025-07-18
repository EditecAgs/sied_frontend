<template>
	<AdminLayout>
		<PageBreadcrumb :pageTitle="currentPageTitle" />
		<div class="space-y-5 sm:space-y-6">
			<ComponentCard title="Catálogo de Instituciones">
				<btn-create :table="'institution'" @open="({ mode, pk, table}) => openModal(mode, pk, table)" class="divide-error-900 hover:divide-error-800" />
				<mdl-create-edit-institution
					:show="showModal"
					:data="modalData"
					@close="closeModal"
					@saved="handleSaved" />
				<TableInstitutions
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
import TableInstitutions from "../../components/tables/basic-tables/TableInstitutions.vue";
import btnCreate from "../../components/buttons/btnCreate.vue";
import MdlCreateEditInstitution from '../../components/modals/mdlCreateEditInstitution.vue';
import { useModal } from "../../composables/UseModal";

const currentPageTitle = ref("institutions");
const { showModal, modalData, openModal, closeModal } = useModal();

const tableRef = ref(null);

const handleSaved = () => {
	closeModal();
	tableRef.value?.fetchData();
};
</script>
