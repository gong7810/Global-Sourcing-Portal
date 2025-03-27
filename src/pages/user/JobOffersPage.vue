<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { useUserStore } from '@/store/user/userStore';
import { storeToRefs } from 'pinia';
import { useMessagePop } from '@/plugins/commonutils';
import MessagePop from 'primevue/message';

const router = useRouter();
const userStore = useUserStore();
// const { jobOfferList } = storeToRefs(userStore); api 연동할 때 사용하기

const toast = useToast();
const messagePop = useMessagePop();

// mockJobOffers 데이터를 먼저 정의
const mockJobOffers = [
  {
    id: 1,
    companyName: '밥스(주)',
    business: '산업용 CFRP 물러, 디스플레이용 로봇핸드, 자동차 부품',
    address: '대전 유성구 국제과학로46(신동)',
    jobOffer: {
      title: 'IT개발·데이터 | Frontend Developer',
      detailedWork: '웹 서비스 프론트엔드 개발 및 유지보수',
      message: '안녕하세요. 귀하의 프로필을 보고 연락드립니다.'
    },
    status: 'accepted',  // 수락된 상태
    isRead: false,
    createdAt: '2024-03-11T10:00:00',
    acceptedAt: '2024-03-12T14:30:00',
    interviewProposed: true,  // 면접 일정이 제안된 상태
    interviewConfirmed: false,  // 아직 확정되지 않음
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
        criminalRecordFile: {
          name: '범죄경력확인서.pdf',
          size: 1024 * 1024,
          type: 'application/pdf'
        },
        koreanProficiency: '고급',
        koreanStudyDuration: '2년',
        koreanVisitExperience: '없음',
        maritalStatus: '미혼'
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
          period: '2023.01 - 2024.03',
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
        {
          name: 'TOPIK 6급',
          date: '2023-05-15',
          organization: '국립국제교육원'
        }
      ]
    }
  },
  {
    id: 2,
    companyName: '한국항공우주산업(주)',
    business: '항공기 제조 및 개발',
    address: '경상남도 사천시 사남면 공단1로 78',
    jobOffer: {
      title: 'IT개발·데이터 | 항공전자 개발',
      detailedWork: '항공전자 시스템 개발',
      message: '귀하의 경력이 저희 회사의 항공전자 개발 직무와 잘 맞을 것 같습니다.'
    },
    deadline: '2025-03-25',
    status: 'pending',
    isRead: true,
    createdAt: '2024-03-10',
    resumeSnapshot: {
      basicInfo: {
        name: '최예지',
        birthDate: '1996.09.01',
        gender: '여성',
        email: 'yeji@naver.com',
        phone: '010-1234-7496',
        address: '윙스타워 505호',
        criminalRecordFile: {
          name: '범죄경력확인서.pdf',
          size: 1024 * 1024,
          type: 'application/pdf'
        },
        koreanProficiency: '고급',
        koreanStudyDuration: '2년',
        koreanVisitExperience: '없음',
        maritalStatus: '미혼'
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
          period: '2023.01 - 2024.03',
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
        {
          name: 'TOPIK 6급',
          date: '2023-05-15',
          organization: '국립국제교육원'
        }
      ]
    }
  },
  {
    id: 3,
    companyName: 'LIG넥스원',
    business: '방위산업 체계 개발',
    address: '서울특별시 강남구 언주로 45',
    jobOffer: {
      title: 'IT개발·데이터 | 시스템 엔지니어',
      detailedWork: '방산 체계 시스템 설계 및 개발',
      message: '안녕하세요. 귀하의 프로필을 보고 연락드립니다. 저희 회사의 시스템 엔지니어 포지션에 적합한 경력을 보유하고 계신 것 같아 면접을 제안드립니다.'
    },
    deadline: '2025-04-05',
    status: 'rejected',
    isRead: true,
    createdAt: '2024-03-09',
    rejectedAt: '2024-03-18T14:30:00',
    rejectReason: '현재 다른 회사와 채용 과정이 진행 중입니다. 좋은 기회를 주셔서 감사합니다.',
    resumeSnapshot: {
      basicInfo: {
        name: '최예지',
        birthDate: '1996.09.01',
        gender: '여성',
        email: 'yeji@naver.com',
        phone: '010-1234-7496',
        address: '윙스타워 505호',
        criminalRecordFile: {
          name: '범죄경력확인서.pdf',
          size: 1024 * 1024,
          type: 'application/pdf'
        },
        koreanProficiency: '고급',
        koreanStudyDuration: '2년',
        koreanVisitExperience: '없음',
        maritalStatus: '미혼'
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
        {
          name: 'TOPIK 6급',
          date: '2023-05-15',
          organization: '국립국제교육원'
        }
      ]
    }
  },
  {
    id: 4,
    companyName: '현대로템(주)',
    business: '철도차량 제작 및 방산장비 개발',
    address: '경상남도 창원시 성산구 창원대로 1003',
    jobOffer: {
      title: 'IT개발·데이터 | 기계설계 엔지니어',
      detailedWork: '철도차량 기계설계 및 시스템 개발',
      message: '안녕하세요. 귀하의 프로필을 검토한 결과, 저희 회사의 기계설계 엔지니어 포지션과 잘 맞을 것 같아 면접을 제안드립니다.'
    },
    status: 'accepted',
    isRead: true,
    createdAt: '2024-03-12',
    acceptedAt: '2024-03-17',
    interviewProposed: false,  // 아직 면접 일정이 제안되지 않음
    interviewConfirmed: false,  // 면접 일정이 확정되지 않음
    resumeSnapshot: {
      basicInfo: {
        name: '최예지',
        birthDate: '1996.09.01',
        gender: '여성',
        email: 'yeji@naver.com',
        phone: '010-1234-7496',
        address: '윙스타워 505호',
        criminalRecordFile: {
          name: '범죄경력확인서.pdf',
          size: 1024 * 1024,
          type: 'application/pdf'
        },
        koreanProficiency: '고급',
        koreanStudyDuration: '2년',
        koreanVisitExperience: '없음',
        maritalStatus: '미혼'
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
        {
          name: 'TOPIK 6급',
          date: '2023-05-15',
          organization: '국립국제교육원'
        }
      ]
    }
  }
];

// 그 다음에 jobOffers ref 생성
const jobOffers = ref(mockJobOffers);

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
  messagePop.confirm({
    icon: 'info',
    message: `<div class="text-center">
      <p class="text-xl mb-2">${offer.companyName}의 면접 제안을 수락하시겠습니까?</p>
      <p class="text-sm text-gray-600">수락 시 기업 담당자에게 알림과 메일이 발송됩니다.</p>
      <p class="text-sm text-gray-600">이후 면접 일정 조율이 진행됩니다.</p>
    </div>`,
    acceptLabel: '수락',
    rejectLabel: '취소',
    onCloseYes: async () => {
      try {
        // 새로운 객체를 생성하여 할당
        const index = jobOffers.value.findIndex(o => o.id === offer.id);
        jobOffers.value[index] = {
          ...offer,
          status: 'accepted',
          acceptedAt: new Date().toISOString(),
          interviewProposed: false,
          interviewConfirmed: false
        };

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
    }
  });
};

// 거절 사유 모달 상태 추가
const showRejectReasonModal = ref(false);
const rejectReason = ref('');
const offerToReject = ref(null);

// 제안 거절
const rejectOffer = (offer) => {
  offerToReject.value = offer;
  rejectReason.value = ''; // 거절 사유 초기화
  showRejectReasonModal.value = true;
};

// 거절 확인 함수 수정 (공통으로 사용)
const confirmReject = () => {
  if (!rejectReason.value.trim()) {
    toast.add({
      severity: 'warn',
      summary: '입력 필요',
      detail: '거절 사유를 입력해주세요.',
      life: 3000
    });
    return;
  }

  messagePop.confirm({
    icon: 'info',
    message: `<div class="text-center">
      <p class="text-xl mb-2">면접을 거절하시겠습니까?</p>
      <p class="text-sm text-gray-600">거절 시 기업 담당자에게 알림과 메일이 발송됩니다.</p>
      <p class="text-sm text-red-500">이 결정은 되돌릴 수 없습니다.</p>
    </div>`,
    acceptLabel: '거절',
    rejectLabel: '취소',
    acceptClass: 'p-button-danger',
    onCloseYes: () => {
      const offer = offerToReject.value;
      offer.interviewProposed = false;
      offer.status = 'rejected';
      offer.rejectedAt = new Date().toISOString();
      offer.rejectReason = rejectReason.value;
      
      if (selectedDateIndices.value[offer.id] !== undefined) {
        selectedDateIndices.value[offer.id] = undefined;
      }

      toast.add({
        severity: 'info',
        summary: '제안 거절',
        detail: `${offer.companyName}의 제안이 거절되었습니다.`,
        life: 3000
      });

      showRejectReasonModal.value = false;
      showDetailModal.value = false;
    }
  });
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

// 남은 기한 계산 함수 수정
const getDaysUntilDeadline = (deadline) => {
  const today = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // 기한이 지난 경우 '마감' 표시
  if (diffDays < 0) {
    return '마감';
  }
  
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

// 면접 일정 수락
const acceptInterviewSchedule = (offer) => {
  const selectedIndex = selectedDateIndices.value[offer.id];
  const selectedDate = offer.proposedDates[selectedIndex];
  
  messagePop.confirm({
    icon: 'info',
    message: `<div class="text-center">
      <p class="text-xl mb-2">면접 일정을 수락하시겠습니까?</p>
      <p class="text-sm text-gray-600 mb-2">일시: ${selectedDate.date} ${selectedDate.time}</p>
      <p class="text-sm text-gray-600">면접 방식: ${offer.interviewType === 'online' ? '화상 면접' : '대면 면접'}</p>
      <p class="text-sm text-gray-600 mb-4">장소: ${offer.interviewLocation}</p>
      <p class="text-sm text-blue-600">확인 시 기업 담당자에게 알림과 메일이 발송됩니다.</p>
    </div>`,
    acceptLabel: '수락',
    rejectLabel: '취소',
    onCloseYes: () => {
      offer.interviewConfirmed = true;
      offer.interviewProposed = false;
      offer.interviewDate = selectedDate.date;
      offer.interviewTime = selectedDate.time;
      offer.interviewConfirmedAt = new Date().toISOString();
      selectedDateIndices.value[offer.id] = undefined;

      toast.add({
        severity: 'success',
        summary: '면접 일정 확정',
        detail: `${selectedDate.date} ${selectedDate.time}에 면접이 확정되었습니다.`,
        life: 3000
      });
    }
  });
};

// 면접 일정 거절
const rejectInterviewSchedule = (offer) => {
  offerToReject.value = offer;
  rejectReason.value = ''; // 거절 사유 초기화
  showRejectReasonModal.value = true;
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

// 경력 기간 계산 함수 추가
const calculatePeriod = (period) => {
  const [start, end] = period.split(' - ').map(date => {
    const [year, month] = date.split('.');
    return new Date(year, month - 1);
  });
  
  const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  if (years === 0) {
    return `${remainingMonths}개월`;
  } else if (remainingMonths === 0) {
    return `${years}년`;
  } else {
    return `${years}년 ${remainingMonths}개월`;
  }
};

// 총 경력 계산 함수
const calculateTotalCareer = (careers) => {
  if (!careers || careers.length === 0) return '경력 없음';
  
  let totalMonths = 0;
  careers.forEach(career => {
    const [start, end] = career.period.split(' - ');
    const startDate = new Date(start.replace(/\./g, '-'));
    const endDate = end === '재직중' ? new Date() : new Date(end.replace(/\./g, '-'));
    
    const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                  (endDate.getMonth() - startDate.getMonth());
    totalMonths += months;
  });

  const years = Math.floor(totalMonths / 12);
  const remainingMonths = totalMonths % 12;

  if (years === 0) {
    return `${remainingMonths}개월`;
  } else if (remainingMonths === 0) {
    return `${years}년`;
  } else {
    return `${years}년 ${remainingMonths}개월`;
  }
};

// 최종학력 정보 가져오기
const getLatestEducation = (educations) => {
  if (!educations || educations.length === 0) return '학력 정보 없음';
  
  const latest = educations[0]; // 이미 정렬되어 있다고 가정
  return `${latest.schoolName} ${latest.educationType.name} ${latest.isGraduated ? '졸업' : '재학중'}`;
};
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
          'bg-white rounded-lg shadow-sm border hover:shadow-lg transition-shadow duration-200 w-full',
          offer.interviewProposed ? 'border-[#8B8BF5] ring-2 ring-[#8B8BF5] ring-opacity-50' : 'border-gray-200'
        ]"
      >
        <div class="p-6">
          <!-- 최상위 컨테이너를 flex-col로 변경 -->
          <div class="flex flex-col">
            <!-- 회사 정보 및 상태 -->
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center gap-2">
                <h3 class="text-lg font-bold">{{ offer.companyName }}</h3>
                <span :class="getStatusClass(offer.status)" class="px-2 py-1 text-xs rounded">
                  {{ getStatusText(offer.status) }}
                </span>
                <span v-if="!offer.isRead" class="bg-red-500 text-white px-2 py-1 rounded text-xs">New</span>
              </div>
              <!-- 회신기한을 상단으로 이동 -->
              <div v-if="offer.status === 'pending'" class="text-right">
                <span 
                  :class="[
                    'text-sm flex items-center gap-2 justify-end',
                    getDaysUntilDeadline(offer.deadline) === '마감' 
                      ? 'text-red-500' 
                      : getDaysUntilDeadline(offer.deadline) <= 3 
                        ? 'text-orange-500' 
                        : 'text-gray-500'
                  ]"
                >
                  <i class="pi pi-calendar"></i>
                  회신기한: {{ getDaysUntilDeadline(offer.deadline) === '마감' ? '마감' : 'D-' + getDaysUntilDeadline(offer.deadline) }}
                </span>
              </div>
            </div>

            <!-- 회사 정보 -->
            <div class="mb-4">
              <p v-if="offer.business" class="text-gray-600 text-sm mb-2">{{ offer.business }}</p>
              <p class="text-gray-500 text-sm flex items-center gap-2">
                <i class="pi pi-map-marker"></i>
                {{ offer.address }}
              </p>
            </div>

            <!-- 제안 내용 섹션 -->
            <div class="space-y-4">
              <!-- 직무·제안 포지션 -->
              <div>
                <h4 class="font-medium text-gray-900 mb-2">
                  <span class="flex items-center gap-2">
                    <i class="pi pi-briefcase text-[#8B8BF5]"></i>
                    직무·제안 포지션
                  </span>
                </h4>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <p class="text-base text-gray-700">{{ offer.jobOffer.title }}</p>
                </div>
              </div>

              <!-- 상세 업무 -->
              <div>
                <h4 class="font-medium text-gray-900 mb-2">
                  <span class="flex items-center gap-2">
                    <i class="pi pi-list text-[#8B8BF5]"></i>
                    상세 업무
                  </span>
                </h4>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <p class="text-base text-gray-700">{{ offer.jobOffer.detailedWork }}</p>
                </div>
              </div>

              <!-- 면접제안 메시지 -->
              <div>
                <h4 class="font-medium text-gray-900 mb-2">
                  <span class="flex items-center gap-2">
                    <i class="pi pi-comments text-[#8B8BF5]"></i>
                    면접제안 메시지
                  </span>
                </h4>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <p class="text-base text-gray-700 whitespace-pre-line">{{ offer.jobOffer.message }}</p>
                </div>
              </div>
            </div>

            <!-- 상태별 다른 내용 표시 -->
            <div class="mt-4 border-t pt-4">
              <!-- 대기중인 경우 -->
              <div v-if="offer.status === 'pending'" class="space-y-4">
                <p class="text-gray-600">
                  <i class="pi pi-clock mr-2"></i>
                  제안받은 날짜: {{ formatDate(offer.createdAt) }}
                </p>
                <div class="bg-blue-50 p-4 rounded-lg">
                  <p class="text-blue-700">
                    <i class="pi pi-info-circle mr-2"></i>
                    회신기한: {{ getDaysUntilDeadline(offer.deadline) === '마감' ? '마감' : 'D-' + getDaysUntilDeadline(offer.deadline) }}
                  </p>
                </div>
                <div class="flex gap-2 justify-end">
                  <Button label="상세정보보기" class="p-button-outlined" @click="viewOfferDetail(offer)" />
                  <Button label="수락하기" class="p-button-success" @click="acceptOffer(offer)" />
                  <Button label="거절하기" class="p-button-danger" @click="rejectOffer(offer)" />
                </div>
              </div>

              <!-- 수락된 경우 -->
              <div v-else-if="offer.status === 'accepted'" class="space-y-4">
                <div class="space-y-2">
                  <p class="text-gray-600">
                    <i class="pi pi-clock mr-2"></i>
                    제안받은 날짜: {{ formatDate(offer.createdAt) }}
                  </p>
                  <p class="text-green-600">
                    <i class="pi pi-check-circle mr-2"></i>
                    수락 날짜: {{ formatDate(offer.acceptedAt) }}
                  </p>
                </div>

                <!-- 면접 일정 관련 정보 -->
                <div v-if="offer.interviewConfirmed" class="bg-green-50 p-4 rounded-lg">
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
                <div v-else-if="offer.interviewProposed" class="space-y-4">
                  <!-- 면접 일정 정보를 담은 파란색 박스 -->
                  <div class="bg-blue-50 p-4 rounded-lg">
                    <h4 class="font-medium text-gray-900 mb-2">제안된 면접 일정</h4>
                    <!-- 회신기한 추가 -->
                    <p class="text-blue-700 mb-4">
                      <i class="pi pi-info-circle mr-2"></i>
                      회신기한: D-3
                    </p>
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
                  </div>

                  <div class="flex gap-2 justify-end">
                    <Button label="상세정보보기" class="p-button-outlined" @click="viewOfferDetail(offer)" />
                    <Button
                      label="일정 수락"
                      severity="success"
                      @click="acceptInterviewSchedule(offer)"
                      :disabled="selectedDateIndices[offer.id] === undefined"
                    />
                    <Button
                      label="면접 거절"
                      severity="danger"
                      @click="rejectInterviewSchedule(offer)"
                    />
                  </div>
                </div>
                <div v-else-if="!offer.interviewConfirmed" class="space-y-4">
                  <div class="bg-yellow-50 p-4 rounded-lg">
                    <p class="text-yellow-700">
                      <i class="pi pi-clock mr-2"></i>
                      면접 일정 조율 중입니다. 기업 담당자가 일정을 전달할 예정입니다.
                    </p>
                  </div>
                  <!-- 상세정보보기 버튼 추가 -->
                  <div class="flex gap-2 justify-end">
                    <Button label="상세정보보기" class="p-button-outlined" @click="viewOfferDetail(offer)" />
                  </div>
                </div>
              </div>

              <!-- 거절된 경우 -->
              <div v-else-if="offer.status === 'rejected'" class="space-y-4">
                <div class="space-y-2">
                  <p class="text-gray-600">
                    <i class="pi pi-clock mr-2"></i>
                    제안받은 날짜: {{ formatDate(offer.createdAt) }}
                  </p>
                  <p class="text-red-600">
                    <i class="pi pi-times-circle mr-2"></i>
                    {{ formatDate(offer.rejectedAt) }}에 거절되었습니다
                  </p>
                  <!-- 거절 사유 표시 추가 -->
                  <div v-if="offer.rejectReason" class="bg-red-50 p-4 rounded-lg mt-2">
                    <p class="text-red-700">
                      <span class="font-medium">거절 사유:</span><br>
                      {{ offer.rejectReason }}
                    </p>
                  </div>
                </div>
                <div class="flex gap-2 justify-end">
                  <Button label="상세정보보기" class="p-button-outlined" @click="viewOfferDetail(offer)" />
                </div>
              </div>
            </div>
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
          <!-- 회사 사업 분야 (business가 있을 때만 표시) -->
          <div v-if="selectedOffer.business" class="flex gap-8 text-gray-600">
            <span class="flex items-center gap-2">
              <i class="pi pi-briefcase"></i>
              {{ selectedOffer.business }}
            </span>
          </div>
          <!-- 회사 주소 -->
          <div class="flex gap-8 text-gray-600">
            <span class="flex items-center gap-2">
              <i class="pi pi-map-marker"></i>
              {{ selectedOffer.address }}
            </span>
          </div>
        </div>

        <!-- 제안 내용 섹션 수정 -->
        <div class="space-y-4">
          <!-- 직무·제안 포지션 -->
          <div>
            <h4 class="font-medium text-gray-900 mb-2">
              <span class="flex items-center gap-2">
                <i class="pi pi-briefcase text-[#8B8BF5]"></i>
                직무·제안 포지션
              </span>
            </h4>
            <div class="bg-gray-50 p-4 rounded-lg">
              <p class="text-base text-gray-700">{{ selectedOffer.jobOffer.title }}</p>
            </div>
          </div>

          <!-- 상세 업무 -->
          <div>
            <h4 class="font-medium text-gray-900 mb-2">
              <span class="flex items-center gap-2">
                <i class="pi pi-list text-[#8B8BF5]"></i>
                상세 업무
              </span>
            </h4>
            <div class="bg-gray-50 p-4 rounded-lg">
              <p class="text-base text-gray-700">{{ selectedOffer.jobOffer.detailedWork }}</p>
            </div>
          </div>

          <!-- 면접제안 메시지 -->
          <div>
            <h4 class="font-medium text-gray-900 mb-2">
              <span class="flex items-center gap-2">
                <i class="pi pi-comments text-[#8B8BF5]"></i>
                면접제안 메시지
              </span>
            </h4>
            <div class="bg-gray-50 p-4 rounded-lg">
              <p class="text-base text-gray-700 whitespace-pre-line">{{ selectedOffer.jobOffer.message }}</p>
            </div>
          </div>
        </div>

        <!-- 상태별 다른 내용 표시 -->
        <div class="mt-4 border-t pt-4">
          <!-- 대기중인 경우 -->
          <div v-if="selectedOffer.status === 'pending'" class="space-y-4">
            <p class="text-gray-600">
              <i class="pi pi-clock mr-2"></i>
              제안받은 날짜: {{ formatDate(selectedOffer.createdAt) }}
            </p>
            <div class="bg-blue-50 p-4 rounded-lg">
              <p class="text-blue-700">
                <i class="pi pi-info-circle mr-2"></i>
                회신기한: {{ getDaysUntilDeadline(selectedOffer.deadline) === '마감' ? '마감' : 'D-' + getDaysUntilDeadline(selectedOffer.deadline) }}
              </p>
            </div>
            <!-- 버튼 추가 -->
            <div class="flex gap-2 justify-end">
              <Button label="수락하기" class="p-button-success" @click="acceptOffer(selectedOffer)" />
              <Button label="거절하기" class="p-button-danger" @click="rejectOffer(selectedOffer)" />
            </div>
          </div>

          <!-- 수락된 경우 -->
          <div v-else-if="selectedOffer.status === 'accepted'" class="space-y-4">
            <div class="space-y-2">
              <p class="text-gray-600">
                <i class="pi pi-clock mr-2"></i>
                제안받은 날짜: {{ formatDate(selectedOffer.createdAt) }}
              </p>
              <p class="text-green-600">
                <i class="pi pi-check-circle mr-2"></i>
                수락 날짜: {{ formatDate(selectedOffer.acceptedAt) }}
              </p>
            </div>

            <!-- 면접 일정 관련 정보 -->
            <div v-if="selectedOffer.interviewConfirmed" class="bg-green-50 p-4 rounded-lg">
              <h4 class="font-medium text-gray-900 mb-2">확정된 면접 일정</h4>
              <div class="grid grid-cols-2 gap-4">
                <div class="flex items-center gap-2">
                  <i class="pi pi-calendar text-green-600"></i>
                  <span class="text-gray-700">{{ selectedOffer.interviewDate }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <i class="pi pi-clock text-green-600"></i>
                  <span class="text-gray-700">{{ selectedOffer.interviewTime }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <i class="pi pi-video text-green-600"></i>
                  <span class="text-gray-700">
                    {{ selectedOffer.interviewType === 'online' ? '화상 면접' : '대면 면접' }}
                  </span>
                </div>
                <div class="flex items-center gap-2">
                  <i class="pi pi-map-marker text-green-600"></i>
                  <span class="text-gray-700">{{ selectedOffer.interviewLocation }}</span>
                </div>
              </div>
              <p class="mt-4 text-green-600 flex items-center gap-2">
                <i class="pi pi-check-circle"></i>
                <span>{{ formatDate(selectedOffer.interviewConfirmedAt) }}에 면접 일정이 확정되었습니다</span>
              </p>
            </div>
            <div v-else-if="selectedOffer.interviewProposed" class="space-y-4">
              <!-- 면접 일정 정보를 담은 파란색 박스 -->
              <div class="bg-blue-50 p-4 rounded-lg">
                <h4 class="font-medium text-gray-900 mb-2">제안된 면접 일정</h4>
                <!-- 회신기한 추가 -->
                <p class="text-blue-700 mb-4">
                  <i class="pi pi-info-circle mr-2"></i>
                  회신기한: D-3
                </p>
                <div class="space-y-4 mb-4">
                  <div
                    v-for="(dateSlot, index) in selectedOffer.proposedDates"
                    :key="index"
                    class="flex items-center gap-4 p-3 bg-white rounded-lg"
                  >
                    <input
                      type="radio"
                      :name="'interview-date-' + selectedOffer.id"
                      :value="index"
                      v-model="selectedDateIndices[selectedOffer.id]"
                      @click.stop
                    />
                    <div>
                      <div class="font-medium">{{ dateSlot.date }}</div>
                      <div class="text-sm text-gray-600">{{ dateSlot.time }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex gap-2 justify-end">
                <Button
                  label="일정 수락"
                  severity="success"
                  @click="acceptInterviewSchedule(selectedOffer)"
                  :disabled="selectedDateIndices[selectedOffer.id] === undefined"
                />
                <Button
                  label="면접 거절"
                  severity="danger"
                  @click="rejectInterviewSchedule(selectedOffer)"
                />
              </div>
            </div>
            <div v-else-if="!selectedOffer.interviewConfirmed" class="space-y-4">
              <div class="bg-yellow-50 p-4 rounded-lg">
                <p class="text-yellow-700">
                  <i class="pi pi-clock mr-2"></i>
                  면접 일정 조율 중입니다. 기업 담당자가 일정을 전달할 예정입니다.
                </p>
              </div>
            </div>
          </div>

          <!-- 거절된 경우 -->
          <div v-else-if="selectedOffer.status === 'rejected'" class="space-y-4">
            <div class="space-y-2">
              <p class="text-gray-600">
                <i class="pi pi-clock mr-2"></i>
                제안받은 날짜: {{ formatDate(selectedOffer.createdAt) }}
              </p>
              <p class="text-red-600">
                <i class="pi pi-times-circle mr-2"></i>
                {{ formatDate(selectedOffer.rejectedAt) }}에 거절되었습니다
              </p>
              <!-- 거절 사유 표시 추가 -->
              <div v-if="selectedOffer.rejectReason" class="bg-red-50 p-4 rounded-lg mt-2">
                <p class="text-red-700">
                  <span class="font-medium">거절 사유:</span><br>
                  {{ selectedOffer.rejectReason }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- 제안 당시 이력서 정보 표시 부분 수정 -->
        <div v-if="selectedOffer?.resumeSnapshot" class="border-t mt-6 pt-6">
          <div class="flex items-center justify-between mb-4">
            <h4 class="font-medium text-gray-900">제안 당시 이력서 정보</h4>
            <div class="text-sm text-gray-500">
              <i class="pi pi-clock mr-1"></i>
              {{ formatDate(selectedOffer.createdAt) }} 기준
            </div>
          </div>

          <!-- 기본 정보 -->
          <div class="bg-gray-50 p-6 rounded-lg mb-6">
            <h3 class="text-lg font-medium mb-4">기본 정보</h3>
            <div class="grid grid-cols-[1fr_1fr_auto] gap-x-8">
              <!-- 왼쪽 컬럼 -->
              <div class="grid grid-cols-[80px_auto] gap-y-2 text-sm text-gray-600">
                <span class="text-gray-600">이름</span>
                <span>{{ selectedOffer.resumeSnapshot.basicInfo.name }}</span>
                <span class="text-gray-600">생년월일</span>
                <span>{{ selectedOffer.resumeSnapshot.basicInfo.birthDate }}</span>
                <span class="text-gray-600">성별</span>
                <span>{{ selectedOffer.resumeSnapshot.basicInfo.gender }}</span>
                <span class="text-gray-600">휴대폰</span>
                <span>{{ selectedOffer.resumeSnapshot.basicInfo.phone }}</span>
                <span class="text-gray-600">이메일</span>
                <span>{{ selectedOffer.resumeSnapshot.basicInfo.email }}</span>
                <span class="text-gray-600">주소</span>
                <span>{{ selectedOffer.resumeSnapshot.basicInfo.address }}</span>
              </div>

              <!-- 가운데 컬럼 -->
              <div class="grid grid-cols-[100px_auto] gap-y-2 text-sm text-gray-600">
                <span class="text-gray-600">범죄경력</span>
                <span class="flex items-center gap-2">
                  <i class="pi pi-file-pdf text-red-500"></i>
                  {{ selectedOffer.resumeSnapshot.basicInfo.criminalRecordFile?.name || '미제출' }}
                </span>
                <span class="text-gray-600">한국어능력</span>
                <span>{{ selectedOffer.resumeSnapshot.basicInfo.koreanProficiency || '미입력' }}</span>
                <span class="text-gray-600">학습기간</span>
                <span>{{ selectedOffer.resumeSnapshot.basicInfo.koreanStudyDuration || '미입력' }}</span>
                <span class="text-gray-600">방문경험</span>
                <span>{{ selectedOffer.resumeSnapshot.basicInfo.koreanVisitExperience || '미입력' }}</span>
                <span class="text-gray-600">혼인여부</span>
                <span>{{ selectedOffer.resumeSnapshot.basicInfo.maritalStatus || '미입력' }}</span>
              </div>

              <!-- 프로필 사진 (오른쪽) -->
              <div class="flex flex-col items-center">
                <div class="w-[140px] h-[180px] bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    v-if="selectedOffer.resumeSnapshot.basicInfo.profileImage"
                    :src="selectedOffer.resumeSnapshot.basicInfo.profileImage"
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

          <!-- 경력 정보 -->
          <div class="bg-gray-50 p-6 rounded-lg mb-6">
            <div class="flex items-center gap-2 mb-4">
              <h3 class="text-lg font-medium">경력 사항</h3>
              <span class="text-sm text-[#8B8BF5] bg-[#8B8BF5] bg-opacity-10 px-2 py-1 rounded">
                총 {{ calculateTotalCareer(selectedOffer.resumeSnapshot.careers) }}
              </span>
            </div>
            <div v-if="selectedOffer.resumeSnapshot.careers?.length > 0">
              <div v-for="career in selectedOffer.resumeSnapshot.careers" 
                   :key="career.companyName" 
                   class="mb-4 pb-4 border-b last:border-b-0">
                <div class="flex justify-between items-start">
                  <div>
                    <div class="flex items-center gap-2">
                      <div class="font-medium">{{ career.companyName }}</div>
                      <span class="text-sm text-gray-500">({{ calculatePeriod(career.period) }})</span>
                    </div>
                    <div class="text-gray-600">{{ career.period }}</div>
                    <div class="text-gray-600">{{ career.jobCategory?.label || 'IT개발·데이터' }} | {{ career.jobTitle }} | {{ career.department }}</div>
                    <div class="mt-2">{{ career.responsibilities }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center text-gray-500">등록된 경력이 없습니다</div>
          </div>

          <!-- 학력 정보 -->
          <div class="bg-gray-50 p-6 rounded-lg mb-6">
            <div class="mb-4">
              <h3 class="text-lg font-medium">학력 사항</h3>
            </div>
            <div v-if="selectedOffer.resumeSnapshot.educations?.length > 0">
              <div class="text-[#8B8BF5] mb-4">
                최종학력: {{ getLatestEducation(selectedOffer.resumeSnapshot.educations) }}
              </div>
              <div v-for="education in selectedOffer.resumeSnapshot.educations" 
                   :key="education.schoolName">
                <div class="flex justify-between items-start">
                  <div>
                    <div class="mb-2">{{ education.schoolName }}</div>
                    <div class="text-gray-600">{{ education.educationType.name }}</div>
                    <div class="text-gray-600">{{ education.major }}</div>
                    <div class="text-gray-600">{{ education.period }}</div>
                    <div>{{ education.details }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center text-gray-500">등록된 학력이 없습니다</div>
          </div>

          <!-- 학력 정보 섹션 다음에 자격증 섹션 추가 (파일 표시 제거) -->
          <div class="bg-gray-50 p-6 rounded-lg">
            <div class="mb-4">
              <h3 class="text-lg font-medium">자격증 사항</h3>
            </div>
            <div v-if="selectedOffer.resumeSnapshot.certifications?.length" class="space-y-4">
              <div v-for="(cert, index) in selectedOffer.resumeSnapshot.certifications" 
                :key="index" 
                class="mb-4 pb-4 border-b last:border-b-0"
              >
                <div class="flex items-start">
                  <div>
                    <div class="font-medium mb-1">{{ cert.name }}</div>
                    <div class="text-gray-600">
                      <div>취득일: {{ cert.date }}</div>
                      <div>발급기관: {{ cert.organization }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center text-gray-500">
              등록된 자격증이 없습니다
            </div>
          </div>
        </div>
      </div>
    </Dialog>

    <!-- 거절 사유 입력 모달 추가 -->
    <Dialog 
      v-model:visible="showRejectReasonModal" 
      :modal="true" 
      header="면접 거절 사유" 
      :style="{ width: '500px' }"
    >
      <div class="p-6">
        <div class="space-y-4">
          <p class="text-xl mb-2">면접을 거절하시겠습니까?</p>
          <div class="space-y-2">
            <p class="text-gray-600">거절 사유를 입력해주세요.</p>
            <textarea
              v-model="rejectReason"
              rows="4"
              placeholder="예: 다른 회사의 채용 과정이 진행 중입니다."
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8FA1FF] resize-none"
            ></textarea>
          </div>
          <div class="space-y-1 mt-4">
            <p class="text-sm text-gray-600">거절 시 기업 담당자에게 알림과 메일이 발송됩니다.</p>
            <p class="text-sm text-red-500">이 결정은 되돌릴 수 없습니다.</p>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <Button 
            label="취소" 
            class="p-button-text" 
            @click="showRejectReasonModal = false" 
          />
          <Button 
            label="거절" 
            severity="danger" 
            @click="confirmReject" 
          />
        </div>
      </template>
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

:deep(.p-button.p-button-outlined) {
  background: transparent;
  border-color: #8B8BF5;
  color: #8B8BF5;
}

:deep(.p-button.p-button-outlined:hover) {
  background: rgba(139, 139, 245, 0.04);
  border-color: #7070F3;
  color: #7070F3;
}

/* 프로필 이미지 관련 스타일 추가 */
.profile-image-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e5e7eb;
  color: #9ca3af;
}
</style>
