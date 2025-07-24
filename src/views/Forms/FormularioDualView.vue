<template>
	<AdminLayout>
		<PageBreadcrumb :pageTitle="currentPageTitle" />
		<div class="space-y-5 sm:space-y-6">
			<ComponentCard title="Registro de Modelo Dual">
				<btnCreate
					table="modelo dual"
					@open="({ mode, pk, table }) => openModal(mode, pk, table)" />

				<mdlCreateEditDual
					:show="showModal"
					:data="modalData"
					@close="closeModal"
					@saved="handleSaved" />

				<TableModeloDual
					ref="tableRef"
					@open="({ mode, pk, table }) => openModal(mode, pk, table)" />
			</ComponentCard>
		</div>
	</AdminLayout>
</template>

<script setup>
import { ref } from "vue";
import AdminLayout from "../../components/layouts/AdminLayout.vue";
import PageBreadcrumb from "../../components/common/PageBreadcrumb.vue";
import ComponentCard from "../../components/common/componentCard.vue";
import btnCreate from "../../components/buttons/btnCreate.vue";
import mdlCreateEditDual from "../../components/modals/mdlCreateEditDual.vue";
import TableModeloDual from "../../components/tables/basic-tables/TableModeloDual.vue";
import { useModal } from "../../composables/UseModal";

const currentPageTitle = ref("Modelo Dual");
const { showModal, modalData, openModal, closeModal } = useModal();
const tableRef = ref(null);

const handleSaved = () => {
	closeModal();
	tableRef.value?.fetchData();
};
</script>
