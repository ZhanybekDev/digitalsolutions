import {defineStore} from "pinia";
import {ref} from "vue";

export const useStore = defineStore('store', () => {
   const leftPanelData = ref([])
   const rightPanelData = ref([])


    return { leftPanelData, rightPanelData }
})