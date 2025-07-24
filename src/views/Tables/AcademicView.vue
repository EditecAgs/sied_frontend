<template>
	<AdminLayout>
		<PageBreadcrumb :pageTitle="currentPageTitle" />
		<div class="space-y-5 sm:space-y-6">
			<ComponentCard title="Catálogo de Periodos Academicos">
				<btn-create table="user" @open="({ mode, pk, table}) => openModal(mode, pk, table)" />
				<mdl-academic :show="showModal" :data="modalData" @close="closeModal" @saved="handleSaved" />
				<TableAcademic
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
import TableAcademic from "../../components/tables/basic-tables/TableAcademic.vue"
import btnCreate from "../../components/buttons/btnCreate.vue";
import { useModal } from "../../composables/UseModal";
import MdlAcademic from "../../components/modals/mdlAcademic.vue";

const currentPageTitle = ref("Periodos Academicos");
const { showModal, modalData, openModal, closeModal } = useModal();

const tableRef = ref(null);

const handleSaved = () => {
  closeModal();
  tableRef.value?.fetchData();
};
</script>
