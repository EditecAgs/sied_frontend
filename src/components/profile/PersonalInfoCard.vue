<template>
	<div>
		<div class="p-5 mb-6 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
			<div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
				<div>
					<h4 class="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
						Información Personal
					</h4>

					<div class="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
						<div>
							<p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Nombre</p>
							<p class="text-sm font-medium text-gray-800 dark:text-white/90">{{ user.name }}</p>
						</div>

						<div>
							<p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Apellido</p>
							<p class="text-sm font-medium text-gray-800 dark:text-white/90">{{ user.lastname }}</p>
						</div>

						<div>
							<p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
								Dirección de Email
							</p>
							<p class="text-sm font-medium text-gray-800 dark:text-white/90">
								{{ user.email }}
							</p>
						</div>

						<div>
							<p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Institución</p>
							<p class="text-sm font-medium text-gray-800 dark:text-white/90">
								{{ user.institution.name }}
							</p>
						</div>
					</div>
				</div>
				
				<btnEdit
					:table="'perfil'"
					:pk="user.id"
					@open="({ mode, pk, table }) => openModal(mode, pk, table)" />
				
				<mdl-user
					:show="showModal"
					:data="modalData"
					@close="closeModal"
					@saved="handleSaved" />
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getProfile } from '../../services/users/users.js'
import btnEdit from "../buttons/btnEdit.vue"
import MdlUser from '../modals/modals-forms/mdlUser.vue'
import { useModal } from "../../composables/UseModal"

const { showModal, modalData, openModal, closeModal } = useModal()

const user = ref({
	name: '',
	lastname: '',
	email: '',
	institution: {
		name: ''
	}
})


const handleSaved = () => {
	closeModal()
	fetchData()
}

const fetchData = async () => {
	try {
		const userRes = await getProfile()
		user.value = userRes.data
		console.log('Usuario cargado:', user.value)
	} catch (err) {
		console.error('Error al cargar perfil:', err)
	}
}

onMounted(() => {
	fetchData()
})
</script>
