<script setup lang="ts">
import { defineProps, defineEmits, reactive, watchEffect, watch, ref, onMounted } from 'vue'
import axios from 'axios'
import { getStates } from '../../../services/location/states.js'
import { getMunicipalities } from '../../../services/location/municipalities.js'
import {getAcademicPeriods} from '../../../services/institutions/academic-periods.js'
import {getsubsystems} from '../../../services/institutions/subsystems.js'
import { showInstitutions} from "../../../services/institutions/institutions.js"

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
  city: '',
  type: 'Pública' ,
  id_subsystem: '',
  id_academic_period: '',
	image_path: '',
	image_file: null
})

const states = ref([])
const municipalities = ref([])
const allMunicipalities = ref([])
const subsystems = ref([])
const academic_periods = ref([])

const LoadDependence = async() => {
  try {

	  getStates().then(({data}) => {
		  states.value = data;
	  });
    getsubsystems().then(({data}) =>{
      subsystems.value=data
    })
    getAcademicPeriods().then(({data}) =>{
      academic_periods.value=data
    })
    const municipalitiesResp = await getMunicipalities()
    allMunicipalities.value = municipalitiesResp.data

  } catch (err) {
    console.error('Error load dependences:', err)
  }
}



watch(() => form.id_state, (newState) => {
  if (!newState) {
    municipalities.value = []
    return
  }

  municipalities.value = allMunicipalities.value.filter(
      (m) => m.id_state === newState
  )
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
        if (institution[key] !== undefined) {
          form[key] = institution[key]
        }
      })

      if (institution.id_state && allMunicipalities.value.length > 0) {
        municipalities.value = allMunicipalities.value.filter(
            (m) => m.id_state === institution.id_state
        )
      }
    }).finally(() => {
      isLoading.value = false
    })

  } else if (props.data.mode === 'create') {
    alvRoute.value = `${axios.defaults.baseURL}institutions`
    alvMethod.value = 'POST'

    Object.keys(form).forEach(key => {
      form[key] = key === 'Pública' ? 1 : ''
    })

    municipalities.value = []
  }
})

const onFileChange = (event: Event) => {
	const target = event.target as HTMLInputElement
	if (target.files && target.files.length > 0) {
		const file = target.files[0]
		form.image_file = file

		form.image_path = URL.createObjectURL(file)
	}
}

</script>


<template>
	<transition name="fade-scale">
		<div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" style="margin-top: 0px" @click.self="emit('close')">
			<div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-8 relative max-h-[85vh] flex flex-col overflow-hidden">
				<div class="flex items-center justify-between bg-brand-900 -mx-8 -mt-8 px-8 py-4 rounded-t-2xl">
					<h4 class="text-xl font-semibold text-white">
						{{ data.mode === 'create' ? `Crear ${data.table}` : `Editar ${data.table}` }}
					</h4>

					<div class="flex items-center gap-4">
						<div
							v-if="isLoading"
							class="w-6 h-6 border-4 border-white/40 border-t-white rounded-full animate-spin" />

						<button
							class="text-white/80 hover:text-white"
							aria-label="Cerrar modal"
							@click="emit('close')">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>
				</div>

				<alv-form
					id="InstitutionForm"
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
							<label class="block text-sm font-medium text-gray-700 mb-1">Tipo*</label>
							<template v-if="isLoading">
								<div class="h-8 bg-gray-300 rounded animate-pulse w-full" />
							</template>
							<template v-else>
								<select
									v-model="form.type"
									name="type"
									required
									class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-brand-800"
									:disabled="isLoading">
									<option value="Pública">Pública</option>
									<option value="Privada">Privada</option>
									<option value="Mixta">Mixta</option>
								</select>
							</template>
						</div>
					</div>


					<div class="border-t pt-4 mb-6">
						<h5 class="text-md font-semibold text-brand-800 mb-3">Dirección</h5>
						<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div class="form-error">
								<label class="block text-sm font-medium text-gray-700 mb-1">Calle*</label>
								<template v-if="isLoading">
									<div class="h-8 bg-gray-300 rounded animate-pulse w-full" />
								</template>
								<template v-else>
									<input
										v-model="form.street"
										name="street"
										required
										class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-brand-800"
										:disabled="isLoading" />
								</template>
							</div>

							<div class="form-error">
								<label class="block text-sm font-medium text-gray-700 mb-1">Número Exterior*</label>
								<template v-if="isLoading">
									<div class="h-8 bg-gray-300 rounded animate-pulse w-full" />
								</template>
								<template v-else>
									<input
										v-model="form.external_number"
										name="external_number"
										required
										class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-brand-800"
										:disabled="isLoading" />
								</template>
							</div>

							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">Número Interior</label>
								<template v-if="isLoading">
									<div class="h-8 bg-gray-300 rounded animate-pulse w-full" />
								</template>
								<template v-else>
									<input
										v-model="form.internal_number"
										name="internal_number"
										class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-brand-800"
										:disabled="isLoading" />
								</template>
							</div>

							<div class="form-error">
								<label class="block text-sm font-medium text-gray-700 mb-1">Colonia*</label>
								<template v-if="isLoading">
									<div class="h-8 bg-gray-300 rounded animate-pulse w-full" />
								</template>
								<template v-else>
									<input
										v-model="form.neighborhood"
										name="neighborhood"
										required
										class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-brand-800"
										:disabled="isLoading" />
								</template>
							</div>

							<div class="form-error">
								<label class="block text-sm font-medium text-gray-700 mb-1">Código Postal*</label>
								<template v-if="isLoading">
									<div class="h-8 bg-gray-300 rounded animate-pulse w-full" />
								</template>
								<template v-else>
									<input
										v-model="form.postal_code"
										name="postal_code"
										required
										class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-brand-800"
										:disabled="isLoading" />
								</template>
							</div>

							<div class="form-error">
								<label class="block text-sm font-medium text-gray-700 mb-1">Ciudad*</label>
								<template v-if="isLoading">
									<div class="h-8 bg-gray-300 rounded animate-pulse w-full" />
								</template>
								<template v-else>
									<input
										v-model="form.city"
										name="city"
										required
										class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-brand-800"
										:disabled="isLoading" />
								</template>
							</div>
						</div>
					</div>


					<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
						<div class="form-error">
							<label class="block text-sm font-medium text-gray-700 mb-1">Estado*</label>
							<Select
								v-model="form.id_state"
								name="id_state"
								:options="states"
								optionLabel="name"
								optionValue="id"
								:virtualScrollerOptions="{ itemSize: 38, showLoader: isLoading}"
								placeholder="Selecciona un estado"
								class="w-full px-3 py-2 !border-2 !border-gray-900 !rounded-md focus:outline-none focus:ring focus:ring-brand-800" />
						</div>

						<div class="form-error">
							<label class="block text-sm font-medium text-gray-700 mb-1">Municipio*</label>
							<Select
								v-model="form.id_municipality"
								name="id_municipality"
								:options="municipalities"
								optionLabel="name"
								optionValue="id"
								:virtualScrollerOptions="{ itemSize: 38, showLoader: isLoading}"
								placeholder="Selecciona un municipio"
								class="w-full px-3 py-2 !border-2 !border-gray-900 !rounded-md focus:outline-none focus:ring focus:ring-brand-800" />
						</div>


						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">Subsistema</label>
							<Select
								v-model="form.id_subsystem"
								name="id_subsystem"
								:options="subsystems"
								optionLabel="name"
								optionValue="id"
								:virtualScrollerOptions="{ itemSize: 38, showLoader: isLoading}"
								placeholder="Selecciona un subsistema"
								class="w-full px-3 py-2 !border-2 !border-gray-900 !rounded-md focus:outline-none focus:ring focus:ring-brand-800" />
						</div>

						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">Periodo Académico</label>
							<Select
								v-model="form.id_academic_period"
								name="id_academic_period"
								:options="academic_periods"
								optionLabel="name"
								optionValue="id"
								:virtualScrollerOptions="{ itemSize: 38, showLoader: isLoading}"
								placeholder="Selecciona un periodo academico"
								class="w-full px-3 py-2 !border-2 !border-gray-900 !rounded-md focus:outline-none focus:ring focus:ring-brand-800" />
						</div>
					</div>

					<div class="form-error">
						<label class="block text-sm font-medium text-gray-700 mb-1">Imagen</label>
						<template v-if="isLoading">
							<div class="h-8 bg-gray-300 rounded animate-pulse w-full" />
						</template>
						<template v-else>
							<input
								type="file"
								accept="image/*"
								class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-brand-800"
								:disabled="isLoading"
								@change="onFileChange" />
							<div v-if="form.image_path" class="mt-2">
								<img :src="form.image_path" alt="Vista previa" class="h-24 object-contain border rounded-md" />
							</div>
						</template>
					</div>



					<div class="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 sticky bottom-0 bg-white z-10">
						<button
							type="button"
							class="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition"
							:disabled="isLoading"
							@click="emit('close')">
							Cancelar
						</button>
						<button
							form="InstitutionForm"
							class="flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-brand-700 to-brand-900 text-white font-semibold hover:brightness-110 transition shadow-md"
							:disabled="isLoading">
							<span v-if="data.mode !== 'create'">💾</span>
							<span>Guardar</span>
						</button>
					</div>
				</alv-form>
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
