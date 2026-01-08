<template>
	<AdminLayout>
		<PageBreadcrumb :pageTitle="currentPageTitle" />
		<div class="space-y-5 sm:space-y-6">
			<ComponentCard title="Registro de Modelo Dual">
				<div class="flex justify-start mb-4">
				<router-link
					to="/modelo-dual/crear"
					class="inline-flex items-center px-4 py-2 rounded-md shadow-sm
						text-sm font-medium text-white
						bg-brand-800 hover:bg-brand-900
						focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-700"
				>
					<PlusIcon class="h-5 w-5 mr-2" />
					Crear
				</router-link>
				</div>

				<TableModeloDual
					ref="tableRef"
					@open="handleOpen"
					@open-confirm="openDeleteModal"/>
				<mdlDeleteModelDual
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
import AdminLayout from "../../components/layouts/AdminLayout.vue";
import PlusIcon from "../../icons/PlusIcon.vue";
import PageBreadcrumb from "../../components/common/PageBreadcrumb.vue";
import ComponentCard from "../../components/common/componentCard.vue";
import btnCreate from "../../components/buttons/btnCreate.vue";
import mdlCreateEditDual from "../../components/modals/modals-forms/mdlCreateEditDual.vue";
import TableModeloDual from "../../components/tables/basic-tables/TableModeloDual.vue";
import mdlDeleteModelDual from "../../components/modals/delete-only/mdlDeleteModelDual.vue"
import { useModal } from "../../composables/UseModal";
import { useRouter } from 'vue-router';

const router = useRouter();

const currentPageTitle = ref("Modelo Dual");
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
const handleOpen = ({ mode, pk, table }) => {
  if (mode === 'edit') {
    router.push(`/modelo-dual/editar/${pk}`);
  } else if (mode === 'complete') {
    router.push(`/modelo-dual/completar/${pk}`);
  }
};

const handleSaved = () => {
	closeModal();
	tableRef.value?.fetchData();
};
</script>
