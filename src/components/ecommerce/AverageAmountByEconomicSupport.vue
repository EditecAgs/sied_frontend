<template>
	<div
		class="rounded-2xl border border-gray-200 bg-[rgb(211,211,210)]/50
               p-6 sm:p-8 shadow-md dark:border-gray-700 dark:bg-gray-900/90">
		<div class="mb-6">
			<h3 class="text-lg font-semibold text-gray-600 dark:text-white">
				Promedio de Apoyos Económicos
			</h3>
			<p class="mt-1 text-gray-500 text-sm dark:text-gray-400">
				Monto promedio de los apoyos registrados
			</p>
		</div>

		<div class="space-y-6">
			<div
				v-for="(item, index) in averageSupports"
				:key="index"
				class="flex items-center justify-between gap-4 hover:bg-gray-200/50 dark:hover:bg-gray-800/70
                       p-2 rounded-lg transition-colors">

				<div
					class="w-10 h-10 flex items-center justify-center rounded-full text-white font-bold"
					:style="{ backgroundColor: colors[index % colors.length] }">
					{{ item.support_name[0] }}
				</div>

				<div class="flex-1">
					<p class="font-semibold text-gray-900 dark:text-white text-base">
						{{ item.support_name }}
					</p>
					<span class="block text-gray-600 text-xs dark:text-gray-400">
						{{ item.average_amount ? ('$' + item.average_amount) : 'Sin datos' }}
					</span>
				</div>

				<div class="flex items-center gap-3 w-full max-w-[140px]">
					<div class="relative w-full max-w-[100px] h-2 rounded-sm bg-gray-300 dark:bg-gray-700">
						<div
							class="absolute left-0 top-0 h-full rounded-sm"
							:style="{
								width: getPercentage(item.average_amount) + '%',
								backgroundColor: colors[index % colors.length]
							}" />
					</div>
					<p class="font-medium text-gray-900 dark:text-white text-sm">
						{{ getPercentage(item.average_amount) }}%
					</p>
				</div>
			</div>

			<div
				v-if="averageSupports.length === 0"
				class="text-center py-4 text-gray-500 dark:text-gray-400">
				No hay datos disponibles
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getAverageAmountByEconomicSupport } from '../../services/statistics/dashboard'
import { useLoaderNotifier } from '../../composables/useLoaderNotifier'


const { notifyLoaded } = useLoaderNotifier()

const props = defineProps({
  filtersAdd: {
    type: Number,
    default: null 
  }
})

const averageSupports = ref<{ support_name: string; average_amount: number }[]>([])
const colors = ['#83181b', '#a34245', '#c36b6f', '#e39499']

const maxAmount = ref(1)

onMounted(async () => {
	try {
		const response = await getAverageAmountByEconomicSupport(props.filtersAdd)
		const data = response.data.data || []

		const validAmounts = data.map(i => i.average_amount || 0)
		maxAmount.value = Math.max(...validAmounts, 1)

		averageSupports.value = data
	} catch (error) {
		console.error('Error al cargar promedios de apoyos económicos:', error)
	} finally {
		notifyLoaded()
	}
})

const getPercentage = (value: number): number => {
	if (!value) return 0
	return Math.round((value / maxAmount.value) * 100)
}
</script>
