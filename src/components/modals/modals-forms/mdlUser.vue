<script setup lang="ts">
import { defineProps, defineEmits, reactive, watchEffect, ref, onMounted, nextTick, computed } from 'vue'
import axios from 'axios'
import { getInstitutions } from '../../../services/institutions/institutions.js'
import { showUsers, createUsers, updateUsers } from "../../../services/users/users.js"
import btnCreate from '../../buttons/btnCreate.vue'
import mdlInstitution from '../modals-forms/mdlInstitution.vue'
import { useModal } from '../../../composables/UseModal'

const { showModal, modalData, openModal, closeModal } = useModal()

interface UserForm {
	name: string
	lastname: string
	email: string
	id_institution: string
	password: string
	password_confirmation: string
}

interface UserFormErrors {
	name?: string
	lastname?: string
	email?: string
	id_institution?: string
	password?: string
	password_confirmation?: string
	general?: string
}

interface Institution {
	id: string | number
	name: string
}

// eslint-disable-next-line vue/valid-define-props
const props = defineProps<{
	show: boolean
	data: {
		mode: 'create' | 'edit'
		pk: number | null
		table: string
	}
}>()

const emit = defineEmits(['close', 'saved'])

const isLoading = ref(false)
const showPassword = ref(false)
const formErrors = ref<UserFormErrors>({})
const institutions = ref<Institution[]>([])
const showInstitutionDropdown = ref(false)
const institutionSearch = ref('')
const institutionDropdownRef = ref<HTMLElement | null>(null)

const alvRoute = ref('')
const alvMethod = ref<'POST' | 'PUT'>('POST')

const form = reactive<UserForm>({
	name: '',
	lastname: '',
	email: '',
	id_institution: '',
	password: '',
	password_confirmation: ''
})

const filteredInstitutions = computed(() => {
	if (!institutionSearch.value) return institutions.value
	return institutions.value.filter(inst =>
		inst.name.toLowerCase().includes(institutionSearch.value.toLowerCase())
	)
})

const loadInstitutions = async () => {
	try {
		const response = await getInstitutions()
		institutions.value = response.data
		return response.data
	} catch (error) {
		console.error('Error al cargar instituciones:', error)
		return []
	}
}
const selectInstitution = (institution: Institution) => {
	form.id_institution = institution.id.toString()
	institutionSearch.value = institution.name
	showInstitutionDropdown.value = false
}

const handleSavedInstitution = async (newInstitution: any) => {
	try {
		await loadInstitutions()

		await nextTick()

		if (newInstitution) {
			const justCreatedInstitution = institutions.value.find(
				inst => inst.id.toString() === newInstitution.id?.toString() ||
					inst.name === newInstitution.name
			)

			if (justCreatedInstitution) {
				selectInstitution(justCreatedInstitution)

				showInstitutionDropdown.value = false
			} else {
				console.warn('No se encontró la institución recién creada:', newInstitution)
			}
		}

		closeModal()
	} catch (error) {
		console.error('Error al recargar instituciones:', error)
		closeModal()
	}
}


const openCreateInstitution = () => {
	openModal('create', null, 'institucion')
}

const handleClickOutside = (event: MouseEvent) => {
	if (institutionDropdownRef.value && !institutionDropdownRef.value.contains(event.target as Node)) {
		showInstitutionDropdown.value = false
	}
}

onMounted(() => {
	loadInstitutions()
	document.addEventListener('click', handleClickOutside)
})

import { onBeforeUnmount } from 'vue'
onBeforeUnmount(() => {
	document.removeEventListener('click', handleClickOutside)
})

watchEffect(() => {
	if (props.data.mode === 'edit') {
		isLoading.value = true

		if (props.data.table === 'perfil') {
			alvRoute.value = `${axios.defaults.baseURL}profile`
			alvMethod.value = 'PUT'

			axios.get('/profile')
				.then(res => {
					const user = res.data
					form.name = user.name || ''
					form.lastname = user.lastname || ''
					form.email = user.email || ''
					form.id_institution = user.id_institution || ''
					form.password = ''
					form.password_confirmation = ''

					// Establecer el texto de búsqueda basado en la institución seleccionada
					if (user.id_institution && institutions.value.length > 0) {
						const selectedInstitution = institutions.value.find(inst =>
							inst.id.toString() === user.id_institution.toString()
						)
						if (selectedInstitution) {
							institutionSearch.value = selectedInstitution.name
						}
					}
				})
				.catch(error => {
					console.error('Error al cargar perfil:', error)
					formErrors.value = error.response?.data?.errors || {}
				})
				.finally(() => { isLoading.value = false })
		}
		else if (props.data.pk !== null) {
			alvRoute.value = `${axios.defaults.baseURL}users/${props.data.pk}`
			alvMethod.value = 'PUT'

			showUsers(props.data.pk)
				.then(res => {
					const user = res.data
					form.name = user.name || ''
					form.lastname = user.lastname || ''
					form.email = user.email || ''
					form.id_institution = user.id_institution || ''
					form.password = ''
					form.password_confirmation = ''

					if (user.id_institution && institutions.value.length > 0) {
						const selectedInstitution = institutions.value.find(inst =>
							inst.id.toString() === user.id_institution.toString()
						)
						if (selectedInstitution) {
							institutionSearch.value = selectedInstitution.name
						}
					}
				})
				.catch(error => {
					console.error('Error al cargar usuario:', error)
					formErrors.value = error.response?.data?.errors || {}
				})
				.finally(() => { isLoading.value = false })
		}
	}
	else if (props.data.mode === 'create') {
		alvRoute.value = `${axios.defaults.baseURL}users`
		alvMethod.value = 'POST'

		form.name = ''
		form.lastname = ''
		form.email = ''
		form.id_institution = ''
		form.password = ''
		form.password_confirmation = ''
		institutionSearch.value = ''
		formErrors.value = {}
	}
})


const validateForm = (): boolean => {
	const errors: UserFormErrors = {}

	if (!form.name.trim()) errors.name = 'El nombre es requerido'
	else if (form.name.length > 255) errors.name = 'El nombre no puede tener más de 255 caracteres'

	if (!form.lastname.trim()) errors.lastname = 'El apellido es requerido'
	else if (form.lastname.length > 255) errors.lastname = 'El apellido no puede tener más de 255 caracteres'

	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
	if (!form.email.trim()) errors.email = 'El correo electrónico es requerido'
	else if (!emailRegex.test(form.email)) errors.email = 'El formato del correo no es válido'
	else if (form.email.length > 255) errors.email = 'El correo electrónico no puede tener más de 255 caracteres'

	if (!form.id_institution) errors.id_institution = 'La institución es requerida'

	if (props.data.mode === 'create') {
		if (!form.password) errors.password = 'La contraseña es requerida'
		else if (form.password.length < 8) errors.password = 'Debe tener al menos 8 caracteres'
	} else if (props.data.mode === 'edit' && form.password && form.password.length < 8) {
		errors.password = 'Debe tener al menos 8 caracteres'
	}

	if (form.password && form.password !== form.password_confirmation) {
		errors.password_confirmation = 'Las contraseñas no coinciden'
	}

	formErrors.value = errors
	return Object.keys(errors).length === 0
}

const submitForm = async (event: Event) => {
	event.preventDefault()
	if (!validateForm()) return

	isLoading.value = true

	try {
		const formData: Record<string, any> = {
			name: form.name,
			lastname: form.lastname,
			email: form.email,
			id_institution: form.id_institution
		}

		if (form.password) {
			formData.password = form.password
			formData.password_confirmation = form.password_confirmation
		}


		let response
		if (props.data.mode === 'create') {
			response = await createUsers(formData)
		}
		else if (props.data.mode === 'edit') {
			if (props.data.table === 'perfil') {
				response = await axios.put('/profile', formData)
			} else if (props.data.pk) {
				response = await updateUsers(props.data.pk, formData)
			}
		}

		afterDone(response)
	} catch (error: any) {
		console.error('Error al guardar usuario:', error)

		if (error.response?.data?.errors) {
			formErrors.value = error.response.data.errors
		} else if (error.response?.data?.message) {
			formErrors.value.general = error.response.data.message
		} else {
			formErrors.value.general = 'Error al guardar el usuario'
		}

		afterError(error.response)
	} finally {
		isLoading.value = false
	}
}

const afterDone = (response: any) => {
	console.log('Usuario guardado exitosamente:', response.data)
	emit('saved')
	emit('close')
}

const afterError = (response: any) => {
	console.log('Error al enviar:', response?.data)
}

const togglePasswordVisibility = () => {
	showPassword.value = !showPassword.value
}
</script>

<template>
	<transition name="fade-scale">
		<div
			v-if="show"
			class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
			style="margin-top: 0px"
			@click.self="emit('close')">
			<div
				class="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-8 relative max-h-[85vh] flex flex-col overflow-hiddenbg-cover bg-center"
				style="background-image: url('/images/background/bg-white-flores.png');">
				<div class="flex items-center justify-between bg-brand-900 -mx-8 -mt-8 px-8 py-4 rounded-t-2xl">
					<h4 class="text-xl font-semibold text-white">
						{{ data.mode === 'create'
							? `Crear ${data.table}`
							: data.table === 'perfil'
								? 'Editar mi perfil'
								: `Editar ${data.table}` }}
					</h4>

					<div class="flex items-center gap-4">
						<div
							v-if="isLoading"
							class="w-6 h-6 border-4 border-white/40 border-t-white rounded-full animate-spin" />

						<button
							class="text-white/80 hover:text-white text-2xl font-bold leading-none"
							@click="emit('close')">
							&times;
						</button>
					</div>
				</div>

				<div v-if="formErrors.general" class="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
					{{ formErrors.general }}
				</div>

				<form
					id="UserForm"
					class="flex-grow overflow-y-auto pr-2"
					@submit="submitForm">
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 mt-5">
						<div class="form-error">
							<label class="block text-sm font-medium text-gray-700 mb-1">Nombre*</label>
							<template v-if="isLoading">
								<div class="h-8 bg-gray-300 rounded animate-pulse" />
							</template>
							<template v-else>
								<input
									v-model="form.name"
									type="text"
									name="name"
									required
									maxlength="255"
									:class="[
										'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-brand-800',
										formErrors.name ? 'border-red-500' : 'border-gray-300'
									]" />
								<div v-if="formErrors.name" class="text-red-500 text-sm mt-1">
									{{ formErrors.name }}
								</div>
							</template>
						</div>

						<div class="form-error">
							<label class="block text-sm font-medium text-gray-700 mb-1">Apellido*</label>
							<template v-if="isLoading">
								<div class="h-8 bg-gray-300 rounded animate-pulse" />
							</template>
							<template v-else>
								<input
									v-model="form.lastname"
									type="text"
									name="lastname"
									required
									maxlength="255"
									:class="[
										'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-brand-800',
										formErrors.lastname ? 'border-red-500' : 'border-gray-300'
									]" />
								<div v-if="formErrors.lastname" class="text-red-500 text-sm mt-1">
									{{ formErrors.lastname }}
								</div>
							</template>
						</div>

						<div class="form-error">
							<label class="block text-sm font-medium text-gray-700 mb-1">Correo*</label>
							<template v-if="isLoading">
								<div class="h-8 bg-gray-300 rounded animate-pulse" />
							</template>
							<template v-else>
								<input
									v-model="form.email"
									type="email"
									name="email"
									required
									maxlength="255"
									:class="[
										'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-brand-800',
										formErrors.email ? 'border-red-500' : 'border-gray-300'
									]" />
								<div v-if="formErrors.email" class="text-red-500 text-sm mt-1">
									{{ formErrors.email }}
								</div>
							</template>
						</div>

						<div class="form-error">
							<label class="block text-sm font-medium text-gray-700 mb-1">Institución*</label>
							<div class="flex gap-2 items-start">
								<div ref="institutionDropdownRef" class="flex-1 relative">
									<div class="relative">
										<input
											v-model="institutionSearch"
											type="text"
											placeholder="Buscar institución..."
											:class="[
												'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-brand-800',
												formErrors.id_institution ? 'border-red-500' : 'border-gray-300'
											]"
											@focus="showInstitutionDropdown = true"
											@input="showInstitutionDropdown = true" />

										<div
											v-if="showInstitutionDropdown && filteredInstitutions.length > 0"
											class="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
											<div class="py-1">
												<div
													v-for="inst in filteredInstitutions"
													:key="inst.id"
													class="px-3 py-2 cursor-pointer hover:bg-gray-100 transition-colors"
													:class="{
														'bg-brand-50 text-brand-700': form.id_institution === inst.id.toString()
													}"
													@click="selectInstitution(inst)">
													{{ inst.name }}
												</div>
											</div>
										</div>

										<div
											v-if="showInstitutionDropdown && institutionSearch && filteredInstitutions.length === 0"
											class="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-3">
											<p class="text-gray-600 text-sm mb-2">No se encontraron instituciones.</p>
											<button
												type="button"
												class="text-brand-600 hover:text-brand-800 underline text-sm font-medium"
												@click="openCreateInstitution">
												¿Crear nueva institución?
											</button>
										</div>
									</div>

									<input
										type="hidden"
										name="id_institution"
										:value="form.id_institution" />

									<div v-if="formErrors.id_institution" class="text-red-500 text-sm mt-1">
										{{ formErrors.id_institution }}
									</div>
								</div>

								<btn-create
									:table="'Institución'"
									class="h-10 px-3 flex-shrink-0 mt-0.5"
									tooltip="Crear nueva institución"
									@open="openCreateInstitution" />
							</div>
						</div>

						<div class="form-error md:col-span-2">
							<label class="block text-sm font-medium text-gray-700 mb-1">
								Contraseña{{ data.mode === 'create' ? '*' : '' }}
								<span v-if="data.mode === 'edit'" class="text-gray-500 text-xs">(Dejar en blanco para mantener la actual)</span>
							</label>
							<template v-if="isLoading">
								<div class="h-8 bg-gray-300 rounded animate-pulse" />
							</template>
							<template v-else>
								<div class="relative">
									<input
										v-model="form.password"
										:type="showPassword ? 'text' : 'password'"
										name="password"
										:required="data.mode === 'create'"
										:minlength="data.mode === 'create' ? 8 : 0"
										:placeholder="data.mode === 'edit' ? 'Nueva contraseña (opcional)' : 'Ingresa la contraseña'"
										:class="[
											'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-brand-800 pr-10',
											formErrors.password ? 'border-red-500' : 'border-gray-300'
										]" />
									<button
										type="button"
										class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
										@click="togglePasswordVisibility">
										<span v-if="showPassword">👁️</span>
										<span v-else>👁️‍🗨️</span>
									</button>
								</div>
								<div v-if="formErrors.password" class="text-red-500 text-sm mt-1">
									{{ formErrors.password }}
								</div>
								<div v-else class="text-gray-500 text-xs mt-1">
									La contraseña debe tener al menos 8 caracteres
								</div>
							</template>
						</div>

						<div v-if="form.password" class="form-error md:col-span-2">
							<label class="block text-sm font-medium text-gray-700 mb-1">Confirmar Contraseña*</label>
							<template v-if="isLoading">
								<div class="h-8 bg-gray-300 rounded animate-pulse" />
							</template>
							<template v-else>
								<div class="relative">
									<input
										v-model="form.password_confirmation"
										:type="showPassword ? 'text' : 'password'"
										name="password_confirmation"
										:required="form.password !== ''"
										placeholder="Confirma la contraseña"
										:class="[
											'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-brand-800 pr-10',
											formErrors.password_confirmation ? 'border-red-500' : 'border-gray-300'
										]" />
									<button
										type="button"
										class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
										@click="togglePasswordVisibility">
										<span v-if="showPassword">👁️</span>
										<span v-else>👁️‍🗨️</span>
									</button>
								</div>
								<div v-if="formErrors.password_confirmation" class="text-red-500 text-sm mt-1">
									{{ formErrors.password_confirmation }}
								</div>
							</template>
						</div>
					</div>

					<div class="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 sticky bottom-0 ">
						<button
							type="button"
							class="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition"
							@click="emit('close')">
							Cancelar
						</button>
						<button
							type="submit"
							:disabled="isLoading"
							class="flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-brand-700 to-brand-900 text-white font-semibold hover:brightness-110 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
							<span v-if="isLoading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
							<span>{{ isLoading ? 'Guardando...' : 'Guardar' }}</span>
						</button>
					</div>
				</form>

				<mdlInstitution
					:show="showModal"
					:data="modalData"
					@close="closeModal"
					@saved="handleSavedInstitution" />
			</div>
		</div>
	</transition>
</template>

<style scoped>
.fade-scale-enter-active,
.fade-scale-leave-active {
	transition: all 0.3s ease;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
	opacity: 0;
	transform: scale(0.95);
}
.fade-scale-enter-to,
.fade-scale-leave-from {
	opacity: 1;
	transform: scale(1);
}
</style>