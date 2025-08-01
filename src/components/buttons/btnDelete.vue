<template>
	<button
		class="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-red-200 text-red-700 rounded-lg hover:bg-red-50 hover:border-red-300 hover:text-red-800 font-medium shadow-xs transition-all duration-200 text-sm"
		@click="handleClick">
		<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
		</svg>
		<span>Eliminar</span>
	</button>
</template>

<script setup>
const props = defineProps({
	table: String,
	pk: Number,
})

const emit = defineEmits(['open-confirm'])

function handleClick() {
	emit('open-confirm', {
		table: props.table,
		pk: props.pk
	})
}
</script>

<style scoped>
.shadow-xs {
	box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
</style>