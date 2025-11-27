<script setup>
import {ref, watch} from 'vue';
import {fetchItems, enqueueAction} from '../utils/api.js';
import {useStore} from '../store/store.js';
import {useDebounce} from "../utils/useDebounce.js";
import {addItem} from "../utils/api.js";
import {useToast} from "../composables/useToast.js";

const store = useStore()
const toast = useToast()

const filter = ref('');
const processingSet = ref(new Set());
const loading = ref(false);
const noMoreData = ref(false);

const debouncedFilter = useDebounce(filter, 500);
const showAddDialog = ref(false);

let offset = 0;
const limit = 20;

const loadMore = async () => {
  if (loading.value || noMoreData.value) return
  loading.value = true;
  try {
    const items = await fetchItems(offset, limit, debouncedFilter.value ? parseInt(debouncedFilter.value) : undefined);
    if (!items || items.length === 0) {
      noMoreData.value = true;
      return;
    }
    store.leftPanelData.push(...items);
    offset += 20;
  }catch (error){
    toast.error('Не удалось получить данные');
    console.log(error)
  }finally {
    loading.value = false
  }
};

const onScroll = async (e) => {
  const el = e.target;
  if (el.scrollTop + el.clientHeight >= el.scrollHeight - 5) {
    await loadMore();
  }
};

const selectItem = async (id) => {
  if (store.leftPanelData.length < 20) {
    await loadMore();
  }
  processingSet.value.add(id);
  try {
    await enqueueAction('SELECT', {id});
    store.leftPanelData = store.leftPanelData.filter(i => i.id !== id);
    store.rightPanelData.push({id});
  }catch (error){
    console.log(error)
    toast.error('Не удалось выбрать')
  }finally {
    processingSet.value.delete(id);
  }
};

const newItemId = ref(null);

const addItemAction = async () => {
  if (!newItemId.value) return;

  try{
    const items = await addItem(newItemId.value);
    console.log('items', items);
    toast.success('ID успешно добавлен!')
    newItemId.value = null;
    showAddDialog.value = false;
  }catch (err){
    if(err.response.data.error) toast.error(err.response.data.error)
    console.log(err.message);
  }
};

watch(debouncedFilter, async () => {
  store.leftPanelData = [];
  offset = 0;
  noMoreData.value = false;
  await loadMore();
});

loadMore();
</script>

<template>

  <div class="flex-1 border p-2 rounded overflow-auto" @scroll="onScroll">
    <div class="flex items-center gap-2 justify-between mb-2">
      <input v-model="filter" placeholder="ID" class="mb-0 p-1 border rounded w-full"/>

      <button
          @click="showAddDialog = true"
          class="rounded text-white flex items-center gap-2 justify-center p-1.5
         bg-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed hover:scale-103"
      >Добавить</button>
    </div>
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

    <template v-if="!loading && !store.leftPanelData.length">
      <div class="flex justify-center items-center">
        <span>Нет данных для отображения</span>
      </div>
    </template>
  </div>

  <transition name="fade">
    <div
        v-if="showAddDialog"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        @click.self="showAddDialog = false"
    >
      <div class="bg-white p-5 rounded-xl shadow-lg w-full max-w-md animate-scaleIn">
        <h2 class="text-xl font-semibold mb-4">Добавить элемент</h2>

        <input
            v-model="newItemId"
            type="number"
            class="w-full border p-2 rounded mb-4"
            placeholder="Введите ID"
        />

        <div class="flex justify-end gap-2">
          <button
              class="px-3 py-1.5 rounded bg-gray-300 hover:bg-gray-400"
              @click="showAddDialog = false"
          >
            Отмена
          </button>

          <button
              class="px-3 py-1.5 rounded bg-green-600 text-white hover:bg-green-700"
              @click="addItemAction"
          >
            Добавить
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .15s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@keyframes scaleIn {
  0% { transform: scale(.9); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

.animate-scaleIn {
  animation: scaleIn 0.15s ease;
}
</style>
