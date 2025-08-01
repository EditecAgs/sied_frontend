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
import { watch } from 'vue';
import { useAxios } from './axios';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();


watch(
	() => route.name,
	() => {
		window.axios = useAxios(router);
	}
);
</script>
