import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useInterviewStore = defineStore('interview', () => {
  const interviewOffers = ref([]);

  const createInterviewOffer = (talent, companyInfo) => {
    try {
      const newOffer = {
        ...talent,
        companyInfo
      };
      console.log('Adding new offer:', newOffer); // 디버깅용
      interviewOffers.value = [...interviewOffers.value, newOffer];
      return newOffer;
    } catch (error) {
      console.error('Error in createInterviewOffer:', error);
      throw error;
    }
  };

  // 면접 제안 여부 확인 함수 추가
  const hasProposedInterview = (talentId) => {
    console.log('checking talent id:', talentId);
    console.log('current offers:', interviewOffers.value);
    return interviewOffers.value.some(offer => {
      console.log('comparing:', offer.candidate.id, talentId);
      return offer.candidate.id === talentId;
    });
  };

  return {
    interviewOffers,
    createInterviewOffer,
    hasProposedInterview
  };
}, {
  persist: true // Pinia persist 플러그인 사용 시 상태 유지
}); 