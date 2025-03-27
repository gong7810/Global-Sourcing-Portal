<script setup>
import { onMounted, ref, computed } from 'vue';
import { useAuthStore } from '@/store/auth/authStore';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import Dialog from 'primevue/dialog';
import { isNil } from 'es-toolkit';

const router = useRouter();

const careers = [
  { label: '신입', value: 'entry' },
  { label: '1~3년', value: 'junior' },
  { label: '4~7년', value: 'middle' },
  { label: '8년 이상', value: 'senior' }
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
  if (!isNil(userInfo.value?.isCompany) && !userInfo.value?.isCompany) {
    bookmarkFlag.value = false;
  }
});

const formatCurrency = (value) => {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

// 북마크 토글 함수 수정
const toggleBookmark = (talent) => {
  if (!talent) return;

  // bookmarkedTalents에서 해당 인재 찾기
  const index = bookmarkedTalents.value.findIndex((t) => t.id === talent.id);
  if (index !== -1) {
    // 북마크 상태 토글
    const updatedTalent = { ...bookmarkedTalents.value[index] };
    updatedTalent.isBookmarked = !updatedTalent.isBookmarked;

    // 북마크가 해제되면 목록에서 제거
    if (!updatedTalent.isBookmarked) {
      bookmarkedTalents.value.splice(index, 1);
      // 모달이 열려있고 해당 인재의 모달이라면 모달 닫기
      if (selectedCandidate.value?.id === talent.id) {
        showResumeModal.value = false;
      }
    } else {
      // 북마크가 다시 설정되면 목록 업데이트
      bookmarkedTalents.value[index] = updatedTalent;
      // 모달이 열려있는 경우 selectedCandidate 업데이트
      if (selectedCandidate.value?.id === talent.id) {
        selectedCandidate.value = updatedTalent;
      }
    }
  }
};

// bookmarkedTalents ref 수정 (모달에 필요한 정보 추가)
const bookmarkedTalents = ref([
  {
    id: 1,
    name: '홍길동',
    nationality: '베트남',
    career: '5년',
    birthdate: '1996.09.01',
    gender: '남성',
    phone: '010-1234-5678',
    email: 'hong@example.com',
    address: '서울시 강남구 테헤란로 123',
    education: '하노이공과대학교',
    major: '컴퓨터공학',
    bookmarkedDate: '2024-03-15',
    isBookmarked: true,
    passportName: 'HONG GILDONG',
    passportNumber: 'M1234****',
    passportExpiry: '2028-09-01',
    jobCategory: { label: 'IT개발·데이터', value: 'it' },
    careers: [
      {
        company: '(주)테크솔루션',
        period: '2021.03 - 2024.03',
        jobCategory: { label: 'IT개발·데이터', value: 'it' },
        position: '프론트엔드 개발자 | 개발팀',
        description:
          '웹 서비스 프론트엔드 개발 및 유지보수\n- React, TypeScript 기반 웹 애플리케이션 개발\n- 성능 최적화 및 사용자 경험 개선'
      },
      {
        company: '(주)스타트업',
        period: '2019.03 - 2021.02',
        jobCategory: { label: 'IT개발·데이터', value: 'it' },
        position: '웹 개발자 | 서비스개발팀',
        description: '자사 웹 서비스 개발\n- Vue.js 기반 프론트엔드 개발\n- REST API 연동 및 기능 구현'
      }
    ],
    education: [
      {
        school: '하노이공과대학교',
        type: '대학교(4년)',
        major: '컴퓨터공학',
        period: '2015.03 - 2019.02',
        description: '학점 4.0/4.5\n웹 개발 동아리 회장\n알고리즘 경진대회 수상'
      }
    ]
  },
  {
    id: 2,
    name: '김철수',
    nationality: '중국',
    career: '3년',
    birthdate: '1997.05.15',
    gender: '남성',
    phone: '010-2345-6789',
    email: 'kim@example.com',
    address: '서울시 서초구 서초대로 456',
    education: '베이징대학교',
    major: '소프트웨어공학',
    bookmarkedDate: '2024-03-14',
    isBookmarked: true,
    passportName: 'KIM CHEOLSOO',
    passportNumber: 'M5678****',
    passportExpiry: '2027-05-15',
    jobCategory: { label: 'IT개발·데이터', value: 'it' },
    careers: [
      {
        company: '(주)데이터테크',
        period: '2021.01 - 2024.03',
        jobCategory: { label: 'IT개발·데이터', value: 'it' },
        position: '백엔드 개발자 | 서버개발팀',
        description:
          '백엔드 서버 개발 및 운영\n- Spring Boot 기반 REST API 개발\n- MSA 아키텍처 설계 및 구현\n- 대용량 데이터 처리 시스템 구축'
      }
    ],
    education: [
      {
        school: '베이징대학교',
        type: '대학교(4년)',
        major: '소프트웨어공학',
        period: '2016.09 - 2020.08',
        description: '학점 3.8/4.0\n클라우드 컴퓨팅 연구실 인턴\n교내 프로그래밍 대회 2위'
      }
    ]
  }
]);

// 검색 필터 상태 관리
const searchKeyword = ref('');
const selectedCareer = ref(null);
const selectedNationalities = ref([]);

// 직무 카테고리 추가
const jobCategories = [
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

// 직무 필터 상태 추가
const selectedJobCategory = ref(null);

// 필터링된 북마크 목록
const filteredBookmarks = computed(() => {
  return bookmarkedTalents.value.filter((talent) => {
    // 경력 필터
    const careerMatch =
      !selectedCareer.value || talent.career === careers.find((c) => c.value === selectedCareer.value)?.label;

    // 국적 필터
    const nationalityMatch =
      selectedNationalities.value.length === 0 ||
      selectedNationalities.value.some(
        (n) => talent.nationality === nationalities.find((nat) => nat.value === n)?.label
      );

    // 직무 필터 추가
    const jobCategoryMatch = !selectedJobCategory.value || talent.jobCategory?.value === selectedJobCategory.value;

    // 키워드 검색 (이름, 학교, 전공)
    const keyword = searchKeyword.value.toLowerCase();
    const keywordMatch =
      !keyword ||
      talent.name.toLowerCase().includes(keyword) ||
      talent.education.toLowerCase().includes(keyword) ||
      talent.major.toLowerCase().includes(keyword);

    return careerMatch && nationalityMatch && jobCategoryMatch && keywordMatch;
  });
});

// 이력서 모달 관련 상태 추가
const showResumeModal = ref(false);
const selectedCandidate = ref(null);
const isAccepted = ref(false); // 면접 제안 수락 여부 (연락처 표시용)

// 이력서 모달 열기 함수 수정
const openResumeModal = (talent) => {
  // 전달받은 talent 객체를 복사하여 selectedCandidate에 할당
  selectedCandidate.value = { ...talent };
  showResumeModal.value = true;
};

// 면접 제안 페이지로 이동하는 함수 추가
const openInterviewOffer = (talent) => {
  router.push(`/business/interview-offer/create/${talent.id}`);
};

// 북마크된 인재 목록에서 교육 정보 표시를 위한 computed 속성 추가
const getEducationDisplay = (talent) => {
  if (Array.isArray(talent.education)) {
    const latestEducation = talent.education[0];
    return `${latestEducation.school} · ${latestEducation.major}`;
  }
  return `${talent.education} · ${talent.major}`;
};

// 개별 경력 기간 계산 함수
const calculateCareerPeriod = (period) => {
  const [start, end] = period.split(' - ');
  const startDate = new Date(start.split('.').join('-'));
  const endDate = end === '현재' ? new Date() : new Date(end.split('.').join('-'));
  
  const years = endDate.getFullYear() - startDate.getFullYear();
  const months = endDate.getMonth() - startDate.getMonth();
  
  let totalMonths = years * 12 + months;
  if (totalMonths < 12) {
    return `${totalMonths}개월`;
  }
  
  const remainingYears = Math.floor(totalMonths / 12);
  const remainingMonths = totalMonths % 12;
  
  if (remainingMonths === 0) {
    return `${remainingYears}년`;
  }
  return `${remainingYears}년 ${remainingMonths}개월`;
};

// 최종학력 표시 함수
const getLatestEducation = (education) => {
  if (!education || education.length === 0) return '정보 없음';
  const latestEdu = education[0]; // 배열의 첫 번째 항목이 가장 최근 학력이라고 가정
  return `${latestEdu.school} ${latestEdu.type} (${latestEdu.major})`;
};

// script 섹션에 calculateTotalCareer 함수 추가
const calculateTotalCareer = (careers) => {
  if (!careers?.length) return '0년';
  
  let totalMonths = 0;
  
  careers.forEach(career => {
    const [start, end] = career.period.split(' - ');
    const startDate = new Date(start.replace('.', '-'));
    const endDate = end === '현재' ? new Date() : new Date(end.replace('.', '-'));
    
    const monthDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                     (endDate.getMonth() - startDate.getMonth());
    totalMonths += monthDiff;
  });
  
  if (totalMonths >= 12) {
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    return months > 0 ? `${years}년 ${months}개월` : `${years}년`;
  }
  
  return `${totalMonths}개월`;
};
</script>

<template>
  <!-- 전체 컨테이너에 최대 폭 제한과 중앙 정렬 적용 -->
  <div class="max-w-[1200px] mx-auto px-4 py-12">
    <div class="grid gap-4">
      <!-- 상단 메뉴 아이콘들 -->
      <div class="flex justify-center gap-32 mb-12">
        <!-- 인재 검색 -->
        <div class="flex flex-col items-center cursor-pointer group" @click="router.push('/business/TalentSearchPage')">
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
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <span class="text-[14px] font-bold text-gray-700 transition-all duration-200 group-hover:text-[#8B8BF5]"
            >인재 검색</span
          >
        </div>

        <!-- 면접 제안 내역 -->
        <div class="flex flex-col items-center cursor-pointer group" @click="router.push('/business/InterviewOffers')">
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
          <span class="text-[14px] font-bold text-gray-700 transition-all duration-200 group-hover:text-[#8B8BF5]"
            >면접 제안 내역</span
          >
        </div>

        <!-- 면접 결과 내역 -->
        <div class="flex flex-col items-center cursor-pointer group" @click="router.push('/business/InterviewResults')">
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
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <span class="text-[14px] font-bold text-gray-700 transition-all duration-200 group-hover:text-[#8B8BF5]"
            >면접 결과 내역</span
          >
        </div>

        <!-- 기업 정보 -->
        <div class="flex flex-col items-center cursor-pointer group" @click="router.push('/business/CompanyInfoPage')">
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
          <span class="text-[14px] font-bold text-gray-700 transition-all duration-200 group-hover:text-[#8B8BF5]"
            >기업 정보</span
          >
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

        <!-- 검색 필터 섹션 수정 -->
        <div class="flex items-center gap-4 mb-6">
          <!-- 국적 필터 -->
          <div class="w-[200px]">
            <label class="block text-sm font-medium text-gray-700 mb-1">국적</label>
            <MultiSelect
              v-model="selectedNationalities"
              :options="nationalities"
              optionLabel="label"
              placeholder="전체"
              class="w-full"
            />
          </div>

          <!-- 경력 필터 -->
          <div class="w-[150px]">
            <label class="block text-sm font-medium text-gray-700 mb-1">경력</label>
            <Dropdown
              v-model="selectedCareer"
              :options="careers"
              optionLabel="label"
              placeholder="전체"
              class="w-full"
            />
          </div>

          <!-- 직무 필터 추가 -->
          <div class="w-[200px]">
            <label class="block text-sm font-medium text-gray-700 mb-1">직무</label>
            <Dropdown
              v-model="selectedJobCategory"
              :options="jobCategories"
              optionLabel="label"
              placeholder="전체"
              class="w-full"
            />
          </div>

          <!-- 키워드 검색 -->
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">키워드</label>
            <InputText v-model="searchKeyword" placeholder="이름, 학교, 전공 등" class="w-full" />
          </div>
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

        <!-- 북마크된 인재는 있지만 필터링 결과가 없을 때 -->
        <div v-else-if="filteredBookmarks.length === 0" class="text-center py-12">
          <div class="flex flex-col items-center gap-4">
            <i class="pi pi-bookmark text-gray-300 text-5xl mb-2"></i>
            <p class="text-gray-500 mb-2">검색 결과가 없습니다</p>
            <p class="text-gray-400 text-sm mb-4">다른 검색 조건을 시도해보세요</p>
          </div>
        </div>

        <!-- 북마크된 인재가 있을 때 표시할 목록 -->
        <div v-else class="grid grid-cols-1 gap-4">
          <div
            v-for="talent in filteredBookmarks"
            :key="talent.id"
            class="border rounded-lg p-6 hover:border-[#8B8BF5] transition-all duration-200"
          >
            <div class="flex justify-between items-start">
              <div>
                <div class="flex items-center gap-3 mb-3">
                  <h3 class="text-lg font-bold">{{ talent.name }}</h3>
                  <span class="text-sm text-gray-600">{{ talent.nationality }}</span>
                  <span class="bg-[#8B8BF5] bg-opacity-10 text-[#8B8BF5] px-3 py-1 rounded-full text-sm">
                    경력 {{ talent.career }}
                  </span>
                </div>
                <p class="text-gray-600">{{ getEducationDisplay(talent) }}</p>
              </div>
              <div class="flex flex-col items-end gap-3">
                <button @click="toggleBookmark(talent)" class="text-[#8B8BF5]">
                  <i class="pi pi-bookmark-fill"></i>
                </button>
                <span class="text-sm text-gray-500">북마크: {{ talent.bookmarkedDate }}</span>
                <!-- 이력서 보기 버튼 추가 -->
                <button
                  @click="openResumeModal(talent)"
                  class="w-[140px] px-4 py-2 border border-[#8B8BF5] text-[#8B8BF5] rounded-lg hover:bg-gray-50"
                >
                  이력서 보기
                </button>
                <button
                  @click="openInterviewOffer(talent)"
                  class="w-[140px] px-4 py-2 bg-[#8B8BF5] text-white rounded-lg hover:bg-[#7A7AE6] transition-colors"
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

  <!-- 이력서 상세 모달 추가 -->
  <Dialog v-model:visible="showResumeModal" :modal="true" :style="{ width: '80vw' }" :maximizable="true">
    <template #header>
      <div class="text-2xl font-bold">이력서</div>
    </template>

    <div class="p-4">
      <!-- 기본 정보 -->
      <div class="mb-8 bg-gray-50 p-6 rounded-lg">
        <h3 class="text-lg font-medium mb-4">기본 정보</h3>
        <div class="grid grid-cols-2 gap-y-4">
          <div class="flex gap-8">
            <span class="text-gray-600 w-20">이름</span>
            <span>{{ selectedCandidate?.name }}</span>
          </div>
          <div class="flex gap-8">
            <span class="text-gray-600 w-20">생년월일</span>
            <span>{{ selectedCandidate?.birthdate }}</span>
          </div>
          <div class="flex gap-8">
            <span class="text-gray-600 w-20">성별</span>
            <span>{{ selectedCandidate?.gender }}</span>
          </div>
          <!-- 연락처 정보는 면접 제안 수락 후에만 표시 -->
          <div v-if="isAccepted" class="flex gap-8">
            <span class="text-gray-600 w-20">연락처</span>
            <span>{{ selectedCandidate?.phone }}</span>
          </div>
          <div v-if="isAccepted" class="flex gap-8">
            <span class="text-gray-600 w-20">이메일</span>
            <span>{{ selectedCandidate?.email }}</span>
          </div>
          <div v-if="isAccepted" class="flex gap-8">
            <span class="text-gray-600 w-20">주소</span>
            <span>{{ selectedCandidate?.address }}</span>
          </div>
          <!-- 연락처 정보가 없을 때 표시할 메시지 -->
          <div v-else class="col-span-2 text-gray-500 italic">
            * 연락처 정보는 면접 제안이 수락된 후 확인하실 수 있습니다
          </div>
        </div>
      </div>

      <!-- 국가 -->
      <div class="mb-8 bg-gray-50 p-6 rounded-lg">
        <h3 class="text-lg font-medium mb-4">국가</h3>
        <div>
          <span>{{ selectedCandidate?.nationality }}</span>
        </div>
      </div>

      <!-- 여권 -->
      <div class="mb-8 bg-gray-50 p-6 rounded-lg">
        <h3 class="text-lg font-medium mb-4">여권</h3>
        <div class="grid gap-y-4">
          <div class="flex gap-8">
            <span class="text-gray-600 w-20">이름</span>
            <span>{{ selectedCandidate?.passportName }}</span>
          </div>
          <div class="flex gap-8">
            <span class="text-gray-600 w-20">여권번호</span>
            <span>{{ selectedCandidate?.passportNumber }}</span>
          </div>
          <div class="flex gap-8">
            <span class="text-gray-600 w-20">국적</span>
            <span>{{ selectedCandidate?.nationality }}</span>
          </div>
          <div class="flex gap-8">
            <span class="text-gray-600 w-20">만료일</span>
            <span>{{ selectedCandidate?.passportExpiry }}</span>
          </div>
        </div>
      </div>

      <!-- 경력 사항 -->
      <div class="mb-8 bg-gray-50 p-6 rounded-lg">
        <div class="flex items-center gap-2 mb-4">
          <h3 class="text-lg font-medium">경력 사항</h3>
          <span class="text-sm text-[#8B8BF5] bg-[#8B8BF5] bg-opacity-10 px-2 py-1 rounded">
            총 {{ calculateTotalCareer(selectedCandidate?.careers) }}
          </span>
        </div>
        <div v-for="(career, index) in selectedCandidate?.careers" :key="index" class="mb-4">
          <div class="flex items-center gap-2">
            <div class="font-medium">{{ career.company }}</div>
            <span class="text-sm text-gray-500">({{ calculateCareerPeriod(career.period) }})</span>
          </div>
          <div class="text-gray-600">{{ career.period }}</div>
          <div class="text-gray-600">{{ career.jobCategory.label }} | {{ career.position }}</div>
          <div class="mt-2 whitespace-pre-line">{{ career.description }}</div>
        </div>
      </div>

      <!-- 학력 사항 -->
      <div class="mb-8 bg-gray-50 p-6 rounded-lg">
        <h3 class="text-lg font-medium mb-4">학력 사항</h3>
        <div class="text-[#8B8BF5] mb-4">
          최종학력: {{ getLatestEducation(selectedCandidate?.education) }}
        </div>
        <div v-for="(edu, index) in selectedCandidate?.education" :key="index" class="mb-4">
          <div class="font-medium">{{ edu.school }}</div>
          <div class="text-gray-600">{{ edu.type }}</div>
          <div class="text-gray-600">{{ edu.major }}</div>
          <div class="text-gray-600">{{ edu.period }}</div>
          <div class="whitespace-pre-line">{{ edu.description }}</div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-4">
        <Button
          @click="toggleBookmark(selectedCandidate)"
          class="p-button-text"
          :class="{
            'text-[#8B8BF5]': selectedCandidate?.isBookmarked,
            'text-gray-400': !selectedCandidate?.isBookmarked
          }"
        >
          <i
            :class="['pi', selectedCandidate?.isBookmarked ? 'pi-bookmark-fill' : 'pi-bookmark']"
            style="font-size: 1.5rem"
          ></i>
        </Button>
        <Button @click="openInterviewOffer(selectedCandidate)" class="bg-[#8B8BF5] hover:bg-[#7A7AE6]">
          면접 제안하기
        </Button>
      </div>
    </template>
  </Dialog>
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

/* 필터 스타일 추가 */
:deep(.p-dropdown),
:deep(.p-multiselect) {
  width: 100%;
}

:deep(.p-dropdown-panel),
:deep(.p-multiselect-panel) {
  width: 100%;
}
</style>
