<template>
	<AdminLayout>
		<PageBreadcrumb :pageTitle="currentPageTitle" />
		<div class="space-y-5 sm:space-y-6">
			<ComponentCard title="Catálogo de Subsistemas">
				<btn-create table="subsistema" @open="({ mode, pk, table}) => openModal(mode, pk, table)" />
				<mdl-subsystems :show="showModal" :data="modalData" @close="closeModal" @saved="handleSaved" />
				<TableSubsystems
					ref="tableRef"
					@open="({ mode, pk, table }) => openModal(mode, pk, table)"
					@open-confirm="openDeleteModal" />
				<mdlDeleteSubsystems
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
import TableSubsystems from "../../components/tables/basic-tables/TableSubsystems.vue";
import btnCreate from "../../components/buttons/btnCreate.vue";
import MdlSubsystems from "../../components/modals/modals-forms/mdlSubystems.vue"
import { useModal } from "../../composables/UseModal";
import mdlDeleteSubsystems from "../../components/modals/delete-only/mdlDeleteSubsystems.vue"

const currentPageTitle = ref("Subsistemas");
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
