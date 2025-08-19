<template>
	<admin-layout>
		<div class="grid grid-cols-12 gap-4 md:gap-6">
			<div class="col-span-12 space-y-6 xl:col-span-7">
				<ecommerce-metrics />
				<monthly-sale />
			</div>

			<div class="col-span-12 xl:col-span-5">
				<div class="max-h-[510px] overflow-y-auto">
					<SectorsMexico />
				</div>
			</div>

			<div class="col-span-12">
				<statistics-chart />
			</div>

			<div class="col-span-12 xl:col-span-8">
				<recent-orders />
			</div>
			<div class="col-span-12 xl:col-span-4">
				<customer-demographic />
			</div>
		</div>
	</admin-layout>
</template>


<script>
import AdminLayout from '../components/layouts/AdminLayout.vue'
import EcommerceMetrics from '../components/ecommerce/EcommerceMetrics.vue'
import MonthlyTarget from '../components/ecommerce/MonthlyTarget.vue'
import MonthlySale from '../components/ecommerce/MonthlySale.vue'
import CustomerDemographic from '../components/ecommerce/CustomerDemographic.vue'
import StatisticsChart from '../components/ecommerce/StatisticsChart.vue'
import RecentOrders from '../components/ecommerce/RecentOrders.vue'
import SectorsMexico from '../components/ecommerce/SectorsMexico.vue'
export default {
  name: 'Ecommerce',
  components: {
    AdminLayout,
    EcommerceMetrics,
	  // eslint-disable-next-line vue/no-unused-components
    MonthlyTarget,
    MonthlySale,
    CustomerDemographic,
    StatisticsChart,
    RecentOrders,
	  SectorsMexico
  },
}
</script>
