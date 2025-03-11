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
// const { proposalCount } = storeToRefs(userStore);

const bookmarkFlag = ref(true);
const proposalFlag = ref(false);

const unreadOffers = ref(3);

onMounted(() => {
  if (userInfo.value?.type === 'user') {
    bookmarkFlag.value = false;
    proposalFlag.value = true;
  }

  // getJobOfferList();
});

const getJobOfferList = async () => {
  // TODO: 페이지가 렌더링될때 API호출로 채용제안 갯수를 가져와야함
  // const body = {
  //   id: userInfo.id
  // }
  // unreadOffers.value = response.filter((item) => item.status === 'pending').length;
};

// const formatCurrency = (value) => {
//   return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
// };

// 회사 정보 데이터 수정
const companies = ref([
  {
    name: '밥스(주)',
    business: '산업용 CFRP 물러, 디스플레이용 로봇핸드, 자동차 부품',
    address: '대전 유성구 국제과학로46(신동)',
    positions: [
      { title: '항공기계설계', career: '경력 3년 이상', count: 2 },
      { title: '제품개발', career: '신입/경력', count: 1 }
    ]
  },
  {
    name: '한국항공우주산업(주)',
    business: '기체구조물, 성능개량, 원재기 제작',
    address: '서울사무소: 서울특별시 강남구 테헤란로 309 6층 (역삼동, 삼성제일빌딩)\n부사: 경남 사천시 사남면 유천리 802',
    positions: [
      { title: '항공기계설계', career: '경력 5년 이상', count: 3 },
      { title: '품질관리', career: '경력 무관', count: 2 }
    ]
  },
  {
    name: 'LIG넥스원',
    business: '항공전자, 유도 및 수중 무기, 사격통제, 전자광학',
    address: '경기도 용인시 기흥구 마북로 207',
    positions: [
      { title: '항공전자 개발', career: '경력 3년 이상', count: 2 },
      { title: '시스템 엔지니어', career: '신입/경력', count: 3 }
    ]
  },
  {
    name: '대한항공',
    business: '항공기 및 위성 부품 제작, 정비 및 개조',
    address: '서울시 중구 서소문동 41-3 대한항공 서소문빌딩 10층',
    positions: [
      { title: '항공정비사', career: '경력 5년 이상', count: 5 },
      { title: '항공기계설계', career: '경력 3년 이상', count: 2 },
      { title: '품질관리', career: '신입/경력', count: 3 }
    ]
  },
  {
    name: '한국로스트왁스',
    business: '항공기 엔진 부품',
    address: '경기도 안산시 단원구 성곡동 702-5(시화공단 4마 409)',
    positions: [
      { title: '생산기술', career: '신입/경력', count: 2 },
      { title: '품질관리', career: '경력 2년 이상', count: 1 }
    ]
  }
]);
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
        <div class="flex flex-col items-center cursor-pointer group" @click="router.push('/user/supportDetail')">
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
        <!-- v-if="proposalFlag" -->
        <div class="flex flex-col items-center cursor-pointer group" @click="router.push('/user/job-offers')">
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

      <!-- 필터 영역 주석 처리 -->
      <!--
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
      -->

      <!-- 필터 모달 주석 처리 -->
      <!--
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
      -->

      <!-- 메뉴 아이콘들 아래에 추가 -->
      <div class="space-y-4 mt-8">
        <!-- 회사 정보 카드 -->
        <div v-for="company in companies" :key="company.name"
          class="bg-white rounded-lg p-6 border border-gray-200 transition-all duration-200 hover:shadow-lg hover:border-[#8B8BF5]">
          <div class="flex justify-between items-start">
            <div class="flex-grow">
              <div class="flex items-center gap-2 mb-3">
                <h3 class="text-xl font-bold">{{ company.name }}</h3>
              </div>
              <div class="flex gap-8 text-gray-600 mb-3">
                <span class="flex items-center gap-2">
                  <i class="pi pi-briefcase"></i>
                  {{ company.business }}
                </span>
              </div>
              <!-- 채용 중인 포지션 추가 -->
              <div class="mb-3">
                <h4 class="font-medium text-gray-900 mb-2">
                  <span class="flex items-center gap-2">
                    <i class="pi pi-users text-[#8B8BF5]"></i>
                    채용 중인 포지션
                  </span>
                </h4>
                <div class="grid grid-cols-2 gap-3">
                  <div v-for="position in company.positions" :key="position.title"
                    class="bg-gray-50 p-3 rounded-lg">
                    <div class="font-medium text-gray-900">{{ position.title }}</div>
                    <div class="flex justify-between items-center mt-1">
                      <span class="text-sm text-gray-600">{{ position.career }}</span>
                      <span class="text-sm text-[#8B8BF5] font-medium">{{ position.count }}명</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex gap-8 text-gray-600">
                <span class="flex items-center gap-2 text-sm">
                  <i class="pi pi-map-marker"></i>
                  {{ company.address }}
                </span>
              </div>
            </div>
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

/* 주소 줄바꿈을 위한 스타일 추가 */
.text-sm {
  white-space: pre-line;
}
</style>
