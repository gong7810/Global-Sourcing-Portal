<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import InputTextarea from 'primevue/textarea';
import { useMessagePop } from '@/plugins/commonutils';
import InterviewResultsDetailModal from '@/components/modal/InterviewResultsDetailModal.vue';

const router = useRouter();
const messagePop = useMessagePop();

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
          description: '웹 서비스 프론트엔드 개발',
          file: {
            name: '비티로봇_경력증명서.pdf',
            size: '1.2MB',
            exists: true
          }
        },
        {
          company: '(주)테크솔루션',
          period: '2021.01 - 2023.02',
          position: '웹 개발자/프론트엔드팀',
          description: 'React 기반 웹 서비스 개발',
          file: {
            name: '테크솔루션_경력증명서.pdf',
            size: '1.1MB',
            exists: false
          }
        }
      ],
      education: [
        {
          school: '한국대학교',
          degree: '대학교(4년)',
          major: '컴퓨터공학과',
          period: '2015.03 - 2019.02',
          description: '컴퓨터공학과 활동',
          isGraduated: true,
          file: {
            name: '한국대학교_졸업증명서.pdf',
            size: '1.5MB',
            exists: true
          }
        },
        {
          school: '서울고등학교',
          degree: '고등학교',
          major: '이과',
          period: '2012.03 - 2015.02',
          description: '',
          isGraduated: true,
          file: {
            name: '서울고_졸업증명서.pdf',
            size: '1.3MB',
            exists: true
          }
        }
      ],
      criminalRecordFile: {
        name: '범죄경력확인서.pdf',
        size: 1024 * 1024,
        type: 'application/pdf'
      },
      koreanProficiency: '고급',
      koreanStudyDuration: '2년',
      koreanVisitExperience: '없음',
      maritalStatus: '미혼',
      certificates: [
        {
          name: 'TOPIK 6급',
          issuedDate: '2023-05-15',
          file: {
            name: 'TOPIK_6급_자격증.pdf',
            size: '1.1MB',
            exists: true
          }
        },
        {
          name: 'AWS Solutions Architect Associate',
          issuedDate: '2023-08-20',
          file: {
            name: 'AWS_SAA_Certificate.pdf',
            size: '800KB',
            exists: false  // 첨부파일 없는 경우
          }
        }
      ]
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
      education: [
        {
          school: '베이징대학교',
          degree: '대학교(4년)',
          major: '소프트웨어공학',
          period: '2016.09 - 2020.08',
          description: '학점 3.8/4.0\n클라우드 컴퓨팅 연구실 인턴\n교내 프로그래밍 대회 2위',
          isGraduated: true,
          file: {
            name: '베이징대_졸업증명서.pdf',
            size: '1.4MB',
            exists: true
          }
        }
      ],
      criminalRecordFile: {
        name: '범죄경력확인서.pdf',
        size: 1024 * 1024,
        type: 'application/pdf'
      },
      koreanProficiency: '중급',
      koreanStudyDuration: '1년',
      koreanVisitExperience: '없음',
      maritalStatus: '미혼',
      certificates: [
        {
          name: 'TOPIK 5급',
          issuedDate: '2023-03-10'
        },
        {
          name: 'SQLD',
          issuedDate: '2022-12-15'
        },
        {
          name: 'Linux Master 2급',
          issuedDate: '2022-06-30'
        }
      ]
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

  // 결과 입력/수정 확인 메시지 설정
  const isNewResult = !selectedInterview.value.result;
  const isResultChanged = !isNewResult && selectedInterview.value.result !== editResult.value;

  // 알림이 필요한 경우:
  // 1. 최초 결과 입력 시 (합격/불합격만)
  // 2. 기존 결과에서 다른 결과로 변경 시 (모든 변경)
  const needsNotification = (isNewResult && editResult.value !== 'pending') || 
                          (isResultChanged);

  const confirmMessage = isNewResult
    ? `${selectedInterview.value.candidate.name}님의 면접 결과를 입력하시겠습니까?`
    : `${selectedInterview.value.candidate.name}님의 면접 결과를 수정하시겠습니까?`;

  const detailMessage = needsNotification
    ? `\n\n결과: ${resultOptions.find(opt => opt.value === editResult.value).label}\n` +
      `피드백: ${editFeedback.value || '(없음)'}\n\n` +
      '* 확인 시 구직자에게 알림과 이메일이 발송됩니다.'
    : `\n\n결과: ${resultOptions.find(opt => opt.value === editResult.value).label}\n` +
      `피드백: ${editFeedback.value || '(없음)'}`;

  messagePop.confirm({
    icon: 'info',
    message: `<div class="text-center">
      <p class="text-xl mb-2">${confirmMessage}</p>
      <div class="text-sm text-gray-600 text-left mt-4">
        ${detailMessage.replace(/\n/g, '<br>')}
      </div>
    </div>`,
    acceptLabel: '확인',
    rejectLabel: '취소',
    onCloseYes: () => {
      // 기존 결과 저장
      selectedInterview.value.result = editResult.value;
      selectedInterview.value.feedback = editFeedback.value;
      selectedInterview.value.updatedAt = new Date().toISOString().split('T')[0];
      
      // 알림/이메일 발송이 필요한 경우에만 성공 메시지에 알림 발송 문구 포함
      if (needsNotification) {
        messagePop.confirm({
          icon: 'info',
          message: `<div class="text-center">
            <p class="text-xl mb-2">면접 결과가 저장되었습니다.</p>
            <p class="text-sm text-gray-600">${selectedInterview.value.candidate.name}님께 알림과 이메일이 발송되었습니다.</p>
          </div>`,
          acceptLabel: '확인',
          showReject: false,
          onCloseYes: () => {
            showResultModal.value = false;
            // 상태 초기화
            editResult.value = null;
            editFeedback.value = '';
            selectedInterview.value = null;
          }
        });
      } else {
        // 알림/이메일이 발송되지 않는 경우
        messagePop.confirm({
          icon: 'info',
          message: `<div class="text-center">
            <p class="text-xl mb-2">면접 결과가 저장되었습니다.</p>
          </div>`,
          acceptLabel: '확인',
          showReject: false,
          onCloseYes: () => {
            showResultModal.value = false;
            // 상태 초기화
            editResult.value = null;
            editFeedback.value = '';
            selectedInterview.value = null;
          }
        });
      }
    }
  });
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

// 상세 정보 모달 관련 상태만 유지
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
          <p class="text-gray-600" v-if="interview.candidate.education?.length">
            {{ interview.candidate.education[0].school }} · {{ interview.candidate.education[0].major }}
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
            :disabled="interview.result !== null"
          >
            {{ interview.result === null ? '면접 결과 입력' : '결과 확정됨' }}
          </Button>
        </div>
      </div>
    </div>

    <!-- 결과 수정 모달 -->
    <Dialog 
      v-model:visible="showResultModal"
      modal
      :header="'면접 결과 입력'"
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
            :disabled="selectedInterview?.result !== null"
          />
        </div>

        <div>
          <label class="block font-medium mb-2">피드백</label>
          <InputTextarea
            v-model="editFeedback"
            rows="4"
            class="w-full"
            placeholder="면접 피드백을 입력해주세요"
            :disabled="selectedInterview?.result !== null"
          />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <Button 
            @click="showResultModal = false"
            class="p-button-text"
          >
            닫기
          </Button>
          <Button 
            @click="saveResult"
            class="bg-[#8B8BF5]"
            :disabled="selectedInterview?.result !== null"
          >
            입력
          </Button>
        </div>
      </template>
    </Dialog>

    <!-- 상세 정보 모달을 컴포넌트로 교체 -->
    <InterviewResultsDetailModal
      v-model:visible="showDetailModal"
      :interview="selectedDetailInterview"
    />
  </div>
</template> 