<script setup>
import { onMounted, ref } from 'vue';
import { useAuthStore } from '@/store/auth/authStore';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import Select from 'primevue/select';

const router = useRouter();

const selectedCareer = ref(null);
const selectedNationality = ref(null);

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

const bookmarkFlag = ref(true);

// 북마크 토글 함수 추가
const toggleBookmark = (candidate) => {
  candidate.isBookmarked = !candidate.isBookmarked;
};

onMounted(() => {
  if (userInfo.value?.type === 'user') {
    bookmarkFlag.value = false;
  }
});

const formatCurrency = (value) => {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

// 채용공고 목록 데이터 주석 처리
/*
const jobPosts = ref([
  {
    id: 1,
    company: '(주)코아시아',
    title: '정보전략그룹(IT) 경력직 채용 공고',
    department: 'IT개발·데이터',
    location: '경기 화성시',
    headcount: 0,
    dday: 49,
    type: '정규직'
  },
  {
    id: 2,
    company: '(주)삼성전자',
    title: '소프트웨어 개발자 채용',
    department: '웹 개발',
    location: '서울 서초구',
    headcount: 5,
    dday: 30,
    type: '정규직'
  },
  {
    id: 3,
    company: '(주)네이버',
    title: '프론트엔드 개발자 모집',
    department: '프론트엔드',
    location: '경기 성남시',
    headcount: 3,
    dday: 15,
    type: '정규직'
  }
]);
*/
</script>

<template>
  <!-- 전체 컨테이너에 최대 폭 제한과 중앙 정렬 적용 -->
  <div class="max-w-[1200px] mx-auto px-4 py-12">
    <div class="grid gap-4">
      <!-- 상단 메뉴 아이콘들 -->
      <div class="flex justify-center gap-32 mb-12">
        <!-- 공고 등록 메뉴 주석 처리 -->
        <!--
        <div class="flex flex-col items-center cursor-pointer group" @click="router.push('/business/postJobPage')">
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
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </div>
          <span class="text-[14px] font-bold text-gray-700 transition-all duration-200 group-hover:text-[#8B8BF5]">공고 등록</span>
        </div>
        -->

        <!-- 공고 관리 메뉴 주석 처리 -->
        <!--
        <div class="flex flex-col items-center cursor-pointer group" @click="router.push('/business/JobPostsPage')">
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
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <path d="M14 2v6h6"></path>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <line x1="10" y1="9" x2="8" y2="9"></line>
            </svg>
          </div>
          <span class="text-[14px] font-bold text-gray-700 transition-all duration-200 group-hover:text-[#8B8BF5]">공고 관리</span>
        </div>
        -->
        
        <div class="flex flex-col items-center cursor-pointer group" @click="router.push('/business/CandidatesPage')">
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
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <span class="text-[14px] font-bold text-gray-700 transition-all duration-200 group-hover:text-[#8B8BF5]">지원자 관리</span>
        </div>

        <!-- 인재 검색 메뉴 추가 -->
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

        <div class="flex flex-col items-center cursor-pointer group" @click="router.push('/business/TalentPoolPage')">
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
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <span class="text-[14px] font-bold text-gray-700 transition-all duration-200 group-hover:text-[#8B8BF5]">북마크</span>
        </div>

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

      <!-- 채용공고 카드 목록 주석 처리 -->
      <!--
      <div class="space-y-4">
        <div v-for="post in jobPosts" :key="post.id"
          class="bg-white rounded-lg p-6 border border-gray-200 transition-all duration-200 hover:shadow-lg hover:border-[#8B8BF5]">
          <div class="flex justify-between items-start">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <span class="font-bold">{{ post.company }}</span>
                <span class="text-[#8B8BF5]">D-{{ post.dday }}</span>
                <span class="bg-[#8B8BF5] bg-opacity-10 text-[#8B8BF5] px-3 py-1 rounded-full text-sm">{{ post.type }}</span>
              </div>
              <h3 class="text-xl font-bold mb-4">{{ post.title }}</h3>
              <div class="flex gap-8 text-gray-600">
                <span class="flex items-center gap-2">
                  <i class="pi pi-briefcase"></i>
                  {{ post.department }}
                </span>
                <span class="flex items-center gap-2">
                  <i class="pi pi-map-marker"></i>
                  {{ post.location }}
                </span>
                <span class="flex items-center gap-2">
                  <i class="pi pi-users"></i>
                  채용인원: {{ post.headcount }}명
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      -->
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

