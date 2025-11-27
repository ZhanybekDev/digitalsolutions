<script setup>
import { useToast } from "../composables/useToast.js";

const { toasts } = useToast();
</script>

<template>
  <div class="fixed top-4 right-4 z-999 space-y-2">
    <transition-group name="toast" tag="div">
      <div
          v-for="t in toasts"
          :key="t.id"
          class="px-4 py-2 rounded-lg shadow-lg text-white flex items-center gap-3 animate-slideIn"
          :class="{
          'bg-green-600': t.type === 'success',
          'bg-red-600': t.type === 'error',
          'bg-blue-600': t.type === 'info',
          'bg-gray-700': !['success','error','info'].includes(t.type)
        }"
      >
        {{ t.message }}
      </div>
    </transition-group>
  </div>
</template>

<style>
.toast-enter-active, .toast-leave-active {
  transition: all .25s ease;
}

.toast-enter-from, .toast-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

@keyframes slideIn {
  0% {
    opacity: 0;
    transform: translateX(25px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-slideIn {
  animation: slideIn .25s ease;
}
</style>
