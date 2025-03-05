<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import Select from 'primevue/select';

const router = useRouter();
const goBack = () => {
  router.back();
};

// 필터 옵션
const selectedJob = ref(null);
const selectedCareer = ref(null);

const jobs = [
  { label: '기획·전략', value: 'planning' },
  { label: '마케팅·홍보·조사', value: 'marketing' },
  { label: '회계·세무·재무', value: 'accounting' },
  { label: '인사·노무·HRD', value: 'hr' },
  { label: '총무·법무·사무', value: 'admin' },
  { label: 'IT개발·데이터', value: 'it' },
  { label: '디자인', value: 'design' },
  { label: '영업·판매·무역', value: 'sales' },
  { label: '고객상담·TM', value: 'cs' },
  { label: '구매·자재·물류', value: 'purchasing' },
  { label: '상품기획·MD', value: 'md' },
  { label: '운전·운송·배송', value: 'delivery' },
  { label: '서비스', value: 'service' },
  { label: '생산', value: 'production' },
  { label: '건설·건축', value: 'construction' },
  { label: '의료', value: 'medical' },
  { label: '연구·R&D', value: 'research' },
  { label: '교육', value: 'education' },
  { label: '미디어·문화·스포츠', value: 'media' },
  { label: '금융·보험', value: 'finance' },
  { label: '공공·복지', value: 'public' }
];

const careers = [
  { label: '신입', value: 'entry' },
  { label: '1~3년', value: 'junior' },
  { label: '4~7년', value: 'middle' },
  { label: '8년 이상', value: 'senior' },
];

// 북마크된 구직자 데이터 수정
const bookmarkedCandidates = ref([
  {
    id: 1,
    name: '홍길동',
    career: '5년',
    job: '기획·전략',
    nationality: '대한민국',
    bookmarkDate: '2024-03-21'
  },
  {
    id: 2,
    name: '김철수',
    career: '3년',
    job: 'IT개발·데이터',
    nationality: '대한민국',
    bookmarkDate: '2024-03-20'
  }
]);

// 필터링된 구직자 목록 수정 (lastPosition을 job으로 변경)
const filteredCandidates = computed(() => {
  return bookmarkedCandidates.value.filter(candidate => {
    if (selectedJob.value && candidate.job !== selectedJob.value.label) return false;
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
          <Select v-model="selectedJob" :options="jobs" optionLabel="label" 
            placeholder="직무" class="w-full" />
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
              <h3 class="text-xl font-bold mb-4">{{ candidate.job }}</h3>
              <div class="flex gap-8 text-gray-600">
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
