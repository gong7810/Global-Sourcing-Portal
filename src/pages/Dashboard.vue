<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { isNil, isNull } from 'es-toolkit/compat';
import { storeToRefs } from 'pinia';

import { useAuthStore } from '@/store/auth/authStore';
import { useUserStore } from '@/store/user/userStore';
import { getOfferListByUser } from '@/apis/user/userApis';

const router = useRouter();
const authStore = useAuthStore();
const userStore = useUserStore();
const { userInfo } = storeToRefs(authStore);
// const { proposalCount } = storeToRefs(userStore);

const bookmarkFlag = ref(true);
const proposalFlag = ref(false);
const interviewFlag = ref(false);

const unreadOffers = ref(0);

// JobOffersPage.vue의 데이터를 기반으로 한 면접 제안 데이터
const offerCompanies = ref([]);

const completedCompanies = ref([
  {
    companyName: '한국로스트왁스',
    position: '생산기술',
    status: 'rejected',
    date: '2024-03-10'
  },
  {
    companyName: '한화에어로스페이스',
    position: '항공기계설계',
    status: 'interview_completed',
    date: '2024-03-05',
    interviewDate: '2024-03-19',
    interviewTime: '10:00',
    completedAt: '2024-03-19T11:30:00'
  }
]);

onMounted(() => {
  if (!isNil(userInfo.value?.isCompany) && !userInfo.value?.isCompany) {
    bookmarkFlag.value = false;
    proposalFlag.value = true;
    interviewFlag.value = true;
  }

  if (userInfo.value) {
    getJobOfferList();
  }
});

// 면접 제안 목록 조회
const getJobOfferList = async () => {
  const response = await getOfferListByUser();

  // 답변 대기중인 면접 제안
  unreadOffers.value = response.contents.filter((com) => {
    return com.statusCd === 'JO_ST_1';
  }).length;

  //진행중인 면접 : 면접 대기중, 수락 / 면접 결과 미입력
  offerCompanies.value = response.contents.filter((com) => {
    return com.statusCd !== 'JO_ST_3' && isNull(com?.resultCd);
  });

  //완료된 면접 : 면접 거절 / 면접 결과 합격 불합격
  completedCompanies.value = response.contents.filter((com) => {
    return com?.statusCd === 'JO_ST_3' || ['INTERVIEW_RESULT_1', 'INTERVIEW_RESULT_2'].includes(com?.resultCd);
  });
};

// 상태에 따른 텍스트 색상 반환
const getStatusColor = (statusCd) => {
  switch (statusCd) {
    case 'JO_ST_1':
      return 'text-yellow-600';
    case 'JO_ST_2':
      return 'text-green-600';
    case 'JO_ST_3':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};
</script>

<template>
  <div class="max-w-[1200px] mx-auto px-4 py-12">
    <!-- 비로그인 상태일 때 -->
    <template v-if="!authStore.isLogin()">
      <!-- 메인 히어로 섹션 -->
      <div class="text-center mb-16">
        <h1 class="text-4xl font-bold mb-4">Global Sourcing Portal</h1>
        <p class="text-xl text-gray-600 mb-8">기업의 직접 면접 제안을 받아보세요</p>
        <div class="flex justify-center gap-4">
          <button
            class="px-8 py-3 bg-[#8B8BF5] text-white rounded-lg hover:bg-[#7878F2] transition-colors"
            @click="router.push('/login')"
          >
            로그인하기
          </button>
          <button
            class="px-8 py-3 border-2 border-[#8B8BF5] text-[#8B8BF5] rounded-lg hover:bg-[#8B8BF5] hover:text-white transition-colors"
            @click="router.push('/register-select')"
          >
            회원가입
          </button>
        </div>
      </div>

      <!-- 서비스 특징 섹션 -->
      <div class="grid grid-cols-3 gap-8 mb-16">
        <div class="text-center p-8 bg-white rounded-xl shadow-sm">
          <div class="w-16 h-16 bg-[#8B8BF5] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-[#8B8BF5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold mb-2">직접 면접 제안</h3>
          <p class="text-gray-600">기업에서 직접 검토 후<br />면접을 제안합니다</p>
        </div>

        <div class="text-center p-8 bg-white rounded-xl shadow-sm">
          <div class="w-16 h-16 bg-[#8B8BF5] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-[#8B8BF5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <h3 class="text-xl font-bold mb-2">간편한 일정 조율</h3>
          <p class="text-gray-600">면접 일정을<br />선택할 수 있습니다</p>
        </div>

        <div class="text-center p-8 bg-white rounded-xl shadow-sm">
          <div class="w-16 h-16 bg-[#8B8BF5] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-[#8B8BF5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <path d="M14 2v6h6"></path>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <line x1="10" y1="9" x2="8" y2="9"></line>
            </svg>
          </div>
          <h3 class="text-xl font-bold mb-2">이력서 관리</h3>
          <p class="text-gray-600">이력서를 작성해보세요</p>
        </div>
      </div>

      <!-- 회원가입 유도 섹션 -->
      <div class="bg-[#8B8BF5] bg-opacity-5 rounded-2xl p-12 text-center">
        <h2 class="text-2xl font-bold mb-4">지금 바로 시작해보세요!</h2>
        <p class="text-gray-600 mb-8">
          이력서를 등록하고 기업의 면접 제안을 받아보세요.<br />
          다양한 기업들이 여러분을 기다리고 있습니다.
        </p>
        <!-- <button 
          class="px-8 py-3 bg-[#8B8BF5] text-white rounded-lg hover:bg-[#7878F2] transition-colors"
          @click="router.push('/signup')"
        >
          무료로 시작하기
        </button> -->
      </div>
    </template>

    <!-- 로그인 상태일 때 -->
    <template v-else>
      <!-- 상단 메뉴 아이콘들 -->
      <div class="grid gap-4">
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
          <div
            v-if="proposalFlag"
            class="flex flex-col items-center cursor-pointer group"
            @click="router.push('/user/jobOffers')"
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
                v-if="unreadOffers"
                class="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-red-500 text-white text-xs rounded-full"
              >
                {{ unreadOffers }}
              </div>
            </div>
            <span class="text-[14px] font-bold text-gray-700 transition-all duration-200 group-hover:text-[#8B8BF5]">
              면접제안
            </span>
          </div>
          <div
            v-if="interviewFlag"
            class="flex flex-col items-center cursor-pointer group"
            @click="router.push('/user/jobSeekerInterviews')"
          >
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
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <span class="text-[14px] font-bold text-gray-700 transition-all duration-200 group-hover:text-[#8B8BF5]">
              면접 현황
            </span>
          </div>
          <!-- <div class="flex flex-col items-center cursor-pointer group" @click="router.push('/user/companyList')">
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
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </div>
            <span class="text-[14px] font-bold text-gray-700 transition-all duration-200 group-hover:text-[#8B8BF5]">
              기업 목록
            </span>
          </div> -->
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
          <!-- 면접 제안 목록 -->
          <div class="space-y-8">
            <!-- 진행중인 면접 제안 -->
            <div class="bg-white rounded-lg p-6 border border-gray-200">
              <h2 class="text-xl font-bold mb-4">진행중인 면접 제안</h2>
              <div v-if="offerCompanies.length" class="space-y-4">
                <div
                  v-for="company in offerCompanies"
                  :key="company?.id"
                  class="p-4 border border-gray-100 rounded-lg hover:shadow-md transition-all"
                >
                  <div class="flex justify-between items-start">
                    <div>
                      <h3 class="font-bold text-lg">{{ company?.company?.name }}</h3>
                      <p class="text-gray-600">{{ company?.position }}</p>
                      <p class="text-sm text-gray-500">{{ company?.createdAt?.slice(0, 10)?.replaceAll('-', '.') }}</p>
                    </div>
                    <span :class="[getStatusColor(company?.statusCd), 'font-medium']">
                      {{ company?.status?.name }}
                    </span>
                  </div>
                </div>
              </div>
              <div v-else class="p-8 text-center border border-gray-100 rounded-lg bg-gray-50">
                <svg
                  class="w-12 h-12 text-gray-400 mx-auto mb-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <p class="text-gray-500 font-medium">진행중인 면접 제안이 없습니다</p>
                <p class="text-gray-400 text-sm mt-1">기업에서 면접 제안을 보내면 여기에 표시됩니다</p>
              </div>
            </div>

            <!-- 구분선 -->
            <div class="border-t border-gray-200 my-8"></div>

            <!-- 완료된 면접 제안 -->
            <div class="bg-white rounded-lg p-6 border border-gray-200">
              <h2 class="text-xl font-bold mb-4">완료된 면접 제안</h2>
              <div v-if="completedCompanies.length" class="space-y-4">
                <div
                  v-for="company in completedCompanies"
                  :key="company.id"
                  class="p-4 border border-gray-100 rounded-lg hover:shadow-md transition-all"
                >
                  <div class="flex justify-between items-start">
                    <div>
                      <h3 class="font-bold text-lg">{{ company?.company?.name }}</h3>
                      <p class="text-gray-600">{{ company?.position }}</p>
                      <p class="text-sm text-gray-500">{{ company?.createdAt?.slice(0, 10)?.replaceAll('-', '.') }}</p>
                    </div>
                    <span :class="[getStatusColor(company?.statusCd), 'font-medium']">
                      {{ company?.status?.name }}
                    </span>
                  </div>
                </div>
              </div>
              <div v-else class="p-8 text-center border border-gray-100 rounded-lg bg-gray-50">
                <svg
                  class="w-12 h-12 text-gray-400 mx-auto mb-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p class="text-gray-500 font-medium">완료된 면접 제안이 없습니다</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
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
