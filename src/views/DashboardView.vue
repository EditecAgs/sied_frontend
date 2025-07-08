<template>
	<div class="flex flex-col h-screen">

		<NavBar class="fixed top-0 left-0 right-0 z-50 h-16" />

		<div class="flex pt-16 h-full w-full">

			<SideBar class="fixed top-16 left-0 bottom-0 z-40 w-64" />


			<main class="ml-64 p-6 overflow-auto bg-gray-100 w-[calc(100%-16rem)]">
				<h1 class="text-2xl font-semibold mb-4">Contenido del Dashboard</h1>

			</main>
		</div>
	</div>
</template>

<script setup>
import NavBar from '../components/NavBar.vue'
import SideBar from '../components/SideBar.vue'
</script>