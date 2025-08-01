<template>
	<AdminLayout>
		<PageBreadcrumb :pageTitle="currentPageTitle" />
		<div class="space-y-5 sm:space-y-6">
			<ComponentCard title="Catálogo de Periodos Academicos">
				<btn-create table="academic-periods" @open="({ mode, pk, table}) => openModal(mode, pk, table)" />
				<mdl-academic :show="showModal" :data="modalData" @close="closeModal" @saved="handleSaved" />
				<TableAcademic
					ref="tableRef"
					@open="({ mode, pk, table }) => openModal(mode, pk, table)"
					@open-confirm="openDeleteModal"/>
				<mdlDeleteAcademic
					:show="showDeleteModal"
					:table="deleteTarget.table"
					:pk="deleteTarget.pk"
					@close="showDeleteModal = false"
					@deleted="handleDeleted" />
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
import MdlAcademic from "../../components/modals/modals-forms/mdlAcademic.vue";
import mdlDeleteAcademic from "../../components/modals/delete-only/mdlDeleteAcademic.vue"

const currentPageTitle = ref("Periodos Academicos");
const { showModal, modalData, openModal, closeModal } = useModal();

const tableRef = ref(null);
const showDeleteModal = ref(false)
const deleteTarget = ref({ table: '', pk: null })

function openDeleteModal({ table, pk }) {
	deleteTarget.value = { table, pk }
	showDeleteModal.value = true
}
function handleDeleted() {
	tableRef.value?.fetchData()
	showDeleteModal.value = false
}

const handleSaved = () => {
  closeModal();
  tableRef.value?.fetchData();
};
</script>
