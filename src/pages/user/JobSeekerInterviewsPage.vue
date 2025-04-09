<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import { useDateFormatter } from '@/plugins/commonutils';
import { getCodeList } from '@/apis/common/commonApis';
import { getOfferListByUser } from '@/apis/user/userApis';

const router = useRouter();
const dateFormatter = useDateFormatter();

// 면접 목록 데이터
const offerCompanies = ref([]);

// 필터 상태 추가
const selectedFilter = ref('all'); // 'all', 'passed', 'failed'

// 전체 직무 카테고리 옵션
const jobCategoryOptions = ref([]);

// TODO: 인터뷰 결과 코드 API 연동
// 필터 옵션
const filterOptions = [
  { name: '전체', code: 'all' },
  { name: '합격', code: 'INTERVIEW_RESULT_1' },
  { name: '불합격', code: 'INTERVIEW_RESULT_2' }
];

onMounted(() => {
  getJobCategoryCode();

  getOfferResult();
});

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

// 면접 결과 현황 리스트 조회
const getOfferResult = async () => {
  const response = await getOfferListByUser();

  offerCompanies.value = response.contents.filter((com) => {
    return ['INTERVIEW_RESULT_1', 'INTERVIEW_RESULT_2'].includes(com?.resultCd);
  });
};

// 필터링된 면접 목록
const filteredInterviews = computed(() => {
  return offerCompanies.value.filter(
    (interview) => selectedFilter.value === 'all' || interview.resultCd === selectedFilter.value
  );
});

// 결과에 따른 스타일과 텍스트
const getResultInfo = (resultCd) => {
  switch (resultCd) {
    case 'INTERVIEW_RESULT_1':
      return {
        text: '합격',
        class: 'bg-green-100 text-green-600'
      };
    case 'INTERVIEW_RESULT_2':
      return {
        text: '불합격',
        class: 'bg-red-100 text-red-600'
      };
    case 'INTERVIEW_RESULT_3':
      return null; // 보류는 구직자에게 표시하지 않음
    default:
      return {
        text: '결과 대기중',
        class: 'bg-gray-50 text-gray-600'
      };
  }
};

// 면접 완료 여부 확인
const isInterviewCompleted = (interview) => {
  const interviewDate = new Date(interview.interviewDate);
  const today = new Date();
  return interviewDate < today;
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
        <h1 class="text-3xl font-bold">내 면접 현황</h1>
      </div>
    </div>

    <!-- 필터 버튼 그룹 추가 -->
    <div class="flex gap-2 mb-6">
      <button
        v-for="option in filterOptions"
        :key="option.code"
        @click="selectedFilter = option.code"
        :class="[
          'px-4 py-2 rounded-full text-sm transition-colors',
          selectedFilter === option.code ? 'bg-[#8B8BF5] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        ]"
      >
        {{ option.name }}
        <!-- 각 상태의 개수 표시 -->
        <span class="ml-1" v-if="option.code !== 'all'">
          ({{ offerCompanies.filter((interview) => interview.resultCd === option.code).length }})
        </span>
        <!-- 전체 개수 표시 -->
        <span class="ml-1" v-else> ({{ offerCompanies.length }}) </span>
      </button>
    </div>

    <!-- 면접 목록 -->
    <div class="grid grid-cols-1 gap-4">
      <div v-for="interview in filteredInterviews" :key="interview.id" class="bg-white rounded-lg p-6 shadow-sm">
        <div class="flex justify-between items-start mb-4">
          <!-- 회사 정보 -->
          <div>
            <h3 class="text-lg font-bold mb-1">{{ interview.company.name }}</h3>
          </div>

          <!-- 면접 결과 -->
          <div v-if="interview?.result && interview?.resultCd !== 'INTERVIEW_RESULT_3'" class="text-right">
            <div class="mb-2">
              <span :class="`px-3 py-1 rounded-full text-sm ${getResultInfo(interview.resultCd).class}`">
                {{ getResultInfo(interview?.resultCd).text }}
              </span>
            </div>
            <div class="text-sm text-gray-500">결과 발표일: {{ dateFormatter.halfDate(interview?.updatedAt) }}</div>
          </div>
        </div>

        <!-- 면접 정보 -->
        <div class="border-t pt-4">
          <div class="mb-4">
            <h4 class="text-base font-bold text-gray-900 mb-2">직무 · 제안 포지션</h4>
            <p class="text-gray-600">
              {{
                interview?.jobCategoryCd === 'JOB_22'
                  ? `기타(${interview?.customJobCategory})`
                  : convertJobCode(interview?.jobCategoryCd)
              }}
              | {{ interview?.position }}
            </p>
          </div>

          <div class="mb-4">
            <h4 class="text-base font-bold text-gray-900 mb-2">면접 일시</h4>
            <p class="text-gray-600">
              {{ interview?.interviewTime?.slice(0, 10).replaceAll('-', '.') }} |
              {{ interview?.interviewTime?.slice(11, 16) }}
            </p>
          </div>

          <div class="mb-4">
            <h4 class="text-base font-bold text-gray-900 mb-2">면접 방식</h4>
            <p class="text-gray-600">
              {{ interview?.interviewType?.name }}
            </p>
          </div>

          <!-- 합격/불합격 피드백 표시 -->
          <div v-if="interview?.result && interview?.resultCd !== 'INTERVIEW_RESULT_3' && interview?.resultMemo">
            <h4 class="text-base font-bold text-gray-900 mb-2">{{ interview?.result?.value ? '메세지' : '피드백' }}</h4>
            <p class="text-gray-600 whitespace-pre-line">{{ interview?.resultMemo }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 필터링된 결과가 없을 때 표시할 메시지 -->
    <div v-if="filteredInterviews.length === 0" class="p-8 text-center border border-gray-100 rounded-lg bg-gray-50">
      <svg
        class="w-12 h-12 text-gray-400 mx-auto mb-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <p class="text-gray-500 font-medium">해당하는 면접 결과가 없습니다</p>
      <p class="text-gray-400 text-sm mt-1">면접이 완료되면 여기에 결과가 표시됩니다</p>
    </div>
  </div>
</template>
