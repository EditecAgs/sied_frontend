<template>
	<div class="min-h-screen overflow-x-hidden">
		<app-sidebar
			class="fixed left-0 top-0 z-40"
			:class="{
				'hidden lg:block': !isMobileOpen, 
				'block': isMobileOpen 
			}" />
		<Backdrop />

		<div
			class="flex-1 transition-all duration-300 ease-in-out min-h-screen overflow-x-hidden"
			:class="getMainContainerClass">
			<app-header
				:class="getHeaderClass" />

			<main class=" overflow-x-auto min-h-screen">
				<div class="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6 min-w-fit">
					<slot />
				</div>
			</main>
		</div>
	</div>
</template>

<script setup>
import AppSidebar from './AppSidebar.vue'
import AppHeader from './AppHeader.vue'
import { useSidebar } from '../../composables/useSidebar'
import Backdrop from './Backdrop.vue'
import { onMounted, onUnmounted, computed, ref } from 'vue'

const { isExpanded, isHovered, isMobileOpen } = useSidebar()
const isMobile = ref(window.innerWidth < 1024)

const handleResize = () => {
	isMobile.value = window.innerWidth < 1024
}

const getMainContainerClass = computed(() => {
	if (isMobile.value) {
		return ''
	}

	return isExpanded.value || isHovered.value ? 'lg:ml-[290px]' : 'lg:ml-[90px]'
})

const getHeaderClass = computed(() => {
	if (isMobile.value) {
		return 'left-0 right-0 w-full'
	}

	const leftOffset = (isExpanded.value || isHovered.value) ? 'left-[290px]' : 'left-[90px]'
	return `${leftOffset} right-0 w-[calc(100%-${isExpanded.value || isHovered.value ? '290px' : '90px'})]`
})

onMounted(() => {
	document.body.style.overflowX = 'hidden'
	window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
	document.body.style.overflowX = ''
	window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
main {
	scroll-behavior: smooth;
}

main::-webkit-scrollbar {
	height: 8px;
}

main::-webkit-scrollbar-track {
	background: #f1f1f1;
}

main::-webkit-scrollbar-thumb {
	background: #888;
	border-radius: 4px;
}

main::-webkit-scrollbar-thumb:hover {
	background: #555;
}
</style>