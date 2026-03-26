<template>
	<div ref="dropdownRef" class="relative">
		<button
			class="flex items-center text-gray-700 dark:text-gray-400"
			@click.prevent="toggleDropdown">
			<span class="mr-3 overflow-hidden rounded-full h-11 w-11">
				<img
					v-if="logoUrl"
					:src="logoUrl"
					:alt="displayName"
					class="object-cover h-full w-full" />
			</span>

			<div class="flex flex-col items-end mr-1">
				<span class="font-medium text-theme-sm">
					{{ displayName }}
				</span>
				<span class="text-xs text-gray-500 dark:text-gray-400 ">
					{{ userName }}
				</span>
			</div>

			<ChevronDownIcon :class="{ 'rotate-180': dropdownOpen }" />
		</button>

		<div
			v-if="dropdownOpen"
			class="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark">
			<ul class="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
				<li v-for="item in menuItems" :key="item.href">
					<router-link
						:to="item.href"
						class="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
						<component
							:is="item.icon"
							class="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
						{{ item.text }}
					</router-link>
				</li>
			</ul>
			<router-link
				to="/signin"
				class="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
				@click="signOut">
				<LogoutIcon
					class="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
				Cerrar sesión
			</router-link>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import {
	UserCircleIcon,
	ChevronDownIcon,
	LogoutIcon,
	InfoCircleIcon
} from '../../../icons'
import { showInstitutions } from '../../../services/institutions/institutions'
import { showUsers } from '../../../services/users/users'

const router = useRouter()
const dropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const user = ref<any>(null)
const institution = ref<any>(null)

const menuItems = [
	{ href: '/profile', icon: UserCircleIcon, text: 'Editar perfil' },
	{ href: '/profile', icon: InfoCircleIcon, text: 'Soporte' }
]

const toggleDropdown = () => (dropdownOpen.value = !dropdownOpen.value)
const closeDropdown = () => (dropdownOpen.value = false)


const signOut = () => {
	axios.get('/logout')
		.then(() => {
			localStorage.removeItem('token')
			localStorage.removeItem('user')
			localStorage.removeItem('institution')
			axios.defaults.headers.common['Authorization'] = undefined

			router.push('/signin')
			closeDropdown()
		})
		.catch((err) => {
			console.error('Error al cerrar sesión:', err)
			localStorage.removeItem('token')
			localStorage.removeItem('user')
			localStorage.removeItem('institution')
			axios.defaults.headers.common['Authorization'] = undefined
			router.push('/signin')
			closeDropdown()
		})
}

const handleClickOutside = (event: MouseEvent) => {
	if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
		closeDropdown()
	}
}

onMounted(async () => {
	document.addEventListener('click', handleClickOutside)

	const rawUser = localStorage.getItem('user')
	if (rawUser) {
		try {
			user.value = JSON.parse(rawUser)

			if (user.value?.id && !user.value.lastname) {
				try {
					const token = localStorage.getItem('token')
					if (token) {
						axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
					}
					const userResponse = await showUsers(user.value.id)
					if (userResponse?.data) {
						user.value = userResponse.data
						localStorage.setItem('user', JSON.stringify(userResponse.data))
					}
				} catch (err) {
					console.error('Error al obtener detalles del usuario:', err)
				}
			}
		} catch (err) {
			console.warn('Error parseando user de localStorage', err)
		}
	}


	const rawInst = localStorage.getItem('institution')
	if (rawInst) {
		try {
			institution.value = JSON.parse(rawInst)
		} catch (err) {
			console.warn('Error parseando institution de localStorage', err)
		}
	} else if (user.value?.id_institution) {
		try {
			const token = localStorage.getItem('token')
			if (token) {
				axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
			}
			const res = await showInstitutions(user.value.id_institution)
			institution.value = res?.data ?? res

			if (institution.value) {
				localStorage.setItem('institution', JSON.stringify(institution.value))
			}
		} catch (err) {
			console.error('No se pudo obtener institución', err)
		}
	}
})


onUnmounted(() => {
	document.removeEventListener('click', handleClickOutside)
})

const logoUrl = computed(() => {
	if (!institution.value) return '/images/institutionsLogo/logo_ITA.png'


	if (institution.value.logo_url) return institution.value.logo_url
	if (institution.value.logo) return institution.value.logo
	if (institution.value.image) return institution.value.image

	return '/images/institutionsLogo/logo_ITA.png'
})

const displayName = computed(() => {
	if (institution.value?.name) return institution.value.name
	if (user.value?.name) return user.value.name
	return 'Institución'
})

const userName = computed(() => {
	if (user.value?.name && user.value?.lastname) {
		return `${user.value.name} ${user.value.lastname}`
	} else if (user.value?.name) {
		return user.value.name
	} else if (user.value?.email) {
		return user.value.email
	}
	return 'Usuario'
})
</script>