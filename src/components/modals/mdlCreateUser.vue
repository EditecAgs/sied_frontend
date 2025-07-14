<script setup lang="ts">
import {defineProps, defineEmits, reactive, watchEffect, ref} from 'vue'
import axios from 'axios';

const alvRoute = ref();
alvRoute.value = axios.defaults.baseURL + 'users';

const alvMethod = ref("POST");

const afterDone = (response) => {
  console.log(response + "asasdasd")
}

const afterError = (response) => {
  console.log(response + "asdasd")
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

const emit = defineEmits(['close'])


const form = reactive({
	name: '',
	email: '',
  password: '',
  institucion: ''
})

watchEffect(() => {
	if (props.show && props.data.mode === 'edit' && props.data.pk !== null) {
		// 🔁 Aquí vamos a llamar a la api
		form.name = `Usuario ${props.data.pk}`
		form.email = `usuario${props.data.pk}@correo.com`
    form.password = `**********`
    form.institucion = `ITA`
	}

	if (props.data.mode === 'create') {
		form.name = ''
		form.email = ''
    form.password = ''
    form.institucion= ''
  }
})


const submitForm = () => {
	if (props.data.mode === 'edit') {
		console.log('Usuario actualizado:', form, 'ID:', props.data.pk)
	} else {
		console.log('Usuario creado:', form)
	}

	emit('close')
}
</script>

<template>
	<div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
		<div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-md p-6">
			<h4 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">
				{{ data.mode === 'create' ? `Crear ${data.table}` : `Editar ${data.table}` }}
			</h4>

			<alv-form
				id="UserForm"
				ref="UserForm"
				:action="alvRoute"
				:data-object="form"
				:enable-button-on-done="true"
				:input-parent-selector="'.form-group'"
				:method="alvMethod"
				:spinner="true"
				@after-done="afterDone"
				@after-error="afterError">
				<!-- Nombre -->
				<div class="mb-4 form-error">
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
					<input
						v-model="form.name"
						type="text"
						required
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
				</div>

				<!-- Correo -->
				<div class="mb-4 form-error">
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Correo</label>
					<input
						v-model="form.email"
						type="email"
						required
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
				</div>
        
				<div class="mb-4 form-error">
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
					<input
						v-model="form.password"
						type="password"
						required
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
				</div>
        
				<div class="mb-4 form-error">
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Institución</label>
					<input
						v-model="form.institucion"
						type="text"
						required
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
				</div>


				<!-- Acciones -->
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
