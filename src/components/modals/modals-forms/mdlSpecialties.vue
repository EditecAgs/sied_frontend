<script setup lang="ts">
import { defineProps, defineEmits, reactive, watchEffect, ref, onMounted, computed, watch, nextTick } from 'vue'
import axios from 'axios'
import { getCareers } from '../../../services/institutions/careers'
import { getInstitutions } from '../../../services/institutions/institutions'
import { showSpecialty } from '../../../services/institutions/specialties'
import btnCreate from '../../buttons/btnCreate.vue'
import mdlInstitution from '../modals-forms/mdlInstitution.vue'
import mdlCareer from '../modals-forms/mdlCareers.vue'
import { useModal } from '../../../composables/UseModal'

const { showModal, modalData, openModal, closeModal } = useModal()

const emit = defineEmits(['close', 'saved'])
const isLoading = ref(false)
const alvRoute = ref('')
const alvMethod = ref<'POST' | 'PUT'>('POST')

const careers = ref<any[]>([])
const institutions = ref<any[]>([])

const filteredCareers = computed(() => {
	if (!form.id_institution) {
		return careers.value;
	}

	const institutionId = parseInt(form.id_institution);
	return careers.value.filter(career =>
		career.id_institution === institutionId
	);
});

const hasCareersForInstitution = computed(() => {
	if (!form.id_institution) return true;
	return filteredCareers.value.length > 0;
});

// Manejar guardado de institución
const handleSavedInstitution = async (newInstitution: any) => {
	try {
		// Recargar instituciones
		await loadInstitutions()

		// Dar tiempo a Vue para actualizar
		await nextTick()

		if (newInstitution) {
			// Seleccionar automáticamente la nueva institución
			form.id_institution = newInstitution.id.toString()
		}

		closeModal()
	} catch (error) {
		console.error('Error al recargar instituciones:', error)
		closeModal()
	}
}

// Manejar guardado de carrera
const handleSavedCareer = async (newCareer: any) => {
	try {
		// Recargar carreras
		await loadCareers()

		// Dar tiempo a Vue para actualizar
		await nextTick()

		if (newCareer) {
			// Seleccionar automáticamente la nueva carrera
			form.id_career = newCareer.id.toString()

			// Si no había institución seleccionada, seleccionar la de la carrera
			if (!form.id_institution && newCareer.id_institution) {
				form.id_institution = newCareer.id_institution.toString()
			}
		}

		closeModal()
	} catch (error) {
		console.error('Error al recargar carreras:', error)
		closeModal()
	}
}

// Abrir modal para crear institución
const openCreateInstitution = () => {
	openModal('create', null, 'institucion')
}

// Abrir modal para crear carrera
const openCreateCareer = () => {
	openModal('create', null, 'carrera')
}

const afterDone = (response) => {
	emit('saved', response.data)
	emit('close')
}

const afterError = (error: any) => {
	console.log('Error al enviar:', error.response?.data || error.message)
}

// eslint-disable-next-line vue/valid-define-props
const props = defineProps<{
	show: boolean
	data: {
		mode: 'create' | 'edit'
		pk: number | null
		table: string
		careerId?: string // Agregar careerId como prop opcional
	}
}>()

const form = reactive({
	id: '',
	name: '',
	id_institution: '',
	id_career: ''
})

// Cargar instituciones
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

const loadCareers = async () => {
	try {
		const response = await getCareers()
		careers.value = response.data
		return response.data
	} catch (error) {
		console.error('Error al cargar carreras:', error)
		return []
	}
}

// Cargar todos los datos
const loadSelectData = async () => {
	try {
		await Promise.all([
			loadCareers(),
			loadInstitutions()
		])
	} catch (error) {
		console.error('❌ Error cargando opciones:', error)
	}
}

// MODIFICACIÓN: Watch para props.data que ahora maneja careerId
watch(() => props.data, (newData) => {
	console.log('🔍 Props.data cambiado:', newData);

	// Si viene un careerId, preseleccionarlo
	if (newData?.careerId) {
		console.log('🎯 Preseleccionando carrera:', newData.careerId);
		form.id_career = newData.careerId;

		// Buscar la carrera para obtener su institución
		const selectedCareer = careers.value.find(c =>
			String(c.id) === String(newData.careerId)
		);

		if (selectedCareer && selectedCareer.id_institution) {
			form.id_institution = String(selectedCareer.id_institution);
			console.log('🏫 Institución preseleccionada:', form.id_institution);
		}
	}
}, { deep: true, immediate: true });

watch(() => props.show, async (newVal) => {
	if (newVal) {
		console.log('📂 Abriendo modal de especialidades');
		await loadSelectData();

		// Si hay un careerId en los props, configurar el formulario
		if (props.data?.careerId) {
			console.log('📌 Configurando carrera desde careerId:', props.data.careerId);

			// Esperar a que se carguen las carreras
			await nextTick();

			form.id_career = props.data.careerId;

			// Buscar la carrera para obtener su institución
			const selectedCareer = careers.value.find(c =>
				String(c.id) === String(props.data.careerId)
			);

			if (selectedCareer && selectedCareer.id_institution) {
				form.id_institution = String(selectedCareer.id_institution);
				console.log('🏫 Institución encontrada:', form.id_institution);
			}
		}
	}
}, { immediate: true });

watch(() => form.id_institution, (newInstitutionId, oldInstitutionId) => {
	if (newInstitutionId !== oldInstitutionId) {
		if (form.id_career) {
			const currentCareer = filteredCareers.value.find(career =>
				career.id === parseInt(form.id_career)
			);
			if (!currentCareer) {
				form.id_career = '';
			}
		}
	}
});

// MODIFICACIÓN: watchEffect para manejar modo edit/create
watchEffect(() => {
	if (props.data.mode === 'edit' && props.data.pk !== null) {
		console.log('✏️ Modo edición - ID:', props.data.pk);
		alvRoute.value = `${axios.defaults.baseURL}specialties/${props.data.pk}`
		alvMethod.value = 'PUT'
		isLoading.value = true

		showSpecialty(props.data.pk).then(res => {
			const specialty = res.data
			console.log('📋 Datos de especialidad cargados:', specialty);
			Object.keys(form).forEach(key => {
				if (specialty[key] !== undefined) {
					form[key] = specialty[key]
				}
			})
		}).catch(error => {
			console.error('Error al cargar la especialidad:', error)
		}).finally(() => {
			isLoading.value = false
		})

	} else if (props.data.mode === 'create') {
		console.log('🆕 Modo creación');
		alvRoute.value = `${axios.defaults.baseURL}specialties`
		alvMethod.value = 'POST'

		// SOLO resetear si no hay careerId en los props
		if (!props.data?.careerId) {
			Object.keys(form).forEach(key => {
				form[key] = ''
			})
		} else {
			console.log('🎯 Manteniendo carreraId preseleccionado:', props.data.careerId);
		}
	}
})

onMounted(() => {
	loadSelectData()
})
</script>

<template>
	<transition name="fade-scale">
		<div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" style="margin-top: 0px" @click.self="emit('close')">
			<div
				class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-8 relative max-h-[85vh] flex flex-col overflow-hidden"
				style="background-image: url('/images/background/bg-white-flores.png');">
				<div class="flex items-center justify-between bg-brand-900 -mx-8 -mt-8 px-8 py-4 rounded-t-2xl">
					<h4 class="text-xl font-semibold text-white">
						{{ data.mode === 'create' ? `Crear ${data.table}` : `Editar ${data.table}` }}
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

				<alv-form
					id="SpecialtyForm"
					:action="alvRoute"
					:data-object="form"
					:input-parent-selector="'.form-error'"
					:method="alvMethod"
					:enable-button-on-done="true"
					:spinner="true"
					class="flex-grow overflow-y-auto pr-2"
					@after-done="afterDone"
					@after-error="afterError">
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 mt-5">
						<div class="form-error">
							<label class="block text-sm font-medium text-gray-700 mb-1">Nombre*</label>
							<template v-if="isLoading">
								<div class="h-8 bg-gray-300 rounded animate-pulse w-full" />
							</template>
							<template v-else>
								<input
									v-model="form.name"
									type="text"
									name="name"
									required
									class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-brand-800"
									:disabled="isLoading" />
							</template>
						</div>

						<div class="form-error">
							<label class="block text-sm font-medium text-gray-700 mb-1">Carrera*</label>
							<div class="flex gap-2">
								<template v-if="isLoading">
									<div class="h-8 bg-gray-300 rounded animate-pulse w-full" />
								</template>
								<template v-else>
									<select
										v-model="form.id_career"
										name="id_career"
										required
										class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-brand-800 flex-1"
										:disabled="isLoading || !hasCareersForInstitution">
										<option value="">
											{{ form.id_institution && !hasCareersForInstitution
											? 'No hay carreras disponibles'
											: 'Seleccione carrera'
											}}
										</option>
										<option
											v-for="career in filteredCareers"
											:key="career.id"
											:value="career.id">
											{{ career.name }}
										</option>
									</select>
									<btn-create
										:table="'Carrera'"
										class="h-10 px-3 flex-shrink-0 mt-0.5"
										tooltip="Crear nueva carrera"
										@open="openCreateCareer" />
								</template>
							</div>
							<div
								v-if="form.id_institution && !hasCareersForInstitution"
								class="text-sm text-red-600 mt-1">
								⚠️ La institución seleccionada no tiene carreras disponibles
							</div>
							<div
								v-else-if="form.id_institution && form.id_career && filteredCareers.length > 0"
								class="text-sm text-green-600 mt-1">
								✓ {{ filteredCareers.length }} carrera(s) disponible(s)
							</div>
						</div>

						<div class="form-error md:col-span-2">
							<label class="block text-sm font-medium text-gray-700 mb-1">Institución*</label>
							<div class="flex gap-2">
								<template v-if="isLoading">
									<div class="h-8 bg-gray-300 rounded animate-pulse w-full" />
								</template>
								<template v-else>
									<select
										v-model="form.id_institution"
										name="id_institution"
										required
										class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-brand-800 flex-1"
										:disabled="isLoading">
										<option value="">Seleccione institución</option>
										<option v-for="inst in institutions" :key="inst.id" :value="inst.id">
											{{ inst.name }}
										</option>
									</select>
									<btn-create
										:table="'Institución'"
										class="h-10 px-3 flex-shrink-0 mt-0.5"
										tooltip="Crear nueva institución"
										@open="openCreateInstitution" />
								</template>
							</div>
							<div
								v-if="form.id_institution"
								class="text-sm text-gray-600 mt-1">
								Al seleccionar una institución, solo verás sus carreras disponibles
							</div>
						</div>
					</div>

					<div class="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 sticky bottom-0 bg-transparent z-10">
						<button
							type="button"
							class="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition"
							:disabled="isLoading"
							@click="emit('close')">
							Cancelar
						</button>
						<button
							form="SpecialtyForm"
							class="flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-brand-700 to-brand-900 text-white font-semibold hover:brightness-110 transition shadow-md"
							:disabled="isLoading || (form.id_institution && !hasCareersForInstitution)">
							Guardar
						</button>
					</div>
				</alv-form>
			</div>
		</div>
	</transition>

	<mdlInstitution
		:show="showModal && modalData?.table === 'institucion'"
		:data="modalData"
		@close="closeModal"
		@saved="handleSavedInstitution" />

	<mdlCareer
		:show="showModal && modalData?.table === 'carrera'"
		:data="modalData"
		@close="closeModal"
		@saved="handleSavedCareer" />
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