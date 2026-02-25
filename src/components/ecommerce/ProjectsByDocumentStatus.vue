<template>
	<div
		class="overflow-hidden rounded-2xl border border-gray-200 bg-[rgb(211,211,210)]/50 p-6 shadow-md dark:border-gray-700 dark:bg-gray-900/90 sm:p-8">
		<div class="flex items-center justify-between mb-6">
			<h3 class="text-xl font-semibold text-gray-600 dark:text-white">
				Proyectos por Estado de Documento
			</h3>
			<div class="text-sm text-gray-500 dark:text-gray-400">
				Total proyectos: {{ totalProjects }}
			</div>
		</div>

		<div v-if="loading" class="flex justify-center py-12">
			<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9C2131]" />
		</div>

		<div v-else-if="chartData.length > 0" class="relative">
			<div class="max-w-full overflow-x-auto custom-scrollbar">
				<div class="min-w-[500px]">
					<div class="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
						<div class="w-64 flex-shrink-0">Estado del documento</div>
						<div class="flex-1 flex items-center gap-2">
							<span class="w-16 text-right">Cantidad</span>
							<span class="w-20 text-right">Porcentaje</span>
						</div>
					</div>

					<div
						v-for="(item, index) in chartData"
						:key="item.id"
						class="flex items-center gap-4 mb-4 hover:bg-white/40 dark:hover:bg-gray-800/40 p-2 rounded-lg transition-colors">
						<div class="w-64 flex-shrink-0">
							<div class="flex items-center gap-2">
								<div
									class="w-3 h-3 rounded-full flex-shrink-0"
									:style="{ backgroundColor: getColor(index) }" />
								<span class="text-sm font-medium text-gray-700 dark:text-gray-300 break-words">
									{{ item.status_name }}
								</span>
							</div>
						</div>

						<div class="flex-1 flex items-center gap-2">
							<div class="relative w-full max-w-[300px] h-6 rounded-lg bg-gray-200 dark:bg-gray-700 overflow-hidden">
								<div
									class="absolute left-0 top-0 h-full rounded-lg transition-all duration-500"
									:style="{
										width: item.percentage + '%',
										backgroundColor: getColor(index)
									}" />
							</div>
							<span class="w-16 text-sm font-medium text-gray-900 dark:text-white text-right">
								{{ item.project_count }}
							</span>
							<span class="w-20 text-sm text-gray-600 dark:text-gray-400 text-right">
								{{ item.percentage }}%
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Sin datos -->
		<div v-else class="text-center py-12 text-gray-500 dark:text-gray-400">
			No hay datos disponibles
		</div>
	</div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { getProjectsByDocumentStatus } from '../../services/statistics/dashboard'

const props = defineProps({
	filters: {
		type: Object,
		default: () => ({})
	}
})

const emit = defineEmits(['loaded'])

const colors = ['#9C2131', '#C9A236', '#3A4A5F', '#707070', '#C4C4C4', '#6B7280', '#B45309', '#9CA3AF', '#7C3AED', '#0891B2']

const statusData = ref([])
const loading = ref(false)

const totalProjects = computed(() => {
	return statusData.value.reduce((sum, item) => sum + item.project_count, 0)
})

const chartData = computed(() => {
	return statusData.value.map(item => ({
		...item,
		percentage: parseFloat(item.percentage)
	}))
})

const getColor = (index) => {
	return colors[index % colors.length]
}

const loadData = async () => {
	try {
		loading.value = true
		const response = await getProjectsByDocumentStatus(props.filters)
		statusData.value = response.data
		emit('loaded')
	} catch (error) {
		console.error('Error al cargar estados de documentos:', error)
		statusData.value = []
	} finally {
		loading.value = false
	}
}

onMounted(() => {
	loadData()
})

watch(() => props.filters, () => {
	loadData()
}, { deep: true })
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
	height: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
	background: #f1f1f1;
	border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
	background: #9C2131;
	border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
	background: #7a1a27;
}
</style>