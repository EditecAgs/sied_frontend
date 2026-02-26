import { ref } from 'vue'

type ModalBase = {
	mode: 'create' | 'edit'
	pk: number | null
	table: string
}

export function useModal() {
	const showModal = ref(false)

	const modalData = ref<ModalBase & Record<string, unknown>>({
		mode: 'create',
		pk: null,
		table: ''
	})

	const openModal = (
		mode: 'create' | 'edit',
		pk: number | null = null,
		table: string,
		extraData: Record<string, unknown> = {}
	) => {
		modalData.value = { mode, pk, table, ...extraData }
		showModal.value = true
	}

	const closeModal = () => {
		showModal.value = false
	}

	return {
		showModal,
		modalData,
		openModal,
		closeModal,
	}
}