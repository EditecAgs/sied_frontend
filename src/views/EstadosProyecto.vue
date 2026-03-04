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
							class="inline-flex items-center gap-2
	       px-4 py-2
	       bg-[#6b1d2a]
	       text-white
	       rounded-md
	       hover:bg-[#5a1823]
	       focus:outline-none
	       focus:ring-2
	       focus:ring-[#7a1f2b]
	       focus:ring-offset-2
	       transition-all
	       disabled:opacity-50
	       disabled:cursor-not-allowed"
							@click="applyFilters">
							<svg
								v-if="!isApplyingFilters"
								xmlns="http://www.w3.org/2000/svg"
								class="w-4 h-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="2">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M3 4h18l-7 8v6l-4 2v-8L3 4z" />
							</svg>

							<span v-if="isApplyingFilters">Aplicando...</span>
							<span v-else>Filtrar</span>
						</button>
						<button
							:disabled="isApplyingFilters"
							class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							@click="clearFilters">
							Borrar filtros
						</button>
						<!-- Comentario aquí
						<button
							class="w-12 h-12 flex items-center justify-center
								bg-[#7a1f2b]
								text-white
								rounded-xl
								shadow-md
								hover:bg-[#8f2433]
								hover:shadow-lg
								active:scale-95
								transition-all duration-200"
							title="Descargar PDF"
							@click="downloadPdf">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="w-6 h-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="2">

								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M9 3h6l4 4v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2h2z" />

								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M15 3v4h4" />

								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M8 13h8M8 17h6" />
							</svg>
						</button>
						-->
					</div>
				</div>
			</div>

			<div class="min-h-screen w-full bg-cover bg-center bg-fixed">
				<div class="flex flex-col gap-4 md:gap-6 p-4 md:p-6">
					<ProjectsByDocumentStatus :key="componentKey + 'documentstatus'" :filters="currentFilters" @loaded="onChildLoaded" />
					<ProjectsByStatus :key="componentKey + 'projectstatus'" :filters="currentFilters" @loaded="onChildLoaded" />
				</div>
			</div>
		</admin-layout>
	</div>
</template>

<script>
import AdminLayout from '../components/layouts/AdminLayout.vue'
import LoadingScreen from '../components/layouts/LoadingScreen.vue'
import ProjectsByDocumentStatus from '../components/ecommerce/ProjectsByDocumentStatus.vue';
import ProjectsByStatus from '../components/ecommerce/ProjectsByStatus.vue';
import { downloadDashboardPdf } from '../services/statistics/dashboard';
import { getInstitutions, showInstitutions } from '../services/institutions/institutions'
import { getStates } from '../services/location/states.js'

export default {
	name: 'Ecommerce',
	components: {
		AdminLayout,
		ProjectsByDocumentStatus,
		ProjectsByStatus,
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
		},

		async downloadPdf() {
			const response = await downloadDashboardPdf({
				id_state: this.currentFilters.id_state,
				id_institution: this.currentFilters.id_institution
			});

			const blob = new Blob([response.data], { type: 'application/pdf' });
			const url = window.URL.createObjectURL(blob);

			const link = document.createElement('a');
			link.href = url;
			link.download = 'dashboard.pdf';
			link.click();

			window.URL.revokeObjectURL(url);
		},
	}
}
</script>