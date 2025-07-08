<template>
	<ThemeProvider>
		<SidebarProvider>
			<RouterView />
		</SidebarProvider>
	</ThemeProvider>
</template>

<script setup lang="ts">
import ThemeProvider from './components/layouts/ThemeProvider.vue'
import SidebarProvider from './components/layouts/SidebarProvider.vue'
</script>
