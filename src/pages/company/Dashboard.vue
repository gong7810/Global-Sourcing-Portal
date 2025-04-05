<script setup>
import { onMounted, ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';

import { useMessagePop } from '@/plugins/commonutils';
import { getCodeList } from '@/apis/common/commonApis';
import { deleteFavoriteResume, getFavoriteResumeList, getUserResume } from '@/apis/company/companyApis';

const router = useRouter();
const messagePop = useMessagePop();

const koreanLv = ref('');
const koreanLevelList = ref([]);
const educationLevelList = ref([]);

// 이력서 모달 관련 상태 추가
const showResumeModal = ref(false);
const selectedCandidate = ref(null);
const isAccepted = ref(false); // 면접 제안 수락 여부 (연락처 표시용)

// 필터 옵션
const nationalityOptions = ref([]);
const careerOptions = ref([]);
const jobCategoryOptions = ref([]);
const genderOptions = ref([]);

// 검색 필터 상태 관리
const filters = ref({
  nationalityCd: null,
  careerHistory: null,
  jobCategoryCd: null,
  genderCd: null
});

// 북마크 인재 리스트
const bookmarkedTalents = ref([
  {
    id: 1,
    name: '홍길동',
    nationality: '베트남',
    experienceDurationMonth: '5년',
    birthdate: '1996.09.01',
    gender: '남성',
    phone: '010-1234-5678',
    email: 'hong@example.com',
    address: '서울시 강남구 테헤란로 123',
    profileImage: {
      url: '/images/profile1.jpg',
      exists: true
    },
    passportName: 'HONG GILDONG',
    passportNumber: 'M1234****',
    passportExpiry: '2028-09-01',
    jobCategory: { label: 'IT개발·데이터', value: 'it' },
    isBookmarked: true,
    bookmarkedDate: '2024-03-15',
    experiences: [
      {
        company: '(주)테크솔루션',
        period: '2021.03 - 2024.03',
        jobCategory: { label: 'IT개발·데이터', value: 'it' },
        position: '프론트엔드 개발자 | 개발팀',
        content:
          '웹 서비스 프론트엔드 개발 및 유지보수\n- React, TypeScript 기반 웹 애플리케이션 개발\n- 성능 최적화 및 사용자 경험 개선'
      },
      {
        company: '(주)스타트업',
        period: '2019.03 - 2021.02',
        jobCategory: { label: 'IT개발·데이터', value: 'it' },
        position: '웹 개발자 | 서비스개발팀',
        content: '자사 웹 서비스 개발\n- Vue.js 기반 프론트엔드 개발\n- REST API 연동 및 기능 구현'
      }
    ],
    education: [
      {
        schoolName: '하노이공과대학교',
        type: '대학교(4년)',
        major: '컴퓨터공학',
        period: '2015.03 - 2019.02',
        content: '학점 4.0/4.5\n웹 개발 동아리 회장\n알고리즘 경진대회 수상'
      }
    ],
    certificates: [
      {
        name: 'TOPIK 6급',
        issuedDate: '2023-05-15'
      },
      {
        name: 'AWS Solutions Architect Associate',
        issuedDate: '2023-08-20'
      },
      {
        name: 'JLPT N1',
        issuedDate: '2023-07-10'
      }
    ],
    criminalRecordFile: {
      name: '범죄경력확인서.pdf',
      size: '1.2MB',
      exists: true
    },
    koreanProficiency: '고급',
    koreanStudyDuration: '2년',
    koreanVisitExperience: '없음',
    maritalStatus: '미혼',
    isInterviewOffered: true
  },
  {
    id: 2,
    name: '김철수',
    nationality: '중국',
    experienceDurationMonth: '3년',
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
    experiences: [
      {
        company: '(주)데이터테크',
        period: '2021.01 - 2024.03',
        jobCategory: { label: 'IT개발·데이터', value: 'it' },
        position: '백엔드 개발자 | 서버개발팀',
        content:
          '백엔드 서버 개발 및 운영\n- Spring Boot 기반 REST API 개발\n- MSA 아키텍처 설계 및 구현\n- 대용량 데이터 처리 시스템 구축'
      }
    ],
    education: [
      {
        schoolName: '베이징대학교',
        type: '대학교(4년)',
        major: '소프트웨어공학',
        period: '2016.09 - 2020.08',
        content: '학점 3.8/4.0\n클라우드 컴퓨팅 연구실 인턴\n교내 프로그래밍 대회 2위'
      }
    ],
    isInterviewOffered: false
  }
]);

onMounted(() => {
  getKoreanLevelCode();
  getNationCode();
  getJobCategoryCode();
  getCareerPeriodCode();
  getEducationLevelCode();
  getGenderCode();

  searchTalents();
});

// 한국어 실력 코드 조회
const getKoreanLevelCode = async () => {
  const response = await getCodeList(`KOREAN_LV`);

  response.map((item) => {
    koreanLevelList.value.push({ name: item.name, code: item.code });
  });
};

// 국적 코드 조회
const getNationCode = async () => {
  const response = await getCodeList(`NATIONALITY_TY`);

  response.map((item) => {
    nationalityOptions.value.push({
      name: item.name,
      code: item.code
    });
  });
};

// 경력 코드 조회
const getCareerPeriodCode = async () => {
  const response = await getCodeList(`CAREER_PERIOD`);

  response.map((item) => {
    careerOptions.value.push({
      name: item.name,
      code: item.code
    });
  });
};

// 직무 코드 조회
const getJobCategoryCode = async () => {
  const response = await getCodeList(`JOB_CATEGORY`);

  response.map((item) => {
    jobCategoryOptions.value.push({
      name: item.name,
      code: item.code
    });
  });
};

// 학력 코드 조회
const getEducationLevelCode = async () => {
  const response = await getCodeList(`EDUCATION_LEVEL`);

  response.map((item) => {
    educationLevelList.value.push({
      name: item.name,
      code: item.code
    });
  });
};

// 성별 코드 조회
const getGenderCode = async () => {
  const response = await getCodeList(`GENDER_TY`);

  response.map((item) => {
    genderOptions.value.push({ name: `${item.name}성`, code: item.code });
  });
};

// 인재 필터 조회
const searchTalents = async () => {
  let fromPeriod = '';
  let toPeriod = '';

  if (filters.value.careerHistory) {
    switch (filters.value.careerHistory) {
      case careerOptions.value[0].code:
        fromPeriod = 0;
        toPeriod = 1;
        break;
      case careerOptions.value[1].code:
        fromPeriod = 1;
        toPeriod = 3;
        break;
      case careerOptions.value[2].code:
        fromPeriod = 3;
        toPeriod = 7;
        break;
      case careerOptions.value[3].code:
        fromPeriod = 7;
        toPeriod = 50;
        break;
    }
  }

  let queryList = Object.entries(filters.value).reduce((acc, cur, idx) => {
    if (idx !== 1 && cur[1]) {
      acc.push(`${cur[0]}=${cur[1]}`);
    } else if (cur[1]) {
      acc.push(`fromPeriod=${fromPeriod}&toPeriod=${toPeriod}`);
    }
    return acc;
  }, []);

  const response = await getFavoriteResumeList(queryList.join('&'));

  bookmarkedTalents.value = response.contents.sort((a, b) => a.id - b.id);
};

// 인재 북마크 등록 / 해제
const toggleBookmark = async (talent, isPage) => {
  messagePop.confirm({
    icon: 'info',
    message: '북마크 해제하시겠습니까?',
    onCloseYes: async () => {
      const response = isPage
        ? await deleteFavoriteResume(talent.id, null)
        : await deleteFavoriteResume(null, talent.id);

      if (response && response.success === undefined) {
        messagePop.toast('북마크 삭제되었습니다.', 'info');

        showResumeModal.value = false;
        searchTalents();
      }
    }
  });
};

// TODO: 임시 주석 (화면에서 직무 필터가 불가)
// 필터링된 북마크 목록
const filteredBookmarks = computed(() => {
  return bookmarkedTalents.value.filter((talent) => {
    // 국적 필터
    const nationalityMatch =
      !filters.value.nationalityCd || talent.resume.nationalityCd === filters.value.nationalityCd;

    // 경력 필터
    let fromPeriod = 0;
    let toPeriod = 600;

    if (filters.value.careerHistory) {
      switch (filters.value.careerHistory) {
        case careerOptions.value[0].code:
          fromPeriod = 0;
          toPeriod = 12;
          break;
        case careerOptions.value[1].code:
          fromPeriod = 12;
          toPeriod = 36;
          break;
        case careerOptions.value[2].code:
          fromPeriod = 6;
          toPeriod = 84;
          break;
        case careerOptions.value[3].code:
          fromPeriod = 84;
          toPeriod = 600;
          break;
      }
    }

    const careerMatch =
      !filters.value.careerHistory ||
      (talent?.resume?.experienceDurationMonth >= fromPeriod && talent?.resume?.experienceDurationMonth < toPeriod);

    // // 직무 필터
    // const response = await getUserResume()

    // const jobCategoryMatch = !filters.value.jobCategoryCd || talent.resume.jobCategory?.value === selectedJobCategory.value;

    // 성별 필터
    const genderMatch = !filters.value.genderCd || talent?.resume?.user?.genderCd === filters.value.genderCd;

    return nationalityMatch && careerMatch && genderMatch;
  });
});

// 이력서 모달 열기
const openResumeModal = async (talent) => {
  // 개별 이력서 조회 API 호출
  const response = await getUserResume(talent.resume.id);

  selectedCandidate.value = response;

  selectedCandidate.value.user = {
    ...selectedCandidate.value.user,
    profileImage: `${import.meta.env.VITE_UPLOAD_PATH}/${selectedCandidate.value.user?.imageFile?.fileName}`
  };

  showResumeModal.value = true;
};

// 국적 코드 변환
const convertNationCode = (code) => {
  if (!code) return null;

  let name = '';

  nationalityOptions.value.filter((item) => {
    if (item.code === code) {
      name = item.name;
    }
  });

  return name;
};

// 한국어 실력 코드 변환
const convertCode = (code) => {
  if (!code) return null;

  let name = '';

  koreanLevelList.value.filter((item) => {
    if (item.code === code) {
      name = item.name;
    }
  });

  return name;
};

// 직무 코드 변환
const convertJobCode = (code) => {
  if (!code) return null;

  let name = '';

  jobCategoryOptions.value.filter((item) => {
    if (item.code === code) {
      name = item.name;
    }
  });

  return name;
};

// 학력 코드 변환
const convertEduLevelCode = (code) => {
  if (!code) return null;

  let name = '';

  educationLevelList.value.filter((item) => {
    if (item.code === code) {
      name = item.name;
    }
  });

  return name;
};

watch(
  () => selectedCandidate.value,
  () => {
    koreanLv.value = convertCode(selectedCandidate.value?.user?.koreanProficiencyCd);
  },
  { deep: true }
);

// 면접 제안 페이지로 이동하는 함수 수정
const openInterviewOffer = (talent) => {
  if (talent.isInterviewOffered) return;
  router.push(`/company/interview-offer/create/${talent.id}`);
};

// 북마크된 인재 목록에서 교육 정보 표시를 위한 computed 속성 추가
const getEducationDisplay = (talent) => {
  if (Array.isArray(talent.resume.lastEducation)) {
    const latestEducation = talent.education[0];
    return `${latestEducation.schoolName} · ${latestEducation.major}`;
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
  return `${latestEdu.schoolName} ${latestEdu.type} (${latestEdu.major})`;
};

// script 섹션에 calculateTotalCareer 함수 추가
const calculateTotalCareer = (careers) => {
  if (!careers?.length) return '0년';

  let totalMonths = 0;

  careers.forEach((career) => {
    const [start, end] = career.period.split(' - ');
    const startDate = new Date(start.replace('.', '-'));
    const endDate = end === '현재' ? new Date() : new Date(end.replace('.', '-'));

    const monthDiff =
      (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
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
        <div class="flex flex-col items-center cursor-pointer group" @click="router.push('/company/TalentSearchPage')">
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
        <div class="flex flex-col items-center cursor-pointer group" @click="router.push('/company/InterviewOffers')">
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
        <div class="flex flex-col items-center cursor-pointer group" @click="router.push('/company/InterviewResults')">
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
        <div class="flex flex-col items-center cursor-pointer group" @click="router.push('/company/CompanyInfoPage')">
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
            기업 정보
          </span>
        </div>
      </div>

      <!-- 북마크된 인재 목록 섹션 -->
      <div class="bg-white rounded-lg p-6 shadow-sm mb-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold">북마크된 인재</h2>
          <router-link
            to="/company/TalentSearchPage"
            class="text-[#8B8BF5] hover:text-[#7A7AE6] text-sm flex items-center gap-1"
          >
            <span>인재 더보기</span>
            <i class="pi pi-arrow-right"></i>
          </router-link>
        </div>

        <!-- 검색 필터 섹션 수정 -->
        <div class="flex items-center gap-4 mb-6">
          <!-- 국적 필터 -->
          <div class="w-[150px]">
            <label class="block text-sm font-medium text-gray-700 mb-1">국적</label>
            <Select
              v-model="filters.nationalityCd"
              :options="nationalityOptions"
              optionLabel="name"
              optionValue="code"
              placeholder="--Select--"
              showClear
              class="w-full"
            />
          </div>

          <!-- 경력 필터 -->
          <div class="w-[200px]">
            <label class="block text-sm font-medium text-gray-700 mb-1">경력</label>
            <Select
              v-model="filters.careerHistory"
              :options="careerOptions"
              optionLabel="name"
              optionValue="code"
              placeholder="--Select--"
              showClear
              class="w-full"
            />
          </div>

          <!-- 직무 필터 추가 -->
          <div class="w-[200px]">
            <label class="block text-sm font-medium text-gray-700 mb-1">직무</label>
            <Select
              v-model="filters.jobCategoryCd"
              :options="jobCategoryOptions"
              class="w-full"
              optionLabel="name"
              optionValue="code"
              placeholder="--Select--"
              showClear
            />
          </div>

          <!-- 성별 카테고리 필터 -->
          <div class="w-[150px]">
            <label class="block text-sm font-medium text-gray-700 mb-1">성별</label>
            <Select
              v-model="filters.genderCd"
              :options="genderOptions"
              class="w-full"
              optionLabel="name"
              optionValue="code"
              placeholder="--Select--"
              showClear
            />
          </div>

          <!-- 검색 버튼 -->
          <div class="self-end">
            <Button @click="searchTalents" class="bt_btn widthFixed primary"> 검색하기 </Button>
          </div>
        </div>

        <!-- 북마크된 인재가 없을 때 표시할 빈 상태 -->
        <div v-if="bookmarkedTalents.length === 0" class="text-center py-12">
          <div class="flex flex-col items-center gap-4">
            <i class="pi pi-bookmark text-gray-300 text-5xl mb-2"></i>
            <p class="text-gray-500 mb-2">북마크된 인재가 없습니다</p>
            <p class="text-gray-400 text-sm mb-4">관심있는 인재를 북마크하고 관리해보세요</p>
            <router-link
              to="/company/TalentSearchPage"
              class="inline-flex items-center px-4 py-2 bg-[#8B8BF5] text-white rounded-lg hover:bg-[#7A7AE6] transition-colors"
            >
              <i class="pi pi-search mr-2"></i>
              인재 검색하기
            </router-link>
          </div>
        </div>

        <!-- 북마크된 인재는 있지만 필터링 결과가 없을 때 -->
        <div v-else-if="bookmarkedTalents?.length === 0" class="text-center py-12">
          <div class="flex flex-col items-center gap-4">
            <i class="pi pi-bookmark text-gray-300 text-5xl mb-2"></i>
            <p class="text-gray-500 mb-2">검색 결과가 없습니다</p>
            <p class="text-gray-400 text-sm mb-4">다른 검색 조건을 시도해보세요</p>
          </div>
        </div>

        <!-- 북마크된 인재가 있을 때 표시할 목록 -->
        <div v-else class="grid grid-cols-1 gap-4">
          <div
            v-for="talent in bookmarkedTalents"
            :key="talent.id"
            class="border rounded-lg p-6 hover:border-[#8B8BF5] transition-all duration-200"
          >
            <div class="flex justify-between items-start">
              <div>
                <div class="flex items-center gap-3 mb-3">
                  <h3 class="text-lg font-bold notranslate">{{ talent?.resume?.user?.name }}</h3>
                  <span class="text-sm text-gray-600">{{ convertNationCode(talent?.resume?.nationalityCd) }}</span>
                  <span class="bg-[#8B8BF5] bg-opacity-10 text-[#8B8BF5] px-3 py-1 rounded-full text-sm">
                    {{
                      talent?.resume?.experienceDurationMonth
                        ? '경력 ' +
                          parseInt(talent?.resume.experienceDurationMonth / 12) +
                          '년 ' +
                          (talent?.resume.experienceDurationMonth % 12) +
                          '개월'
                        : '신입'
                    }}
                  </span>
                </div>
                <p class="text-gray-600">
                  {{
                    talent?.resume?.finalEducation
                      ? `${talent?.resume?.finalEducation?.schoolName} ${talent?.resume?.finalEducation?.major} ${talent?.resume?.finalEducation?.isGraduated ? '졸업' : '재학중'}`
                      : ''
                  }}
                </p>
              </div>
              <div class="flex flex-col items-end gap-3">
                <button @click="toggleBookmark(talent, true)" class="text-[#8B8BF5]">
                  <i class="pi pi-bookmark-fill"></i>
                </button>
                <span class="text-sm text-gray-500">
                  북마크 {{ ' : ' + talent.createdAt?.slice(0, 10).replaceAll('-', '.') }}
                </span>
                <!-- 이력서 보기 버튼 추가 -->
                <button
                  @click="openResumeModal(talent)"
                  class="w-[140px] px-4 py-2 border border-[#8B8BF5] text-[#8B8BF5] rounded-lg hover:bg-gray-50"
                >
                  이력서 보기
                </button>
                <button
                  @click="openInterviewOffer(talent)"
                  :disabled="talent.isInterviewOffered"
                  class="w-[140px] px-4 py-2 text-white rounded-lg transition-colors"
                  :class="
                    talent.isInterviewOffered ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#8B8BF5] hover:bg-[#7A7AE6]'
                  "
                >
                  {{ talent.isInterviewOffered ? '제안 완료' : '면접 제안하기' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 이력서 상세 모달 추가 -->
  <Dialog v-model:visible="showResumeModal" modal :style="{ width: '80vw' }" :maximizable="true" :blockScroll="false">
    <template #header>
      <div class="text-2xl font-bold">이력서</div>
    </template>

    <div class="p-4">
      <!-- 기본 정보 -->
      <div class="mb-8 bg-gray-50 p-6 rounded-lg">
        <h3 class="text-lg font-medium mb-4">기본 정보</h3>
        <div class="grid grid-cols-[1fr_1fr_auto] gap-x-8">
          <!-- 왼쪽 컬럼 -->
          <div class="grid grid-cols-[80px_auto] gap-y-2 text-sm text-gray-600">
            <span class="text-gray-600">이름</span>
            <span class="notranslate">{{ selectedCandidate?.user?.name }}</span>
            <span class="text-gray-600">생년월일</span>
            <span>{{ selectedCandidate?.user?.birth }}</span>
            <span class="text-gray-600">성별</span>
            <span>{{ selectedCandidate?.user?.genderCd === 'GENDER_MALE' ? '남성' : '여성' }}</span>
            <span class="text-gray-600">휴대폰</span>
            <span class="text-[#8B8BF5]">{{
              isAccepted ? selectedCandidate?.user?.mobile : '면접 제안 수락 후 확인 가능'
            }}</span>
            <span class="text-gray-600">이메일</span>
            <span class="text-[#8B8BF5]">{{
              isAccepted ? selectedCandidate?.user?.email : '면접 제안 수락 후 확인 가능'
            }}</span>
            <span class="text-gray-600">주소</span>
            <span class="text-[#8B8BF5]">{{
              isAccepted ? selectedCandidate?.user?.address : '면접 제안 수락 후 확인 가능'
            }}</span>
          </div>

          <!-- 가운데 컬럼 -->
          <div class="grid grid-cols-[100px_auto] gap-y-2 text-sm text-gray-600">
            <span class="text-gray-600">범죄경력</span>
            <span v-if="isAccepted" class="flex items-center gap-2">
              <i class="pi pi-file-pdf text-red-500"></i>
              {{ selectedCandidate?.user?.criminalRecordFile?.name || '미제출' }}
            </span>
            <span v-else class="text-[#8B8BF5]">면접 제안 수락 후 확인 가능</span>

            <span class="text-gray-600">한국어능력</span>
            <span>{{ koreanLv || '미입력' }}</span>
            <span class="text-gray-600">학습기간</span>
            <span>{{ selectedCandidate?.user?.koreanStudyPeriod || '미입력' }}</span>
            <span class="text-gray-600">한국방문경험</span>
            <span>{{
              selectedCandidate?.user?.hasVisitedKorea === false
                ? '없음'
                : selectedCandidate?.user?.hasVisitedKorea
                  ? '있음'
                  : '미입력'
            }}</span>
            <span class="text-gray-600">혼인여부</span>
            <span>{{
              selectedCandidate?.user?.isMarried === false
                ? '미혼'
                : selectedCandidate?.user?.isMarried
                  ? '기혼'
                  : '미입력'
            }}</span>
          </div>

          <!-- 프로필 사진 (오른쪽) -->
          <div class="flex flex-col items-center">
            <div class="w-[140px] h-[180px] bg-gray-100 rounded-lg overflow-hidden">
              <img
                v-if="selectedCandidate?.user?.profileImage"
                :src="selectedCandidate?.user?.profileImage || '/default-profile.jpg'"
                alt="프로필 사진"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                <i class="pi pi-user text-4xl"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 국가 -->
      <div class="mb-8 bg-gray-50 p-6 rounded-lg">
        <h3 class="text-lg font-medium mb-4">국가</h3>
        <div>
          <span>{{ selectedCandidate?.nationality?.name }}</span>
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
            <span>{{ selectedCandidate?.passport }}</span>
          </div>
          <div class="flex gap-8">
            <span class="text-gray-600 w-20">국적</span>
            <span>{{ selectedCandidate?.nationality?.name }}</span>
          </div>
          <div class="flex gap-8">
            <span class="text-gray-600 w-20">만료일</span>
            <span>{{ selectedCandidate?.passportExpiryDt.slice(0, 10) }}</span>
          </div>
        </div>
      </div>

      <!-- 경력 사항 -->
      <div class="mb-8 bg-gray-50 p-6 rounded-lg">
        <div class="flex items-center gap-2 mb-4">
          <h3 class="text-lg font-medium">경력 사항</h3>
          <span class="text-sm text-[#8B8BF5] bg-[#8B8BF5] bg-opacity-10 px-2 py-1 rounded">
            {{
              selectedCandidate?.experienceDurationMonth
                ? '총 ' +
                  parseInt(selectedCandidate?.experienceDurationMonth / 12) +
                  '년 ' +
                  (selectedCandidate?.experienceDurationMonth % 12) +
                  '개월'
                : '신입'
            }}
          </span>
        </div>
        <div v-if="selectedCandidate?.experiences.length">
          <div
            v-for="(career, index) in selectedCandidate?.experiences"
            :key="index"
            class="mb-4 pb-4 border-b last:border-b-0"
          >
            <div class="flex items-center gap-2">
              <div class="font-medium">{{ career?.companyName }}</div>
              <span class="text-sm text-gray-500">
                ({{
                  `${career?.startDt?.slice(0, 7).replaceAll('-', '.')} ~ ${career?.endDt?.slice(0, 7) ? career?.endDt?.slice(0, 7).replaceAll('-', '.') : '재직중'}`
                }})
              </span>
            </div>
            <div class="text-gray-600">{{ career?.department }}</div>
            <div class="text-gray-600">{{ convertJobCode(career?.jobCategoryCd) }} | {{ career.position }}</div>
            <div class="mt-2 whitespace-pre-line">{{ career?.content }}</div>
          </div>
        </div>

        <div v-else class="text-center text-gray-500">등록된 경력이 없습니다</div>
      </div>

      <!-- 학력 사항 -->
      <div class="mb-8 bg-gray-50 p-6 rounded-lg">
        <div class="flex items-center gap-2 mb-4">
          <h3 class="text-lg font-medium">학력 사항</h3>
          <span class="text-sm text-[#8B8BF5] bg-[#8B8BF5] bg-opacity-10 px-2 py-1 rounded">
            {{
              selectedCandidate?.finalEducation
                ? '최종학력 : ' +
                  `${selectedCandidate?.finalEducation?.schoolName} ${selectedCandidate?.finalEducation?.major} ${selectedCandidate?.finalEducation?.isGraduated ? '졸업' : '재학중'}`
                : ''
            }}
          </span>
        </div>
        <div v-if="selectedCandidate?.finalEducation">
          <!-- <div class="text-[#8B8BF5] mb-4">
            최종학력:
            {{
              selectedCandidate?.finalEducation
                ? `${selectedCandidate?.finalEducation?.schoolName} ${selectedCandidate?.finalEducation?.major} ${selectedCandidate?.finalEducation?.isGraduated ? '졸업' : '재학중'}`
                : ''
            }}
          </div> -->
          <div
            v-for="(edu, index) in selectedCandidate?.educations"
            :key="index"
            class="mb-6 pb-6 border-b last:border-b-0"
          >
            <div class="text-[#8B8BF5] mb-2">
              {{ edu?.schoolName }} ({{ convertEduLevelCode(edu?.educationLevelCd) }})
            </div>
            <div class="text-gray-600">{{ edu?.major }}</div>
            <div class="text-gray-600">{{ `${edu?.startDt} ~ ${edu?.endDt ? edu?.endDt : '재학중'}` }}</div>
            <div class="whitespace-pre-line">{{ edu?.content }}</div>
          </div>
        </div>

        <div v-else class="text-center text-gray-500">등록된 학력이 없습니다</div>
      </div>

      <!-- 자격증 사항 -->
      <div class="mb-8 bg-gray-50 p-6 rounded-lg">
        <div class="mb-4">
          <h3 class="text-lg font-medium">자격증 사항</h3>
        </div>
        <div v-if="selectedCandidate?.certifications?.length" class="space-y-4">
          <div
            v-for="(cert, index) in selectedCandidate.certifications"
            :key="index"
            class="mb-4 pb-4 border-b last:border-b-0"
          >
            <div class="font-medium mb-1">{{ cert.name }}</div>
            <div class="font-medium mb-1">발급기관 : {{ cert.issuer }}</div>
            <div class="text-gray-600">취득일 : {{ cert.acquiredDt.slice(0, 10).replaceAll('-', '.') }}</div>
          </div>
        </div>

        <div v-else class="text-center text-gray-500">등록된 자격증이 없습니다</div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-4 pt-[15px]">
        <Button
          @click="toggleBookmark(selectedCandidate, false)"
          class="p-button-text"
          :class="['p-button-text', selectedCandidate?.isBookmarked ? 'text-[#8B8BF5]' : 'text-gray-400']"
        >
          <i
            :class="['pi', selectedCandidate?.isBookmarked ? 'pi-bookmark-fill' : 'pi-bookmark']"
            style="font-size: 1.5rem"
          ></i>
        </Button>
        <Button
          @click="openInterviewOffer(selectedCandidate)"
          :disabled="selectedCandidate?.isInterviewOffered"
          class="transition-colors"
          :class="selectedCandidate?.isInterviewOffered ? 'bg-gray-400' : 'bg-[#8B8BF5] hover:bg-[#7A7AE6]'"
        >
          {{ selectedCandidate?.isInterviewOffered ? '제안 완료' : '면접 제안하기' }}
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

/* 모달이 열릴 때 스크롤바 유지 */
::v-deep .p-dialog-mask {
  overflow-y: auto !important;
}

::v-deep .p-dialog {
  margin: 0 auto !important;
}
</style>
