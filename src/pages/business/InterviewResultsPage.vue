<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import InputTextarea from 'primevue/textarea';

const router = useRouter();

// 면접 결과 상태 옵션
const resultOptions = [
  { label: '합격', value: 'passed' },
  { label: '불합격', value: 'failed' },
  { label: '보류', value: 'pending' }
];

// 면접 완료된 후보자 목록
const interviewResults = ref([
  {
    id: 1,
    candidate: {
      name: '최예지',
      nationality: '베트남',
      career: '5년',
      education: {
        school: '한국대학교',
        major: '컴퓨터공학과'
      }
    },
    position: 'Frontend Developer',
    interviewDate: '2024-03-22',
    interviewType: 'online',
    result: null,
    feedback: '',
    interviewCompletedDate: '2024-03-22',
    updatedAt: null
  },
  {
    id: 2,
    candidate: {
      name: '김철수',
      nationality: '중국',
      career: '3년',
      education: {
        school: '베이징대학교',
        major: '소프트웨어공학'
      }
    },
    position: 'Backend Developer',
    interviewDate: '2024-03-21',
    interviewType: 'offline',
    result: 'failed',
    feedback: '기술 스택이 부족하고 의사소통에 어려움이 있음',
    updatedAt: '2024-03-21'
  }
]);

// 결과 수정 모달 관련 상태
const showResultModal = ref(false);
const selectedInterview = ref(null);
const editResult = ref(null);
const editFeedback = ref('');

// 결과 수정 모달 열기
const openResultModal = (interview) => {
  selectedInterview.value = interview;
  editResult.value = interview.result;
  editFeedback.value = interview.feedback;
  showResultModal.value = true;
};

// 결과 저장
const saveResult = () => {
  if (!editResult.value) {
    alert('면접 결과를 선택해주세요.');
    return;
  }

  if (selectedInterview.value) {
    selectedInterview.value.result = editResult.value;
    selectedInterview.value.feedback = editFeedback.value;
    selectedInterview.value.updatedAt = new Date().toISOString().split('T')[0];
    showResultModal.value = false;
    
    // 상태 초기화
    editResult.value = null;
    editFeedback.value = '';
    selectedInterview.value = null;
  }
};

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
      return {
        text: '보류',
        class: 'bg-yellow-50 text-yellow-600'
      };
    default: // null이거나 다른 값일 경우
      return {
        text: '결과 미입력',
        class: 'bg-gray-50 text-gray-600'
      };
  }
};

// 필터 상태 추가
const selectedFilter = ref('all');

// 필터 옵션
const filterOptions = [
  { label: '전체', value: 'all' },
  { label: '결과 미입력', value: 'none' },
  { label: '합격', value: 'passed' },
  { label: '불합격', value: 'failed' },
  { label: '보류', value: 'pending' }
];

// 필터링된 결과 목록
const filteredResults = computed(() => {
  if (selectedFilter.value === 'all') {
    return interviewResults.value;
  }
  if (selectedFilter.value === 'none') {
    return interviewResults.value.filter(interview => interview.result === null);
  }
  return interviewResults.value.filter(interview => interview.result === selectedFilter.value);
});
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
        <h1 class="text-3xl font-bold">면접 결과 관리</h1>
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
          ({{ 
            option.value === 'none' 
              ? interviewResults.filter(interview => interview.result === null).length 
              : interviewResults.filter(interview => interview.result === option.value).length 
          }})
        </span>
        <!-- 전체 개수 표시 -->
        <span class="ml-1" v-else>
          ({{ interviewResults.length }})
        </span>
      </button>
    </div>

    <!-- 결과 목록 (filteredResults로 변경) -->
    <div class="grid grid-cols-1 gap-4">
      <!-- 필터링된 결과가 없을 때 표시할 메시지 -->
      <div v-if="filteredResults.length === 0" class="bg-white rounded-lg p-12 shadow-sm text-center">
        <div class="flex flex-col items-center gap-4">
          <div class="w-16 h-16 rounded-full bg-[#8B8BF5] bg-opacity-10 flex items-center justify-center mb-2">
            <i class="pi pi-users text-[#8B8BF5] text-3xl"></i>
          </div>
          <h3 class="text-xl font-medium text-gray-900">해당하는 면접 결과가 없습니다</h3>
        </div>
      </div>

      <!-- 기존 결과 목록 (filteredResults 사용) -->
      <div v-else v-for="interview in filteredResults" :key="interview.id"
        class="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200">
        <div class="flex justify-between items-start mb-4">
          <div class="flex items-center gap-3">
            <h3 class="text-lg font-bold">{{ interview.candidate.name }}</h3>
            <span class="text-sm text-gray-600">{{ interview.candidate.nationality }}</span>
            <span class="bg-[#8B8BF5] bg-opacity-10 text-[#8B8BF5] px-3 py-1 rounded-full text-sm">
              경력 {{ interview.candidate.career }}
            </span>
            <span v-if="interview.result !== null" :class="`px-3 py-1 rounded-full text-sm ${getResultInfo(interview.result).class}`">
              {{ getResultInfo(interview.result).text }}
            </span>
            <span v-else class="px-3 py-1 rounded-full text-sm bg-gray-50 text-gray-600">
              결과 미입력
            </span>
          </div>
          <div class="text-sm text-gray-500">
            면접일: {{ interview.interviewDate }}
          </div>
        </div>

        <div class="mb-4">
          <p class="text-gray-600">
            {{ interview.candidate.education.school }} · {{ interview.candidate.education.major }}
          </p>
        </div>

        <div class="border-t pt-4">
          <div class="mb-3">
            <h4 class="font-medium text-gray-900 mb-1">제안 포지션</h4>
            <p class="text-gray-600">{{ interview.position }}</p>
          </div>
          <div class="mb-3">
            <h4 class="font-medium text-gray-900 mb-1">면접 방식</h4>
            <p class="text-gray-600">{{ interview.interviewType === 'online' ? '화상 면접' : '대면 면접' }}</p>
          </div>
          <div v-if="interview.updatedAt" class="mb-3">
            <h4 class="font-medium text-gray-900 mb-1">결과 발표일</h4>
            <p class="text-gray-600">{{ interview.updatedAt }}</p>
          </div>
          <div>
            <h4 class="font-medium text-gray-900 mb-1">면접 피드백</h4>
            <p class="text-gray-600">{{ interview.feedback || '아직 입력된 피드백이 없습니다.' }}</p>
          </div>
        </div>

        <div class="mt-4 flex justify-end">
          <Button 
            @click="openResultModal(interview)"
            class="bg-[#8B8BF5] text-white"
          >
            {{ interview.result === null ? '면접 결과 입력' : '결과 수정' }}
          </Button>
        </div>
      </div>
    </div>

    <!-- 결과 수정 모달 -->
    <Dialog 
      v-model:visible="showResultModal"
      modal
      header="면접 결과 수정"
      :style="{ width: '500px' }"
    >
      <div class="p-4 space-y-4">
        <div>
          <label class="block font-medium mb-2">면접 결과</label>
          <Dropdown
            v-model="editResult"
            :options="resultOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="결과 선택"
            class="w-full"
          />
        </div>

        <div>
          <label class="block font-medium mb-2">피드백</label>
          <InputTextarea
            v-model="editFeedback"
            rows="4"
            class="w-full"
            placeholder="면접 피드백을 입력해주세요"
          />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <Button 
            @click="showResultModal = false"
            class="p-button-text"
          >
            취소
          </Button>
          <Button 
            @click="saveResult"
            class="bg-[#8B8BF5]"
          >
            저장
          </Button>
        </div>
      </template>
    </Dialog>
  </div>
</template> 