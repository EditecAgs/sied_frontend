<template>
	<div style="background-image: url('/images/background/bg-white-flores.png')">
		<admin-layout>
			<div class="min-h-screen w-full bg-cover bg-center bg-fixed">
				<div class="grid grid-cols-12 gap-4 md:gap-6 p-4 md:p-6">
					<div class="col-span-12 xl:col-span-7 grid gap-4 md:gap-6">
						<ecommerce-metrics />
						<monthly-sale />
					</div>

					<div class="col-span-12 xl:col-span-5">
						<div class="h-full max-h-[575px] overflow-y-auto">
							<SectorsMexico />
						</div>
					</div>

					<div class="col-span-12">
						<statistics-chart class="h-full" />
					</div>


					<div class="col-span-12 xl:col-span-8 grid gap-4 md:gap-6">
						<recent-orders class="h-full" />
					</div>

					<div class="col-span-12 xl:col-span-4 grid gap-4 md:gap-6">
						<customer-demographic class="h-full" />
						<SectorsMexicoMetric class="h-full" />
					</div>

					<div class="col-span-12 xl:col-span-12 grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
						<OrganizationsByScope class="h-full" />
						<ProjectsByEconomicSupport class="h-full" />
					</div>
					<div class="col-span-12 xl:col-span-12 grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
						<AverageAmountByEconomicSupport class="h-full" />
					</div>
				</div>
			</div>
		</admin-layout>
	</div>
</template>

<script>
import AdminLayout from '../components/layouts/AdminLayout.vue';
import EcommerceMetrics from '../components/ecommerce/EcommerceMetrics.vue';
import MonthlyTarget from '../components/ecommerce/MonthlyTarget.vue';
import MonthlySale from '../components/ecommerce/MonthlySale.vue';
import CustomerDemographic from '../components/ecommerce/CustomerDemographic.vue';
import StatisticsChart from '../components/ecommerce/StatisticsChart.vue';
import RecentOrders from '../components/ecommerce/RecentOrders.vue';
import SectorsMexico from '../components/ecommerce/SectorsMexico.vue';
import SectorsMexicoMetric from '../components/ecommerce/SectorsMexicoMetric.vue';
import OrganizationsByScope from '../components/ecommerce/OrganizationsByScope.vue';
import ProjectsByEconomicSupport from '../components/ecommerce/ProjectsByEconomicSupport.vue';
import AverageAmountByEconomicSupport from '../components/ecommerce/AverageAmountByEconomicSupport.vue';

export default {
	name: 'Ecommerce',
	components: {
		OrganizationsByScope,
		ProjectsByEconomicSupport,
		AverageAmountByEconomicSupport,
		AdminLayout,
		EcommerceMetrics,
		// eslint-disable-next-line vue/no-unused-components
		MonthlyTarget,
		MonthlySale,
		CustomerDemographic,
		StatisticsChart,
		RecentOrders,
		SectorsMexico,
		SectorsMexicoMetric,
	},
};
</script>
