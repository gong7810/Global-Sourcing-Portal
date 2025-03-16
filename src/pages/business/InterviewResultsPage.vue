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

// 면접 완료된 후보자 목록 데이터 구조 수정
const interviewResults = ref([
  {
    id: 1,
    candidate: {
      name: '최예지',
      nationality: '베트남',
      career: '5년',
      birth: '1996.09.01',
      gender: '여성',
      phone: '010-1234-7496',
      email: 'yeji@naver.com',
      address: '홍스타워 505호',
      passportName: 'CHOI YEJI',
      visaInfo: {
        type: 'M1234****',
        country: '대한민국',
        expiryDate: '2030-01-01'
      },
      careerHistory: [
        {
          company: '(주)비티로봇',
          period: '2023.03 - 2024.03',
          position: '프론트엔드 개발자/개발팀',
          description: '웹 서비스 프론트엔드 개발'
        }
      ],
      education: {
        school: '한국대학교',
        degree: '대학교(4년)',
        major: '컴퓨터공학과',
        period: '2015.03 - 2019.02',
        description: '컴퓨터공학과 활동'
      }
    },
    jobCategory: { label: 'IT개발·데이터', value: 'it' },
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
      birth: '1997.05.15',
      gender: '남성',
      phone: '010-2345-6789',
      email: 'kim@example.com',
      address: '서울시 서초구 서초대로 456',
      passportName: 'KIM CHEOLSOO',
      visaInfo: {
        type: 'M5678****',
        country: '중국',
        expiryDate: '2027-05-15'
      },
      careerHistory: [
        {
          company: '(주)데이터테크',
          period: '2021.01 - 2024.03',
          jobCategory: { label: 'IT개발·데이터', value: 'it' },
          position: '백엔드 개발자 | 서버개발팀',
          description: '백엔드 서버 개발 및 운영\n- Spring Boot 기반 REST API 개발\n- MSA 아키텍처 설계 및 구현\n- 대용량 데이터 처리 시스템 구축'
        }
      ],
      education: {
        school: '베이징대학교',
        degree: '대학교(4년)',
        major: '소프트웨어공학',
        period: '2016.09 - 2020.08',
        description: '학점 3.8/4.0\n클라우드 컴퓨팅 연구실 인턴\n교내 프로그래밍 대회 2위'
      }
    },
    jobCategory: { label: 'IT개발·데이터', value: 'it' },
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

// 상세 정보 모달 관련 상태 추가
const showDetailModal = ref(false);
const selectedDetailInterview = ref(null);

// 상세 정보 모달 열기 함수
const openDetailModal = (interview) => {
  selectedDetailInterview.value = interview;
  showDetailModal.value = true;
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
          <div class="mb-4">
            <h4 class="text-base font-bold text-gray-900 mb-2">직무 · 제안 포지션</h4>
            <p class="text-gray-600">
              {{ interview.jobCategory?.label || 'IT개발·데이터' }} | {{ interview.position }}
            </p>
          </div>

          <div class="mb-4">
            <h4 class="text-base font-bold text-gray-900 mb-2">면접 방식</h4>
            <p class="text-gray-600">{{ interview.interviewType === 'online' ? '화상 면접' : '대면 면접' }}</p>
          </div>

          <div v-if="interview.updatedAt" class="mb-4">
            <h4 class="text-base font-bold text-gray-900 mb-2">결과 발표일</h4>
            <p class="text-gray-600">{{ interview.updatedAt }}</p>
          </div>

          <div class="mb-4">
            <h4 class="text-base font-bold text-gray-900 mb-2">면접 피드백</h4>
            <p class="text-gray-600">{{ interview.feedback || '아직 입력된 피드백이 없습니다.' }}</p>
          </div>
        </div>

        <div class="mt-4 flex justify-between items-center">
          <!-- 상세 정보 보기 버튼 추가 -->
          <button
            class="text-[#8B8BF5] hover:text-[#7A7AE6] flex items-center gap-1"
            @click="openDetailModal(interview)"
          >
            <span>상세 정보 보기</span>
            <i class="pi pi-arrow-right text-sm"></i>
          </button>
          
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
      :header="selectedInterview?.result === null ? '면접 결과 입력' : '면접 결과 수정'"
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
            {{ selectedInterview?.result === null ? '입력' : '수정' }}
          </Button>
        </div>
      </template>
    </Dialog>

    <!-- 상세 정보 모달 추가 -->
    <Dialog 
      v-model:visible="showDetailModal"
      modal
      :style="{ width: '80vw', maxHeight: '90vh' }"
      :header="'제안 당시 이력서 정보'"
      :closable="true"
      :closeOnEscape="true"
    >
      <div v-if="selectedDetailInterview" class="p-4">
        <div class="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 class="text-lg font-bold mb-4">기본 정보</h3>
          <div class="grid grid-cols-2 gap-y-4">
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">이름</span>
              <span>{{ selectedDetailInterview.candidate.name }}</span>
            </div>
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">생년월일</span>
              <span>{{ selectedDetailInterview.candidate.birth || '-' }}</span>
            </div>
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">성별</span>
              <span>{{ selectedDetailInterview.candidate.gender || '-' }}</span>
            </div>
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">휴대폰</span>
              <span>{{ selectedDetailInterview.candidate.phone || '-' }}</span>
            </div>
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">이메일</span>
              <span>{{ selectedDetailInterview.candidate.email || '-' }}</span>
            </div>
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">주소</span>
              <span>{{ selectedDetailInterview.candidate.address || '-' }}</span>
            </div>
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">경력</span>
              <span>{{ selectedDetailInterview.candidate.career }}</span>
            </div>
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">학력</span>
              <span>{{ selectedDetailInterview.candidate.education?.degree || '-' }}</span>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 class="text-lg font-bold mb-4">국가</h3>
          <div>
            <span>{{ selectedDetailInterview.candidate.visaInfo?.country || selectedDetailInterview.candidate.nationality }}</span>
          </div>
        </div>

        <div class="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 class="text-lg font-bold mb-4">여권</h3>
          <div v-if="selectedDetailInterview.candidate.passportName || selectedDetailInterview.candidate.visaInfo" class="grid gap-y-4">
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">이름</span>
              <span>{{ selectedDetailInterview.candidate.passportName || '-' }}</span>
            </div>
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">여권번호</span>
              <span>{{ selectedDetailInterview.candidate.visaInfo?.type || '-' }}</span>
            </div>
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">국적</span>
              <span>{{ selectedDetailInterview.candidate.visaInfo?.country || selectedDetailInterview.candidate.nationality }}</span>
            </div>
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">만료일</span>
              <span>{{ selectedDetailInterview.candidate.visaInfo?.expiryDate || '-' }}</span>
            </div>
          </div>
          <div v-else class="text-center text-gray-500">
            등록된 여권 정보가 없습니다
          </div>
        </div>

        <div class="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 class="text-lg font-bold mb-4">경력 사항</h3>
          <div v-if="selectedDetailInterview.candidate.careerHistory?.length">
            <div v-for="(career, index) in selectedDetailInterview.candidate.careerHistory" 
              :key="index" 
              class="mb-4"
            >
              <div class="font-medium">{{ career.company }}</div>
              <div class="text-gray-600">{{ career.period }}</div>
              <div class="text-gray-600">{{ career.position.replace('/', ' | ') }}</div>
              <div class="mt-2">{{ career.description }}</div>
            </div>
          </div>
          <div v-else class="text-center text-gray-500">
            등록된 경력 사항이 없습니다
          </div>
        </div>

        <div class="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 class="text-lg font-bold mb-4">학력 사항</h3>
          <div v-if="selectedDetailInterview.candidate.education">
            <div class="mb-2">{{ selectedDetailInterview.candidate.education.school }}</div>
            <div class="text-gray-600">{{ selectedDetailInterview.candidate.education.degree || '-' }}</div>
            <div class="text-gray-600">{{ selectedDetailInterview.candidate.education.major }}</div>
            <div class="text-gray-600">{{ selectedDetailInterview.candidate.education.period || '-' }}</div>
            <div>{{ selectedDetailInterview.candidate.education.description || '-' }}</div>
          </div>
          <div v-else class="text-center text-gray-500">
            등록된 학력 사항이 없습니다
          </div>
        </div>

        <div class="bg-gray-50 p-6 rounded-lg">
          <h3 class="text-lg font-bold mb-4">자격증 사항</h3>
          <div class="text-center text-gray-500">
            등록된 자격증이 없습니다
          </div>
        </div>
      </div>
    </Dialog>
  </div>
</template> 