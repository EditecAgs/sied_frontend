<template>
	<AdminLayout>
		<PageBreadcrumb :pageTitle="currentPageTitle" />
		<div class="space-y-5 sm:space-y-6">
			<ComponentCard title="Catálogo de Subsistemas">
				<btn-create table="subsystems" @open="({ mode, pk, table}) => openModal(mode, pk, table)" />
				<mdl-subsystems :show="showModal" :data="modalData" @close="closeModal" @saved="handleSaved" />
				<TableSubsystems
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
import TableSubsystems from "../../components/tables/basic-tables/TableSubsystems.vue";
import btnCreate from "../../components/buttons/btnCreate.vue";
import MdlSubsystems from "../../components/modals/mdlSubystems.vue"
import { useModal } from "../../composables/UseModal";

const currentPageTitle = ref("Subsistemas");
const { showModal, modalData, openModal, closeModal } = useModal();

const tableRef = ref(null);

const handleSaved = () => {
  closeModal();
  tableRef.value?.fetchData();
};
</script>
