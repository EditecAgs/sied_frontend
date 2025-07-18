<script setup lang="ts">
import { defineProps, defineEmits, reactive, watchEffect, ref, onMounted } from 'vue'
import axios from 'axios'

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

const afterError = (response) => {
	console.log('Error al enviar:', response.data)
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
	id_state: '',
	id_municipality: '',
	country: 'México',
	city: '',
	google_maps: '',
	type: 1,
	id_subsystem: '',
	id_academic_period: ''
})

const estados = ref([])
const subsistemas = ref([])
const periodosAcademicos = ref([])

const cargarDependencias = async () => {
	try {
		const [estadosRes, subsistemasRes, periodosRes] = await Promise.all([
			axios.get('states'),
			axios.get('subsystems'),
			axios.get('academic-periods')
		])

		estados.value = estadosRes.data
		subsistemas.value = subsistemasRes.data
		periodosAcademicos.value = periodosRes.data
	} catch (err) {
		console.error('Error al cargar dependencias:', err)
	}
}

onMounted(() => {
	cargarDependencias()
})

watchEffect(() => {
	if (props.data.mode === 'edit' && props.data.pk !== null) {
		alvRoute.value = `${axios.defaults.baseURL}institutions/${props.data.pk}`
		alvMethod.value = 'PUT'
		isLoading.value = true

		axios.get(alvRoute.value).then(res => {
			const institution = res.data
			Object.keys(form).forEach(key => {
				if (institution[key] !== undefined) {
					form[key] = institution[key]
				}
			})
		}).finally(() => {
			isLoading.value = false
		})

	} else if (props.data.mode === 'create') {
		alvRoute.value = `${axios.defaults.baseURL}institutions`
		alvMethod.value = 'POST'

		// Resetear formulario
		Object.keys(form).forEach(key => {
			if (key === 'country') {
				form[key] = 'México'
			} else if (key === 'type') {
				form[key] = 1
			} else {
				form[key] = ''
			}
		})
	}
})
</script>

<template>
	<div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
		<div class="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 min-h-[200px] relative">
			<h4 class="text-lg font-semibold text-brand-900 mb-4 flex items-center justify-between">
				{{ data.mode === 'create' ? `Crear ${data.table}` : `Editar ${data.table}` }}
				<div v-if="isLoading" class="ml-4 w-5 h-5 border-2 border-t-2 border-gray-300 border-t-brand-800 rounded-full animate-spin" />
			</h4>

			<alv-form
				id="InstitutionForm"
				:action="alvRoute"
				:data-object="form"
				:input-parent-selector="'.form-error'"
				:method="alvMethod"
				:enable-button-on-done="true"
				:spinner="true"
				@after-done="afterDone"
				@after-error="afterError">
				<!-- Sección 1: Información Básica -->
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
								class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-brand-800" />
						</template>
					</div>

					<div class="form-error">
						<label class="block text-sm font-medium text-gray-700 mb-1">Tipo*</label>
						<template v-if="isLoading">
							<div class="h-10 bg-gray-300 rounded animate-pulse" />
						</template>
						<template v-else>
							<select
								v-model="form.type"
								name="type"
								required
								class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-brand-800">
								<option value="1">Pública</option>
								<option value="2">Privada</option>
								<option value="3">Mixta</option>
							</select>
						</template>
					</div>
				</div>

				<!-- Sección 2: Dirección -->
				<div class="border-t pt-4 mb-6">
					<h5 class="text-md font-medium text-brand-800 mb-3">Dirección</h5>
					<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div class="form-error">
							<label class="block text-sm font-medium text-gray-700 mb-1">Calle*</label>
							<input
								v-model="form.street"
								type="text"
								name="street"
								required
								class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-brand-800" />
						</div>

						<div class="form-error">
							<label class="block text-sm font-medium text-gray-700 mb-1">Número Exterior*</label>
							<input
								v-model="form.external_number"
								type="text"
								name="external_number"
								required
								class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-brand-800" />
						</div>

						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">Número Interior</label>
							<input
								v-model="form.internal_number"
								type="text"
								name="internal_number"
								class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-brand-800" />
						</div>

						<div class="form-error">
							<label class="block text-sm font-medium text-gray-700 mb-1">Colonia*</label>
							<input
								v-model="form.neighborhood"
								type="text"
								name="neighborhood"
								required
								class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-brand-800" />
						</div>

						<div class="form-error">
							<label class="block text-sm font-medium text-gray-700 mb-1">Código Postal*</label>
							<input
								v-model="form.postal_code"
								type="text"
								name="postal_code"
								required
								class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-brand-800" />
						</div>

						<div class="form-error">
							<label class="block text-sm font-medium text-gray-700 mb-1">Ciudad*</label>
							<input
								v-model="form.city"
								type="text"
								name="city"
								required
								class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-brand-800" />
						</div>
					</div>
				</div>

				<!-- Sección 3: Ubicación y Sistema -->
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
					<div class="form-error">
						<label class="block text-sm font-medium text-gray-700 mb-1">Estado*</label>
						<template v-if="isLoading">
							<div class="h-10 bg-gray-300 rounded animate-pulse" />
						</template>
						<template v-else>
							<select
								v-model="form.id_state"
								name="id_state"
								required
								class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-brand-800">
								<option value="" disabled>Selecciona un estado</option>
								<option v-for="estado in estados" :key="estado.id" :value="estado.id">
									{{ estado.name }}
								</option>
							</select>
						</template>
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Municipio</label>
						<input
							v-model="form.id_municipality"
							type="text"
							name="id_municipality"
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-brand-800" />
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">País</label>
						<input
							v-model="form.country"
							type="text"
							name="country"
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-brand-800" />
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Google Maps</label>
						<input
							v-model="form.google_maps"
							type="text"
							name="google_maps"
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-brand-800" />
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Subsistema</label>
						<template v-if="isLoading">
							<div class="h-10 bg-gray-300 rounded animate-pulse" />
						</template>
						<template v-else>
							<select
								v-model="form.id_subsystem"
								name="id_subsystem"
								class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-brand-800">
								<option value="">Selecciona un subsistema</option>
								<option v-for="subsistema in subsistemas" :key="subsistema.id" :value="subsistema.id">
									{{ subsistema.name }}
								</option>
							</select>
						</template>
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Periodo Académico</label>
						<template v-if="isLoading">
							<div class="h-10 bg-gray-300 rounded animate-pulse" />
						</template>
						<template v-else>
							<select
								v-model="form.id_academic_period"
								name="id_academic_period"
								class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-brand-800">
								<option value="">Selecciona un periodo</option>
								<option v-for="periodo in periodosAcademicos" :key="periodo.id" :value="periodo.id">
									{{ periodo.name }}
								</option>
							</select>
						</template>
					</div>
				</div>

				<div class="flex justify-end gap-2 mt-6">
					<button
						type="button"
						class="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
						@click="emit('close')">
						Cancelar
					</button>
					<button
						form="InstitutionForm"
						class="flex items-center gap-1 px-4 py-2 text-sm text-white bg-brand-800 rounded-md hover:bg-brand-900 transition-colors">
						<span v-if="data.mode === 'create'" />
						<span v-else>💾</span>
						<span>Guardar</span>
					</button>
				</div>
			</alv-form>
		</div>
	</div>
</template>