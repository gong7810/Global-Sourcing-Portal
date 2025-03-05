import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useUserStore = defineStore(
  'userStore',
  () => {
    const jobOfferList = ref([
      {
        id: 1,
        companyName: '(주)비티포탈',
        position: '프론트엔드 개발자',
        location: '경남 진주시',
        offerDate: '2025.03.20',
        deadline: '2025.04.05',
        status: 'pending',
        message: '귀하의 이력서를 보고 연락드립니다. 저희 회사와 함께하시면 좋겠습니다.',
        isRead: false
      },
      {
        id: 2,
        companyName: '테크솔루션',
        position: '웹 개발자',
        location: '서울 강남구',
        offerDate: '2025.03.18',
        deadline: '2025.04.01',
        status: 'pending',
        message: '귀하의 기술스택이 저희 회사와 잘 맞을 것 같습니다.',
        isRead: true
      },
      {
        id: 3,
        companyName: '매니징코어',
        position: '기획/디자인',
        location: '화성시 동탄',
        offerDate: '2025.04.05',
        deadline: '2025.04.10',
        status: 'pending',
        message: '귀하의 기술스택이 저희 회사와 잘 맞을 것 같습니다.',
        isRead: false
      }
    ]);

    const proposalCount = computed(() => {
      console.log(
        jobOfferList.value.filter((item) => {
          console.log(item);
          if (item.status === 'pending') return item;
        }).length
      );
      return jobOfferList.value.filter((item) => item.status === 'pending').length;
    });

    return {
      jobOfferList
    };
  },
  {
    persist: {
      enabled: true,
      strategies: [{ storage: sessionStorage }]
    }
  }
);
