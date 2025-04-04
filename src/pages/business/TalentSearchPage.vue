<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import { getCodeList } from '@/apis/common/commonApis';
import { getResumeList } from '@/apis/owner/ownerApis';

const router = useRouter();

const showResumeModal = ref(false);
const selectedCandidate = ref(null);
const isAccepted = ref(false);

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

// 임시 인재 데이터
const talents = ref([]);

onMounted(() => {
  getNationCode();
  getJobCategoryCode();
  getCareerPeriodCode();
  setGenderCode();

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

// 성별 세팅
const setGenderCode = async () => {
  const response = await getCodeList(`GENDER_TY`);

  response.map((item) => {
    genderOptions.value.push({ name: `${item.name}성`, code: item.code });
  });
};

const openResumeModal = (candidate) => {
  selectedCandidate.value = candidate;
  showResumeModal.value = true;
};

const toggleBookmark = (talent) => {
  talent.isBookmarked = !talent.isBookmarked;
};

const openInterviewOffer = (talent) => {
  if (talent.isInterviewOffered) return;
  router.push(`/business/interview-offer/create/${talent.id}`);
  talent.isInterviewOffered = true;

  // 모달이 열려있는 경우 selectedCandidate도 업데이트
  if (selectedCandidate.value?.id === talent.id) {
    selectedCandidate.value.isInterviewOffered = true;
  }
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

  const response = await getResumeList(queryList.join('&'));

  talents.value = response.contents;

  console.log(talents.value);
};

// 필터링된 후보자 목록
// const filteredCandidates = computed(() => {
//   return talents.value.filter((candidate) => {
//     // 국적 필터
//     const nationalityMatch = !filters.value.nationalityCd || candidate.nationality.code === filters.value.nationalityCd;

//     // 경력 필터
//     const careerMatch = !filters.value.careerHistory || candidate.careerHistory === filters.value.careerHistory.name;

//     // 직무 카테고리 필터
//     const categoryMatch = !filters.value.jobCategoryCd || candidate.jobCategory.code === filters.value.jobCategoryCd;

//     // 성별 필터
//     const genderMatch = !filters.value.genderCd || candidate.gender === filters.value.genderCd;

//     return categoryMatch && nationalityMatch && careerMatch && genderMatch;
//   });
// });

// 향후 일괄 선택을 위한 상태만 준비
const selectedTalentIds = ref([]);

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

// 총 경력 계산 함수
const calculateTotalCareer = (careers) => {
  if (!careers?.length) return '0년';

  let totalMonths = 0;

  careers.forEach((career) => {
    const [start, end] = career.period.split(' - ');
    const startDate = new Date(start.split('.').join('-'));
    const endDate = end === '현재' ? new Date() : new Date(end.split('.').join('-'));

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
  <div class="max-w-[1200px] mx-auto px-4 py-12">
    <!-- 헤더 -->
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center gap-4">
        <i
          class="pi pi-angle-left text-4xl text-gray-600 cursor-pointer transition-colors hover:text-[#8FA1FF]"
          @click="router.back()"
        ></i>
        <h1 class="text-3xl font-bold">인재 검색</h1>
      </div>
    </div>

    <!-- 검색 필터 섹션 -->
    <div class="bg-white p-6 rounded-lg shadow-sm mb-6">
      <div class="flex items-center gap-4">
        <!-- 국적 필터 -->
        <div class="w-[200px]">
          <label class="block text-sm font-medium text-gray-700 mb-1">국적</label>
          <Select
            v-model="filters.nationalityCd"
            :options="nationalityOptions"
            class="w-full"
            optionLabel="name"
            optionValue="code"
            placeholder="--Select--"
            showClear
          />
        </div>

        <!-- 경력 필터 -->
        <div class="w-[150px]">
          <label class="block text-sm font-medium text-gray-700 mb-1">경력</label>
          <Select
            v-model="filters.careerHistory"
            :options="careerOptions"
            class="w-full"
            optionLabel="name"
            optionValue="code"
            placeholder="--Select--"
            showClear
          />
        </div>

        <!-- 직무 카테고리 필터 -->
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
        <div class="w-[200px]">
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
    </div>

    <!-- 인재 목록 -->
    <div class="grid grid-cols-1 gap-4">
      <div v-if="talents.length === 0" class="bg-white rounded-lg p-6 shadow-sm text-center text-gray-500">
        등록된 인재가 없습니다.
      </div>
      <div
        v-else
        v-for="talent in talents"
        :key="talent.id"
        class="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200"
      >
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-3">
              <h3 class="text-lg font-bold">{{ talent?.user?.name }}</h3>
              <span class="text-sm text-gray-600">{{ talent?.passportCountry?.name }}</span>
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

            <div class="text-gray-600">
              <!-- <p>{{ talent?.education[0].school }} · {{ talent?.education[0].major }}</p> -->
            </div>
          </div>

          <div class="flex flex-col items-end gap-3">
            <button
              @click="toggleBookmark(talent)"
              :class="['hover:text-[#8B8BF5]', talent.isBookmarked ? 'text-[#8B8BF5]' : 'text-gray-400']"
            >
              <i :class="['pi', talent.isBookmarked ? 'pi-bookmark-fill' : 'pi-bookmark']"></i>
            </button>
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
              :class="talent.isInterviewOffered ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#8B8BF5] hover:bg-[#7A7AE6]'"
            >
              {{ talent.isInterviewOffered ? '제안 완료' : '면접 제안하기' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- 이력서 상세 모달 -->
    <Dialog v-model:visible="showResumeModal" :modal="true" :style="{ width: '80vw' }" :maximizable="true">
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
              <span>{{ selectedCandidate?.name }}</span>
              <span class="text-gray-600">생년월일</span>
              <span>{{ selectedCandidate?.birth }}</span>
              <span class="text-gray-600">성별</span>
              <span>{{ selectedCandidate?.gender }}</span>
              <span class="text-gray-600">휴대폰</span>
              <span>{{ isAccepted ? selectedCandidate?.mobile : '면접 제안 수락 후 확인 가능' }}</span>
              <span class="text-gray-600">이메일</span>
              <span>{{ isAccepted ? selectedCandidate?.email : '면접 제안 수락 후 확인 가능' }}</span>
              <span class="text-gray-600">주소</span>
              <span>{{ isAccepted ? selectedCandidate?.address : '면접 제안 수락 후 확인 가능' }}</span>
            </div>

            <!-- 가운데 컬럼 -->
            <div class="grid grid-cols-[100px_auto] gap-y-2 text-sm text-gray-600">
              <span class="text-gray-600">범죄경력</span>
              <span v-if="isAccepted" class="flex items-center gap-2">
                <i class="pi pi-file-pdf text-red-500"></i>
                {{ selectedCandidate?.criminalRecordFile?.name || '미제출' }}
              </span>
              <span v-else>면접 제안 수락 후 확인 가능</span>

              <span class="text-gray-600">한국어능력</span>
              <span>{{ selectedCandidate?.koreanProficiency || '미입력' }}</span>
              <span class="text-gray-600">학습기간</span>
              <span>{{ selectedCandidate?.koreanStudyPeriod || '미입력' }}</span>
              <span class="text-gray-600">한국방문경험</span>
              <span>{{ selectedCandidate?.hasVisitedKorea || '미입력' }}</span>
              <span class="text-gray-600">혼인여부</span>
              <span>{{ selectedCandidate?.isMarried || '미입력' }}</span>
            </div>

            <!-- 프로필 사진 (오른쪽) -->
            <div class="flex flex-col items-center">
              <div class="w-[140px] h-[180px] bg-gray-100 rounded-lg overflow-hidden">
                <img
                  v-if="selectedCandidate?.profileImage?.exists"
                  :src="selectedCandidate.profileImage.url"
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
          <div
            v-for="(career, index) in selectedCandidate?.careers"
            :key="index"
            class="mb-4 pb-4 border-b last:border-b-0"
          >
            <div class="flex items-center gap-2">
              <div class="font-medium">{{ career.company }}</div>
              <span class="text-sm text-gray-500">({{ calculateCareerPeriod(career.period) }})</span>
            </div>
            <div class="text-gray-600">{{ career.period }}</div>
            <div class="text-gray-600">{{ career.jobCategory.name }} | {{ career.position }}</div>
            <div class="mt-2 whitespace-pre-line">{{ career.description }}</div>
          </div>
        </div>

        <!-- 학력 사항 -->
        <div class="mb-8 bg-gray-50 p-6 rounded-lg">
          <div class="mb-4">
            <h3 class="text-lg font-medium">학력 사항</h3>
          </div>
          <div v-if="selectedCandidate?.education?.length">
            <div class="text-[#8B8BF5] mb-4">
              최종학력: {{ selectedCandidate.education[0].school }} ({{ selectedCandidate.education[0].type }})
            </div>
            <div
              v-for="(edu, index) in selectedCandidate.education"
              :key="index"
              class="mb-6 pb-6 border-b last:border-b-0"
            >
              <div class="text-[#8B8BF5] mb-2">{{ edu.school }} ({{ edu.type }})</div>
              <div class="text-gray-600">{{ edu.major }}</div>
              <div class="text-gray-600">{{ edu.period }}</div>
              <div class="whitespace-pre-line">{{ edu.description }}</div>
            </div>
          </div>
        </div>

        <!-- 자격증 사항 -->
        <div class="mb-8 bg-gray-50 p-6 rounded-lg">
          <div class="mb-4">
            <h3 class="text-lg font-medium">자격증 사항</h3>
          </div>
          <div v-if="selectedCandidate?.certificates?.length" class="space-y-4">
            <div
              v-for="(cert, index) in selectedCandidate.certificates"
              :key="index"
              class="mb-4 pb-4 border-b last:border-b-0"
            >
              <div class="font-medium mb-1">{{ cert.name }}</div>
              <div class="text-gray-600">취득일: {{ cert.issuedDate }}</div>
            </div>
          </div>
          <div v-else class="text-center text-gray-500">등록된 자격증이 없습니다</div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-4">
          <Button
            @click="toggleBookmark(selectedCandidate)"
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
  </div>
</template>

<style scoped>
:deep(.p-dropdown),
:deep(.p-multiselect) {
  width: 100%;
}

:deep(.p-dropdown-panel),
:deep(.p-multiselect-panel) {
  width: 100%;
}
</style>
