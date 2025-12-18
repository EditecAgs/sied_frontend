<template>
	<div style="background-image: url('/images/background/bg-white-flores.png')">
		<admin-layout>
			<LoadingScreen :show="loading" message="Cargando datos..." />

			<div class="bg-white shadow-md rounded-lg p-4 mb-6 mx-4 mt-4">
				<div class="flex flex-col md:flex-row gap-4 items-end">
					<div class="flex-1">
						<label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Filtro</label>
						<select
							v-model="selectedFilter.type"
							class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
							@change="onFilterTypeChange">
							<option value="">Sin filtro</option>
							<option value="state">Estado</option>
							<option value="institution">Institución</option>
						</select>
					</div>

					<div class="flex-1">
						<label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
						<select
							v-model="selectedFilter.stateId"
							:disabled="selectedFilter.type !== 'state' || !showStateFilter"
							class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100 disabled:cursor-not-allowed">
							<option value="">Seleccionar estado</option>
							<option v-for="state in filteredStates" :key="state.id" :value="state.id">
								{{ state.name }}
							</option>
						</select>
					</div>

					<div class="flex-1">
						<label class="block text-sm font-medium text-gray-700 mb-1">Institución</label>
						<select
							v-model="selectedFilter.institutionId"
							:disabled="selectedFilter.type !== 'institution' || !showInstitutionFilter"
							class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100 disabled:cursor-not-allowed">
							<option value="">Seleccionar institución</option>
							<option v-for="institution in filteredInstitutions" :key="institution.id" :value="institution.id">
								{{ institution.name }}
							</option>
						</select>
					</div>

					<div class="flex gap-2">
						<button
							:disabled="isApplyingFilters"
							class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							@click="applyFilters">
							<span v-if="isApplyingFilters">Aplicando...</span>
							<span v-else>Filtrar</span>
						</button>
						<button
							:disabled="isApplyingFilters"
							class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							@click="clearFilters">
							Borrar filtros
						</button>
					</div>
				</div>
			</div>

			<div class="min-h-screen w-full bg-cover bg-center bg-fixed">
				<div class="grid grid-cols-12 gap-4 md:gap-6 p-4 md:p-6 grid-flow-dense">
					<div class="col-span-12 xl:col-span-7 grid gap-4 md:gap-6 auto-rows-max">
						<ecommerce-metrics :key="componentKey + 'metrics'" :filters="currentFilters" @loaded="onChildLoaded" />
						<monthly-sale :key="componentKey + 'monthly'" :filters="currentFilters" @loaded="onChildLoaded" />
					</div>

					<div class="col-span-12 xl:col-span-5">
						<div class="h-full max-h-[575px] overflow-y-auto">
							<SectorsMexico :key="componentKey + 'sectors'" :filters="currentFilters" @loaded="onChildLoaded" />
						</div>
					</div>

					<div class="col-span-12">
						<statistics-chart :key="componentKey + 'stats'" :filters="currentFilters" @loaded="onChildLoaded" />
					</div>

					<div class="col-span-12 xl:col-span-8 grid gap-4 md:gap-6 auto-rows-max">
						<recent-orders :key="componentKey + 'orders'" :filters="currentFilters" @loaded="onChildLoaded" />
						<OrganizationsByScope :key="componentKey + 'scope'" :filters="currentFilters" @loaded="onChildLoaded" />
						<ProjectsByEconomicSupport :key="componentKey + 'economic'" :filters="currentFilters" @loaded="onChildLoaded" />
						<SectorsMexicoMetric :key="componentKey + 'metric'" :filters="currentFilters" @loaded="onChildLoaded" />
					</div>

					<div class="col-span-12 xl:col-span-4 grid gap-4 md:gap-6 auto-rows-max min-w-0">
						<customer-demographic
							:key="componentKey + 'demographic'"
							:filters="currentFilters"
							class="h-auto min-w-0"
							@loaded="onChildLoaded" />

						<AverageAmountByEconomicSupport
							:key="componentKey + 'average'"
							:filters="currentFilters"
							class="h-auto min-w-0"
							@loaded="onChildLoaded" />

						<div class="min-w-0 overflow-hidden">
							<ProjectsByDualType
								:key="componentKey + 'dualtype'"
								:filters="currentFilters"
								class="h-auto w-full"
								@loaded="onChildLoaded" />
						</div>
					</div>

					<div class="col-span-12">
						<OrganizationsByLocalCluster :key="componentKey + 'cluster'" :filters="currentFilters" @loaded="onChildLoaded" />
					</div>

					<div class="col-span-12">
						<div class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
							<ProjectsByClusterLocal :key="componentKey + 'local'" :filters="currentFilters" @loaded="onChildLoaded" />
							<ProjectsByClusterNacional :key="componentKey + 'nacional'" :filters="currentFilters" @loaded="onChildLoaded" />
						</div>
					</div>
				</div>
			</div>
		</admin-layout>
	</div>
</template>

<script>
import AdminLayout from '../components/layouts/AdminLayout.vue'
import EcommerceMetrics from '../components/ecommerce/EcommerceMetrics.vue'
import MonthlySale from '../components/ecommerce/MonthlySale.vue'
import CustomerDemographic from '../components/ecommerce/CustomerDemographic.vue'
import StatisticsChart from '../components/ecommerce/StatisticsChart.vue'
import RecentOrders from '../components/ecommerce/RecentOrders.vue'
import SectorsMexico from '../components/ecommerce/SectorsMexico.vue'
import SectorsMexicoMetric from '../components/ecommerce/SectorsMexicoMetric.vue'
import OrganizationsByScope from '../components/ecommerce/OrganizationsByScope.vue'
import ProjectsByEconomicSupport from '../components/ecommerce/ProjectsByEconomicSupport.vue'
import AverageAmountByEconomicSupport from '../components/ecommerce/AverageAmountByEconomicSupport.vue'
import LoadingScreen from '../components/layouts/LoadingScreen.vue'
import ProjectsByDualType from '../components/ecommerce/ProjectsByDualType.vue'
import OrganizationsByLocalCluster from '../components/ecommerce/OrganizationsByLocalCluster.vue'
import ProjectsByClusterLocal from '../components/ecommerce/ProjectsByClusterLocal.vue'
import ProjectsByClusterNacional from '../components/ecommerce/ProjectsByClusterNacional.vue'
import { getInstitutions, showInstitutions } from '../services/institutions/institutions'
import { getStates } from '../services/location/states.js'

export default {
	name: 'Ecommerce',
	components: {
		AdminLayout,
		EcommerceMetrics,
		MonthlySale,
		CustomerDemographic,
		StatisticsChart,
		RecentOrders,
		SectorsMexico,
		SectorsMexicoMetric,
		OrganizationsByScope,
		ProjectsByEconomicSupport,
		AverageAmountByEconomicSupport,
		ProjectsByDualType,
		OrganizationsByLocalCluster,
		ProjectsByClusterLocal,
		ProjectsByClusterNacional,
		LoadingScreen
	},
	data() {
		return {
			loading: true,
			loadedChildren: 0,
			totalChildren: 2,
			componentKey: 0,
			userType: null,
			userInstitution: null,
			allInstitutions: [],
			allStates: [],
			isApplyingFilters: false,
			selectedFilter: {
				type: '',
				stateId: '',
				institutionId: ''
			},
			currentFilters: {
				id_state: null,
				id_institution: null
			}
		}
	},
	computed: {
		isAdmin() {
			return this.userType === 0
		},
		filteredStates() {
			if (this.isAdmin) return this.allStates
			if (this.userInstitution?.state) return [this.userInstitution.state]
			return []
		},
		filteredInstitutions() {
			if (this.isAdmin) return this.allInstitutions
			if (this.userInstitution?.id) return [this.userInstitution]
			return []
		},
		showInstitutionFilter() {
			return this.filteredInstitutions.length > 0
		},
		showStateFilter() {
			return this.isAdmin || !!this.userInstitution?.state
		}
	},
	async mounted() {
		await this.getUserData()
		await this.loadFilterOptions()
	},
	methods: {
		onChildLoaded() {
			this.loadedChildren++
			if (this.loadedChildren >= this.totalChildren) {
				this.loading = false
				this.isApplyingFilters = false
			}
		},

		async getUserData() {
			const userType = localStorage.getItem('user_type')
			this.userType = userType ? parseInt(userType) : null

			if (this.userType === 0) return

			const inst = JSON.parse(localStorage.getItem('institution') || '{}')
			if (inst?.id) {
				const res = await showInstitutions(inst.id)
				this.userInstitution = res.data
			}
		},

		async loadFilterOptions() {
			const [instRes, statesRes] = await Promise.all([
				getInstitutions(),
				getStates()
			])

			this.allInstitutions = instRes?.data || []
			this.allStates = statesRes?.data || []

			if (!this.isAdmin && this.userInstitution?.id) {
				this.selectedFilter.type = 'institution'
				this.selectedFilter.institutionId = this.userInstitution.id
				this.selectedFilter.stateId = this.userInstitution.state?.id || ''
				this.applyFilters()
			}
		},

		onFilterTypeChange() {
			if (this.selectedFilter.type === 'state') {
				this.selectedFilter.institutionId = ''
				if (!this.isAdmin) {
					this.selectedFilter.stateId = this.userInstitution?.state?.id || ''
				}
			}
			if (this.selectedFilter.type === 'institution') {
				this.selectedFilter.stateId = ''
			}
			if (!this.selectedFilter.type) {
				this.selectedFilter.stateId = ''
				this.selectedFilter.institutionId = ''
			}
		},

		applyFilters() {
			this.loading = true
			this.isApplyingFilters = true
			this.loadedChildren = 0

			this.currentFilters = {
				id_state:
					this.selectedFilter.type === 'state'
						? this.selectedFilter.stateId
						: null,
				id_institution:
					this.selectedFilter.type === 'institution'
						? this.selectedFilter.institutionId
						: null
			}

			this.componentKey++
		},

		clearFilters() {
			this.loading = true
			this.isApplyingFilters = true
			this.loadedChildren = 0

			this.selectedFilter = {
				type: '',
				stateId: '',
				institutionId: ''
			}

			this.currentFilters = {
				id_state: null,
				id_institution: null
			}

			this.componentKey++
		}
	}
}
</script>