<script setup>
import LeftPanel from "./components/LeftPanel.vue";
import RightPanel from "./components/RightPanel.vue";
import Toaster from "./components/Toaster.vue";
</script>

<template>
  <div class="flex h-screen gap-4 p-4">
    <LeftPanel />
    <RightPanel />
  </div>

  <Toaster/>
</template>

<style scoped>

</style>
