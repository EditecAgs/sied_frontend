<template>
	<div style="background-image: url('/images/background/bg-white-flores.png')">
		<admin-layout>
			<LoadingScreen :show="loading" message="Cargando datos..." />


			<div v-show="!loading" class="min-h-screen w-full bg-cover bg-center bg-fixed">
				<div class="grid grid-cols-12 gap-4 md:gap-6 p-4 md:p-6 grid-flow-dense">
					<div class="col-span-12 xl:col-span-7 grid gap-4 md:gap-6 auto-rows-max">
						<ecommerce-metrics @loaded="onChildLoaded" :filtersAdd="filtersAdd"/>
						<monthly-sale @loaded="onChildLoaded" :filtersAdd="filtersAdd"/>
					</div>

					<div class="col-span-12 xl:col-span-5">
						<div class="h-full max-h-[575px] overflow-y-auto">
							<SectorsMexico @loaded="onChildLoaded" :filtersAdd="filtersAdd"/>
						</div>
					</div>

					<div class="col-span-12">
						<statistics-chart class="h-full" @loaded="onChildLoaded" :filtersAdd="filtersAdd"/>
					</div>

					<div class="col-span-12 xl:col-span-8 grid gap-4 md:gap-6 auto-rows-max">
						<recent-orders class="h-auto" @loaded="onChildLoaded" :filtersAdd="filtersAdd"/>
						<OrganizationsByScope class="h-auto" @loaded="onChildLoaded" :filtersAdd="filtersAdd"/>
						<ProjectsByEconomicSupport class="h-auto" @loaded="onChildLoaded" :filtersAdd="filtersAdd"/>
						<SectorsMexicoMetric class="h-auto" @loaded="onChildLoaded" :filtersAdd="filtersAdd"/>
						<OrganizationsByLocalCluster class="h-auto" @loaded="onChildLoaded" :filtersAdd="filtersAdd"/>
					</div>

					<div class="col-span-12 xl:col-span-4 grid gap-4 md:gap-6 auto-rows-max">
						<customer-demographic class="h-auto" @loaded="onChildLoaded" :filtersAdd="filtersAdd"/>
						<AverageAmountByEconomicSupport class="h-auto" @loaded="onChildLoaded" :filtersAdd="filtersAdd"/>
						<ProjectsByDualType class="h-auto" @loaded="onChildLoaded" :filtersAdd="filtersAdd"/>
					</div>


					<div class="col-span-12">
						<div class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
							<ProjectsByClusterLocal class="h-auto" @loaded="onChildLoaded" :filtersAdd="filtersAdd"/>
							<ProjectsByClusterNacional class="h-auto" @loaded="onChildLoaded" :filtersAdd="filtersAdd"/>
						</div>
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
import LoadingScreen from '../components/layouts/LoadingScreen.vue';
import ProjectsByDualType from '../components/ecommerce/ProjectsByDualType.vue';
import OrganizationsByLocalCluster from '../components/ecommerce/OrganizationsByLocalCluster.vue';
import ProjectsByClusterLocal from '../components/ecommerce/ProjectsByClusterLocal.vue';
import ProjectsByClusterNacional from '../components/ecommerce/ProjectsByClusterNacional.vue';
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
		LoadingScreen,
		ProjectsByDualType,
		OrganizationsByLocalCluster,
		ProjectsByClusterLocal,
		ProjectsByClusterNacional,
	},
	//provicional state 2, instituciones 1
	data() {
		return {
			loading: true,
			loadedChildren: 0,
			totalChildren: 1,
			filtersAdd:1
		};
	},
	methods: {
		onChildLoaded() {
			this.loadedChildren++;
			if (this.loadedChildren >= this.totalChildren) {
				this.loading = false;
			}
		},
	},
};
</script>
