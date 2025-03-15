<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';

const router = useRouter();

// 면접 목록 데이터
const interviews = ref([
  {
    id: 1,
    company: {
      name: '(주)테크솔루션',
      logo: '/images/company-logo.png'
    },
    jobCategory: { label: 'IT개발·데이터', value: 'it' },
    position: 'Frontend Developer',
    interviewDate: '2024-03-22',
    interviewType: 'online',
    result: 'passed', // passed, failed, pending, null
    feedback: '기술력이 우수하고 커뮤니케이션 능력이 뛰어남',
    resultUpdatedAt: '2024-03-23'
  },
  {
    id: 2,
    company: {
      name: '(주)비티포탈',
    },
    jobCategory: { label: 'IT개발·데이터', value: 'it' },
    position: 'Frontend Developer',
    interviewDate: '2024-03-15',
    interviewType: 'offline',
    result: 'failed',
    feedback: '기술 스택이 부족하고 프로젝트 경험이 저희가 찾는 방향과 맞지 않아 아쉽습니다. 더 많은 실무 경험을 쌓으신 후 다시 지원해주시면 좋을 것 같습니다.',
    resultUpdatedAt: '2024-03-16'
  }
  // ... 다른 면접 데이터
]);

// 필터 상태 추가
const selectedFilter = ref('all'); // 'all', 'passed', 'failed'

// 필터 옵션
const filterOptions = [
  { label: '전체', value: 'all' },
  { label: '합격', value: 'passed' },
  { label: '불합격', value: 'failed' }
];

// 필터링된 면접 목록
const filteredInterviews = computed(() => {
  if (selectedFilter.value === 'all') {
    return interviews.value;
  }
  return interviews.value.filter(interview => interview.result === selectedFilter.value);
});

// 결과에 따른 스타일과 텍스트
const getResultInfo = (result) => {
  switch (result) {
    case 'passed':
      return {
        text: '합격',
        class: 'bg-green-50 text-green-600'
      };
    case 'failed':
      return {
        text: '불합격',
        class: 'bg-red-50 text-red-600'
      };
    case 'pending':
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
        :key="option.value"
        @click="selectedFilter = option.value"
        :class="[
          'px-4 py-2 rounded-full text-sm transition-colors',
          selectedFilter === option.value
            ? 'bg-[#8B8BF5] text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        ]"
      >
        {{ option.label }}
        <!-- 각 상태의 개수 표시 -->
        <span class="ml-1" v-if="option.value !== 'all'">
          ({{ interviews.filter(interview => interview.result === option.value).length }})
        </span>
        <!-- 전체 개수 표시 -->
        <span class="ml-1" v-else>
          ({{ interviews.length }})
        </span>
      </button>
    </div>

    <!-- 면접 목록 (filteredInterviews로 변경) -->
    <div class="grid grid-cols-1 gap-4">
      <div v-for="interview in filteredInterviews" :key="interview.id"
        class="bg-white rounded-lg p-6 shadow-sm">
        <div class="flex justify-between items-start mb-4">
          <!-- 회사 정보 -->
          <div>
            <h3 class="text-lg font-bold mb-1">{{ interview.company.name }}</h3>
          </div>

          <!-- 면접 결과 -->
          <div v-if="isInterviewCompleted(interview)" class="text-right">
            <div v-if="interview.result && interview.result !== 'pending'" 
              class="mb-2"
            >
              <span :class="`px-3 py-1 rounded-full text-sm ${getResultInfo(interview.result).class}`">
                {{ getResultInfo(interview.result).text }}
              </span>
            </div>
            <div v-if="interview.resultUpdatedAt" class="text-sm text-gray-500">
              결과 발표일: {{ interview.resultUpdatedAt }}
            </div>
          </div>
        </div>

        <!-- 면접 정보 -->
        <div class="border-t pt-4">
          <div class="mb-3">
            <h4 class="font-medium text-gray-900 mb-1">직무 · 제안 포지션</h4>
            <p class="text-gray-600">
              {{ interview.jobCategory?.label || 'IT개발·데이터' }} | {{ interview.position }}
            </p>
          </div>
          
          <div class="mb-3">
            <h4 class="font-medium text-gray-900 mb-1">면접 일시</h4>
            <p class="text-gray-600">{{ interview.interviewDate }}</p>
          </div>
          <div class="mb-3">
            <h4 class="font-medium text-gray-900 mb-1">면접 방식</h4>
            <p class="text-gray-600">
              {{ interview.interviewType === 'online' ? '화상 면접' : '대면 면접' }}
            </p>
          </div>
          <!-- 합격/불합격 피드백 표시 -->
          <div v-if="interview.result && interview.result !== 'pending' && interview.feedback">
            <h4 class="font-medium text-gray-900 mb-1">피드백</h4>
            <p class="text-gray-600">{{ interview.feedback }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 필터링된 결과가 없을 때 표시할 메시지 -->
    <div v-if="filteredInterviews.length === 0" class="text-center py-12">
      <div class="text-gray-500">
        <i class="pi pi-inbox text-4xl mb-4"></i>
        <p class="text-lg">해당하는 면접 결과가 없습니다</p>
      </div>
    </div>
  </div>
</template>