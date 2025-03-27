<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useMessagePop } from '@/plugins/commonutils';

const router = useRouter();
const messagePop = useMessagePop();

// 면접 제안 내역 데이터
const interviewOffers = ref([
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
            exists: true
          }
        }
      ],
      education: {
        school: '한국대학교',
        degree: '대학교(4년)',
        major: '컴퓨터공학과',
        period: '2015.03 - 2019.02',
        description: '컴퓨터공학과 활동',
        file: {
          name: '한국대학교_졸업증명서.pdf',
          size: '1.5MB',
          exists: true
        }
      },
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
            exists: true
          }
        }
      ],
      profileImage: {
        url: '/images/profile1.jpg',
        exists: true,
        name: '최예지_프로필.jpg',
        size: '500KB'
      },
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
    position: 'Frontend Developer',
    jobDescription: '웹 서비스 프론트엔드 개발 및 유지보수',
    message: '안녕하세요. 귀하의 프로필을 보고 연락드립니다.',
    status: 'pending',
    offerDate: '2024-03-20',
    responseDate: null
  },
  {
    id: 2,
    candidate: {
      name: '김철수',
      nationality: '중국',
      career: '3년',
      birth: '1997.05.15',
      gender: '남성',
      phone: '010-5678-1234',
      email: 'kim@example.com',
      address: '서울시 강남구',
      passportName: 'KIM CHULSOO',
      visaInfo: {
        type: 'M5678****',
        country: '중국',
        expiryDate: '2025-12-31'
      },
      careerHistory: [
        {
          company: '(주)테크솔루션',
          period: '2021.01 - 2024.03',
          position: '백엔드 개발자/서버팀',
          description: 'REST API 개발 및 서버 관리'
        }
      ],
      education: {
        school: '베이징대학교',
        degree: '대학교(4년)',
        major: '소프트웨어공학',
        period: '2016.09 - 2020.06',
        description: '소프트웨어공학 전공'
      },
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
    position: 'Backend Developer',
    jobDescription: 'REST API 개발 및 서버 관리',
    message: '안녕하세요. 귀하의 프로필을 보고 연락드립니다.',
    status: 'accepted',
    offerDate: '2024-03-15',
    responseDate: '2024-03-16',
    interviewScheduled: false
  },
  {
    id: 3,
    candidate: {
      name: '박지민',
      nationality: '일본',
      career: '4년',
      birth: '1995.12.20',
      gender: '여성',
      phone: '010-9012-3456',
      email: 'lee@example.com',
      address: '서울시 서초구',
      passportName: 'LEE YOUNGHEE',
      visaInfo: {
        type: 'M9012****',
        country: '일본',
        expiryDate: '2026-06-30'
      },
      careerHistory: [
        {
          company: '(주)소프트뱅크',
          period: '2020.04 - 2024.03',
          position: '백엔드 개발자/서버개발팀',
          description: '자바 기반 백엔드 서버 개발'
        }
      ],
      education: {
        school: '도쿄대학교',
        degree: '대학교(4년)',
        major: '정보공학',
        period: '2014.04 - 2018.03',
        description: '정보공학 전공'
      },
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
    position: 'Frontend Developer',
    jobDescription: '웹 애플리케이션 프론트엔드 개발',
    message: '귀하의 프로필을 보고 면접 제안드립니다.',
    status: 'accepted',
    offerDate: '2024-03-14',
    responseDate: '2024-03-15',
    interviewScheduled: true,
    proposedDates: [
      {
        date: '2024-03-25',
        time: '14:00'
      },
      {
        date: '2024-03-26',
        time: '10:00'
      },
      {
        date: '2024-03-27',
        time: '15:30'
      }
    ],
    interviewType: 'offline',
    interviewLocation: '서울시 강남구 테헤란로 123 OO빌딩 8층',
    interviewConfirmed: false
  },
  {
    id: 4,
    candidate: {
      name: '이영희',
      nationality: '베트남',
      career: '6년',
      birth: '1995.12.20',
      gender: '여성',
      phone: '010-9012-3456',
      email: 'lee@example.com',
      address: '서울시 서초구',
      passportName: 'LEE YOUNGHEE',
      visaInfo: {
        type: 'M9012****',
        country: '일본',
        expiryDate: '2026-06-30'
      },
      careerHistory: [
        {
          company: '(주)소프트뱅크',
          period: '2020.04 - 2024.03',
          position: '백엔드 개발자/서버개발팀',
          description: '자바 기반 백엔드 서버 개발'
        }
      ],
      education: {
        school: '도쿄대학교',
        degree: '대학교(4년)',
        major: '정보공학',
        period: '2014.04 - 2018.03',
        description: '정보공학 전공'
      },
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
    position: 'Full Stack Developer',
    jobDescription: '웹 서비스 풀스택 개발',
    message: '귀하의 경력이 저희 회사와 잘 맞을 것 같습니다.',
    status: 'accepted',
    offerDate: '2024-03-12',
    responseDate: '2024-03-13',
    interviewScheduled: true,
    proposedDates: [
      {
        date: '2024-03-22',
        time: '10:00'
      },
      {
        date: '2024-03-23',
        time: '14:00'
      },
      {
        date: '2024-03-24',
        time: '11:00'
      }
    ],
    interviewType: 'online',
    interviewLocation: 'https://zoom.us/j/123456789',
    interviewConfirmed: true,
    confirmedDate: {
      date: '2024-03-22',
      time: '10:00'
    }
  },
  {
    id: 5,
    candidate: {
      name: '홍길동',
      nationality: '중국',
      career: '3년',
      birth: '1997.05.15',
      gender: '남성',
      phone: '010-5678-1234',
      email: 'kim@example.com',
      address: '서울시 강남구',
      passportName: 'KIM CHULSOO',
      visaInfo: {
        type: 'M5678****',
        country: '중국',
        expiryDate: '2025-12-31'
      },
      careerHistory: [
        {
          company: '(주)테크솔루션',
          period: '2021.01 - 2024.03',
          position: '백엔드 개발자/서버팀',
          description: 'REST API 개발 및 서버 관리'
        }
      ],
      education: {
        school: '베이징대학교',
        degree: '대학교(4년)',
        major: '소프트웨어공학',
        period: '2016.09 - 2020.06',
        description: '소프트웨어공학 전공'
      },
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
    position: 'Backend Developer',
    jobDescription: '백엔드 서버 개발',
    message: '백엔드 개발자 포지션에 관심 있으신가요?',
    status: 'declined',
    offerDate: '2024-03-10',
    responseDate: '2024-03-11'
  }
]);

// 필터 상태 추가
const selectedFilter = ref('all');

// 필터 옵션
const filterOptions = [
  { label: '전체', value: 'all' },
  { label: '대기중', value: 'pending' },
  { label: '수락됨', value: 'accepted' },
  { label: '거절됨', value: 'declined' }
];

// 직무 필터 상태 추가
const selectedJobFilter = ref('all');

// 전체 직무 카테고리 옵션 (TalentSearchPage와 동일하게 사용)
const jobCategories = [
  { label: '기획·전략', value: 'planning' },
  { label: '마케팅·홍보·조사', value: 'marketing' },
  { label: '회계·세무·재무', value: 'accounting' },
  { label: '인사·노무·HRD', value: 'hr' },
  { label: '총무·법무·사무', value: 'admin' },
  { label: 'IT개발·데이터', value: 'it' },
  { label: '디자인', value: 'design' },
  { label: '영업·판매·무역', value: 'sales' },
  { label: '고객상담·TM', value: 'cs' },
  { label: '구매·자재·물류', value: 'purchasing' },
  { label: '상품기획·MD', value: 'md' },
  { label: '운전·운송·배송', value: 'delivery' },
  { label: '서비스', value: 'service' },
  { label: '생산', value: 'production' },
  { label: '건설·건축', value: 'construction' },
  { label: '의료', value: 'medical' },
  { label: '연구·R&D', value: 'research' },
  { label: '교육', value: 'education' },
  { label: '미디어·문화·스포츠', value: 'media' },
  { label: '금융·보험', value: 'finance' },
  { label: '공공·복지', value: 'public' }
];

// 필터링된 제안 목록
const filteredOffers = computed(() => {
  return interviewOffers.value.filter((offer) => {
    // 상태 필터
    const statusMatch = selectedFilter.value === 'all' || offer.status === selectedFilter.value;

    // 직무 필터
    const jobMatch =
      selectedJobFilter.value === 'all' || (offer.jobCategory?.value || 'it') === selectedJobFilter.value;

    return statusMatch && jobMatch;
  });
});

// 각 직무별 제안 수를 계산하는 함수
const getJobCount = (jobValue) => {
  return interviewOffers.value.filter((offer) => (offer.jobCategory?.value || 'it') === jobValue).length;
};

// 상태에 따른 스타일과 텍스트
const getStatusInfo = (status) => {
  switch (status) {
    case 'pending':
      return {
        text: '대기중',
        class: 'bg-yellow-50 text-yellow-600'
      };
    case 'accepted':
      return {
        text: '수락됨',
        class: 'bg-green-50 text-green-600'
      };
    case 'declined':
      return {
        text: '거절됨',
        class: 'bg-red-50 text-red-600'
      };
  }
};

const showDetailModal = ref(false);
const selectedOffer = ref(null);

const openDetailModal = (offer) => {
  selectedOffer.value = offer;
  showDetailModal.value = true;
};

// 면접 일정 관련 상태
const showScheduleModal = ref(false);
const interviewDates = ref([
  { date: null, hour: null, minute: null },
  { date: null, hour: null, minute: null },
  { date: null, hour: null, minute: null }
]);
const interviewType = ref(null);
const interviewLocation = ref('');

// 시간 선택 옵션 수정
const hours = Array.from({ length: 24 }, (_, i) => {
  const hourStr = i.toString().padStart(2, '0');
  return {
    label: hourStr, // "00", "01", "02" 등의 형식으로 표시
    value: i
  };
});

// 분 선택 옵션을 10분 단위로 수정
const minutes = Array.from({ length: 6 }, (_, i) => {
  const minuteValue = i * 10;
  return {
    label: minuteValue.toString().padStart(2, '0'), // "00", "10", "20", "30", "40", "50"
    value: minuteValue
  };
});

// 시간 포맷팅 함수 수정
const formatTime = (hour, minute) => {
  const hourValue = typeof hour === 'object' ? hour.value : hour;
  const minuteValue = typeof minute === 'object' ? minute.value : minute;
  return `${hourValue.toString().padStart(2, '0')}:${minuteValue.toString().padStart(2, '0')}`;
};

// 면접 방식 옵션
const interviewTypes = [
  { label: '대면 면접', value: 'offline' },
  { label: '화상 면접', value: 'online' }
];

const openScheduleModal = (offer) => {
  selectedOffer.value = offer;
  showScheduleModal.value = true;
};

const scheduleInterview = () => {
  // 기존 유효성 검사
  if (!interviewDates.value[0].date || !interviewDates.value[0].hour || !interviewDates.value[0].minute) {
    alert('최소 하나의 면접 일정을 입력해주세요.');
    return;
  }

  if (!interviewType.value || !interviewLocation.value) {
    alert('면접 방식과 장소를 입력해주세요.');
    return;
  }

  // 제안된 일정들 필터링 (날짜가 입력된 것만)
  const proposedDates = interviewDates.value
    .filter((d) => d.date && d.hour !== null && d.minute !== null)
    .map((d) => ({
      date: d.date
        .toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        })
        .replace(/\. /g, '-')
        .replace('.', ''),
      time: formatTime(d.hour, d.minute)
    }));

  // 첫 번째 확인 팝업 표시
  messagePop.confirm({
    icon: 'info',
    message: `<div class="text-center">
      <p class="text-xl mb-2">${selectedOffer.value.candidate.name}님께 면접 일정을 제안하시겠습니까?</p>
      <div class="text-sm text-gray-600 text-left mt-4">
        <p class="font-medium mb-2">제안된 일정:</p>
        ${proposedDates.map((d, i) => `<p>${i + 1}. ${d.date} ${d.time}</p>`).join('')}
        <p class="mt-2">면접 방식: ${interviewType.value.label}</p>
        <p>장소: ${interviewLocation.value}</p>
        <p class="mt-4 text-red-500">* 확인 시 알림과 이메일이 발송됩니다.</p>
      </div>
    </div>`,
    acceptLabel: '제안하기',
    rejectLabel: '취소',
    onCloseYes: () => {
      // 기존 로직 실행
      selectedOffer.value.interviewScheduled = true;
      selectedOffer.value.proposedDates = proposedDates;
      selectedOffer.value.interviewType = interviewType.value;
      selectedOffer.value.interviewLocation = interviewLocation.value;

      // 성공 메시지 표시
      messagePop.confirm({
        icon: 'info',
        message: `<div class="text-center">
          <p class="text-xl mb-2">면접 일정이 제안되었습니다.</p>
          <p class="text-sm text-gray-600">${selectedOffer.value.candidate.name}님께 알림과 이메일이 발송되었습니다.</p>
        </div>`,
        acceptLabel: '확인',
        showReject: false,
        onCloseYes: () => {
          showScheduleModal.value = false;
          // 입력값 초기화
          interviewDates.value = [
            { date: null, hour: null, minute: null },
            { date: null, hour: null, minute: null },
            { date: null, hour: null, minute: null }
          ];
          interviewType.value = null;
          interviewLocation.value = '';
        }
      });
    }
  });
};

const completeInterview = (offer) => {
  // 면접 완료 처리
  offer.interviewCompleted = true;
  offer.interviewCompletedDate = new Date().toISOString().split('T')[0];
  // 바로 면접 결과 관리 페이지로 이동
  router.push('/business/InterviewResults');
};

// 샘플 파일 정보 수정 (일부는 파일이 없는 상태로)
const sampleFiles = {
  passport: {
    name: '여권사본.pdf',
    size: '2.1MB',
    exists: true
  },
  career: {
    name: '경력증명서.pdf',
    size: '1.5MB',
    exists: false // 파일 없음
  },
  education: {
    name: '졸업증명서.pdf',
    size: '1.8MB',
    exists: true
  },
  certificate: {
    name: '자격증.pdf',
    size: '1.2MB',
    exists: false // 파일 없음
  }
};

// 파일 다운로드 함수 수정
const downloadFile = (fileType, fileInfo, itemName = '') => {
  if (!fileInfo?.exists) {
    alert('업로드된 파일이 없습니다.');
    return;
  }
  const message = itemName 
    ? `${itemName} ${fileType} 파일 다운로드 시도\n파일명: ${fileInfo.name}`
    : `${fileType} 파일 다운로드 시도\n파일명: ${fileInfo.name}`;
  
  alert(`${message}\n(실제 다운로드는 백엔드 연동 후 구현 예정)`);
};

// 경력 기간 계산 함수
const calculateCareerPeriod = (period) => {
  if (!period) return '';
  
  const [start, end] = period.split(' - ');
  if (!start || !end) return '';

  const startDate = new Date(start.replace('.', '-'));
  const endDate = end === '현재' ? new Date() : new Date(end.replace('.', '-'));
  
  const monthDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                   (endDate.getMonth() - startDate.getMonth());
  
  if (monthDiff >= 12) {
    const years = Math.floor(monthDiff / 12);
    const months = monthDiff % 12;
    return months > 0 ? `${years}년 ${months}개월` : `${years}년`;
  }
  
  return `${monthDiff}개월`;
};

// 총 경력 계산 함수
const calculateTotalCareer = (careerHistory) => {
  if (!careerHistory?.length) return '0년';
  
  let totalMonths = 0;
  
  careerHistory.forEach(career => {
    const [start, end] = career.period.split(' - ');
    const startDate = new Date(start.replace('.', '-'));
    const endDate = end === '현재' ? new Date() : new Date(end.replace('.', '-'));
    
    const monthDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                     (endDate.getMonth() - startDate.getMonth());
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
    <div class="flex items-center gap-4 mb-8">
      <i
        class="pi pi-angle-left text-4xl text-gray-600 cursor-pointer transition-colors hover:text-[#8FA1FF]"
        @click="router.back()"
      ></i>
      <h1 class="text-3xl font-bold">면접 제안 내역</h1>
    </div>

    <!-- 필터 섹션 수정 -->
    <div class="flex flex-col gap-4 mb-6">
      <!-- 상태 필터 -->
      <div class="flex gap-2">
        <button
          v-for="option in filterOptions"
          :key="option.value"
          @click="selectedFilter = option.value"
          :class="[
            'px-4 py-2 rounded-full text-sm transition-colors',
            selectedFilter === option.value ? 'bg-[#8B8BF5] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          ]"
        >
          {{ option.label }}
          <span class="ml-1">
            ({{ interviewOffers.filter((offer) => option.value === 'all' || offer.status === option.value).length }})
          </span>
        </button>
      </div>

      <!-- 직무 필터를 드롭다운으로 변경 -->
      <div class="flex items-center gap-2">
        <label class="text-sm font-medium text-gray-700">직무</label>
        <Dropdown
          v-model="selectedJobFilter"
          :options="[{ label: '전체', value: 'all' }, ...jobCategories]"
          optionLabel="label"
          placeholder="직무 선택"
          class="w-[200px]"
        >
          <template #value="slotProps">
            <div class="flex items-center gap-2">
              <span>{{ slotProps.value?.label || '전체' }}</span>
              <span v-if="slotProps.value?.value !== 'all'" class="text-sm text-gray-500">
                ({{ getJobCount(slotProps.value?.value) }})
              </span>
            </div>
          </template>
          <template #option="slotProps">
            <div class="flex items-center justify-between">
              <span>{{ slotProps.option.label }}</span>
              <span v-if="slotProps.option.value !== 'all'" class="text-sm text-gray-500">
                ({{ getJobCount(slotProps.option.value) }})
              </span>
            </div>
          </template>
        </Dropdown>
      </div>
    </div>

    <!-- 제안 목록 (filteredOffers로 변경) -->
    <div class="grid grid-cols-1 gap-4">
      <!-- 면접 제안이 없을 때 표시할 빈 상태 -->
      <div v-if="filteredOffers.length === 0" class="bg-white rounded-lg p-12 shadow-sm text-center">
        <div class="flex flex-col items-center gap-4">
          <div class="w-16 h-16 rounded-full bg-[#8B8BF5] bg-opacity-10 flex items-center justify-center mb-2">
            <i class="pi pi-users text-[#8B8BF5] text-3xl"></i>
          </div>
          <h3 class="text-xl font-medium text-gray-900">
            {{ selectedFilter === 'all' ? '아직 면접 제안 내역이 없습니다' : '해당하는 면접 제안이 없습니다' }}
          </h3>
          <p class="text-gray-500 mb-6">
            {{ selectedFilter === 'all' ? '인재 검색 페이지에서 적합한 인재를 찾아 면접을 제안해보세요' : '' }}
          </p>
          <router-link
            v-if="selectedFilter === 'all'"
            to="/business/TalentSearchPage"
            class="inline-flex items-center px-6 py-3 bg-[#8B8BF5] text-white rounded-lg hover:bg-[#7A7AE6] transition-colors"
          >
            <i class="pi pi-search mr-2"></i>
            인재 검색하기
          </router-link>
        </div>
      </div>

      <!-- 기존 면접 제안 목록 (filteredOffers 사용) -->
      <div
        v-else
        v-for="offer in filteredOffers"
        :key="offer.id"
        class="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200"
      >
        <div class="flex justify-between items-start mb-4">
          <div class="flex items-center gap-3">
            <h3 class="text-lg font-bold">{{ offer.candidate.name }}</h3>
            <span class="text-sm text-gray-600">{{ offer.candidate.nationality }}</span>
            <span class="bg-[#8B8BF5] bg-opacity-10 text-[#8B8BF5] px-3 py-1 rounded-full text-sm">
              경력 {{ offer.candidate.career }}
            </span>
            <span :class="`px-3 py-1 rounded-full text-sm ${getStatusInfo(offer.status).class}`">
              {{ getStatusInfo(offer.status).text }}
            </span>
          </div>
          <div class="text-sm text-gray-500">제안일: {{ offer.offerDate }}</div>
        </div>

        <div class="mb-4">
          <p class="text-gray-600">{{ offer.candidate.education.school }} · {{ offer.candidate.education.major }}</p>
        </div>

        <div class="border-t pt-4">
          <div class="mb-4">
            <h4 class="text-base font-bold text-gray-900 mb-2">직무 · 제안 포지션</h4>
            <p class="text-gray-600">{{ offer.jobCategory?.label || 'IT개발·데이터' }} | {{ offer.position }}</p>
          </div>

          <div class="mb-4">
            <h4 class="text-base font-bold text-gray-900 mb-2">상세 업무</h4>
            <p class="text-gray-600">{{ offer.jobDescription }}</p>
          </div>

          <div class="mb-4">
            <h4 class="text-base font-bold text-gray-900 mb-2">메시지</h4>
            <p class="text-gray-600">{{ offer.message }}</p>
          </div>
        </div>

        <div v-if="offer.status === 'accepted'" class="mt-4 border-t pt-4">
          <p class="text-green-600">
            <i class="pi pi-check-circle mr-2"></i>
            {{ offer.responseDate }}에 수락되었습니다
          </p>

          <!-- 면접 일정이 잡히지 않은 경우에만 버튼 표시 -->
          <div v-if="!offer.interviewScheduled" class="mt-3">
            <button
              @click="openScheduleModal(offer)"
              class="px-4 py-2 bg-[#8B8BF5] text-white rounded-lg hover:bg-[#7A7AE6]"
            >
              면접 일정 잡기
            </button>
          </div>

          <!-- 면접 일정이 이미 잡힌 경우 일정 정보 표시 -->
          <div v-else class="mt-3">
            <h4 class="font-medium text-gray-900 mb-2">면접 일정</h4>

            <!-- 확정된 면접 일정이 있는 경우 -->
            <div v-if="offer.interviewConfirmed" class="p-4 bg-green-50 rounded-lg">
              <p class="text-green-600 font-medium mb-3">확정된 면접 일정</p>
              <div class="space-y-2 ml-4">
                <p class="text-gray-600">날짜: {{ offer.confirmedDate.date }}</p>
                <p class="text-gray-600">시간: {{ offer.confirmedDate.time }}</p>
                <p class="text-gray-600">방식: {{ offer.interviewType === 'online' ? '화상 면접' : '대면 면접' }}</p>
                <p class="text-gray-600">장소: {{ offer.interviewLocation }}</p>
              </div>

              <!-- 면접 완료 버튼 추가 -->
              <div v-if="!offer.interviewCompleted" class="mt-4">
                <Button @click="completeInterview(offer)" class="bg-[#8B8BF5] text-white"> 면접 완료 </Button>
              </div>
              <!-- 면접 완료된 경우 표시 -->
              <div v-else class="mt-4">
                <p class="text-blue-600">
                  <i class="pi pi-check-circle mr-2"></i>
                  면접 완료
                </p>
              </div>
            </div>

            <!-- 아직 확정되지 않은 경우 제안된 일정들 표시 -->
            <div v-else class="space-y-4">
              <div v-for="(date, index) in offer.proposedDates" :key="index" class="mb-2">
                <p class="text-gray-600">제안 {{ index + 1 }}</p>
                <p class="text-gray-600 ml-4">날짜: {{ date.date }}</p>
                <p class="text-gray-600 ml-4">시간: {{ date.time }}</p>
              </div>
              <p class="text-gray-600">방식: {{ offer.interviewType === 'online' ? '화상 면접' : '대면 면접' }}</p>
              <p class="text-gray-600">장소: {{ offer.interviewLocation }}</p>
            </div>
          </div>
        </div>

        <div v-if="offer.status === 'declined'" class="mt-4 border-t pt-4">
          <p class="text-red-600">
            <i class="pi pi-times-circle mr-2"></i>
            {{ offer.responseDate }}에 거절되었습니다
          </p>
        </div>

        <div class="mt-4">
          <button
            class="text-[#8B8BF5] hover:text-[#7A7AE6] flex items-center gap-1"
            @click.stop="openDetailModal(offer)"
          >
            <span>상세 정보 보기</span>
            <i class="pi pi-arrow-right text-sm"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- 상세 정보 모달 -->
    <Dialog
      v-model:visible="showDetailModal"
      modal
      :style="{ width: '80vw', maxHeight: '90vh' }"
      :header="'제안 당시 이력서 정보'"
      :closable="true"
      :closeOnEscape="true"
    >
      <div v-if="selectedOffer" class="p-4">
        <!-- 기본 정보 -->
        <div class="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 class="text-lg font-medium mb-4">기본 정보</h3>
          <div class="grid grid-cols-[1fr_1fr_auto] gap-x-8">
            <!-- 왼쪽 컬럼 -->
            <div class="grid grid-cols-[80px_auto] gap-y-2 text-sm text-gray-600">
              <span class="text-gray-600">이름</span>
              <span>{{ selectedOffer.candidate.name }}</span>
              <span class="text-gray-600">생년월일</span>
              <span>{{ selectedOffer.candidate.birth }}</span>
              <span class="text-gray-600">성별</span>
              <span>{{ selectedOffer.candidate.gender }}</span>
              <span class="text-gray-600">휴대폰</span>
              <span>{{ selectedOffer.status === 'accepted' ? selectedOffer.candidate.phone : '면접 제안 수락 후 확인 가능' }}</span>
              <span class="text-gray-600">이메일</span>
              <span>{{ selectedOffer.status === 'accepted' ? selectedOffer.candidate.email : '면접 제안 수락 후 확인 가능' }}</span>
              <span class="text-gray-600">주소</span>
              <span>{{ selectedOffer.status === 'accepted' ? selectedOffer.candidate.address : '면접 제안 수락 후 확인 가능' }}</span>
            </div>

            <!-- 가운데 컬럼 -->
            <div class="grid grid-cols-[100px_auto] gap-y-2 text-sm text-gray-600">
              <span class="text-gray-600">범죄경력</span>
              <span v-if="selectedOffer.status === 'accepted'" class="flex items-center gap-2">
                <i class="pi pi-file-pdf text-red-500"></i>
                {{ selectedOffer.candidate.criminalRecordFile?.name || '미제출' }}
              </span>
              <span v-else>면접 제안 수락 후 확인 가능</span>
              
              <span class="text-gray-600">한국어능력</span>
              <span>{{ selectedOffer.candidate.koreanProficiency || '미입력' }}</span>
              <span class="text-gray-600">학습기간</span>
              <span>{{ selectedOffer.candidate.koreanStudyDuration || '미입력' }}</span>
              <span class="text-gray-600">한국방문경험</span>
              <span>{{ selectedOffer.candidate.koreanVisitExperience || '미입력' }}</span>
              <span class="text-gray-600">혼인여부</span>
              <span>{{ selectedOffer.candidate.maritalStatus || '미입력' }}</span>
            </div>

            <!-- 프로필 사진 (오른쪽) -->
            <div class="flex flex-col items-center">
              <div class="w-[140px] h-[180px] bg-gray-100 rounded-lg overflow-hidden">
                <img
                  v-if="selectedOffer.candidate.profileImage?.exists"
                  :src="selectedOffer.candidate.profileImage.url"
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
        <div class="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 class="text-lg font-medium mb-4">국가</h3>
          <div>
            <span>{{ selectedOffer.candidate.visaInfo.country }}</span>
          </div>
        </div>

        <!-- 여권 -->
        <div class="bg-gray-50 p-6 rounded-lg mb-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium">여권</h3>
            <div>
              <button
                v-if="sampleFiles.passport.exists"
                @click="downloadFile('여권', sampleFiles.passport)"
                class="flex items-center gap-2 text-[#8B8BF5] hover:text-[#7A7AE6]"
              >
                <i class="pi pi-download"></i>
                <span>파일 다운로드</span>
                <span class="text-sm text-gray-500">({{ sampleFiles.passport.size }})</span>
              </button>
              <span v-else class="text-sm text-gray-500"> 업로드된 파일 없음 </span>
            </div>
          </div>
          <div class="grid gap-y-4">
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">이름</span>
              <span>{{ selectedOffer.candidate.passportName }}</span>
            </div>
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">여권번호</span>
              <span>{{ selectedOffer.candidate.visaInfo.type }}</span>
            </div>
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">국적</span>
              <span>{{ selectedOffer.candidate.visaInfo.country }}</span>
            </div>
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">만료일</span>
              <span>{{ selectedOffer.candidate.visaInfo.expiryDate }}</span>
            </div>
          </div>
        </div>

        <!-- 경력 사항 -->
        <div class="bg-gray-50 p-6 rounded-lg mb-6">
          <div class="flex items-center gap-2 mb-4">
            <h3 class="text-lg font-medium">경력 사항</h3>
            <span class="text-sm text-[#8B8BF5] bg-[#8B8BF5] bg-opacity-10 px-2 py-1 rounded">
              총 {{ calculateTotalCareer(selectedOffer.candidate.careerHistory) }}
            </span>
          </div>
          <div v-if="selectedOffer.candidate.careerHistory?.length">
            <div v-for="(career, index) in selectedOffer.candidate.careerHistory" 
              :key="index" 
              class="mb-4 pb-4 border-b last:border-b-0"
            >
              <div class="flex justify-between items-start">
                <div>
                  <div class="flex items-center gap-2">
                    <div class="font-medium">{{ career.company }}</div>
                    <span class="text-sm text-gray-500">({{ calculateCareerPeriod(career.period) }})</span>
                  </div>
                  <div class="text-gray-600">{{ career.period }}</div>
                  <div class="text-gray-600">{{ career.position.replace('/', ' | ') }}</div>
                  <div class="mt-2">{{ career.description }}</div>
                </div>
                <button
                  v-if="career.file?.exists"
                  @click="downloadFile('경력증명서', career.file, career.company)"
                  class="flex items-center gap-2 text-[#8B8BF5] hover:text-[#7A7AE6] ml-4"
                >
                  <i class="pi pi-download"></i>
                  <span class="text-sm">증명서</span>
                  <span class="text-sm text-gray-500">({{ career.file.size }})</span>
                </button>
                <span v-else class="text-sm text-gray-500 ml-4">
                  증명서 없음
                </span>
              </div>
            </div>
          </div>
          <div v-else class="text-center text-gray-500">
            등록된 경력 사항이 없습니다
          </div>
        </div>

        <!-- 학력 사항 -->
        <div class="bg-gray-50 p-6 rounded-lg mb-6">
          <div class="mb-4">
            <h3 class="text-lg font-medium">학력 사항</h3>
          </div>
          <div v-if="selectedOffer.candidate.education">
            <div class="text-[#8B8BF5] mb-4">
              최종학력: {{ selectedOffer.candidate.education.school }} 
              ({{ selectedOffer.candidate.education.degree }})
            </div>
            <div class="flex justify-between items-start">
              <div>
                <div class="mb-2">{{ selectedOffer.candidate.education.school }}</div>
                <div class="text-gray-600">{{ selectedOffer.candidate.education.degree }}</div>
                <div class="text-gray-600">{{ selectedOffer.candidate.education.major }}</div>
                <div class="text-gray-600">{{ selectedOffer.candidate.education.period }}</div>
                <div>{{ selectedOffer.candidate.education.description }}</div>
              </div>
              <button
                v-if="selectedOffer.candidate.education.file?.exists"
                @click="downloadFile('졸업증명서', selectedOffer.candidate.education.file, selectedOffer.candidate.education.school)"
                class="flex items-center gap-2 text-[#8B8BF5] hover:text-[#7A7AE6] ml-4"
              >
                <i class="pi pi-download"></i>
                <span class="text-sm">졸업증명서</span>
                <span class="text-sm text-gray-500">({{ selectedOffer.candidate.education.file.size }})</span>
              </button>
              <span v-else class="text-sm text-gray-500 ml-4">
                증명서 없음
              </span>
            </div>
          </div>
          <div v-else class="text-center text-gray-500">
            등록된 학력 사항이 없습니다
          </div>
        </div>

        <!-- 자격증 사항 -->
        <div class="bg-gray-50 p-6 rounded-lg">
          <div class="mb-4">
            <h3 class="text-lg font-medium">자격증 사항</h3>
          </div>
          <div v-if="selectedOffer.candidate.certificates?.length" class="space-y-4">
            <div v-for="(cert, index) in selectedOffer.candidate.certificates" 
              :key="index" 
              class="border-b last:border-b-0"
            >
              <div class="flex justify-between items-start">
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <div class="font-medium">{{ cert.name }}</div>
                  </div>
                  <div class="text-sm text-gray-600">
                    <div>취득일: {{ cert.issuedDate }}</div>
                  </div>
                </div>
                <button
                  v-if="cert.file?.exists"
                  @click="downloadFile('자격증', cert.file, cert.name)"
                  class="flex items-center gap-2 text-[#8B8BF5] hover:text-[#7A7AE6] ml-4"
                >
                  <i class="pi pi-download"></i>
                  <span class="text-sm">첨부파일</span>
                  <span class="text-sm text-gray-500">({{ cert.file.size }})</span>
                </button>
                <span v-else class="text-sm text-gray-500 ml-4">
                  첨부파일 없음
                </span>
              </div>
            </div>
          </div>
          <div v-else class="text-center text-gray-500">
            등록된 자격증이 없습니다
          </div>
        </div>
      </div>
    </Dialog>

    <!-- 면접 일정 잡기 모달 -->
    <Dialog v-model:visible="showScheduleModal" :modal="true" header="면접 일정 제안하기" :style="{ width: '500px' }">
      <div class="p-4">
        <div class="mb-4">
          <h3 class="font-medium mb-2">후보자</h3>
          <p>{{ selectedOffer?.candidate.name }}</p>
        </div>

        <!-- 3개의 면접 일정 입력 -->
        <div v-for="(dateSlot, index) in interviewDates" :key="index" class="mb-6">
          <h4 class="font-medium mb-2">면접 일정 {{ index + 1 }}</h4>
          <div class="mb-2">
            <label class="block text-sm mb-1">날짜</label>
            <DatePicker v-model="dateSlot.date" class="w-full" :minDate="new Date()" dateFormat="yy-mm-dd" />
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-sm mb-1">시간</label>
              <Dropdown v-model="dateSlot.hour" :options="hours" optionLabel="label" placeholder="시" class="w-full" />
            </div>
            <div>
              <label class="block text-sm mb-1">분</label>
              <Dropdown
                v-model="dateSlot.minute"
                :options="minutes"
                optionLabel="label"
                placeholder="분"
                class="w-full"
              />
            </div>
          </div>
        </div>

        <div class="mb-4">
          <label class="block font-medium mb-2">면접 방식</label>
          <Dropdown
            v-model="interviewType"
            :options="interviewTypes"
            optionLabel="label"
            placeholder="면접 방식 선택"
            class="w-full"
          />
        </div>

        <div class="mb-4">
          <label class="block font-medium mb-2">면접 장소 또는 화상 면접 링크</label>
          <InputText
            v-model="interviewLocation"
            class="w-full"
            :placeholder="interviewType?.value === 'online' ? 'Zoom 링크를 입력해주세요' : '면접 장소를 입력해주세요'"
          />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <Button @click="showScheduleModal = false" class="p-button-text"> 취소 </Button>
          <Button @click="scheduleInterview" class="bg-[#8B8BF5]"> 일정 제안하기 </Button>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.card {
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}
</style>
