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
import { onMounted } from 'vue';
import { useAxios } from './axios';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(() => {
	useAxios(router);
});
</script>