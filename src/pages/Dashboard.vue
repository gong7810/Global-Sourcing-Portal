<script setup>
import { onMounted, ref } from 'vue';
import { useAuthStore } from '@/store/auth/authStore';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/user/userStore';

const router = useRouter();
const authStore = useAuthStore();
const userStore = useUserStore();
const { userInfo } = storeToRefs(authStore);
const { proposalCount } = storeToRefs(userStore);

const showFilterModal = ref(false);
const currentFilter = ref(null);
const tempSelectedOptions = ref([]);

const bookmarkFlag = ref(true);
const proposalFlag = ref(false);

const unreadOffers = ref(proposalCount.value);

const filters = [
  {
    type: 'region',
    title: '지역',
    options: [
      { label: '서울', value: 'seoul' },
      { label: '경기도', value: 'gyeonggi' },
      { label: '인천', value: 'incheon' },
      { label: '부산', value: 'busan' },
      { label: '대구', value: 'daegu' },
      { label: '광주', value: 'gwangju' },
      { label: '대전', value: 'daejeon' },
      { label: '울산', value: 'ulsan' },
      { label: '세종', value: 'sejong' }
    ]
  },
  {
    type: 'job',
    title: '직무',
    options: [
      { label: '개발자', value: 'developer' },
      { label: '디자이너', value: 'designer' },
      { label: '기획자', value: 'planner' },
      { label: '마케팅', value: 'marketing' },
      { label: '영업', value: 'sales' },
      { label: '경영지원', value: 'management' }
    ]
  },
  {
    type: 'career',
    title: '근무형태',
    options: [
      { label: '신입', value: 'entry' },
      { label: '경력', value: 'experienced' },
      { label: '인턴', value: 'intern' },
      { label: '계약직', value: 'contract' }
    ]
  }
  // {
  //   type: 'visa',
  //   title: '보유한 비자',
  //   options: [
  //     { label: '비자 없음', value: 'none' },
  //     { label: '취업 비자', value: 'work' },
  //     { label: '영주권', value: 'permanent' },
  //     { label: '학생 비자', value: 'student' }
  //   ]
  // }
];

const selectedFilters = ref({
  region: [],
  job: [],
  career: []
  // visa: []
});

const openFilterModal = (filterType) => {
  const filter = filters.find((f) => f.type === filterType);
  currentFilter.value = filter;
  tempSelectedOptions.value = [...selectedFilters.value[filterType]];
  showFilterModal.value = true;
};

const toggleOption = (option) => {
  const index = tempSelectedOptions.value.findIndex((o) => o.value === option.value);
  if (index === -1) {
    tempSelectedOptions.value.push(option);
  } else {
    tempSelectedOptions.value.splice(index, 1);
  }
};

const isOptionSelected = (option) => {
  return tempSelectedOptions.value.some((o) => o.value === option.value);
};

const applyFilter = () => {
  selectedFilters.value[currentFilter.value.type] = [...tempSelectedOptions.value];
  showFilterModal.value = false;
};

const cancelFilter = () => {
  showFilterModal.value = false;
};

const getFilterLabel = (filterType) => {
  const selected = selectedFilters.value[filterType];
  if (selected.length === 0) {
    return filters.find((f) => f.type === filterType).title;
  }
  return `${filters.find((f) => f.type === filterType).title} (${selected.length})`;
};

onMounted(() => {
  if (userInfo.value?.type === 'user') {
    bookmarkFlag.value = false;
    proposalFlag.value = true;
  }
});

// const formatCurrency = (value) => {
//   return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
// };
</script>

<template>
  <!-- 전체 컨테이너에 최대 폭 제한과 중앙 정렬 적용 -->
  <div class="max-w-[1200px] mx-auto px-4 py-12">
    <div class="grid gap-4">
      <!-- 상단 메뉴 아이콘들 -->
      <div class="flex justify-center gap-32 mb-12">
        <div class="flex flex-col items-center cursor-pointer group" @click="router.push('/user/resume')">
          <div
            class="w-[84px] h-[84px] flex items-center justify-center rounded-[16px] border-2 border-[#8B8BF5] bg-white mb-2 transition-all duration-200 group-hover:bg-[#8B8BF5] group-hover:shadow-lg"
          >
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
          <span class="text-[14px] font-bold text-gray-700 transition-all duration-200 group-hover:text-[#8B8BF5]"
            >이력서</span
          >
        </div>
        <div class="flex flex-col items-center cursor-pointer group" @click="router.push('/user/applications')">
          <div
            class="w-[84px] h-[84px] flex items-center justify-center rounded-[16px] border-2 border-[#8B8BF5] bg-white mb-2 transition-all duration-200 group-hover:bg-[#8B8BF5] group-hover:shadow-lg"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#8B8BF5"
              stroke-width="2.5"
              class="transition-all duration-200 group-hover:stroke-white"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <span class="text-[14px] font-bold text-gray-700 transition-all duration-200 group-hover:text-[#8B8BF5]"
            >지원내역</span
          >
        </div>
        <!-- <div v-if="bookmarkFlag" class="flex flex-col items-center cursor-pointer group">
          <div
            class="w-[84px] h-[84px] flex items-center justify-center rounded-[16px] border-2 border-[#8B8BF5] bg-white mb-2 transition-all duration-200 group-hover:bg-[#8B8BF5] group-hover:shadow-lg"
          >
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
          <span class="text-[14px] font-bold text-gray-700 transition-all duration-200 group-hover:text-[#8B8BF5]"
            >북마크</span
          >
        </div> -->
        <div
          v-if="proposalFlag"
          class="flex flex-col items-center cursor-pointer group"
          @click="router.push('/user/job-offers')"
        >
          <div
            class="relative w-[84px] h-[84px] flex items-center justify-center rounded-[16px] border-2 border-[#8B8BF5] bg-white mb-2 transition-all duration-200 group-hover:bg-[#8B8BF5] group-hover:shadow-lg"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#8B8BF5"
              stroke-width="2.5"
              class="transition-all duration-200 group-hover:stroke-white"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <!-- 읽지 않은 제안이 있을 경우 표시되는 배지 -->
            <div
              v-if="unreadOffers > 0"
              class="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-red-500 text-white text-xs rounded-full"
            >
              {{ unreadOffers }}
            </div>
          </div>
          <span class="text-[14px] font-bold text-gray-700 transition-all duration-200 group-hover:text-[#8B8BF5]">
            채용제안
          </span>
        </div>
        <div class="flex flex-col items-center cursor-pointer group" @click="router.push('/user/userPage')">
          <div
            class="w-[84px] h-[84px] flex items-center justify-center rounded-[16px] border-2 border-[#8B8BF5] bg-white mb-2 transition-all duration-200 group-hover:bg-[#8B8BF5] group-hover:shadow-lg"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#8B8BF5"
              stroke-width="2.5"
              class="transition-all duration-200 group-hover:stroke-white"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <span class="text-[14px] font-bold text-gray-700 transition-all duration-200 group-hover:text-[#8B8BF5]"
            >내 정보</span
          >
        </div>
      </div>

      <!-- 필터 영역 -->
      <div class="flex gap-4 mb-6">
        <button
          v-for="filter in filters"
          :key="filter.type"
          @click="openFilterModal(filter.type)"
          class="flex-1 px-4 py-3 border border-[#8B8BF5] rounded-lg text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
        >
          <span class="text-gray-600">{{ getFilterLabel(filter.type) }}</span>
          <i class="pi pi-chevron-down text-[#8B8BF5]"></i>
        </button>
      </div>

      <!-- 필터 모달 -->
      <Dialog
        v-model:visible="showFilterModal"
        :header="currentFilter?.title"
        :modal="true"
        :style="{ width: '50vw' }"
        :breakpoints="{ '960px': '75vw', '641px': '90vw' }"
      >
        <div class="p-4">
          <div class="grid grid-cols-3 gap-4">
            <div
              v-for="option in currentFilter?.options"
              :key="option.value"
              @click="toggleOption(option)"
              :class="[
                'p-4 border rounded-lg cursor-pointer transition-all',
                isOptionSelected(option)
                  ? 'border-[#8B8BF5] bg-[#8B8BF5] bg-opacity-10 text-[#8B8BF5]'
                  : 'border-gray-200 hover:border-[#8B8BF5]'
              ]"
            >
              {{ option.label }}
            </div>
          </div>
        </div>
        <template #footer>
          <div class="flex justify-end gap-4">
            <Button label="취소" @click="cancelFilter" class="p-button-text" />
            <Button label="적용하기" @click="applyFilter" class="p-button-primary bg-[#8B8BF5]" />
          </div>
        </template>
      </Dialog>

      <!-- 채용공고 카드들 -->
      <div class="space-y-4">
        <!-- 첫 번째 채용공고 -->
        <div
          class="bg-white rounded-lg p-6 border border-gray-200 transition-all duration-200 hover:shadow-lg hover:border-[#8B8BF5] cursor-pointer"
        >
          <div class="flex justify-between items-start">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <span class="font-bold">(주)코아시아</span>
                <span class="text-[#8B8BF5]">D-49</span>
                <span class="bg-[#8B8BF5] bg-opacity-10 text-[#8B8BF5] px-3 py-1 rounded-full text-sm">정규직</span>
              </div>
              <h3 class="text-xl font-bold mb-4">정보전략그룹(IT) 경력직 채용 공고</h3>
              <div class="flex gap-8 text-gray-600">
                <span class="flex items-center gap-2">
                  <i class="pi pi-briefcase"></i>
                  IT개발·데이터
                </span>
                <span class="flex items-center gap-2">
                  <i class="pi pi-map-marker"></i>
                  경기 화성시
                </span>
                <span class="flex items-center gap-2">
                  <i class="pi pi-users"></i>
                  채용인원: 0명
                </span>
              </div>
            </div>
            <Button class="bt_btn primary">지원하기</Button>
          </div>
        </div>

        <!-- 두 번째 채용공고 -->
        <div
          class="bg-white rounded-lg p-6 border border-gray-200 transition-all duration-200 hover:shadow-lg hover:border-[#8B8BF5] cursor-pointer"
        >
          <div class="flex justify-between items-start">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <span class="font-bold">(주)삼성전자</span>
                <span class="text-[#8B8BF5]">D-30</span>
                <span class="bg-[#8B8BF5] bg-opacity-10 text-[#8B8BF5] px-3 py-1 rounded-full text-sm">정규직</span>
                <span class="bg-[#8B8BF5] bg-opacity-10 text-[#8B8BF5] px-3 py-1 rounded-full text-sm">신입</span>
              </div>
              <h3 class="text-xl font-bold mb-4">소프트웨어 개발자 채용</h3>
              <div class="flex gap-8 text-gray-600">
                <span class="flex items-center gap-2">
                  <i class="pi pi-briefcase"></i>
                  웹 개발
                </span>
                <span class="flex items-center gap-2">
                  <i class="pi pi-map-marker"></i>
                  서울 서초구
                </span>
                <span class="flex items-center gap-2">
                  <i class="pi pi-users"></i>
                  채용인원: 5명
                </span>
              </div>
            </div>
            <Button class="bt_btn primary">지원하기</Button>
          </div>
        </div>

        <!-- 세 번째 채용공고 -->
        <div
          class="bg-white rounded-lg p-6 border border-gray-200 transition-all duration-200 hover:shadow-lg hover:border-[#8B8BF5] cursor-pointer"
        >
          <div class="flex justify-between items-start">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <span class="font-bold">(주)네이버</span>
                <span class="text-[#8B8BF5]">D-15</span>
                <span class="bg-[#8B8BF5] bg-opacity-10 text-[#8B8BF5] px-3 py-1 rounded-full text-sm">정규직</span>
                <span class="bg-[#8B8BF5] bg-opacity-10 text-[#8B8BF5] px-3 py-1 rounded-full text-sm">경력</span>
              </div>
              <h3 class="text-xl font-bold mb-4">프론트엔드 개발자 모집</h3>
              <div class="flex gap-8 text-gray-600">
                <span class="flex items-center gap-2">
                  <i class="pi pi-briefcase"></i>
                  프론트엔드
                </span>
                <span class="flex items-center gap-2">
                  <i class="pi pi-map-marker"></i>
                  경기 성남시
                </span>
                <span class="flex items-center gap-2">
                  <i class="pi pi-users"></i>
                  채용인원: 3명
                </span>
              </div>
            </div>
            <Button class="bt_btn primary">지원하기</Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.p-dialog-header) {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

:deep(.p-dialog-content) {
  padding: 0;
}

:deep(.p-dialog-footer) {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
}

:deep(.p-button.p-button-primary) {
  background: #8b8bf5;
  border-color: #8b8bf5;
}

:deep(.p-button.p-button-primary:hover) {
  background: #7878f2;
  border-color: #7878f2;
}

:deep(.p-button.p-button-text) {
  color: #64748b;
}

:deep(.p-button.p-button-text:hover) {
  background: rgba(100, 116, 139, 0.04);
}

:deep(.p-Button-outlined) {
  padding: 0.75rem 1.5rem;
}

.group:hover {
  transform: translateY(-2px);
}
</style>
