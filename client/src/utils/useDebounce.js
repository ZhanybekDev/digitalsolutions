import { ref, watch } from 'vue'

export function useDebounce(sourceRef, delay = 500) {
    const debounced = ref(sourceRef.value)
    let timeout = null

    watch(
        sourceRef, // <- следим за самим ref
        (newVal) => {
            if (timeout) clearTimeout(timeout)
            timeout = setTimeout(() => {
                debounced.value = newVal
            }, delay)
        },
        { immediate: true }
    )

    return debounced
}
