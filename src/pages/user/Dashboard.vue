<script setup>
import { onMounted, ref } from 'vue';
import { useAuthStore } from '@/store/auth/authStore';
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import AppTopbar from '@/layout/AppTopbar.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const selectedRegion = ref(null);
const selectedJob = ref(null);
const selectedCareer = ref(null);
const selectedEducation = ref(null);

const goToResume = () => {
  router.push({ name: 'Resume' });
};

const regions = [
  { label: '서울', value: 'seoul' },
  { label: '부산', value: 'busan' },
  // 다른 지역들...
];

const jobs = [
  { label: '개발자', value: 'developer' },
  { label: '디자이너', value: 'designer' },
  // 다른 직무들...
];

const careers = [
  { label: '신입', value: 'entry' },
  { label: '경력', value: 'experienced' },
  // 다른 근무형태들...
];

const education = [
  { label: '비자 없음', value: 'none' },
  { label: '취업 비자', value: 'work' },
  // 다른 비자들...
];

const authStore = useAuthStore();
const { userInfo } = storeToRefs(authStore);

const bookmarkFlag = ref(true);

onMounted(() => {
  if (userInfo.value?.type === 'user') {
    bookmarkFlag.value = false;
  }
});

const formatCurrency = (value) => {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};
</script>

<template>
  <AppTopbar />
  <!-- 전체 컨테이너에 최대 폭 제한과 중앙 정렬 적용 -->
  <div class="max-w-[1200px] mx-auto px-4 py-12">
    <div class="grid gap-4">
      <!-- 상단 메뉴 아이콘들 -->
      <div class="flex justify-center gap-32 mb-12">
        <div class="flex flex-col items-center cursor-pointer group">
          <div
            @click="goToResume"
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
          <button @click="goToResume" class="text-[14px] font-bold text-gray-700 transition-all duration-200 group-hover:text-[#8B8BF5]">이력서</button>
        </div>
        <div class="flex flex-col items-center cursor-pointer group" @click="router.push({ name: 'Applications' })">
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
        <div v-if="bookmarkFlag" class="flex flex-col items-center cursor-pointer group">
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
        </div>
        <div class="flex flex-col items-center cursor-pointer group">
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
        <Dropdown v-model="selectedRegion" :options="regions" optionLabel="label" placeholder="지역" class="w-1/4" />
        <Dropdown v-model="selectedJob" :options="jobs" optionLabel="label" placeholder="직무" class="w-1/4" />
        <Dropdown v-model="selectedCareer" :options="careers" optionLabel="label" placeholder="근무형태" class="w-1/4" />
        <Dropdown v-model="selectedEducation" :options="education" optionLabel="label" placeholder="보유한 비자" class="w-1/4" />
      </div>

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

    <!-- 푸터 추가 -->
    <div class="mt-12 border-t border-gray-200 bg-gray-50">
      <div class="max-w-[1200px] mx-auto px-4 pt-6">
        <div class="mb-6">
          <h2 class="text-lg font-bold mb-2">BTPOTAL</h2>
          <div class="text-gray-600 text-sm space-y-1">
            <p>대표: 김종진</p>
            <p>사업자 등록번호: 695-87-03015</p>
            <p>주소: 경상남도 진주시 동부로 169번길 12, B동 505호 (충무공동, 윙스타워)</p>
            <p>고객센터: 070-8211-3394</p>
            <p>이메일: jjkim@pbnt.kr</p>
            <p>직업정보제공사업:</p>
            <p class="pb-3 border-b border-gray-200">통신판매업:</p>
          </div>
        </div>

        <div class="flex gap-6 text-sm">
          <a href="#" class="text-blue-900 font-medium">개인정보처리방침</a>
          <a href="#" class="text-gray-600">이용약관</a>
          <a href="#" class="text-gray-600">이용자 준수사항</a>
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

:deep(.p-dropdown) {
  border-color: #8b8bf5;
  border-radius: 8px;
  padding: 0.5rem;
}

:deep(.p-Button-outlined) {
  padding: 0.75rem 1.5rem;
}

.group:hover {
  transform: translateY(-2px);
}

.mt-12.border-t.border-gray-200.bg-gray-50 {
  background-color: #f1f5f9;
}
</style>
