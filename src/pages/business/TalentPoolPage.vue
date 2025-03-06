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

// 필터 옵션
const selectedCareer = ref(null);
const selectedGender = ref(null);

const careers = [
  { label: '신입', value: 'entry' },
  { label: '1~3년', value: 'junior' },
  { label: '4~7년', value: 'middle' },
  { label: '8년 이상', value: 'senior' },
];

const genders = [
  { label: '남성', value: 'male' },
  { label: '여성', value: 'female' }
];

// 북마크된 구직자 데이터 수정
const bookmarkedCandidates = ref([
  {
    id: 1,
    name: '홍길동',
    career: '5년',
    age: '28',
    gender: '남성',
    nationality: '대한민국',
    bookmarkDate: '2024-03-21'
  },
  {
    id: 2,
    name: '김철수',
    career: '신입',
    age: '25',
    gender: '남성',
    nationality: '대한민국',
    bookmarkDate: '2024-03-20'
  }
]);

// 필터링된 구직자 목록 수정
const filteredCandidates = computed(() => {
  return bookmarkedCandidates.value.filter(candidate => {
    if (selectedGender.value && candidate.gender !== selectedGender.value.label) return false;
    if (selectedCareer.value) {
      const careerYears = parseInt(candidate.career);
      switch (selectedCareer.value.value) {
        case 'entry': return careerYears === 0;
        case 'junior': return careerYears >= 1 && careerYears <= 3;
        case 'middle': return careerYears >= 4 && careerYears <= 7;
        case 'senior': return careerYears >= 8;
      }
    }
    return true;
  });
});

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

// 제안 목록 데이터
const offers = ref([
  {
    id: 1,
    candidate: {
      name: '홍길동',
      career: '5년',
      age: '28',
      gender: '남성',
      nationality: '대한민국'
    },
    jobPosting: {
      title: '시니어 프론트엔드 개발자'
    },
    status: 'pending',
    sentDate: '2024-03-20',
    message: '안녕하세요. 귀하의 프로필을 보고 연락드립니다...',
    responseDate: null
  },
  {
    id: 2,
    candidate: {
      name: '김철수',
      career: '3년',
      age: '26',
      gender: '남성',
      nationality: '대한민국'
    },
    jobPosting: {
      title: '백엔드 개발자'
    },
    status: 'accepted',
    sentDate: '2024-03-15',
    message: '당사의 백엔드 개발자 포지션에 관심이 있으실까요?',
    responseDate: '2024-03-16'
  }
]);

// 상태별 스타일
const getStatusStyle = (status) => {
  switch (status) {
    case 'pending':
      return 'bg-blue-100 text-blue-700';
    case 'accepted':
      return 'bg-green-100 text-green-700';
    case 'rejected':
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
      <!-- 필터 영역 -->
      <div class="flex flex-wrap gap-4 mb-6">
        <div class="flex-1 min-w-[200px]">
          <Select v-model="selectedCareer" :options="careers" optionLabel="label" 
            placeholder="경력" class="w-full" />
        </div>
        <div class="flex-1 min-w-[200px]">
          <Select v-model="selectedGender" :options="genders" optionLabel="label" 
            placeholder="성별" class="w-full" />
        </div>
      </div>

      <!-- 북마크된 구직자 목록 -->
      <div v-if="filteredCandidates.length === 0" class="flex flex-col items-center justify-center py-16">
        <i class="pi pi-bookmark text-[#8FA1FF]" style="font-size: 4rem"></i>
        <h3 class="text-xl font-medium text-gray-900 mb-2 mt-4">북마크된 인재가 없습니다</h3>
        <p class="text-gray-600 mb-6">관심있는 인재를 북마크해보세요!</p>
        <Button label="인재 검색하기" icon="pi pi-search" class="p-button-outlined" @click="router.push('/business')" />
      </div>

      <div v-else class="space-y-4">
        <div v-for="candidate in filteredCandidates" :key="candidate.id"
          class="bg-white rounded-lg p-6 border border-gray-200 transition-all duration-200 hover:shadow-lg hover:border-[#8B8BF5] group">
          <div class="flex justify-between items-start">
            <div class="flex-grow">
              <div class="flex items-center gap-2 mb-2">
                <span class="font-bold">{{ candidate.name }}</span>
                <span class="bg-[#8B8BF5] bg-opacity-10 text-[#8B8BF5] px-3 py-1 rounded-full text-sm">
                  {{ candidate.career }}
                </span>
              </div>
              <div class="flex gap-8 text-gray-600">
                <span class="flex items-center gap-2">
                  <i class="pi pi-user"></i>
                  {{ candidate.age }}세 / {{ candidate.gender }}
                </span>
                <span class="flex items-center gap-2">
                  <i class="pi pi-globe"></i>
                  {{ candidate.nationality }}
                </span>
                <span class="flex items-center gap-2">
                  <i class="pi pi-calendar"></i>
                  북마크일: {{ candidate.bookmarkDate }}
                </span>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <Button icon="pi pi-bookmark-fill" class="p-button-rounded p-button-text text-[#8B8BF5]"
                @click="removeBookmark(candidate)" />
              <Button label="제안하기" class="p-button-outlined" @click.stop="router.push(`/business/job-offer/create/${candidate.id}`)" />
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
          optionValue="value"
          placeholder="상태 필터"
          class="w-[150px]" />
      </div>

      <div class="space-y-4">
        <div v-for="offer in filteredOffers" :key="offer.id"
          class="bg-white rounded-lg p-6 border border-gray-200 transition-all duration-200 hover:shadow-lg">
          <div class="flex justify-between items-start">
            <div class="flex-grow">
              <div class="flex items-center gap-2 mb-2">
                <span class="font-bold">{{ offer.candidate.name }}</span>
                <span class="bg-[#8B8BF5] bg-opacity-10 text-[#8B8BF5] px-3 py-1 rounded-full text-sm">
                  {{ offer.candidate.career }}
                </span>
                <span :class="[getStatusStyle(offer.status), 'px-3 py-1 rounded-full text-sm']">
                  {{ getStatusText(offer.status) }}
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
                  제안일: {{ offer.sentDate }}
                </span>
                <span v-if="offer.responseDate" class="flex items-center gap-2">
                  <i class="pi pi-reply"></i>
                  응답일: {{ offer.responseDate }}
                </span>
              </div>
            </div>
          </div>
          
          <div class="border-t pt-4 mt-4">
            <h4 class="font-medium mb-2">제안한 포지션: {{ offer.jobPosting.title }}</h4>
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
