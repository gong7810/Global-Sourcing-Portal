<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { useMessagePop } from '@/plugins/commonutils';
import { useUserStore } from '@/store/user/userStore';
import { storeToRefs } from 'pinia';

const router = useRouter();
const userStore = useUserStore();

const toast = useToast();
const messagePop = useMessagePop();

// 채용제안 목록 상태
// const jobOffers = computed(() => {
//   return jobOfferList.value;
// });

// TODO: 페이지가 렌더링될때 API호출로 채용제안 목록을 가져와야함
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

onMounted(() => {
  // getJobOfferList();
});

const getJobOfferList = async () => {
  // TODO: 페이지가 렌더링될때 API호출로 채용제안 갯수를 가져와야함
  // const body = {
  //   id: userInfo.id
  // }
  // jobOfferList.value = response.jobOfferList
};

// 상세 보기 모달 상태
const showDetailModal = ref(false);
const selectedOffer = ref(null);

// 제안 상세 보기
const viewOfferDetail = (offer) => {
  selectedOffer.value = offer;
  showDetailModal.value = true;
};

// 제안 수락
const acceptOffer = (offer) => {
  offer.status = 'accepted';
  toast.add({
    severity: 'success',
    summary: '제안 수락',
    detail: `${offer.companyName}의 채용제안을 수락했습니다.`,
    life: 3000
  });

  updateJobOffer(offer);
  showDetailModal.value = false;
};

// 제안 거절
const rejectOffer = (offer) => {
  offer.status = 'rejected';
  toast.add({
    severity: 'info',
    summary: '제안 거절',
    detail: `${offer.companyName}의 채용제안을 거절했습니다.`,
    life: 3000
  });

  updateJobOffer(offer);
  showDetailModal.value = false;
};

const updateJobOffer = (offer) => {
  // TODO: 제안 상태변경 api 호출
  // const body = {
  //   id: userInfo.id,
  //   jobOffer: offer
  // }
};

// 제안 상태에 따른 스타일 클래스
const getStatusClass = (status) => {
  switch (status) {
    case 'accepted':
      return 'bg-green-100 text-green-700';
    case 'rejected':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-yellow-100 text-yellow-700';
  }
};

// 제안 상태 텍스트
const getStatusText = (status) => {
  switch (status) {
    case 'accepted':
      return '수락됨';
    case 'rejected':
      return '거절됨';
    default:
      return '대기중';
  }
};

// 남은 기한 계산
const getDaysUntilDeadline = (deadline) => {
  const today = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};
</script>

<template>
  <div class="max-w-[1200px] mx-auto px-4 py-12">
    <!-- 헤더 -->
    <div class="flex items-center gap-4 mb-8">
      <i
        class="pi pi-angle-left text-4xl text-gray-600 cursor-pointer transition-colors hover:text-[#8FA1FF]"
        @click="router.back()"
      ></i>
      <h1 class="text-3xl font-bold">채용제안</h1>
    </div>

    <!-- 제안 목록 -->
    <div class="space-y-4">
      <div
        v-for="offer in jobOfferList"
        :key="offer.id"
        class="bg-white rounded-lg p-6 border border-gray-200 transition-all duration-200 hover:shadow-lg hover:border-[#8B8BF5] cursor-pointer group"
        @click="viewOfferDetail(offer)"
      >
        <div class="flex justify-between items-start">
          <div class="flex-grow">
            <div class="flex items-center gap-2 mb-2">
              <span class="font-bold">{{ offer.companyName }}</span>
              <span :class="getStatusClass(offer.status)" class="px-3 py-1 rounded-full text-sm">
                {{ getStatusText(offer.status) }}
              </span>
            </div>
            <h3 class="text-xl font-bold mb-4">{{ offer.position }}</h3>
            <div class="flex gap-8 text-gray-600">
              <span class="flex items-center gap-2">
                <i class="pi pi-map-marker"></i>
                {{ offer.location }}
              </span>
              <span class="flex items-center gap-2">
                <i class="pi pi-calendar"></i>
                회신기한: D-{{ getDaysUntilDeadline(offer.deadline) }}
              </span>
            </div>
          </div>

          <!-- 상세보기 버튼 추가 -->
          <div class="flex items-center ml-4">
            <div class="flex items-center gap-2 text-[#8B8BF5] opacity-0 group-hover:opacity-100 transition-opacity">
              <span class="text-sm">상세보기</span>
              <i class="pi pi-angle-right"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 상세 보기 모달 -->
    <Dialog
      v-model:visible="showDetailModal"
      :modal="true"
      :style="{ width: '50vw' }"
      :header="selectedOffer?.companyName"
    >
      <div v-if="selectedOffer" class="p-4 space-y-6">
        <div>
          <h3 class="text-2xl font-bold mb-2">{{ selectedOffer.position }}</h3>
          <div class="flex gap-4 text-gray-600">
            <span>{{ selectedOffer.location }}</span>
          </div>
        </div>

        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-medium mb-2">채용제안 메시지</h4>
          <p class="text-gray-700">{{ selectedOffer.message }}</p>
        </div>

        <div class="bg-blue-50 p-4 rounded-lg">
          <div class="flex items-center gap-2 text-blue-700">
            <i class="pi pi-info-circle"></i>
            <span>회신기한: {{ selectedOffer.deadline }} (D-{{ getDaysUntilDeadline(selectedOffer.deadline) }})</span>
          </div>
        </div>

        <div v-if="selectedOffer.status === 'pending'" class="flex justify-end gap-4">
          <Button label="거절하기" class="p-button-danger" @click="rejectOffer(selectedOffer)" />
          <Button label="수락하기" class="p-button-success" @click="acceptOffer(selectedOffer)" />
        </div>
      </div>
    </Dialog>

    <!-- 토스트 메시지 -->
    <Toast />
  </div>
</template>

<style scoped>
.group {
  position: relative;
  overflow: hidden;
}

.group::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 0.5rem;
  pointer-events: none;
  transition: all 0.2s ease;
}

.group:hover::after {
  box-shadow: inset 0 0 0 2px #8b8bf5;
}

/* 호버 시 살짝 들어올리는 효과 */
.group:hover {
  transform: translateY(-2px);
}

:deep(.p-dialog-header) {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

:deep(.p-dialog-content) {
  padding: 0;
}

:deep(.p-button.p-button-success) {
  background: #10b981;
  border-color: #10b981;
}

:deep(.p-button.p-button-success:hover) {
  background: #059669;
  border-color: #059669;
}

:deep(.p-button.p-button-danger) {
  background: #ef4444;
  border-color: #ef4444;
}

:deep(.p-button.p-button-danger:hover) {
  background: #dc2626;
  border-color: #dc2626;
}
</style>
