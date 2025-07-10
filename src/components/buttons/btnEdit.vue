<template>
	<button
		class="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
		@click="editItem">
		✏️ Edit
	</button>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

// eslint-disable-next-line vue/valid-define-props
const props = defineProps<{
	table: string
	pk: number | string
}>()

const editItem = () => {
	console.log('Editar en tabla:', props.table, 'ID:', props.pk)
	// Aquí puedes emitir evento, navegar o abrir modal
}
</script>
