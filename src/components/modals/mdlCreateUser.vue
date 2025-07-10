<script setup lang="ts">
import { defineProps, defineEmits, reactive } from 'vue'

// eslint-disable-next-line vue/valid-define-props
const props = defineProps<{
	show: boolean
}>()

const emit = defineEmits(['close'])

const form = reactive({
	name: '',
	email: ''
})

const submitForm = () => {
	console.log('Usuario creado:', form)
	emit('close')
	form.name = ''
	form.email = ''
}
</script>

<template>
	<div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
		<div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-md p-6">
			<h4 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Crear Usuario</h4>

			<form @submit.prevent="submitForm">
				<!-- Nombre -->
				<div class="mb-4">
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
					<input
						v-model="form.name"
						type="text"
						required
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
				</div>

				<!-- Correo -->
				<div class="mb-4">
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Correo</label>
					<input
						v-model="form.email"
						type="email"
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
						type="submit"
						class="flex items-center gap-1 px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700">
						<span>➕</span>
						<span>Guardar</span>
					</button>
				</div>
			</form>
		</div>
	</div>
</template>
