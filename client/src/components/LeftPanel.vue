<script setup>
import {ref, watch} from 'vue';
import {fetchItems, enqueueAction} from '../utils/api.js';
import {useStore} from '../store/store.js';
import {useDebounce} from "../utils/useDebounce.js";

const store = useStore()
const processingSet = ref(new Set());
const loading = ref(false);

const filter = ref('');
const debouncedFilter = useDebounce(filter, 500);
let offset = 0;
const limit = 20;

const loadMore = async () => {
  loading.value = true;
  const items = await fetchItems(offset, limit, debouncedFilter.value ? parseInt(debouncedFilter.value) : undefined);
  store.leftPanelData.push(...items);
  offset += items.length;
  loading.value = false;
};

const onScroll = async (e) => {
  const el = e.target;
  if (el.scrollTop + el.clientHeight >= el.scrollHeight - 5) {
    await loadMore();
  }
};

const selectItem = async (id) => {
  if (processingSet.value.has(id)) return;
  processingSet.value.add(id);

  await enqueueAction('SELECT', {id});

  if (store.leftPanelData.length < 20) {
    await loadMore();
  }

  store.leftPanelData = store.leftPanelData.filter(i => i.id !== id);
  store.rightPanelData.push({id});

  processingSet.value.delete(id);
};

watch(debouncedFilter, async () => {
  store.leftPanelData = [];
  offset = 0;
  await loadMore();
});

loadMore();
</script>

<template>
  <div class="flex-1 border p-2 rounded overflow-auto" @scroll="onScroll">
    <input v-model="filter" placeholder="ID" class="mb-2 p-1 border rounded w-full"/>
      <div v-for="item in store.leftPanelData" :key="item.id" class="p-2 border-b flex justify-between items-center">
        <span>{{ item.id }}</span>
        <button
            @click="selectItem(item.id)"
            :disabled="processingSet.has(item.id)"
            class="px-2 py-1 rounded text-white flex items-center gap-2
         bg-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <template v-if="processingSet.has(item.id)">
            <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span>Загрузка…</span>
          </template>
          <template v-else>
            Выбрать
          </template>
        </button>
      </div>
    <template v-if="loading">
      <div class="flex justify-center items-center">
        <span class="w-10 h-10 mt-3 border-2 border-blue border-t-transparent rounded-full animate-spin"></span>
      </div>
    </template>
  </div>
</template>
