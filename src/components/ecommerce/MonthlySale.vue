<template>
	<div
		class="overflow-hidden rounded-2xl border border-gray-200 bg-white px-6 pt-6 shadow-md dark:border-gray-700 dark:bg-gray-900 sm:px-8 sm:pt-8">
		<div class="flex items-center justify-between mb-5">
			<h3 class="text-xl font-semibold text-gray-900 dark:text-white">
				Proyectos por mes
			</h3>

			<div class="relative h-fit">
				<DropdownMenu :menu-items="menuItems">
					<template #icon>
						<svg
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors duration-200">
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M10.2441 6C10.2441 5.0335 11.0276 4.25 11.9941 4.25H12.0041C12.9706 4.25 13.7541 5.0335 13.7541 6C13.7541 6.9665 12.9706 7.75 12.0041 7.75H11.9941C11.0276 7.75 10.2441 6.9665 10.2441 6ZM10.2441 18C10.2441 17.0335 11.0276 16.25 11.9941 16.25H12.0041C12.9706 16.25 13.7541 17.0335 13.7541 18C13.7541 18.9665 12.9706 19.75 12.0041 19.75H11.9941C11.0276 19.75 10.2441 18.9665 10.2441 18ZM11.9941 10.25C11.0276 10.25 10.2441 11.0335 10.2441 12C10.2441 12.9665 11.0276 13.75 11.9941 13.75H12.0041C12.9706 13.75 13.7541 12.9665 13.7541 12C13.7541 11.0335 12.9706 10.25 12.0041 10.25H11.9941Z"
								fill="currentColor" />
						</svg>
					</template>
				</DropdownMenu>
			</div>
		</div>

		<div class="max-w-full overflow-x-auto custom-scrollbar">
			<div id="chartOne" class="-ml-4 min-w-[650px] xl:min-w-full pl-2">
				<VueApexCharts
					type="bar"
					height="200"
					:options="chartOptions"
					:series="series" />
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DropdownMenu from '../common/DropdownMenu.vue'
import VueApexCharts from 'vue3-apexcharts'
import { getProjectsCountByMonth } from '../../services/statistics/dashboard'

const menuItems = [
  { label: 'View More', onClick: () => console.log('View More clicked') },
  { label: 'Delete', onClick: () => console.log('Delete clicked') },
]

const series = ref([
  {
    name: 'Proyectos creados',
    data: Array(12).fill(0),
  },
])

const monthLabels = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

const chartOptions = ref({
  colors: ['#82181aff'],
  chart: {
    fontFamily: 'Outfit, sans-serif',
    type: 'bar',
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '50%',
      borderRadius: 8,
      borderRadiusApplication: 'end',
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 3,
    colors: ['transparent'],
  },
  xaxis: {
    categories: monthLabels,
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    labels: {
      style: {
        colors: '#6b7280',
        fontSize: '12px',
        fontWeight: 500,
      },
    },
  },
  legend: {
    show: true,
    position: 'top',
    horizontalAlign: 'left',
    fontFamily: 'Outfit',
    markers: {
      radius: 99,
    },
    labels: {
      colors: '#374151',
      fontWeight: 600,
    },
  },
  yaxis: {
    title: false,
    labels: {
      style: {
        colors: '#6b7280',
        fontSize: '12px',
        fontWeight: 500,
      },
    },
  },
  grid: {
    yaxis: {
      lines: {
        show: true,
        strokeDashArray: 4,
      },
    },
  },
  fill: {
    opacity: 1,
  },
  tooltip: {
    x: {
      show: false,
    },
    y: {
      formatter: val => val.toString(),
    },
  },
})

onMounted(async () => {
  try {
    const response = await getProjectsCountByMonth()
    const data = response.data.data

    const monthlyData = Array(12).fill(0)

    data.forEach(item => {
      const index = item.month_number - 1
      if (index >= 0 && index < 12) {
        monthlyData[index] = item.project_count
      }
    })

    series.value[0].data = monthlyData
  } catch (error) {
    console.error('Error al cargar proyectos por mes:', error)
  }
})
</script>
