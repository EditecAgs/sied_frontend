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
  email: '',
  lastname: '',
  id_institution: ''
})

const instituciones = ref([])

const cargarInstituciones = () => {
  axios.get('institutions')
      .then(res => {
        instituciones.value = res.data
      })
      .catch(err => {
        console.error('Error al cargar instituciones:', err)
      })
}

onMounted(() => {
  cargarInstituciones()
})

watchEffect(() => {
  if (props.data.mode === 'edit' && props.data.pk !== null) {
    alvRoute.value = `${axios.defaults.baseURL}users/${props.data.pk}`
    alvMethod.value = 'PUT'
    isLoading.value = true

    axios.get(alvRoute.value).then(res => {
      const user = res.data
      form.name = user.name
      form.lastname = user.lastname
      form.email = user.email
      form.id_institution = user.id_institution
    }).finally(() => {
      isLoading.value = false
    })

  } else if (props.data.mode === 'create') {
    alvRoute.value = `${axios.defaults.baseURL}users`
    alvMethod.value = 'POST'

    form.name = ''
    form.lastname = ''
    form.email = ''
    form.id_institution = ''
  }
})
</script>

<template>
	<div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
		<div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-md p-6 min-h-[200px] relative">
			<h4 class="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center justify-between">
				{{ data.mode === 'create' ? `Crear ${data.table}` : `Editar ${data.table}` }}


				<div v-if="isLoading" class="ml-4 w-5 h-5 border-2 border-t-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
			</h4>

			<alv-form
				id="UserForm"
				:action="alvRoute"
				:data-object="form"
				:input-parent-selector="'.form-error'"
				:method="alvMethod"
				:enable-button-on-done="true"
				:spinner="true"
				@after-done="afterDone"
				@after-error="afterError">
				<div class="mb-4 form-error">
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
					<template v-if="isLoading">

						<div class="h-8 bg-gray-300 rounded animate-pulse dark:bg-gray-600" />
					</template>
					<template v-else>
						<input
							v-model="form.name"
							type="text"
							name="name"
							required
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
					</template>
				</div>

				<div class="mb-4 form-error">
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Apellido</label>
					<template v-if="isLoading">
						<div class="h-8 bg-gray-300 rounded animate-pulse dark:bg-gray-600" />
					</template>
					<template v-else>
						<input
							v-model="form.lastname"
							type="text"
							name="lastname"
							required
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
					</template>
				</div>

				<div class="mb-4 form-error">
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Correo</label>
					<template v-if="isLoading">
						<div class="h-8 bg-gray-300 rounded animate-pulse dark:bg-gray-600" />
					</template>
					<template v-else>
						<input
							v-model="form.email"
							type="email"
							name="email"
							required
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
					</template>
				</div>

				<div class="mb-4 form-error">
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Institución</label>
					<template v-if="isLoading">
						<div class="h-10 bg-gray-300 rounded animate-pulse dark:bg-gray-600" />
					</template>
					<template v-else>
						<select
							v-model="form.id_institution"
							name="id_institucion"
							required
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
							<option value="" disabled>Selecciona una institución</option>
							<option v-for="inst in instituciones" :key="inst.id" :value="inst.id">
								{{ inst.name }}
							</option>
						</select>
					</template>
				</div>

				<div class="flex justify-end gap-2 mt-6">
					<button
						type="button"
						class="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
						@click="emit('close')">
						Cancelar
					</button>
					<button
						form="UserForm"
						class="flex items-center gap-1 px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700">
						<span v-if="data.mode === 'create'">➕</span>
						<span v-else>💾</span>
						<span>Guardar</span>
					</button>
				</div>
			</alv-form>
		</div>
	</div>
</template>
