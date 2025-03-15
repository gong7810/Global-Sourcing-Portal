<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { useUserStore } from '@/store/user/userStore';
import { storeToRefs } from 'pinia';

const router = useRouter();
const userStore = useUserStore();
// const { jobOfferList } = storeToRefs(userStore); api 연동할 때 사용하기

const toast = useToast();

// 면접제안 목록 상태
const jobOffers = computed(() => {
  return mockJobOffers;
});

// 상세 보기 모달 상태
const showDetailModal = ref(false);
const selectedOffer = ref(null);

// 면접 일정 선택을 위한 상태
const selectedDateIndices = ref({}); // 각 제안별로 선택된 일정을 추적

// 필터 상태 추가
const selectedFilter = ref('all'); // 'all', 'accepted', 'pending', 'rejected'

// 필터 옵션
const filterOptions = [
  { label: '전체', value: 'all' },
  { label: '수락됨', value: 'accepted' },
  { label: '대기중', value: 'pending' },
  { label: '거절됨', value: 'rejected' }
];

// 필터링된 제안 목록 computed 속성 추가
const filteredJobOffers = computed(() => {
  if (selectedFilter.value === 'all') {
    return jobOffers.value;
  }
  return jobOffers.value.filter(offer => offer.status === selectedFilter.value);
});

// 제안 상세 보기
const viewOfferDetail = (offer) => {
  selectedOffer.value = offer;
  if (!offer.isRead) {
    offer.isRead = true;
    // API 호출하여 읽음 상태 업데이트
  }
  showDetailModal.value = true;
};

// 제안 수락
const acceptOffer = async (offer) => {
  try {
    // 제안 수락 처리
    offer.status = 'accepted';
    offer.acceptedAt = new Date().toISOString();

    // API 연동 전까지는 주석 처리
    // await updateJobOffer(offer);  // 실제 API 연동 시 사용할 코드

    toast.add({
      severity: 'success',
      summary: '제안 수락',
      detail: `${offer.companyName}의 면접제안을 수락했습니다.`,
      life: 3000
    });

    showDetailModal.value = false;
  } catch (error) {
    console.error('제안 수락 중 오류 발생:', error);
    toast.add({
      severity: 'error',
      summary: '오류',
      detail: '제안 수락 중 문제가 발생했습니다.',
      life: 3000
    });
  }
};

// 제안 거절
const rejectOffer = (offer) => {
  offer.status = 'rejected';
  toast.add({
    severity: 'info',
    summary: '제안 거절',
    detail: `${offer.companyName}의 면접제안을 거절했습니다.`,
    life: 3000
  });
  showDetailModal.value = false;
};

// 제안 상태에 따른 스타일 클래스
const getStatusClass = (status) => {
  switch (status) {
    case 'accepted':
      return 'bg-green-100 text-green-700';
    case 'rejected':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-yellow-100 text-yellow-700';
  }
};

// 제안 상태 텍스트
const getStatusText = (status) => {
  switch (status) {
    case 'accepted':
      return '수락됨';
    case 'rejected':
      return '거절됨';
    case 'pending':
      return '대기중';
    default:
      return '대기중';
  }
};

// 남은 기한 계산
const getDaysUntilDeadline = (deadline) => {
  const today = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// 나이 계산 함수 추가
const calculateAge = (birthDate) => {
  const today = new Date();
  const birth = new Date(birthDate.replace(/\./g, '-'));
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
};

// 면접 일정 수락 함수 수정
const acceptInterviewSchedule = (offer) => {
  const selectedIndex = selectedDateIndices.value[offer.id];

  if (selectedIndex === undefined) {
    toast.add({
      severity: 'warn',
      summary: '알림',
      detail: '면접 일정을 선택해주세요.',
      life: 3000
    });
    return;
  }

  // 선택된 일정으로 면접 정보 업데이트
  const selectedDate = offer.proposedDates[selectedIndex];
  offer.interviewConfirmed = true; // 면접 확정 상태로 변경
  offer.interviewProposed = false; // 제안 상태 해제
  offer.interviewDate = selectedDate.date;
  offer.interviewTime = selectedDate.time;
  offer.interviewConfirmedAt = new Date().toISOString();

  // 선택된 일정 인덱스 초기화
  selectedDateIndices.value[offer.id] = undefined;

  toast.add({
    severity: 'success',
    summary: '면접 일정 확정',
    detail: `${selectedDate.date} ${selectedDate.time}에 면접이 확정되었습니다.`,
    life: 3000
  });
};

// 면접 일정 거절 함수 수정
const rejectInterviewSchedule = (offer) => {
  offer.interviewProposed = false;
  offer.status = 'rejected';
  offer.rejectedAt = new Date().toISOString();
  selectedDateIndices.value[offer.id] = undefined;

  toast.add({
    severity: 'info',
    summary: '면접 일정 거절',
    detail: '면접 일정이 거절되었습니다.',
    life: 3000
  });
};

// 날짜 포맷팅 함수 추가
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// jobOffers 데이터 예시
const mockJobOffers = [
  {
    id: 1,
    companyName: '밥스(주)',
    business: '산업용 CFRP 물러, 디스플레이용 로봇핸드, 자동차 부품',
    address: '대전 유성구 국제과학로46(신동)',
    positions: [
      { title: '항공기계설계', career: '경력 3년 이상', count: 2 },
      { title: '제품개발', career: '신입/경력', count: 1 }
    ],
    message: '귀하의 경력과 기술이 저희 회사와 잘 맞을 것 같아 면접제안을 드립니다...',
    deadline: '2025-03-15',
    status: 'accepted',
    isRead: false,
    createdAt: '2024-03-11T10:00:00',
    acceptedAt: '2024-03-12T14:30:00',
    interviewProposed: true,
    interviewProposedAt: '2024-03-13T09:00:00',
    interviewConfirmed: false,
    proposedDates: [
      { date: '2024-03-25', time: '14:00' },
      { date: '2024-03-26', time: '10:00' },
      { date: '2024-03-27', time: '15:30' }
    ],
    interviewType: 'offline',
    interviewLocation: '서울시 강남구 테헤란로 123',
    resumeSnapshot: {
      basicInfo: {
        name: '최예지',
        birthDate: '1996.09.01',
        gender: '여성',
        email: 'yeji@naver.com',
        phone: '010-1234-7496',
        address: '윙스타워 505호',
        totalCareer: '5년',
        lastEducation: '대학교(4년) 졸업'
      },
      nationalityInfo: '대한민국',
      passportInfo: {
        passportNumber: 'M1234****',
        surname: 'CHOI',
        givenNames: 'YEJI',
        nationality: '대한민국',
        birthDate: '1996-09-01',
        issueDate: '2020-01-01',
        expiryDate: '2030-01-01',
        issuingCountry: '대한민국',
        birthPlace: 'SEOUL'
      },
      careers: [
        {
          companyName: '(주)비티포탈',
          period: '2023.03 - 2024.03',
          jobCategory: { label: 'IT개발·데이터', value: 'it' },
          jobTitle: '프론트엔드 개발자',
          department: '개발팀',
          responsibilities: '웹 서비스 프론트엔드 개발'
        }
      ],
      educations: [
        {
          educationType: { name: '대학교(4년)', code: 'UNIVERSITY' },
          schoolName: '한국대학교',
          period: '2015.03 - 2019.02',
          major: '컴퓨터공학과',
          isGraduated: true,
          details: '웹 개발 동아리 활동'
        }
      ],
      certifications: []
    }
  },
  {
    id: 2,
    companyName: '한국항공우주산업(주)',
    business: '항공기 제조 및 개발',
    address: '경상남도 사천시 사남면 공단1로 78',
    positions: [{ title: '항공전자 개발', career: '경력 3년 이상', count: 2 }],
    message: '귀하의 경력이 저희 회사의 항공전자 개발 직무와 잘 맞을 것 같습니다...',
    deadline: '2025-03-25',
    status: 'pending',
    isRead: true,
    createdAt: '2024-03-10',
    acceptedAt: '2024-03-16',
    interviewProposed: true,
    interviewConfirmed: false,
    interviewDate: '2024-03-25',
    interviewTime: '14:30',
    interviewType: 'offline',
    interviewLocation: '경상남도 사천시 사남면 공단1로 78',
    resumeSnapshot: {
      basicInfo: {
        name: '최예지',
        birthDate: '1996.09.01',
        gender: '여성',
        email: 'yeji@naver.com',
        phone: '010-1234-7496',
        address: '윙스타워 505호',
        totalCareer: '5년',
        lastEducation: '대학교(4년) 졸업'
      },
      nationalityInfo: '대한민국',
      passportInfo: {
        passportNumber: 'M1234****',
        surname: 'CHOI',
        givenNames: 'YEJI',
        nationality: '대한민국',
        birthDate: '1996-09-01',
        issueDate: '2020-01-01',
        expiryDate: '2030-01-01',
        issuingCountry: '대한민국',
        birthPlace: 'SEOUL'
      },
      careers: [
        {
          companyName: '(주)비티포탈',
          period: '2023.03 - 2024.03',
          jobCategory: { label: 'IT개발·데이터', value: 'it' },
          jobTitle: '프론트엔드 개발자',
          department: '개발팀',
          responsibilities: '웹 서비스 프론트엔드 개발'
        }
      ],
      educations: [
        {
          educationType: { name: '대학교(4년)', code: 'UNIVERSITY' },
          schoolName: '한국대학교',
          period: '2015.03 - 2019.02',
          major: '컴퓨터공학과',
          isGraduated: true,
          details: '웹 개발 동아리 활동'
        }
      ],
      certifications: [
        // {
        //   name: '정보처리기사',
        //   date: '2020-12',
        //   organization: '한국산업인력공단',
        //   certificate: 'cert_1.pdf'
        // }
      ]
    }
  },
  {
    id: 3,
    companyName: 'LIG넥스원',
    business: '방위산업 체계 개발',
    address: '서울특별시 강남구 언주로 45',
    positions: [{ title: '시스템 엔지니어', career: '신입/경력', count: 3 }],
    message: '귀하의 프로필을 보고 연락드립니다...',
    deadline: '2025-04-05',
    status: 'rejected',
    isRead: true,
    createdAt: '2024-03-09',
    rejectedAt: '2024-03-18T14:30:00',
    resumeSnapshot: {
      basicInfo: {
        name: '최예지',
        birthDate: '1996.09.01',
        gender: '여성',
        email: 'yeji@naver.com',
        phone: '010-1234-7496',
        address: '윙스타워 505호',
        totalCareer: '5년',
        lastEducation: '대학교(4년) 졸업'
      },
      nationalityInfo: '대한민국',
      passportInfo: {
        passportNumber: 'M1234****',
        surname: 'CHOI',
        givenNames: 'YEJI',
        nationality: '대한민국',
        birthDate: '1996-09-01',
        issueDate: '2020-01-01',
        expiryDate: '2030-01-01',
        issuingCountry: '대한민국',
        birthPlace: 'SEOUL'
      },
      careers: [
        {
          companyName: '(주)비티포탈',
          period: '2023.03 - 2024.03',
          jobCategory: { label: 'IT개발·데이터', value: 'it' },
          jobTitle: '프론트엔드 개발자',
          department: '개발팀',
          responsibilities: '웹 서비스 프론트엔드 개발'
        }
      ],
      educations: [
        {
          educationType: { name: '대학교(4년)', code: 'UNIVERSITY' },
          schoolName: '한국대학교',
          period: '2015.03 - 2019.02',
          major: '컴퓨터공학과',
          isGraduated: true,
          details: '웹 개발 동아리 활동'
        }
      ],
      certifications: [
        // {
        //   name: '정보처리기사',
        //   date: '2020-12',
        //   organization: '한국산업인력공단',
        //   certificate: 'cert_1.pdf'
        // }
      ]
    }
  },
  {
    id: 4,
    companyName: '현대로템(주)',
    business: '철도차량 제작 및 방산장비 개발',
    address: '경상남도 창원시 성산구 창원대로 1003',
    positions: [{ title: '기계설계', career: '경력 3년 이상', count: 2 }],
    message: '귀하의 경력이 저희 회사의 기계설계 직무와 잘 맞을 것 같아 면접 제안을 드립니다...',
    deadline: '2025-03-20',
    status: 'accepted',
    isRead: true,
    createdAt: '2024-03-12',
    acceptedAt: '2024-03-17',
    interviewProposed: false,
    interviewConfirmed: false,
    resumeSnapshot: {
      basicInfo: {
        name: '최예지',
        birthDate: '1996.09.01',
        gender: '여성',
        email: 'yeji@naver.com',
        phone: '010-1234-7496',
        address: '윙스타워 505호',
        totalCareer: '5년',
        lastEducation: '대학교(4년) 졸업'
      },
      nationalityInfo: '대한민국',
      passportInfo: {
        passportNumber: 'M1234****',
        surname: 'CHOI',
        givenNames: 'YEJI',
        nationality: '대한민국',
        birthDate: '1996-09-01',
        issueDate: '2020-01-01',
        expiryDate: '2030-01-01',
        issuingCountry: '대한민국',
        birthPlace: 'SEOUL'
      },
      careers: [
        {
          companyName: '(주)비티포탈',
          period: '2023.03 - 2024.03',
          jobCategory: { label: 'IT개발·데이터', value: 'it' },
          jobTitle: '프론트엔드 개발자',
          department: '개발팀',
          responsibilities: '웹 서비스 프론트엔드 개발'
        }
      ],
      educations: [
        {
          educationType: { name: '대학교(4년)', code: 'UNIVERSITY' },
          schoolName: '한국대학교',
          period: '2015.03 - 2019.02',
          major: '컴퓨터공학과',
          isGraduated: true,
          details: '웹 개발 동아리 활동'
        }
      ],
      certifications: [
        // {
        //   name: '정보처리기사',
        //   date: '2020-12',
        //   organization: '한국산업인력공단',
        //   certificate: 'cert_1.pdf'
        // }
      ]
    }
  }
];
</script>

<template>
  <div class="max-w-[1200px] mx-auto px-4 py-12">
    <!-- 헤더 -->
    <div class="flex items-center gap-4 mb-8">
      <i
        class="pi pi-angle-left text-4xl text-gray-600 cursor-pointer transition-colors hover:text-[#8FA1FF]"
        @click="router.back()"
      ></i>
      <h1 class="text-3xl font-bold">면접제안</h1>
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
          ({{ jobOffers.filter(offer => offer.status === option.value).length }})
        </span>
        <!-- 전체 개수 표시 -->
        <span class="ml-1" v-else>
          ({{ jobOffers.length }})
        </span>
      </button>
    </div>

    <!-- 제안 목록 (filteredJobOffers로 변경) -->
    <div class="space-y-4">
      <div
        v-for="offer in filteredJobOffers"
        :key="offer.id"
        :class="[
          'bg-white rounded-lg shadow-sm border hover:shadow-lg transition-shadow duration-200 cursor-pointer w-full',
          offer.interviewProposed ? 'border-[#8B8BF5] ring-2 ring-[#8B8BF5] ring-opacity-50' : 'border-gray-200'
        ]"
        @click="viewOfferDetail(offer)"
      >
        <div class="p-6">
          <div class="flex items-start justify-between">
            <div class="flex-grow">
              <!-- 회사명과 상태 -->
              <div class="flex items-center gap-2 mb-4">
                <h3 class="text-lg font-bold">{{ offer.companyName }}</h3>
                <span :class="getStatusClass(offer.status)" class="px-2 py-1 text-xs rounded">
                  {{ getStatusText(offer.status) }}
                </span>
                <!-- 새로운 면접 일정 제안 뱃지 추가 -->
                <span v-if="offer.interviewProposed" class="bg-[#8B8BF5] text-white px-2 py-1 rounded text-xs">
                  새로운 면접 일정
                </span>
                <span v-if="!offer.isRead" class="bg-red-500 text-white px-2 py-1 rounded text-xs">New</span>
              </div>

              <!-- 회사 사업 분야 -->
              <p class="text-gray-600 text-sm mb-4">{{ offer.business }}</p>

              <!-- 주소 -->
              <p class="text-gray-500 text-sm mb-4 flex items-center gap-2">
                <i class="pi pi-map-marker"></i>
                {{ offer.address }}
              </p>

              <!-- 채용 중인 포지션 -->
              <div>
                <h4 class="font-medium text-gray-900 mb-3">
                  <span class="flex items-center gap-2">
                    <i class="pi pi-users text-[#8B8BF5]"></i>
                    채용 중인 포지션
                  </span>
                </h4>
                <div class="grid grid-cols-2 gap-3">
                  <div v-for="position in offer.positions" :key="position.title" class="bg-gray-50 p-3 rounded-lg">
                    <div class="font-medium text-gray-900">{{ position.title }}</div>
                    <div class="flex justify-between items-center mt-1">
                      <span class="text-sm text-gray-600">{{ position.career }}</span>
                      <span class="text-sm text-[#8B8BF5] font-medium">{{ position.count }}명</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 회신기한 -->
            <div class="ml-6 text-right">
              <span class="text-sm text-gray-500 flex items-center gap-2 justify-end">
                <i class="pi pi-calendar"></i>
                회신기한: D-{{ getDaysUntilDeadline(offer.deadline) }}
              </span>
            </div>
          </div>

          <!-- 제안이 수락된 경우 상태 표시 부분 수정 -->
          <div v-if="offer.status === 'accepted'" class="mt-4 border-t pt-4">
            <div class="space-y-2">
              <!-- 제안 관련 날짜 정보 -->
              <p class="text-gray-600">
                <i class="pi pi-clock mr-2"></i>
                제안받은 날짜: {{ formatDate(offer.createdAt) }}
              </p>
              <p class="text-green-600">
                <i class="pi pi-check-circle mr-2"></i>
                수락 날짜: {{ formatDate(offer.acceptedAt) }}
              </p>
              <p v-if="offer.interviewProposed || offer.interviewConfirmed" class="text-blue-600">
                <i class="pi pi-calendar mr-2"></i>
                면접 일정 제안받은 날짜: {{ formatDate(offer.interviewProposedAt) }}
              </p>
            </div>

            <!-- 면접 일정이 확정된 경우 -->
            <div v-if="offer.interviewConfirmed" class="mt-3 bg-green-50 p-4 rounded-lg">
              <h4 class="font-medium text-gray-900 mb-2">확정된 면접 일정</h4>
              <div class="grid grid-cols-2 gap-4">
                <div class="flex items-center gap-2">
                  <i class="pi pi-calendar text-green-600"></i>
                  <span class="text-gray-700">{{ offer.interviewDate }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <i class="pi pi-clock text-green-600"></i>
                  <span class="text-gray-700">{{ offer.interviewTime }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <i class="pi pi-video text-green-600"></i>
                  <span class="text-gray-700">
                    {{ offer.interviewType === 'online' ? '화상 면접' : '대면 면접' }}
                  </span>
                </div>
                <div class="flex items-center gap-2">
                  <i class="pi pi-map-marker text-green-600"></i>
                  <span class="text-gray-700">{{ offer.interviewLocation }}</span>
                </div>
              </div>
              <p class="mt-4 text-green-600 flex items-center gap-2">
                <i class="pi pi-check-circle"></i>
                <span>{{ formatDate(offer.interviewConfirmedAt) }}에 면접 일정이 확정되었습니다</span>
              </p>
            </div>

            <!-- 면접 일정이 제안된 경우 (아직 확정되지 않은 경우) -->
            <div v-else-if="offer.interviewProposed" class="mt-3 bg-blue-50 p-4 rounded-lg" @click.stop>
              <h4 class="font-medium text-gray-900 mb-2">제안된 면접 일정</h4>
              <div class="space-y-4 mb-4">
                <div
                  v-for="(dateSlot, index) in offer.proposedDates"
                  :key="index"
                  class="flex items-center gap-4 p-3 bg-white rounded-lg"
                >
                  <input
                    type="radio"
                    :name="'interview-date-' + offer.id"
                    :value="index"
                    v-model="selectedDateIndices[offer.id]"
                    @click.stop
                  />
                  <div>
                    <div class="font-medium">{{ dateSlot.date }}</div>
                    <div class="text-sm text-gray-600">{{ dateSlot.time }}</div>
                  </div>
                </div>
              </div>

              <div class="mb-4">
                <div class="font-medium mb-2">면접 방식</div>
                <p class="text-gray-700">
                  {{ offer.interviewType === 'online' ? '화상 면접' : '대면 면접' }}
                </p>
                <p class="text-gray-700">{{ offer.interviewLocation }}</p>
              </div>

              <div class="flex gap-2">
                <Button
                  severity="success"
                  class="p-button-sm"
                  @click.stop="acceptInterviewSchedule(offer)"
                  :disabled="selectedDateIndices[offer.id] === undefined"
                >
                  일정 수락
                </Button>
                <Button severity="danger" class="p-button-sm" @click.stop="rejectInterviewSchedule(offer)">
                  면접 거절
                </Button>
              </div>
            </div>

            <!-- 아직 면접 일정이 제안되지 않은 경우 -->
            <div v-else class="mt-3 bg-yellow-50 p-4 rounded-lg">
              <p class="text-yellow-700">
                <i class="pi pi-clock mr-2"></i>
                면접 일정 조율 중입니다. 기업 담당자가 일정을 전달할 예정입니다.
              </p>
            </div>
          </div>

          <!-- 제안이 대기중인 경우 상태 표시 부분 추가 -->
          <div v-if="offer.status === 'pending'" class="mt-4 border-t pt-4">
            <p class="text-gray-600">
              <i class="pi pi-clock mr-2"></i>
              제안받은 날짜: {{ formatDate(offer.createdAt) }}
            </p>
          </div>

          <!-- 제안이 거절된 경우 상태 표시 부분 수정 -->
          <div v-else-if="offer.status === 'rejected'" class="mt-4 border-t pt-4">
            <div class="space-y-2">
              <p class="text-gray-600">
                <i class="pi pi-clock mr-2"></i>
                제안받은 날짜: {{ formatDate(offer.createdAt) }}
              </p>
              <p class="text-red-600">
                <i class="pi pi-times-circle mr-2"></i>
                {{ formatDate(offer.rejectedAt) }}에 거절되었습니다
              </p>
            </div>
          </div>

          <!-- 상세정보 보기 버튼 추가 -->
          <div class="mt-4 flex justify-end">
            <button
              class="text-[#8B8BF5] hover:text-[#7A7AE6] flex items-center gap-1"
              @click.stop="viewOfferDetail(offer)"
            >
              <span>상세 정보 보기</span>
              <i class="pi pi-arrow-right text-sm"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 필터링된 결과가 없을 때 표시할 메시지 -->
    <div v-if="filteredJobOffers.length === 0" class="text-center py-12">
      <div class="text-gray-500">
        <i class="pi pi-inbox text-4xl mb-4"></i>
        <p class="text-lg">해당하는 면접 제안이 없습니다</p>
      </div>
    </div>

    <!-- 상세 보기 모달 -->
    <Dialog v-model:visible="showDetailModal" :modal="true" :style="{ width: '60vw' }">
      <!-- 헤더 커스텀 -->
      <template #header>
        <div class="flex items-center gap-2">
          <span class="text-xl font-bold">{{ selectedOffer?.companyName }}</span>
          <span v-if="selectedOffer" :class="getStatusClass(selectedOffer.status)" class="px-2 py-1 text-xs rounded">
            {{ getStatusText(selectedOffer.status) }}
          </span>
        </div>
      </template>

      <div v-if="selectedOffer" class="p-6 space-y-6">
        <!-- 회사 기본 정보 -->
        <div class="space-y-3">
          <!-- 회사 사업 분야 -->
          <div class="flex gap-8 text-gray-600">
            <span class="flex items-center gap-2">
              <i class="pi pi-briefcase"></i>
              {{ selectedOffer.business }}
            </span>
          </div>
          <!-- 회사 주소 추가 -->
          <div class="flex gap-8 text-gray-600">
            <span class="flex items-center gap-2">
              <i class="pi pi-map-marker"></i>
              {{ selectedOffer.address }}
            </span>
          </div>
        </div>

        <!-- 채용 중인 포지션 -->
        <div class="mb-3">
          <h4 class="font-medium text-gray-900 mb-2">
            <span class="flex items-center gap-2">
              <i class="pi pi-users text-[#8B8BF5]"></i>
              채용 중인 포지션
            </span>
          </h4>
          <div class="grid grid-cols-2 gap-3">
            <div v-for="position in selectedOffer.positions" :key="position.title" class="bg-gray-50 p-3 rounded-lg">
              <div class="font-medium text-gray-900">{{ position.title }}</div>
              <div class="flex justify-between items-center mt-1">
                <span class="text-sm text-gray-600">{{ position.career }}</span>
                <span class="text-sm text-[#8B8BF5] font-medium">{{ position.count }}명</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 면접제안 메시지 -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-medium mb-2">면접제안 메시지</h4>
          <p class="text-gray-700 whitespace-pre-line">{{ selectedOffer.message }}</p>
        </div>

        <!-- 회신기한 -->
        <div class="bg-blue-50 p-4 rounded-lg">
          <div class="flex items-center gap-2 text-blue-700">
            <i class="pi pi-info-circle"></i>
            <span>회신기한: {{ selectedOffer.deadline }} (D-{{ getDaysUntilDeadline(selectedOffer.deadline) }})</span>
          </div>
        </div>

        <!-- 제안 당시 이력서 정보 표시 (모든 상태에서) -->
        <div v-if="selectedOffer?.resumeSnapshot" class="border-t mt-6 pt-6">
          <div class="flex items-center justify-between mb-4">
            <h4 class="font-medium text-gray-900">제안 당시 이력서 정보</h4>
            <div class="text-sm text-gray-500">
              <i class="pi pi-clock mr-1"></i>
              {{ formatDate(selectedOffer.createdAt) }} 기준
            </div>
          </div>

          <div class="space-y-4">
            <!-- 기본 정보 -->
            <div class="bg-gray-50 p-4 rounded-lg">
              <h5 class="font-medium mb-2">기본 정보</h5>
              <div class="grid grid-cols-[80px_auto] gap-y-2 text-sm text-gray-600">
                <span class="text-gray-500">이름</span>
                <span>{{ selectedOffer.resumeSnapshot.basicInfo.name }}</span>
                <span class="text-gray-500">생년월일</span>
                <span>{{ selectedOffer.resumeSnapshot.basicInfo.birthDate }} (만 {{ calculateAge(selectedOffer.resumeSnapshot.basicInfo.birthDate) }}세)</span>
                <span class="text-gray-500">성별</span>
                <span>{{ selectedOffer.resumeSnapshot.basicInfo.gender }}</span>
                <span class="text-gray-500">휴대폰</span>
                <span>{{ selectedOffer.resumeSnapshot.basicInfo.phone }}</span>
                <span class="text-gray-500">이메일</span>
                <span>{{ selectedOffer.resumeSnapshot.basicInfo.email }}</span>
                <span class="text-gray-500">주소</span>
                <span>{{ selectedOffer.resumeSnapshot.basicInfo.address }}</span>
                <span class="text-gray-500">경력</span>
                <span>{{ selectedOffer.resumeSnapshot.basicInfo.totalCareer }}</span>
                <span class="text-gray-500">학력</span>
                <span>{{ selectedOffer.resumeSnapshot.basicInfo.lastEducation }}</span>
              </div>
            </div>

            <!-- 국가 정보 -->
            <div class="bg-gray-50 p-4 rounded-lg">
              <h5 class="font-medium mb-2">국가</h5>
              <div class="text-sm text-gray-600">
                {{ selectedOffer.resumeSnapshot.nationalityInfo }}
              </div>
            </div>

            <!-- 여권 정보 -->
            <div class="bg-gray-50 p-4 rounded-lg">
              <h5 class="font-medium mb-2">여권</h5>
              <div class="space-y-2 text-sm text-gray-600">
                <p>이름: {{ selectedOffer.resumeSnapshot.passportInfo.surname }} {{ selectedOffer.resumeSnapshot.passportInfo.givenNames }}</p>
                <p>여권번호: {{ selectedOffer.resumeSnapshot.passportInfo.passportNumber }}</p>
                <p>국적: {{ selectedOffer.resumeSnapshot.passportInfo.nationality }}</p>
                <p>만료일: {{ selectedOffer.resumeSnapshot.passportInfo.expiryDate }}</p>
              </div>
            </div>

            <!-- 경력 정보 -->
            <div class="bg-gray-50 p-4 rounded-lg">
              <h5 class="font-medium mb-2">경력 사항</h5>
              <div v-if="selectedOffer.resumeSnapshot.careers?.length > 0">
                <div v-for="career in selectedOffer.resumeSnapshot.careers" 
                     :key="career.companyName" 
                     class="mb-4 border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                  <div class="space-y-1">
                    <h6 class="font-medium text-gray-900">{{ career.companyName }}</h6>
                    <p class="text-sm text-gray-600">{{ career.period }}</p>
                    <p class="text-sm text-gray-600">
                      {{ career.jobCategory?.label || 'IT개발·데이터' }} | {{ career.jobTitle }} | {{ career.department }}
                    </p>
                    <p class="text-sm text-gray-600 mt-2">{{ career.responsibilities }}</p>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-4 text-gray-500">등록된 경력이 없습니다</div>
            </div>

            <!-- 학력 정보 -->
            <div class="bg-gray-50 p-4 rounded-lg">
              <h5 class="font-medium mb-2">학력 사항</h5>
              <div v-if="selectedOffer.resumeSnapshot.educations?.length > 0">
                <div v-for="education in selectedOffer.resumeSnapshot.educations" 
                     :key="education.schoolName" 
                     class="mb-4 border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                  <div class="space-y-1">
                    <h6 class="font-medium text-gray-900">{{ education.schoolName }}</h6>
                    <p class="text-sm text-gray-600">{{ education.educationType.name }}</p>
                    <p class="text-sm text-gray-600">{{ education.period }}</p>
                    <p class="text-sm text-gray-600">{{ education.major }}</p>
                    <p v-if="education.details" class="text-sm text-gray-600 mt-2">{{ education.details }}</p>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-4 text-gray-500">등록된 학력이 없습니다</div>
            </div>

            <!-- 자격증 정보 -->
            <div class="bg-gray-50 p-4 rounded-lg">
              <h5 class="font-medium mb-2">자격증 사항</h5>
              <div v-if="selectedOffer.resumeSnapshot.certifications?.length > 0">
                <div v-for="cert in selectedOffer.resumeSnapshot.certifications" 
                     :key="cert.name" 
                     class="mb-4 border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                  <div class="space-y-1">
                    <p class="text-sm text-gray-900">{{ cert.name }}</p>
                    <p class="text-sm text-gray-600">취득일: {{ cert.date }}</p>
                    <p class="text-sm text-gray-600">발급기관: {{ cert.organization }}</p>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-4 text-gray-500">등록된 자격증이 없습니다</div>
            </div>
          </div>
        </div>

        <!-- 버튼 -->
        <div v-if="selectedOffer.status === 'pending'" class="flex justify-end gap-4">
          <Button label="거절하기" class="p-button-danger" @click="rejectOffer(selectedOffer)" />
          <Button label="수락하기" class="p-button-success" @click="acceptOffer(selectedOffer)" />
        </div>
      </div>
    </Dialog>

    <!-- 토스트 메시지 -->
    <Toast />
  </div>
</template>

<style scoped>
:deep(.p-dialog-header) {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

:deep(.p-dialog-content) {
  padding: 0;
}

:deep(.p-button.p-button-success) {
  background: #10b981;
  border-color: #10b981;
}

:deep(.p-button.p-button-success:hover) {
  background: #059669;
  border-color: #059669;
}

:deep(.p-button.p-button-danger) {
  background: #ef4444;
  border-color: #ef4444;
}

:deep(.p-button.p-button-danger:hover) {
  background: #dc2626;
  border-color: #dc2626;
}
</style>
