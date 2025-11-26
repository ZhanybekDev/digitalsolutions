<script setup>
import { ref, watch } from 'vue';
import draggable from 'vuedraggable';
import { fetchSelected, enqueueAction } from '../utils/api.js';
import {useStore} from "../store/store.js";
import {useDebounce} from "../utils/useDebounce.js";


const store = useStore();

const filter = ref('');
const debouncedFilter = useDebounce(filter, 500);
let offset = 0;
const limit = 20;

const loadMore = async () => {
  const items = await fetchSelected(offset, limit, debouncedFilter.value ? parseInt(debouncedFilter.value) : undefined);
  store.rightPanelData.push(...items);
  offset += items.length;
};

const onScroll = async (e) => {
  const el = e.target;
  if (el.scrollTop + el.clientHeight >= el.scrollHeight - 5) {
    await loadMore();
  }
};

const deselectItem = async (id) => {
  await enqueueAction('DESELECT', { id });
  store.rightPanelData = store.rightPanelData.filter(i => i.id !== id);
  store.leftPanelData.unshift({id})
  store.leftPanelData.sort((a, b) => a.id - b.id)
};

const onReorder = async () => {
  await enqueueAction('REORDER', { order: store.rightPanelData.map(i => i.id) });
};

watch(debouncedFilter, () => {
  store.rightPanelData = [];
  offset = 0;
  loadMore();
});

loadMore();
</script>

<template>
  <div class="flex-1 border p-2 rounded overflow-auto" @scroll="onScroll">
    <input v-model="filter" placeholder="ID" class="mb-2 p-1 border rounded w-full" />
    <draggable v-model="store.rightPanelData" item-key="id" @end="onReorder">
      <template #item="{ element }">
        <div class="p-2 border-b flex justify-between items-center">
          <span>{{ element.id }}</span>
          <button @click="deselectItem(element.id)" class="px-2 py-1 bg-red-500 text-white rounded">Удалить</button>
        </div>
      </template>
    </draggable>
  </div>
</template>
