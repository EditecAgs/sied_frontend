<template>
	<button
		class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
		@click="emit('open')">
		<span>➕</span>
		<span>Crear</span>
	</button>
</template>

<script setup lang="ts">
// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
	(e: 'open'): void
}>()

// eslint-disable-next-line vue/valid-define-props
defineProps<{
	table: string
}>()
</script>
