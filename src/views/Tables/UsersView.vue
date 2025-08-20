<template>
	<AdminLayout>
		<PageBreadcrumb :pageTitle="currentPageTitle" />
		<div class="space-y-5 sm:space-y-6">
			<ComponentCard title="Catálogo de Usuarios">
				<btn-create table="usuario" @open="({ mode, pk, table}) => openModal(mode, pk, table)" />
				<mdl-user :show="showModal" :data="modalData" @close="closeModal" @saved="handleSaved" />
				<TableUsers
					ref="tableRef"
					@open="({ mode, pk, table }) => openModal(mode, pk, table)"
					@open-confirm="openDeleteModal" />
				<mdlDeleteUser
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
import TableUsers from "../../components/tables/basic-tables/TableUsers.vue";
import btnCreate from "../../components/buttons/btnCreate.vue";
import MdlUser from '../../components/modals/modals-forms/mdlUser.vue';
import { useModal } from "../../composables/UseModal";
import mdlDeleteUser from "../../components/modals/delete-only/mdlDeleteUser.vue"

const currentPageTitle = ref("Usuarios");
const { showModal, modalData, openModal, closeModal } = useModal();

const tableRef = ref(null);
const showDeleteModal = ref(false)
const deleteTarget = ref({ table: '', pk: null })

function openDeleteModal({ table, pk }) {
  deleteTarget.value = { table, pk }
  showDeleteModal.value = true
}

const handleSaved = () => {
  closeModal();
  tableRef.value?.fetchData();
};
function handleDeleted() {
  tableRef.value?.fetchData()
  showDeleteModal.value = false
}
</script>