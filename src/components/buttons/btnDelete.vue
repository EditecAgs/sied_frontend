<!-- btnDelete.vue -->
<template>
	<button
		class="px-3 py-1 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700"
		@click="confirmDelete">
		Delete
	</button>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import Swal from 'sweetalert2'
import axios from 'axios'

// eslint-disable-next-line vue/valid-define-props
const props = defineProps<{
	table: string
	pk: number | string
}>()

const emit = defineEmits(['deleted'])

const confirmDelete = async () => {
	const result = await Swal.fire({
		title: '¿Estás seguro?',
		text: "No podrás revertir esta acción",
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#d33',
		cancelButtonColor: '#3085d6',
		confirmButtonText: 'Sí, eliminar',
		cancelButtonText: 'Cancelar',
	})

	if (result.isConfirmed) {
		try {
			await axios.delete(`${props.table}/${props.pk}`)

			await Swal.fire('Eliminado', 'El registro ha sido eliminado.', 'success')
			emit('deleted', props.pk)

		} catch (error) {
			console.error('Error al eliminar:', error)
			await Swal.fire('Error', 'No se pudo eliminar el registro.', 'error')
		}
	}
}
</script>
