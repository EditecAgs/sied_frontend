<template>
	<div
		class="overflow-hidden rounded-2xl border border-gray-200 bg-[rgb(211,211,210)]/50 p-4 shadow-md dark:border-gray-700 dark:bg-gray-900 sm:p-6 lg:p-8">
		<div class="flex items-center justify-between mb-4 sm:mb-5">
			<h3 class="text-lg font-semibold text-gray-700 dark:text-white sm:text-xl">
				Operación de Organizaciones
			</h3>

			<div v-if="loading" class="text-sm text-gray-500">Cargando...</div>
			<div v-else-if="loadError" class="text-sm text-red-500">Error</div>
			<div v-else class="text-sm text-gray-600">
				Total: {{ totalOrganizations }}
			</div>
		</div>

		<div class="relative min-h-[320px]">
			<VueApexCharts
				v-if="!loading && !loadError && hasData"
				:key="chartKey"
				type="donut"
				:height="350"
				:options="chartOptions"
				:series="series" />
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, watch, computed, nextTick } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import { getOrganizationsByScope } from '../../services/statistics/dashboard'

const props = defineProps({
  filters: { type: Object, default: () => ({}) }
})

const series = ref([])
const totalOrganizations = ref(0)
const loading = ref(false)
const loadError = ref(false)
const chartKey = ref(0)

const scopeLabels = {
  Municipal: 'Municipal',
  Estatal: 'Estatal',
  Federal: 'Federal',
  Internacional: 'Internacional'
}

const chartOptions = ref({
  colors: ['#83181b', '#9c2f33', '#b44b4f', '#d07a7e'],
  chart: {
    type: 'donut',
    fontFamily: 'Outfit, sans-serif',
    foreColor: '#0056ff'
  },
  labels: [],
  dataLabels: {
    enabled: true,
    formatter: (val, { seriesIndex, w }) => {
      const label = w.config.labels[seriesIndex]
      return `${label}\n${val.toFixed(1)}%`
    },
    style: {
      fontSize: '12px',
      fontWeight: 600,
      colors: ['#4a4c4e']
    },
    dropShadow: {
      enabled: false
    }
  },
  plotOptions: {
    pie: {
      donut: {
        size: '65%',
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Total',
            color: '#374151',
            fontSize: '13px',
            fontWeight: 600,
            formatter: w =>
                w.globals.seriesTotals.reduce((a, b) => a + b, 0)
          }
        }
      }
    }
  }
  ,
  legend: {
    position: 'bottom',
    fontSize: '13px',
    labels: { colors: '#374151' }
  },
  tooltip: {
    y: {
      formatter: (value, {w }) => {
        const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0)
        const percent = total > 0 ? ((value / total) * 100).toFixed(1) : 0
        return `${value} organizaciones (${percent}%)`
      }
    }
  }
})

const hasData = computed(() => series.value.some(v => v > 0))

const loadData = async () => {
  try {
    loading.value = true
    loadError.value = false

    const { data } = await getOrganizationsByScope(props.filters)

    const sorted = [...data].sort((a, b) => b.total - a.total)

    chartOptions.value.labels = sorted.map(
        i => scopeLabels[i.scope] || i.scope
    )

    series.value = sorted.map(i => i.total)
    totalOrganizations.value = series.value.reduce((a, b) => a + b, 0)

    await nextTick()
    chartKey.value++
  } catch (e) {
    loadError.value = true
  } finally {
    loading.value = false
  }
}

onMounted(loadData)
watch(() => props.filters, loadData, { deep: true })
</script>
