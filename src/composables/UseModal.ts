// composables/useModal.ts
import { ref } from 'vue'

export function useModal() {
    const showModal = ref(false)
    const modalData = ref<{ mode: 'create' | 'edit'; pk: number | null; table: string }>({
        mode: 'create',
        pk: null,
		table: ''
    })

    const openModal = (mode: 'create' | 'edit', pk: number | null = null, table: string) => {
        modalData.value = { mode, pk , table}
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
