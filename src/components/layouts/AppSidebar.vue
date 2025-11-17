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
										<!-- Si el enlace es interno, usa router-link -->
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

import {
	GridIcon,
	UserCircleIcon,
	ChevronDownIcon,
	HorizontalDots,
	TableIcon,
	ListIcon,
	FolderIcon,
	HistoryIcon,
	accesIcon
} from '../../icons';
import { useSidebar } from '../../composables/useSidebar';

const route = useRoute();
const { isExpanded, isMobileOpen, isHovered, openSubmenu } = useSidebar();

const userType = ref(null);

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


const menuGroups = computed(() => {
	return [
		{
			title: 'Menú',
			items: [
				{
					icon: GridIcon,
					name: 'Dashboard',
					path: '/dashboard',
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
						{ name: 'Áreas Duales', path: '/dual_Area-table', pro: false },
						{ name: 'Carreras', path: '/careers-table', pro: false },
						{ name: 'Cámaras', path: '/Clusters-table', pro: false },
						{ name: 'Especialidades', path: '/specialties-table', pro: false },
						{ name: 'Estudiantes', path: '/student-table', pro: false },
						{ name: 'Estatus de Documentos', path: '/document-table', pro: false },
						{ name: 'Instituciones', path: '/institution-table', pro: false },
						{ name: 'Microcredenciales', path: '/micro-credentials-table', pro: false },
						{ name: 'Certificaciones', path: '/certifications-table', pro: false },
						{ name: 'Diplomados', path: '/diplomas-table', pro: false },
						{ name: 'Organizaciones', path: '/Organization-table', pro: false },
						{ name: 'Periodos Académicos', path: '/periods_Academic-table', pro: false },
						{ name: 'Sectores', path: '/sectors-table', pro: false },
						{ name: 'Subsistemas', path: '/subsystem-table', pro: false },
						{ name: 'Tipo de Organización ', path: '/type-table', pro: false },
						{ name: 'Tipo de Actividad Dual', path: '/dual_type-table', pro: false },
					].filter(Boolean),
				},
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