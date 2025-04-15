<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { isNull } from 'es-toolkit';

import { useDateFormatter } from '@/plugins/commonutils';
import { useMessagePop } from '@/plugins/commonutils';
import { useCompanyStore } from '@/store/company/companyStore';
import { getCodeList } from '@/apis/common/commonApis';
import { deleteFavoriteResume, getFavoriteResumeList, getOfferList, getUserResume } from '@/apis/company/companyApis';

const router = useRouter();
const dateFormatter = useDateFormatter();
const messagePop = useMessagePop();
const companyStore = useCompanyStore();

const isLoading = ref(false);
const isResumeLoading = ref(false);

const unreadOffers = ref(0);
const unwriteResults = ref(0);

// 이력서 모달 관련 상태 추가
const showResumeModal = ref(false);
const selectedCandidate = ref(null);
const isAccepted = ref(false); // 면접 제안 수락 여부 (연락처 표시용)

// 필터 옵션
const nationalityOptions = ref([]);
const careerOptions = ref([]);
const genderOptions = ref([
  { name: '남성', code: 'GENDER_MALE' },
  { name: '여성', code: 'GENDER_FEMALE' }
]);

// 검색 필터 상태 관리
const filters = ref({
  nationality: null,
  experienceDurationMonth: null,
  gender: null
});

// 북마크 인재 리스트
const bookmarkedTalents = ref([]);

onMounted(() => {
  getNationCode();
  getCareerPeriodCode();

  getOfferChange();
  searchTalents();
});

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

// 면접 제안 사항 갯수 조회
const getOfferChange = async () => {
  const response = await getOfferList();

  unreadOffers.value = response.contents.filter((com) => {
    return (
      !['JO_ST_1', 'JO_ST_6'].includes(com?.statusCd) &&
      isNull(com?.resultCd) &&
      isToday(dateFormatter.halfDate(com?.updatedAt))
    );
  }).length;

  unwriteResults.value = response.contents.filter((com) => {
    return ['JO_ST_6'].includes(com.statusCd) && (isNull(com?.resultCd) || com?.resultCd === 'INTERVIEW_RESULT_3');
  }).length;
};

// 오늘인지 체크
const isToday = (dateString) => {
  // 문자열을 Date 객체로 변환
  const date = new Date(dateString.replace(/\./g, '-')); // '.'을 '-'로 변환하여 ISO 형식으로 변환
  const today = new Date();

  // 오늘 날짜와 비교
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
};

// 북마크 인재 필터 조회
const searchTalents = async () => {
  isLoading.value = true;
  let fromPeriod = '';
  let toPeriod = '';

  if (filters.value.experienceDurationMonth) {
    switch (filters.value.experienceDurationMonth) {
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

  try {
    const response = await getFavoriteResumeList(queryList.join('&'));
    bookmarkedTalents.value = response.contents.sort((a, b) => a.id - b.id);
  } catch (error) {
    console.error('북마크된 인재 목록을 불러오는 중 오류가 발생했습니다:', error);
    bookmarkedTalents.value = [];
  } finally {
    isLoading.value = false;
  }
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

// 필터링된 북마크 목록
const filteredBookmarks = computed(() => {
  return bookmarkedTalents.value.filter((talent) => {
    // 국적 필터
    const nationalityMatch = !filters.value.nationality || talent?.nationalityName === filters.value.nationality?.name;

    // 경력 필터
    let fromPeriod = 0;
    let toPeriod = 600;

    if (filters.value.experienceDurationMonth) {
      switch (filters.value.experienceDurationMonth) {
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
      !filters.value.experienceDurationMonth ||
      (talent?.experienceDurationMonth >= fromPeriod && talent?.experienceDurationMonth < toPeriod);

    // 성별 필터
    const genderMatch = !filters.value.gender || `${talent?.genderName}성` === filters.value.gender.name;

    return nationalityMatch && careerMatch && genderMatch;
  });
});

// 이력서 모달 열기
const openResumeModal = async (talent) => {
  isResumeLoading.value = true;
  showResumeModal.value = true;

  try {
    // 개별 이력서 조회 API 호출
    const response = await getUserResume(talent.resumeId);

    selectedCandidate.value = response;

    selectedCandidate.value.user = {
      ...selectedCandidate.value.user,
      profileImage: selectedCandidate.value.user?.imageFile
        ? `${import.meta.env.VITE_UPLOAD_PATH}/${selectedCandidate.value.user?.imageFile?.fileName}`
        : null
    };
  } catch (error) {
    console.error('이력서 정보를 불러오는 중 오류가 발생했습니다:', error);
  } finally {
    isResumeLoading.value = false;
  }
};

// 면접 제안
const openInterviewOffer = async (talent, isPage) => {
  if (talent?.isInterviewOffered) return;

  let response = {};
  let id = talent.id;

  if (isPage) {
    response = await getUserResume(talent.resumeId);

    companyStore.setOfferUserResume(response);
    id = talent.resumeId;
  } else {
    companyStore.setOfferUserResume(talent);
  }

  router.push(`/company/InterviewOffer/create/${id}`);
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
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <!-- 읽지 않은 제안이 있을 경우 표시되는 배지 -->
            <div
              v-if="unreadOffers"
              class="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-red-500 text-white text-xs rounded-full"
            >
              {{ unreadOffers }}
            </div>
          </div>
          <span class="text-[14px] font-bold text-gray-700 transition-all duration-200 group-hover:text-[#8B8BF5]"
            >면접 제안 내역</span
          >
        </div>

        <!-- 면접 결과 내역 -->
        <div class="flex flex-col items-center cursor-pointer group" @click="router.push('/company/InterviewResults')">
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
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <!-- 결과를 입력하지 않은 면접이 있을 경우 표시되는 배지 -->
            <div
              v-if="unwriteResults"
              class="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-red-500 text-white text-xs rounded-full"
            >
              {{ unwriteResults }}
            </div>
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

        <!-- 검색 필터 섹션 -->
        <div class="flex items-center gap-4 mb-6">
          <!-- 국적 필터 -->
          <div class="w-[300px]">
            <label class="block text-sm font-medium text-gray-700 mb-1">국적</label>
            <Select
              v-model="filters.nationality"
              :options="nationalityOptions"
              optionLabel="name"
              placeholder="--Select--"
              checkmark
              showClear
              class="w-full"
            />
          </div>

          <!-- 경력 필터 -->
          <div class="w-[300px]">
            <label class="block text-sm font-medium text-gray-700 mb-1">경력</label>
            <Select
              v-model="filters.experienceDurationMonth"
              :options="careerOptions"
              optionLabel="name"
              optionValue="code"
              placeholder="--Select--"
              checkmark
              showClear
              class="w-full"
            />
          </div>

          <!-- 성별 필터 -->
          <div class="w-[300px]">
            <label class="block text-sm font-medium text-gray-700 mb-1">성별</label>
            <Select
              v-model="filters.gender"
              :options="genderOptions"
              class="w-full"
              optionLabel="name"
              placeholder="--Select--"
              checkmark
              showClear
            />
          </div>
        </div>

        <!-- 로딩 중일 때 표시할 상태 -->
        <div v-if="isLoading" class="text-center py-12">
          <div class="flex flex-col items-center gap-4">
            <i class="pi pi-spin pi-spinner text-4xl text-[#8B8BF5]"></i>
            <p class="text-gray-600">북마크된 인재 정보를 조회중입니다...</p>
          </div>
        </div>

        <!-- 북마크된 인재가 없을 때 표시할 빈 상태 -->
        <div v-else-if="bookmarkedTalents.length === 0" class="text-center py-12">
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
        <div v-else-if="filteredBookmarks?.length === 0" class="text-center py-12">
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
                  <h3 class="text-lg font-bold notranslate">{{ talent?.userName }}</h3>
                  <span class="text-sm text-gray-600">{{ talent?.nationalityName }}</span>
                  <span class="bg-[#8B8BF5] bg-opacity-10 text-[#8B8BF5] px-3 py-1 rounded-full text-sm">
                    {{
                      talent?.experienceDurationMonth
                        ? '경력 ' +
                          parseInt(talent.experienceDurationMonth / 12) +
                          '년 ' +
                          (talent.experienceDurationMonth % 12) +
                          '개월'
                        : '신입'
                    }}
                  </span>
                </div>
                <p class="text-gray-600">
                  {{
                    talent?.schoolName
                      ? `${talent?.schoolName} ${talent?.major} ${talent?.isGraduated ? '졸업' : '재학중'}`
                      : '-'
                  }}
                </p>
              </div>
              <div class="flex flex-col items-end gap-3">
                <button @click="toggleBookmark(talent, true)" class="text-[#8B8BF5]">
                  <i class="pi pi-bookmark-fill"></i>
                </button>
                <span class="text-sm text-gray-500">
                  북마크 {{ ' : ' + talent?.createdAt?.slice(0, 10).replaceAll('-', '.') }}
                </span>
                <!-- 이력서 보기 버튼 추가 -->
                <button
                  @click="openResumeModal(talent)"
                  class="w-[140px] px-4 py-2 border border-[#8B8BF5] text-[#8B8BF5] rounded-lg hover:bg-gray-50"
                >
                  이력서 보기
                </button>
                <button
                  class="w-[140px] px-4 py-2 text-white rounded-lg transition-colors"
                  :class="
                    talent?.isInterviewOffered ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#8B8BF5] hover:bg-[#7A7AE6]'
                  "
                  :disabled="talent?.isInterviewOffered"
                  @click="openInterviewOffer(talent, true)"
                >
                  {{ talent?.isInterviewOffered ? '제안 완료' : '면접 제안' }}
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
      <!-- 로딩 중일 때 표시할 상태 -->
      <div v-if="isResumeLoading" class="flex flex-col items-center justify-center py-12">
        <i class="pi pi-spin pi-spinner text-4xl text-[#8B8BF5] mb-4"></i>
        <p class="text-gray-600">이력서 정보를 불러오는 중입니다...</p>
      </div>

      <!-- 이력서 내용 -->
      <div v-else>
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
                {{ selectedCandidate?.user?.hasCriminalRecord ? '있음' : '없음' }}
              </span>
              <span v-else class="text-[#8B8BF5]">면접 제안 수락 후 확인 가능</span>

              <span class="text-gray-600">한국어 능력</span>
              <span>{{ selectedCandidate?.user?.koreanProficiency?.name || '미입력' }}</span>
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
                  :src="selectedCandidate?.user?.profileImage"
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
          <h3 class="text-lg font-medium mb-4">국적</h3>
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
              <span class="text-gray-600 w-20">발급국가</span>
              <span>{{ selectedCandidate?.nationality?.name }}</span>
            </div>
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">만료일</span>
              <span>{{ selectedCandidate?.passportExpiryDt.slice(0, 10).replaceAll('-', '.') }}</span>
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
              <div class="text-gray-600">{{ career?.jobCategory?.name }} | {{ career.position }}</div>
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
          <div v-if="selectedCandidate?.educations?.length">
            <div
              v-for="(edu, index) in selectedCandidate?.educations"
              :key="index"
              class="mb-6 pb-6 border-b last:border-b-0"
            >
              <div class="text-[#8B8BF5] mb-2">{{ edu?.schoolName }} {{ `(${edu?.educationLevel?.name})` }}</div>
              <div class="text-gray-600">{{ edu?.major }}</div>
              <div class="text-gray-600">{{ `${edu?.startDt} ~ ${edu?.endDt ? edu?.endDt : '재학중'}` }}</div>
              <div class="whitespace-pre-line">{{ edu?.content }}</div>
            </div>
          </div>

          <div v-else class="text-center text-gray-500">등록된 학력이 없습니다</div>
        </div>

        <!-- 자격증 사항 -->
        <div class="mb-8 bg-gray-50 p-6 rounded-lg">
          <div class="flex items-center gap-2 mb-4">
            <h3 class="text-lg font-medium">자격증 사항</h3>
            <span class="text-sm text-[#8B8BF5] bg-[#8B8BF5] bg-opacity-10 px-2 py-1 rounded">
              {{
                selectedCandidate?.certifications?.length
                  ? '총 ' + selectedCandidate?.certifications?.length + '개 취득'
                  : '미취득'
              }}
            </span>
          </div>
          <div v-if="selectedCandidate?.certifications?.length" class="space-y-4">
            <div
              v-for="(cert, index) in selectedCandidate.certifications"
              :key="index"
              class="mb-4 pb-4 border-b last:border-b-0"
            >
              <div class="font-medium mb-1">{{ cert?.name }}</div>
              <div class="font-medium mb-1">발급기관 : {{ cert?.issuer }}</div>
              <div class="text-gray-600">취득일 : {{ cert?.acquiredDt.slice(0, 10).replaceAll('-', '.') }}</div>
            </div>
          </div>

          <div v-else class="text-center text-gray-500">등록된 자격증이 없습니다</div>
        </div>
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
          class="bt_btn primary transition-colors"
          :class="selectedCandidate?.isInterviewOffered ? 'bg-gray-400' : 'bg-[#8B8BF5] hover:bg-[#7A7AE6]'"
          :disabled="selectedCandidate?.isInterviewOffered"
          @click="openInterviewOffer(selectedCandidate, false)"
        >
          {{ selectedCandidate?.isInterviewOffered ? '제안 완료' : '면접 제안' }}
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
