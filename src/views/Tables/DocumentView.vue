<template>
	<AdminLayout>
		<PageBreadcrumb :pageTitle="currentPageTitle" />
		<div class="space-y-5 sm:space-y-6">
			<ComponentCard title="Catálogo de Estatus de Documentos">
				<btn-create :table="'Estado de Documento'" @open="({ mode, pk, table}) => openModal(mode, pk, table)" class="divide-error-900 hover:divide-error-800" />
				<mdlDocument
					:show="showModal"
					:data="modalData"
					@close="closeModal"
					@saved="handleSaved" />
				<TableDocument
					ref="tableRef"
					@open="({ mode, pk, table }) => openModal(mode, pk, table)"
					@open-confirm="openDeleteModal" />
				<mdlDeleteDocument
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
import TableDocument from "../../components/tables/basic-tables/TableDocument.vue";
import btnCreate from "../../components/buttons/btnCreate.vue";
import mdlDocument from '../../components/modals/modals-forms/mdlDocument.vue';
import { useModal } from "../../composables/UseModal";
import mdlDeleteDocument from "../../components/modals/delete-only/mdlDeleteDocument.vue"

const currentPageTitle = ref("Estatus de Documentos");
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
