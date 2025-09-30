<template>
	<div
		v-if="show"
		class="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
		<div class="flex flex-col items-center space-y-4">
			<div class="w-16 h-16 border-4 border-t-transparent border-brand-500 rounded-full animate-spin" />

			
			<p class="text-lg font-semibold text-gray-700">
				{{ message }}
			</p>
		</div>
	</div>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
	show: {
		type: Boolean,
		default: false
	},
	message: {
		type: String,
		default: 'Cargando...'
	}
})
</script>
