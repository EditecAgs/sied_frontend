<template>
	<AdminLayout>
		<PageBreadcrumb :pageTitle="currentPageTitle" />
		<div class="space-y-5 sm:space-y-6">
			<ComponentCard title="Catálogo de Tipo de Organizaciones">
				<btn-create :table="'Tipo de Organizaciones'" @open="({ mode, pk, table}) => openModal(mode, pk, table)" class="divide-error-900 hover:divide-error-800" />
				<mdlTypes
					:show="showModal"
					:data="modalData"
					@close="closeModal"
					@saved="handleSaved" />
				<TableTypes
					ref="tableRef"
					@open="({ mode, pk, table }) => openModal(mode, pk, table)"
					@open-confirm="openDeleteModal" />
				<mdlDeleteTypes
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
import TableTypes from "../../components/tables/basic-tables/TableTypes.vue";
import btnCreate from "../../components/buttons/btnCreate.vue";
import mdlTypes from '../../components/modals/modals-forms/mdlTypes.vue';
import { useModal } from "../../composables/UseModal";
import mdlDeleteTypes from "../../components/modals/delete-only/mdlDeleteTypes.vue"

const currentPageTitle = ref("Tipo de Organizaciones");
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
