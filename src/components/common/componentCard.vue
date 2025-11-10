<template>
	<div
		class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
		<h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">{{ title }}</h2>
		<p v-if="desc" class="text-sm text-gray-500 dark:text-gray-400 mb-4">{{ desc }}</p>
		<slot />
	</div>
</template>

<script setup lang="ts">
defineProps({
	title: String,
	desc: String
});
</script>
