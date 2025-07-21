<script setup lang="ts">
import { defineProps, defineEmits, reactive, watchEffect, watch, ref, onMounted } from 'vue'
import axios from 'axios'
import { getStates } from '../../services/location/states.js'

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
const municipios = ref([]) // municipios filtrados
const todosMunicipios = ref([]) // todos los municipios sin filtrar
const subsistemas = ref([])
const periodosAcademicos = ref([])

const cargarDependencias = async () => {
  try {
    const [ subsistemasRes, periodosRes] = await Promise.all([
      //axios.get('states'),
      axios.get('subsystems'),
      axios.get('academic-periods')
    ])

	  getStates().then(({data}) => {
		  estados.value = data;
	  });

   // estados.value = estadosRes.data
    subsistemas.value = subsistemasRes.data
    periodosAcademicos.value = periodosRes.data
  } catch (err) {
    console.error('Error al cargar dependencias:', err)
  }
}

const cargarTodosLosMunicipios = async () => {
  try {
    const response = await axios.get('municipalities')
    todosMunicipios.value = response.data
  } catch (err) {
    console.error('Error al cargar todos los municipios:', err)
    todosMunicipios.value = []
  }
}

watch(() => form.id_state, (nuevoEstado) => {
  if (!nuevoEstado) {
    municipios.value = []
    return
  }

  municipios.value = todosMunicipios.value.filter(
      (m) => m.id_state === nuevoEstado
  )
})

onMounted(() => {
  cargarDependencias()
  cargarTodosLosMunicipios()
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

      if (institution.id_state && todosMunicipios.value.length > 0) {
        municipios.value = todosMunicipios.value.filter(
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
      if (key === 'country') {
        form[key] = 'México'
      } else if (key === 'type') {
        form[key] = 1
      } else {
        form[key] = ''
      }
    })

    municipios.value = []
  }
})
</script>

<template>
	<transition name="fade-scale">
		<div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" @click.self="emit('close')">
			<div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-8 relative max-h-[85vh] flex flex-col overflow-hidden">
				<h4 class="text-2xl font-extrabold text-brand-900 mb-6 flex items-center justify-between">
					{{ data.mode === 'create' ? `Crear ${data.table}` : `Editar ${data.table}` }}
					<div v-if="isLoading" class="ml-4 w-6 h-6 border-4 border-t-4 border-gray-300 border-t-brand-800 rounded-full animate-spin" />
				</h4>

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
					<!-- Información general -->
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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

					<!-- Dirección -->
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
								:options="estados"
								optionLabel="name"
								optionValue="id"
								:virtualScrollerOptions="{ itemSize: 38, showLoader: isLoading}"
								placeholder="Selecciona un estado"
								class="w-full px-3 py-2 !border-2 !border-gray-900 !rounded-md focus:outline-none focus:ring focus:ring-brand-800" />
							<!--
							<template v-if="isLoading">
								<div class="h-8 bg-gray-300 rounded animate-pulse w-full" />
							</template>
							<template v-else>
								<select
									v-model="form.id_state"
									name="id_state"
									required
									class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-brand-800"
									:disabled="isLoading">
									<option value="" disabled>Selecciona un estado</option>
									<option v-for="estado in estados" :key="estado.id" :value="estado.id">{{ estado.name }}</option>
								</select>
							</template>-->
						</div>

						<div class="form-error">
							<label class="block text-sm font-medium text-gray-700 mb-1">Municipio*</label>
							<template v-if="isLoading">
								<div class="h-8 bg-gray-300 rounded animate-pulse w-full" />
							</template>
							<template v-else>
								<select
									v-model="form.id_municipality"
									name="id_municipality"
									required
									class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-brand-800"
									:disabled="isLoading">
									<option value="" disabled>Selecciona un municipio</option>
									<option v-for="municipio in municipios" :key="municipio.id" :value="municipio.id">
										{{ municipio.name }}
									</option>
								</select>
							</template>
						</div>

						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">País</label>
							<template v-if="isLoading">
								<div class="h-8 bg-gray-300 rounded animate-pulse w-full" />
							</template>
							<template v-else>
								<input
									v-model="form.country"
									name="country"
									class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-brand-800"
									:disabled="isLoading" />
							</template>
						</div>

						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">Google Maps</label>
							<template v-if="isLoading">
								<div class="h-8 bg-gray-300 rounded animate-pulse w-full" />
							</template>
							<template v-else>
								<input
									v-model="form.google_maps"
									name="google_maps"
									class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-brand-800"
									:disabled="isLoading" />
							</template>
						</div>

						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">Subsistema</label>
							<template v-if="isLoading">
								<div class="h-8 bg-gray-300 rounded animate-pulse w-full" />
							</template>
							<template v-else>
								<select
									v-model="form.id_subsystem"
									name="id_subsystem"
									class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-brand-800"
									:disabled="isLoading">
									<option value="">Selecciona un subsistema</option>
									<option v-for="s in subsistemas" :key="s.id" :value="s.id">{{ s.name }}</option>
								</select>
							</template>
						</div>

						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">Periodo Académico</label>
							<template v-if="isLoading">
								<div class="h-8 bg-gray-300 rounded animate-pulse w-full" />
							</template>
							<template v-else>
								<select
									v-model="form.id_academic_period"
									name="id_academic_period"
									class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-brand-800"
									:disabled="isLoading">
									<option value="">Selecciona un periodo</option>
									<option v-for="p in periodosAcademicos" :key="p.id" :value="p.id">{{ p.name }}</option>
								</select>
							</template>
						</div>
					</div>

					<!-- Botones -->
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
