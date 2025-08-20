<template>
	<button
		class="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-brand-200 text-brand-800 rounded-lg hover:bg-brand-50 hover:border-brand-300 hover:text-brand-900 font-medium shadow-xs transition-all duration-200 text-sm"
		@click="handleClick">
		<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
		</svg>
		<span>Editar</span>
	</button>
</template>

<script setup>
const props = defineProps({
	table: {
		type: String,
		required: true
	},
	pk: {
		type: Number,
		required: true
	}
})

const emit = defineEmits(['open'])

function handleClick() {
	emit('open', {
		mode: 'edit',
		pk: props.pk,
		table: props.table
	})
}
</script>

<style scoped>
.shadow-xs {
	box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
</style>