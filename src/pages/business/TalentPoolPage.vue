<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import Select from 'primevue/select';
import Dialog from 'primevue/dialog';

const router = useRouter();
const goBack = () => {
  router.back();
};

// 북마크된 인재 데이터
const bookmarkedCandidates = ref([
  {
    id: 1,
    candidate: {
      id: 1,
      name: '홍길동',
      job: 'IT개발·데이터',
      career: '5년',
      education: '경상국립대학교(4년) 전자·전기공학과 졸업',
      age: '28',
      gender: '남성',
      nationality: '대한민국'
    },
    bookmarkedDate: '2024-03-20'
  },
  {
    id: 2,
    candidate: {
      id: 2,
      name: '김철수',
      job: '경영·사무',
      career: '신입',
      education: '부산외국어대학교(4년) 경영학과 졸업',
      age: '26',
      gender: '남성',
      nationality: '대한민국'
    },
    bookmarkedDate: '2024-03-19'
  },
  {
    id: 3,
    candidate: {
      id: 3,
      name: '이영희',
      job: '',
      career: '신입',
      education: '호원대학교(4년) 전자·전기공학과 졸업',
      age: '25',
      gender: '여성',
      nationality: '대한민국'
    },
    bookmarkedDate: '2024-03-18'
  }
]);

// 북마크 제거 함수
const removeBookmark = (candidate) => {
  bookmarkedCandidates.value = bookmarkedCandidates.value.filter(c => c.id !== candidate.id);
};

const showOffersModal = ref(false);
const selectedOfferStatus = ref('all');
const offerStatusOptions = [
  { label: '전체', value: 'all' },
  { label: '대기중', value: 'pending' },
  { label: '수락', value: 'accepted' },
  { label: '거절', value: 'rejected' }
];

// 제안 목록 데이터 수정
const offers = ref([
  {
    id: 1,
    candidate: {
      id: 1,
      name: '홍길동',
      job: 'IT개발·데이터',
      career: '5년',
      education: '경상국립대학교(4년) 전자·전기공학과 졸업',
      age: '28',
      gender: '남성',
      nationality: '대한민국'
    },
    status: '대기중',
    offerDate: '2024-03-20',
    message: '안녕하세요. 귀하의 프로필을 보고 연락드립니다...',
    responseDate: null,
    jobTitle: '시니어 프론트엔드 개발자'
  },
  {
    id: 2,
    candidate: {
      id: 2,
      name: '김철수',
      job: '경영·사무',
      career: '신입',
      education: '부산외국어대학교(4년) 경영학과 졸업',
      age: '26',
      gender: '남성',
      nationality: '대한민국'
    },
    status: '수락',
    offerDate: '2024-03-15',
    message: '당사의 백엔드 개발자 포지션에 관심이 있으실까요?',
    responseDate: '2024-03-16',
    jobTitle: '백엔드 개발자'
  }
]);

// 상태별 스타일 함수 수정
const getStatusStyle = (status) => {
  switch (status) {
    case '대기중':
      return 'bg-blue-100 text-blue-700';
    case '수락':
      return 'bg-green-100 text-green-700';
    case '거절':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

// 상태 텍스트
const getStatusText = (status) => {
  switch (status) {
    case 'pending':
      return '대기중';
    case 'accepted':
      return '수락';
    case 'rejected':
      return '거절';
    default:
      return '알 수 없음';
  }
};

// 필터링된 제안 목록
const filteredOffers = computed(() => {
  if (selectedOfferStatus.value === 'all') {
    return offers.value;
  }
  return offers.value.filter(offer => offer.status === selectedOfferStatus.value);
});
</script>

<template>
  <div class="max-w-[1200px] mx-auto px-4 py-12">
    <!-- 헤더 -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4 mb-8">
        <i class="pi pi-angle-left text-4xl text-gray-600 cursor-pointer transition-colors hover:text-[#8FA1FF]" 
          @click="goBack"></i>
        <h1 class="text-3xl font-bold">북마크</h1>
      </div>
      <Button 
        label="채용 제안 내역" 
        icon="pi pi-list" 
        class="p-button-outlined"
        @click="showOffersModal = true" />
    </div>

    <!-- 메인 컨텐츠 영역 -->
    <div class="bg-white rounded-lg p-6">
      <!-- 북마크된 구직자 목록 -->
      <div v-if="bookmarkedCandidates.length === 0" class="flex flex-col items-center justify-center py-16">
        <i class="pi pi-bookmark text-[#8FA1FF]" style="font-size: 4rem"></i>
        <h3 class="text-xl font-medium text-gray-900 mb-2 mt-4">북마크된 인재가 없습니다</h3>
        <p class="text-gray-600 mb-6">관심있는 인재를 북마크해보세요!</p>
        <Button label="인재 검색하기" icon="pi pi-search" class="p-button-outlined" @click="router.push('/business')" />
      </div>

      <div v-else class="space-y-4">
        <div v-for="candidate in bookmarkedCandidates" :key="candidate.id"
          class="bg-white rounded-lg p-6 border border-gray-200 transition-all duration-200 hover:shadow-lg hover:border-[#8B8BF5] group">
          <div class="flex justify-between items-start">
            <div class="flex-grow">
              <div class="flex items-center gap-2 mb-1">
                <span class="font-bold text-lg">{{ candidate.candidate.name }}</span>
              </div>
              <div class="flex items-center gap-2 mb-2">
                <span class="text-[#8B8BF5] font-medium text-lg">{{ candidate.candidate.job }}</span>
                <span class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  {{ candidate.candidate.career }}
                </span>
              </div>
              <div class="flex gap-8 text-gray-600">
                <span class="flex items-center gap-2">
                  <i class="pi pi-user"></i>
                  {{ candidate.candidate.age }}세 / {{ candidate.candidate.gender }}
                </span>
                <span class="flex items-center gap-2">
                  <i class="pi pi-globe"></i>
                  {{ candidate.candidate.nationality }}
                </span>
                <span class="flex items-center gap-2">
                  <i class="pi pi-calendar"></i>
                  북마크일: {{ candidate.bookmarkedDate }}
                </span>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <Button icon="pi pi-bookmark-fill" class="p-button-rounded p-button-text text-[#8B8BF5]"
                @click="removeBookmark(candidate)" />
              <Button label="제안하기" class="p-button-outlined" @click.stop="router.push(`/business/job-offer/create/${candidate.candidate.id}`)" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 모달 추가 -->
    <Dialog 
      v-model:visible="showOffersModal"
      modal
      :style="{ width: '90vw', maxWidth: '1000px' }"
      header="채용 제안 내역">
      <div class="flex justify-end mb-6">
        <Select v-model="selectedOfferStatus" 
          :options="offerStatusOptions" 
          optionLabel="label"
          placeholder="상태 필터"
          class="w-[150px]" />
      </div>

      <div class="space-y-4">
        <div v-for="offer in filteredOffers" :key="offer.id"
          class="bg-white rounded-lg p-6 border border-gray-200 transition-all duration-200 hover:shadow-lg">
          <div class="flex justify-between items-start">
            <div class="flex-grow">
              <div class="flex items-center gap-2 mb-1">
                <span class="font-bold text-lg">{{ offer.candidate.name }}</span>
              </div>
              <div v-if="offer.candidate.career === '신입' && !offer.candidate.job" class="mb-2">
                <span class="text-gray-600">
                  <i class="pi pi-book mr-1"></i>
                  {{ offer.candidate.education }}
                </span>
              </div>
              <div v-else class="flex items-center gap-2 mb-2">
                <span class="text-[#8B8BF5] font-medium text-lg">{{ offer.candidate.job }}</span>
                <span class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  {{ offer.candidate.career }}
                </span>
                <span v-if="offer.candidate.career === '신입'" class="text-gray-600">
                  <i class="pi pi-book mr-1"></i>
                  {{ offer.candidate.education }}
                </span>
              </div>
              <div class="flex gap-8 text-gray-600">
                <span class="flex items-center gap-2">
                  <i class="pi pi-user"></i>
                  {{ offer.candidate.age }}세 / {{ offer.candidate.gender }}
                </span>
                <span class="flex items-center gap-2">
                  <i class="pi pi-globe"></i>
                  {{ offer.candidate.nationality }}
                </span>
                <span class="flex items-center gap-2">
                  <i class="pi pi-calendar"></i>
                  제안일: {{ offer.offerDate }}
                </span>
                <span v-if="offer.responseDate" class="flex items-center gap-2">
                  <i class="pi pi-reply"></i>
                  응답일: {{ offer.responseDate }}
                </span>
              </div>
            </div>
            <span :class="[getStatusStyle(offer.status), 'px-3 py-1 rounded-full text-sm']">
              {{ offer.status }}
            </span>
          </div>
          
          <div class="border-t pt-4 mt-4">
            <h4 class="font-medium mb-2">제안한 포지션: {{ offer.jobTitle }}</h4>
            <p class="text-gray-600 line-clamp-2">{{ offer.message }}</p>
          </div>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<style scoped>
:deep(.p-select) {
  width: 100%;
}

:deep(.p-select-input) {
  border-color: #8b8bf5;
  border-radius: 8px;
  padding: 0.5rem;
}

:deep(.p-button.p-button-outlined) {
  color: #8FA1FF;
  border-color: #8FA1FF;
  border-radius: 8px;
}

:deep(.p-button.p-button-outlined:hover) {
  background: rgba(143, 161, 255, 0.1);
  border-color: #8FA1FF;
  color: #8FA1FF;
}

:deep(.p-button.p-button-text) {
  color: #8FA1FF;
}

:deep(.p-button.p-button-text:hover) {
  background: rgba(143, 161, 255, 0.1);
}
</style>
