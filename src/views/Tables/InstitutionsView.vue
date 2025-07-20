<template>
	<AdminLayout>
		<PageBreadcrumb :pageTitle="currentPageTitle" />
		<div class="space-y-5 sm:space-y-6">
			<ComponentCard title="Catálogo de Instituciones">
				<btn-create :table="'institution'" @open="({ mode, pk, table}) => openModal(mode, pk, table)" class="divide-error-900 hover:divide-error-800" />
				<mdl-institution
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
import MdlInstitution from '../../components/modals/mdlInstitution.vue';
import { useModal } from "../../composables/UseModal";

const currentPageTitle = ref("Instituciones");
const { showModal, modalData, openModal, closeModal } = useModal();

const tableRef = ref(null);

const handleSaved = () => {
	closeModal();
	tableRef.value?.fetchData();
};
</script>
