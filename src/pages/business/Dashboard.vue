<script setup>
import { onMounted, ref } from 'vue';
import { useAuthStore } from '@/store/auth/authStore';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

const router = useRouter();

const careers = [
  { label: '신입', value: 'entry' },
  { label: '1~3년', value: 'junior' },
  { label: '4~7년', value: 'middle' },
  { label: '8년 이상', value: 'senior' },
];

const nationalities = [
  { label: '베트남', value: 'VN' },
  { label: '중국', value: 'CN' },
  { label: '일본', value: 'JP' },
  { label: '기타', value: 'OTHER' }
];

const authStore = useAuthStore();
const { userInfo } = storeToRefs(authStore);

// bookmarkStore 관련 코드 제거
const bookmarkFlag = ref(true);

onMounted(() => {
  if (userInfo.value?.type === 'user') {
    bookmarkFlag.value = false;
  }
});

const formatCurrency = (value) => {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

// 북마크 토글 함수 추가
const toggleBookmark = (talent) => {
  const index = bookmarkedTalents.value.findIndex(t => t.id === talent.id);
  if (index !== -1) {
    bookmarkedTalents.value.splice(index, 1); // 북마크 제거
  }
};

// bookmarkedTalents ref 수정 (isBookmarked 속성 추가)
const bookmarkedTalents = ref([
  {
    id: 1,
    name: '홍길동',
    nationality: '베트남',
    career: '5년',
    education: '하노이공과대학교',
    major: '컴퓨터공학',
    bookmarkedDate: '2024-03-15',
    isBookmarked: true
  },
  {
    id: 2,
    name: '김철수',
    nationality: '중국',
    career: '3년',
    education: '베이징대학교',
    major: '소프트웨어공학',
    bookmarkedDate: '2024-03-14',
    isBookmarked: true
  }
]);
</script>

<template>
  <!-- 전체 컨테이너에 최대 폭 제한과 중앙 정렬 적용 -->
  <div class="max-w-[1200px] mx-auto px-4 py-12">
    <div class="grid gap-4">
      <!-- 상단 메뉴 아이콘들 -->
      <div class="flex justify-center gap-32 mb-12">
        <!-- 인재 검색 -->
        <div class="flex flex-col items-center cursor-pointer group" @click="router.push('/business/TalentSearchPage')">
          <div class="w-[84px] h-[84px] flex items-center justify-center rounded-[16px] border-2 border-[#8B8BF5] bg-white mb-2 transition-all duration-200 group-hover:bg-[#8B8BF5] group-hover:shadow-lg">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#8B8BF5"
              stroke-width="2.5"
              class="transition-all duration-200 group-hover:stroke-white"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <span class="text-[14px] font-bold text-gray-700 transition-all duration-200 group-hover:text-[#8B8BF5]">인재 검색</span>
        </div>

        <!-- 면접 제안 내역 -->
        <div class="flex flex-col items-center cursor-pointer group" @click="router.push('/business/InterviewOffers')">
          <div class="w-[84px] h-[84px] flex items-center justify-center rounded-[16px] border-2 border-[#8B8BF5] bg-white mb-2 transition-all duration-200 group-hover:bg-[#8B8BF5] group-hover:shadow-lg">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#8B8BF5"
              stroke-width="2.5"
              class="transition-all duration-200 group-hover:stroke-white"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <span class="text-[14px] font-bold text-gray-700 transition-all duration-200 group-hover:text-[#8B8BF5]">면접 제안 내역</span>
        </div>

        <!-- 기업 정보 -->
        <div class="flex flex-col items-center cursor-pointer group" @click="router.push('/business/CompanyInfoPage')">
          <div class="w-[84px] h-[84px] flex items-center justify-center rounded-[16px] border-2 border-[#8B8BF5] bg-white mb-2 transition-all duration-200 group-hover:bg-[#8B8BF5] group-hover:shadow-lg">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#8B8BF5"
              stroke-width="2.5"
              class="transition-all duration-200 group-hover:stroke-white"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
          <span class="text-[14px] font-bold text-gray-700 transition-all duration-200 group-hover:text-[#8B8BF5]">기업 정보</span>
        </div>
      </div>

      <!-- 북마크된 인재 목록 섹션 -->
      <div class="bg-white rounded-lg p-6 shadow-sm mb-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold">북마크된 인재</h2>
          <router-link 
            to="/business/TalentSearchPage"
            class="text-[#8B8BF5] hover:text-[#7A7AE6] text-sm flex items-center gap-1"
          >
            <span>인재 더보기</span>
            <i class="pi pi-arrow-right"></i>
          </router-link>
        </div>
        
        <!-- 북마크된 인재가 없을 때 표시할 빈 상태 -->
        <div v-if="bookmarkedTalents.length === 0" class="text-center py-12">
          <div class="flex flex-col items-center gap-4">
            <i class="pi pi-bookmark text-gray-300 text-5xl mb-2"></i>
            <p class="text-gray-500 mb-2">북마크된 인재가 없습니다</p>
            <p class="text-gray-400 text-sm mb-4">관심있는 인재를 북마크하고 관리해보세요</p>
            <router-link 
              to="/business/TalentSearchPage"
              class="inline-flex items-center px-4 py-2 bg-[#8B8BF5] text-white rounded-lg hover:bg-[#7A7AE6] transition-colors"
            >
              <i class="pi pi-search mr-2"></i>
              인재 검색하기
            </router-link>
          </div>
        </div>
        
        <!-- 북마크된 인재가 있을 때 표시할 목록 -->
        <div v-else class="grid grid-cols-1 gap-4">
          <div v-for="talent in bookmarkedTalents" :key="talent.id" 
            class="border rounded-lg p-6 hover:border-[#8B8BF5] transition-all duration-200">
            <div class="flex justify-between items-start">
              <div>
                <div class="flex items-center gap-3 mb-3">
                  <h3 class="text-lg font-bold">{{ talent.name }}</h3>
                  <span class="text-sm text-gray-600">{{ talent.nationality }}</span>
                  <span class="bg-[#8B8BF5] bg-opacity-10 text-[#8B8BF5] px-3 py-1 rounded-full text-sm">
                    경력 {{ talent.career }}
                  </span>
                </div>
                <p class="text-gray-600">{{ talent.education }} · {{ talent.major }}</p>
              </div>
              <div class="flex flex-col items-end gap-3">
                <button @click="toggleBookmark(talent)" class="text-[#8B8BF5]">
                  <i class="pi pi-bookmark-fill"></i>
                </button>
                <span class="text-sm text-gray-500">북마크: {{ talent.bookmarkedDate }}</span>
                <button 
                  @click="router.push(`/business/interview-offer/create/${talent.id}`)"
                  class="px-4 py-2 bg-[#8B8BF5] text-white rounded-lg hover:bg-[#7A7AE6] transition-colors"
                >
                  면접 제안하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

:deep(.p-select) {
  width: 100%;
}

:deep(.p-select-input) {
  border-color: #8b8bf5;
  border-radius: 8px;
  padding: 0.5rem;
}

/* Remove Dropdown specific styles */
:deep(.p-dropdown),
:deep(.p-dropdown-panel),
:deep(.p-dropdown-items),
:deep(.p-dropdown-item) {
  display: none;
}

.group:hover {
  transform: translateY(-2px);
}
</style>

