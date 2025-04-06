import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCompanyStore = defineStore(
  'companyStore',
  () => {
    const companyData = ref();
    const offerUserResume = ref();

    const setCompanyData = (data) => (companyData.value = data);
    const setOfferUserResume = (resume) => (offerUserResume.value = resume);

    return {
      companyData,
      setCompanyData,
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
