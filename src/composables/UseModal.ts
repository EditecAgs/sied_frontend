// composables/useModal.ts
import { ref } from 'vue'

export function useModal() {
    const showModal = ref(false)
    const modalData = ref<{ mode: 'create' | 'edit'; pk: number | null }>({
        mode: 'create',
        pk: null,
    })

    const openModal = (mode: 'create' | 'edit', pk: number | null = null) => {
        modalData.value = { mode, pk }
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
