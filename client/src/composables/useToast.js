import { ref } from "vue";

const toasts = ref([]);

export function useToast() {
    const show = (message, type = "success") => {
        const id = Date.now();

        toasts.value.push({ id, message, type });

        setTimeout(() => {
            toasts.value = toasts.value.filter(t => t.id !== id);
        }, 3000);
    };

    return {
        toasts,
        success: (msg) => show(msg, "success"),
        error: (msg) => show(msg, "error"),
        info: (msg) => show(msg, "info"),
        show
    };
}
