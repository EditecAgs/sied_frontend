<script setup lang="ts">
import { defineProps, defineEmits, reactive, watchEffect, watch, ref, onMounted } from 'vue'
import axios from 'axios'
import { VTooltip } from 'floating-vue'
import 'floating-vue/dist/style.css'
import { getStates } from '../../../services/location/states.js'
import { getMunicipalities } from '../../../services/location/municipalities.js'
import { getAcademicPeriods } from '../../../services/institutions/academic-periods.js'
import { getsubsystems } from '../../../services/institutions/subsystems.js'
import { showInstitutions } from "../../../services/institutions/institutions.js"

const emit = defineEmits(['close', 'saved'])
const isLoading = ref(false)
const alvRoute = ref()
alvRoute.value = axios.defaults.baseURL + 'users'
const alvMethod = ref('POST')

const afterDone = (response) => {
	console.log(response.data + ' guardado exitosamente')
	emit('saved')
	emit('close')
}

const afterError = (error) => {
	if (error.response && error.response.data && error.response.data.errors) {
		console.error('Errores de validación:', error.response.data.errors)
	} else {
		console.error('Error inesperado:', error)
	}
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

const form = reactive({
	name: '',
	street: '',
	external_number: '',
	internal_number: '',
	neighborhood: '',
	postal_code: '',
	id_state: null,
	id_municipality: null,
	city: '',
	type: 'Pública',
	id_subsystem: null,
	id_academic_period: null,
	image: '',
	image_path: ''
})

const states = ref([])
const municipalities = ref([])
const allMunicipalities = ref([])
const subsystems = ref([])
const academic_periods = ref([])

const vTooltip = VTooltip

const fieldHelpTexts: Record<string, string> = {
	name: "Nombre oficial de la institución educativa.",
	type: "Clasificación de la institución según su administración (Pública, Privada o Mixta).",
	street: "Calle donde se encuentra ubicada la institución.",
	external_number: "Número exterior del edificio o predio.",
	internal_number: "Número interior (si aplica, en caso de oficinas o locales).",
	neighborhood: "Colonia o barrio correspondiente a la dirección.",
	postal_code: "Código postal asignado a la zona donde está ubicada la institución.",
	city: "Ciudad donde se localiza la institución.",
	id_state: "Selecciona el estado de la república donde se encuentra la institución.",
	id_municipality: "Selecciona el municipio correspondiente al estado elegido.",
	image: "Imagen o logotipo representativo de la institución."
}

const LoadDependence = async () => {
	try {
		const statesResp = await getStates()
		states.value = statesResp.data

		const subsystemsResp = await getsubsystems()
		subsystems.value = subsystemsResp.data

		const periodsResp = await getAcademicPeriods()
		academic_periods.value = periodsResp.data

		const municipalitiesResp = await getMunicipalities()
		allMunicipalities.value = municipalitiesResp.data

		if (props.data.mode === 'create') {
			form.id_subsystem = subsystems.value.length ? subsystems.value[0].id : null
			form.id_academic_period = academic_periods.value.length ? academic_periods.value[0].id : null
		}
	} catch (err) {
		console.error('Error load dependences:', err)
	}
}

watch(() => form.id_state, (newState) => {
	municipalities.value = newState
		? allMunicipalities.value.filter(m => m.id_state === newState)
		: []
	form.id_municipality = null
})

onMounted(() => {
	LoadDependence()
})

watchEffect(() => {
	if (props.data.mode === 'edit' && props.data.pk !== null) {
		alvRoute.value = `${axios.defaults.baseURL}institutions/${props.data.pk}`
		alvMethod.value = 'PUT'
		isLoading.value = true

		showInstitutions(props.data.pk).then(res => {
			const institution = res.data
			Object.keys(form).forEach(key => {
				if (institution[key] !== undefined) form[key] = institution[key]
			})

			if (institution.id_state && allMunicipalities.value.length > 0) {
				municipalities.value = allMunicipalities.value.filter(
					m => m.id_state === institution.id_state
				)
			}

			if (institution.image) {
				form.image = institution.image
				form.image_path = institution.image
			}
		}).finally(() => {
			isLoading.value = false
		})
	} else if (props.data.mode === 'create') {
		alvRoute.value = `${axios.defaults.baseURL}institutions`
		alvMethod.value = 'POST'
		Object.keys(form).forEach(k => form[k] = (typeof form[k] === 'string' ? '' : null))
		form.type = 'Pública'
	}
})

const onFileChange = (event: Event) => {
	const target = event.target as HTMLInputElement
	if (target.files && target.files.length > 0) {
		const file = target.files[0]
		form.image_path = URL.createObjectURL(file)

		const reader = new FileReader()
		reader.onload = () => {
			form.image = reader.result as string
		}
		reader.readAsDataURL(file)
	}
}
</script>

<template>
	<transition name="fade-scale">
		<div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" style="margin-top: 0px" @click.self="emit('close')">
			<div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-8 relative max-h-[85vh] flex flex-col overflow-hidden" style="background-image: url('/images/background/bg-white-flores.png');">
				<div class="flex items-center justify-between bg-brand-900 -mx-8 -mt-8 px-8 py-4 rounded-t-2xl">
					<h4 class="text-xl font-semibold text-white">
						{{ data.mode === 'create' ? `Crear ${data.table}` : `Editar ${data.table}` }}
					</h4>
					<button class="text-white/80 hover:text-white" aria-label="Cerrar modal" @click="emit('close')">✖</button>
				</div>

				<alv-form
					id="InstitutionForm"
					:action="alvRoute"
					:data-object="form"
					:method="alvMethod"
					class="flex-grow overflow-y-auto pr-2"
					@after-done="afterDone"
					@after-error="afterError">
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 mt-5">
						<div class="form-error">
							<label class="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
								Nombre*
								<button
									type="button"
									v-tooltip="fieldHelpTexts.name"
									class="help-icon text-gray-400 hover:text-brand-600 cursor-help">?</button>
							</label>
							<input v-model="form.name" type="text" name="name" required class="w-full px-3 py-2 border rounded-md" />
						</div>
						<div class="form-error">
							<label class="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
								Tipo*
								<button
									type="button"
									v-tooltip="fieldHelpTexts.type"
									class="help-icon text-gray-400 hover:text-brand-600 cursor-help">?</button>
							</label>
							<select v-model="form.type" name="type" required class="w-full px-3 py-2 border rounded-md">
								<option value="Pública">Pública</option>
								<option value="Privada">Privada</option>
								<option value="Mixta">Mixta</option>
							</select>
						</div>
					</div>

					<div class="border-t pt-4 mb-6">
						<h5 class="text-md font-semibold text-brand-800 mb-3">Dirección</h5>
						<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div class="form-error">
								<label class="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
									Calle*
									<button
										type="button"
										v-tooltip="fieldHelpTexts.street"
										class="help-icon text-gray-400 hover:text-brand-600 cursor-help">?</button>
								</label>
								<input v-model="form.street" name="street" required class="w-full px-3 py-2 border rounded-md" />
							</div>

							<div class="form-error">
								<label class="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
									Número Exterior*
									<button
										type="button"
										v-tooltip="fieldHelpTexts.external_number"
										class="help-icon text-gray-400 hover:text-brand-600 cursor-help">?</button>
								</label>
								<input v-model="form.external_number" name="external_number" required class="w-full px-3 py-2 border rounded-md" />
							</div>

							<div>
								<label class="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
									Número Interior
									<button
										type="button"
										v-tooltip="fieldHelpTexts.internal_number"
										class="help-icon text-gray-400 hover:text-brand-600 cursor-help">?</button>
								</label>
								<input v-model="form.internal_number" name="internal_number" class="w-full px-3 py-2 border rounded-md" />
							</div>

							<div class="form-error">
								<label class="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
									Colonia*
									<button
										type="button"
										v-tooltip="fieldHelpTexts.neighborhood"
										class="help-icon text-gray-400 hover:text-brand-600 cursor-help">?</button>
								</label>
								<input v-model="form.neighborhood" name="neighborhood" required class="w-full px-3 py-2 border rounded-md" />
							</div>

							<div class="form-error">
								<label class="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
									Código Postal*
									<button
										type="button"
										v-tooltip="fieldHelpTexts.postal_code"
										class="help-icon text-gray-400 hover:text-brand-600 cursor-help">?</button>
								</label>
								<input v-model="form.postal_code" name="postal_code" required class="w-full px-3 py-2 border rounded-md" />
							</div>

							<div class="form-error">
								<label class="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
									Ciudad*
									<button
										type="button"
										v-tooltip="fieldHelpTexts.city"
										class="help-icon text-gray-400 hover:text-brand-600 cursor-help">?</button>
								</label>
								<input v-model="form.city" name="city" required class="w-full px-3 py-2 border rounded-md" />
							</div>
						</div>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
						<div class="form-error">
							<label class="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
								Estado*
								<button
									type="button"
									v-tooltip="fieldHelpTexts.id_state"
									class="help-icon text-gray-400 hover:text-brand-600 cursor-help">?</button>
							</label>
							<select v-model="form.id_state" name="id_state" class="w-full px-3 py-2 border rounded-md">
								<option value="">Selecciona tu Estado</option>
								<option v-for="state in states" :key="state.id" :value="state.id">{{ state.name }}</option>
							</select>
						</div>
						<div class="form-error">
							<label class="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
								Municipio*
								<button
									type="button"
									v-tooltip="fieldHelpTexts.id_municipality"
									class="help-icon text-gray-400 hover:text-brand-600 cursor-help">?</button>
							</label>
							<select v-model="form.id_municipality" name="id_municipality" class="w-full px-3 py-2 border rounded-md">
								<option value="">Selecciona tu Municipio</option>
								<option v-for="municipalitie in municipalities" :key="municipalitie.id" :value="municipalitie.id">{{ municipalitie.name }}</option>
							</select>
						</div>
					</div>

					<div class="form-error">
						<label class="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
							Imagen
							<button
								type="button"
								v-tooltip="fieldHelpTexts.image"
								class="help-icon text-gray-400 hover:text-brand-600 cursor-help">?</button>
						</label>
						<input type="file" accept="image/*" class="w-full px-3 py-2 border rounded-md" @change="onFileChange" />
						<div v-if="form.image_path" class="mt-2">
							<img :src="form.image_path" alt="Vista previa" class="h-24 object-contain border rounded-md" />
						</div>
					</div>
				</alv-form>
				<div class="flex justify-end gap-3  pt-4 border-t border-transparent sticky bottom-0 bg-transparent z-10">
					<button type="button" class="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200" @click="emit('close')">Cancelar</button>
					<button form="InstitutionForm" class="px-6 py-2 rounded-lg bg-gradient-to-r from-brand-700 to-brand-900 text-white font-semibold">Guardar</button>
				</div>
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

.help-icon {
	@apply w-4 h-4 flex items-center justify-center rounded-full border border-current text-xs font-bold;
}
</style>