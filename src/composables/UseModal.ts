// composables/useModal.ts
import { ref } from 'vue'

export function useModal() {
    const showModal = ref(false)
    const modalData = ref<{ mode: 'create' | 'edit'; pk: number | null; table: string }>({
        mode: 'create',
        pk: null,
		table: ''
    })

    const openModal = (mode: 'create' | 'edit', pk: number | null = null, table: string, extraData: any = null) => {
        modalData.value = { mode, pk , table, ...extraData }
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
