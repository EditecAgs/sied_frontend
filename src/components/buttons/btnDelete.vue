<template>
	<button
		class="px-3 py-1 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700"
		@click="editItem">
		Delete
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
	console.log('eliminar en tabla:', props.table, 'ID:', props.pk)
// Aquí puedes emitir evento, navegar o abrir modal
}
</script>