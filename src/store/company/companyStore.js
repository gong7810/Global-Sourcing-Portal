import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCompanyStore = defineStore(
  'companyStore',
  () => {
    const offerUserResume = ref();

    const setOfferUserResume = (resume) => (offerUserResume.value = resume);

    return {
      offerUserResume,
      setOfferUserResume
    };
  },
  {
    persist: {
      enabled: true,
      strategies: [{ storage: sessionStorage }]
    }
  }
);
