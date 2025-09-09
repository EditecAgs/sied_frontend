<template>
	<div
		v-if="isMobileOpen"
		class="fixed inset-0 bg-transparent z-40 lg:hidden"
		@click="toggleMobileSidebar" />
</template>

<script setup lang="ts">
import { useSidebar } from '../../composables/useSidebar'
const { toggleMobileSidebar, isMobileOpen } = useSidebar()
</script>
