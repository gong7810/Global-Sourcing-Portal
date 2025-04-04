import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCompanyStore = defineStore(
  'companyStore',
  () => {
    const user = ref('');

    return {
      user
    };
  },
  {
    persist: {
      enabled: true,
      strategies: [{ storage: sessionStorage }]
    }
  }
);
