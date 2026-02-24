<template>
	<aside
		:class="[
			'fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200',
			{
				'lg:w-[290px]': isExpanded || isMobileOpen || isHovered,
				'lg:w-[90px]': !isExpanded && !isHovered,
				'translate-x-0 w-[290px]': isMobileOpen,
				'-translate-x-full': !isMobileOpen,
				'lg:translate-x-0': true,
			},
		]"
		style="background-image: url('/images/background/bg-guinda-pleca.png'); background-size: cover; background-position: center;"
		@mouseenter="!isExpanded && (isHovered = true)"
		@mouseleave="isHovered = false">
		<div class="relative z-10 h-full flex flex-col">
			<div
				:class="[
					'pt-0 pb-8 flex transition-all duration-300',
					!isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start',
				]">
				<router-link to="/">
					<template v-if="isExpanded || isHovered || isMobileOpen">
						<img
							src="/images/logo/logo-gob.png"
							alt="Logo"
							class="w-80 pb-3" />
						<h1 class="text-5xl text-white font-montserrat font-bold">SIED</h1>
					</template>

					<template v-else>
						<img
							src="/images/logo/logo-gob.png"
							alt="Logo"
							class="w-80 transition-all duration-300 mt-4" />
						<h1 class="text-3xl text-white font-montserrat font-bold">SIED</h1>
					</template>
				</router-link>
			</div>


			<div class="flex-1 flex flex-col min-h-0 overflow-hidden">
				<nav class="mb-6 flex-1 overflow-hidden">
					<div class="h-full overflow-y-auto custom-scrollbar">
						<div class="flex flex-col gap-4">
							<div
								v-for="(menuGroup, groupIndex) in menuGroups"
								:key="groupIndex">
								<h2
									:class="[
										'mb-4 text-xs uppercase flex leading-[20px] text-gray-50',
										!isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start',
									]">
									<template v-if="isExpanded || isHovered || isMobileOpen">
										{{ menuGroup.title }}
									</template>
									<HorizontalDots v-else />
								</h2>
								<ul class="flex flex-col gap-4">
									<li
										v-for="(item, index) in menuGroup.items"
										:key="item.name">
										<!-- Botón para items con subItems (menú desplegable) -->
										<button
											v-if="item.subItems"
											:class="[
												'menu-item group w-full',
												{
													'menu-item-active': isSubmenuOpen(groupIndex, index),
													'menu-item-inactive': !isSubmenuOpen(groupIndex, index),
												},
												!isExpanded && !isHovered ? 'lg:justify-center' : 'lg:justify-start',
											]"
											@click="toggleSubmenu(groupIndex, index)">
											<span :class="[isSubmenuOpen(groupIndex, index) ? 'menu-item-icon-active' : 'menu-item-icon-inactive']">
												<component :is="item.icon" class="text-white" />
											</span>
											<span
												v-if="isExpanded || isHovered || isMobileOpen"
												class="menu-item-text text-white">
												{{ item.name }}
											</span>
											<ChevronDownIcon
												v-if="isExpanded || isHovered || isMobileOpen"
												:class="[
													'ml-auto w-5 h-5 transition-transform duration-200',
													{
														'rotate-180 text-brand-500': isSubmenuOpen(groupIndex, index),
													},
												]" />
										</button>

										<!-- Botón para items con action (como Recargar Caché) -->
										<button
											v-else-if="item.action"
											@click="item.action"
											:class="[
												'menu-item group w-full',
												'menu-item-inactive hover:opacity-80',
												!isExpanded && !isHovered ? 'lg:justify-center' : 'lg:justify-start',
											]">
											<span class="menu-item-icon-inactive">
												<component :is="item.icon" class="text-white" />
											</span>
											<span
												v-if="isExpanded || isHovered || isMobileOpen"
												class="menu-item-text text-white">
												{{ item.name }}
											</span>
										</button>

										<!-- Link normal para items con path -->
										<router-link
											v-else-if="item.path && !item.path.startsWith('http')"
											:to="item.path"
											:class="[
												'menu-item group',
												{
													'menu-item-active': isActive(item.path),
													'menu-item-inactive': !isActive(item.path),
												},
											]">
											<span :class="[isActive(item.path) ? 'menu-item-icon-active' : 'menu-item-icon-inactive']">
												<component :is="item.icon" class="text-white" />
											</span>
											<span
												v-if="isExpanded || isHovered || isMobileOpen"
												class="menu-item-text text-white">
												{{ item.name }}
											</span>
										</router-link>

										<!-- Link externo -->
										<a
											v-else-if="item.path && item.path.startsWith('http')"
											:href="item.path"
											target="_blank"
											rel="noopener noreferrer"
											:class="[
												'menu-item group',
												'menu-item-inactive hover:opacity-80',
											]">
											<span class="menu-item-icon-inactive">
												<component :is="item.icon" class="text-white" />
											</span>
											<span
												v-if="isExpanded || isHovered || isMobileOpen"
												class="menu-item-text text-white">
												{{ item.name }}
											</span>
										</a>

										<transition
											@enter="startTransition"
											@after-enter="endTransition"
											@before-leave="startTransition"
											@after-leave="endTransition">
											<div v-show="isSubmenuOpen(groupIndex, index) && (isExpanded || isHovered || isMobileOpen)">
												<ul class="mt-2 space-y-1 ml-9">
													<li
														v-for="subItem in item.subItems"
														:key="subItem.name">
														<router-link
															:to="subItem.path"
															:class="[
																'menu-dropdown-item',
																{
																	'menu-dropdown-item-active': isActive(subItem.path),
																	'menu-dropdown-item-inactive': !isActive(subItem.path),
																},
															]">
															{{ subItem.name }}
															<span class="flex items-center gap-1 ml-auto">
																<span
																	v-if="subItem.new"
																	:class="[
																		'menu-dropdown-badge',
																		{
																			'menu-dropdown-badge-active': isActive(subItem.path),
																			'menu-dropdown-badge-inactive': !isActive(subItem.path),
																		},
																	]">
																	new
																</span>
																<span
																	v-if="subItem.pro"
																	:class="[
																		'menu-dropdown-badge',
																		{
																			'menu-dropdown-badge-active': isActive(subItem.path),
																			'menu-dropdown-badge-inactive': !isActive(subItem.path),
																		},
																	]">
																	pro
																</span>
															</span>
														</router-link>
													</li>
												</ul>
											</div>
										</transition>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</nav>
				<SidebarWidget v-if="isExpanded || isHovered || isMobileOpen" />
			</div>
		</div>
	</aside>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Swal from 'sweetalert2';

import {
	GridIcon,
	UserCircleIcon,
	ChevronDownIcon,
	HorizontalDots,
	TableIcon,
	ListIcon,
	FolderIcon,
	HistoryIcon,
	accesIcon,
	RefreshIcon, // Importa el icono de refresh (asegúrate de tenerlo en tus iconos)
} from '../../icons';
import { useSidebar } from '../../composables/useSidebar';
import { refreshDashboardCache } from '../../services/statistics/dashboard';

const route = useRoute();
const { isExpanded, isMobileOpen, isHovered, openSubmenu } = useSidebar();

const userType = ref(null);
const isRefreshing = ref(false);

onMounted(() => {
	const userData = localStorage.getItem('user');
	if (userData) {
		try {
			const user = JSON.parse(userData);
			userType.value = user.type;
		} catch (error) {
			console.warn('Error al parsear user data:', error);
		}
	}
});

// Función para recargar caché con SweetAlert2
const handleRefreshCache = async () => {
	if (isRefreshing.value) return;

	const result = await Swal.fire({
		title: '¿Recargar caché del dashboard?',
		text: 'Esto actualizará todos los datos estadísticos. Puede tomar unos segundos.',
		icon: 'question',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Sí, recargar',
		cancelButtonText: 'Cancelar'
	});

	if (!result.isConfirmed) return;

	isRefreshing.value = true;

	Swal.fire({
		title: 'Actualizando caché',
		text: 'Por favor espera...',
		allowOutsideClick: false,
		allowEscapeKey: false,
		didOpen: () => {
			Swal.showLoading();
		}
	});

	try {
		const response = await refreshDashboardCache();

		if (response.data.success) {
			Swal.fire({
				icon: 'success',
				title: '¡Caché actualizada!',
				html: `
					${response.data.message}<br>
					<small class="text-gray-500">Job ID: ${response.data.data?.job_id || 'N/A'}</small>
				`,
				timer: 3000,
				showConfirmButton: true
			});
		} else {
			throw new Error(response.data.message || 'Error al actualizar');
		}
	} catch (error) {
		console.error('Error:', error);

		if (error.response?.status === 429) {
			Swal.fire({
				icon: 'warning',
				title: 'Ya está en proceso',
				text: 'La caché ya está siendo actualizada. Por favor espera unos segundos.',
				confirmButtonColor: '#3085d6'
			});
		} else {
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: error.response?.data?.message || 'Error al conectar con el servidor',
				confirmButtonColor: '#3085d6'
			});
		}
	} finally {
		isRefreshing.value = false;
	}
};

const menuGroups = computed(() => {
	return [
		{
			title: 'Menú',
			items: [
				{
					name: 'Estadisticas',
					icon: GridIcon,
					subItems: [
						{ name: 'Métricas Generales', path: '/static-general', pro: false },
						{ name: 'Estado del Proyecto', path: '/static-project-states', pro: false },
						{ name: 'Clasificación de Proyectos', path: '/static-project-classification', pro: false },
						{ name: 'Organizaciones y Sectores', path: '/static-organizations-sectors', pro: false },
						{ name: 'Finanzas', path: '/static-finances', pro: false },
						{ name: 'Análisis por Clúster', path: '/static-analysis-clusters', pro: false },
						{ name: 'Acreditaciones', path: '/static-accreditations', pro: false },
					]
				},
				{
					icon: UserCircleIcon,
					name: 'Perfil de Usuario',
					path: '/profile',
				},
				{
					name: 'Modelo Dual',
					icon: ListIcon,
					path: '/form-elements',
				},
			],
		},
		{
			title: 'Admin',
			items: [
				{
					name: 'Catálogos',
					icon: TableIcon,
					subItems: [
						...(userType.value === 0 ? [{ name: 'Usuarios', path: '/basic-tables', pro: false }] : []),
						{ name: 'Apoyo Económico', path: '/economic-table', pro: false },
						{ name: 'Carreras', path: '/careers-table', pro: false },
						{ name: 'Cámaras', path: '/Clusters-table', pro: false },
						{ name: 'Certificaciones', path: '/certifications-table', pro: false },
						{ name: 'Clasificación General del Proyecto Dual', path: '/dual_Area-table', pro: false },
						{ name: 'Diplomados', path: '/diplomas-table', pro: false },
						{ name: 'Especialidades', path: '/specialties-table', pro: false },
						{ name: 'Estudiantes', path: '/student-table', pro: false },
						{ name: 'Estatus de Documentos', path: '/document-table', pro: false },
						{ name: 'Instituciones', path: '/institution-table', pro: false },
						{ name: 'Microcredenciales', path: '/micro-credentials-table', pro: false },
						{ name: 'Organizaciones', path: '/Organization-table', pro: false },
						{ name: 'Periodos Académicos', path: '/periods_Academic-table', pro: false },
						{ name: 'Sectores', path: '/sectors-table', pro: false },
						{ name: 'Subsistemas', path: '/subsystem-table', pro: false },
						{ name: 'Tipo de Modelo Dual', path: '/dual_type-table', pro: false },
						{ name: 'Tipo de Organización ', path: '/type-table', pro: false },
						{ name: 'Tipo de Beneficio', path: '/benefit-type-table', pro: false }
					].filter(Boolean),
				},
				// BOTÓN DE RECARGAR CACHÉ - SOLO PARA ADMIN
				...(userType.value === 0
					? [{
						icon: RefreshIcon, // Usa RefreshIcon o HistoryIcon
						name: 'Recargar Caché',
						action: handleRefreshCache, // Función que se ejecutará
					}]
					: []),
			],
		},
		{
			title: 'Recursos',
			items: [
				{
					icon: FolderIcon,
					name: 'Tutoriales',
					path: '/tutorials',
				},
				...(userType.value === 0
					? [
						{
							icon: HistoryIcon,
							name: 'Registro de Actividades de Usuario',
							path: '/logs',
						},
						{
							icon: accesIcon,
							name: 'Registro de Accesos de Usuario',
							path: '/access-logs',
						}
					]
					: []),
			],
		},
	];
});

const isActive = (path) => route.path === path;

const toggleSubmenu = (groupIndex, itemIndex) => {
	const key = `${groupIndex}-${itemIndex}`;
	openSubmenu.value = openSubmenu.value === key ? null : key;
};

const isAnySubmenuRouteActive = computed(() => {
	return menuGroups.value.some((group) =>
		group.items.some((item) =>
			item.subItems && item.subItems.some((subItem) => isActive(subItem.path))
		)
	);
});

const isSubmenuOpen = (groupIndex, itemIndex) => {
	const key = `${groupIndex}-${itemIndex}`;
	return (
		openSubmenu.value === key ||
		(isAnySubmenuRouteActive.value &&
			menuGroups.value[groupIndex].items[itemIndex].subItems?.some((subItem) => isActive(subItem.path)))
	);
};

const startTransition = (el) => {
	el.style.height = 'auto';
	const height = el.scrollHeight;
	el.style.height = '0px';
	void el.offsetHeight;
	el.style.height = height + 'px';
};

const endTransition = (el) => {
	el.style.height = '';
};
</script>

<style scoped>
.custom-scrollbar {
	scrollbar-width: thin;
	scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
	width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
	background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
	background-color: rgba(255, 255, 255, 0.3);
	border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
	background-color: rgba(255, 255, 255, 0.5);
}
</style>