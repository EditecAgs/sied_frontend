<template>
	<AdminLayout>
		<PageBreadcrumb :pageTitle="currentPageTitle" />
		<div class="space-y-5 sm:space-y-6">
			<ComponentCard title="Catálogo de Especialidades">
				<btn-create :table="'Especialidad'" @open="({ mode, pk, table}) => openModal(mode, pk, table)" class="divide-error-900 hover:divide-error-800" />
				<mdlSpecialties
					:show="showModal"
					:data="modalData"
					@close="closeModal"
					@saved="handleSaved" />
				<TableSpecialties
					ref="tableRef"
					@open="({ mode, pk, table }) => openModal(mode, pk, table)"
					@open-confirm="openDeleteModal" />
				<mdlDeleteSpecialties
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
import TableSpecialties from "../../components/tables/basic-tables/TableSpecialties.vue";
import btnCreate from "../../components/buttons/btnCreate.vue";
import mdlSpecialties from '../../components/modals/modals-forms/mdlSpecialties.vue';
import { useModal } from "../../composables/UseModal";
import mdlDeleteSpecialties from "../../components/modals/delete-only/mdlDeleteSpecialte.vue"

const currentPageTitle = ref("Especialidades");
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
