<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import { useMessagePop } from '@/plugins/commonutils';
import { getCodeList } from '@/apis/common/commonApis';
import { getOfferList, requestOffer } from '@/apis/company/companyApis';

const router = useRouter();
const messagePop = useMessagePop();

const showDetailModal = ref(false);
const selectedOffer = ref(null);

// 면접 일정 관련 상태
const showScheduleModal = ref(false);
const interviewDates = ref([
  { date: null, hour: null, minute: null },
  { date: null, hour: null, minute: null },
  { date: null, hour: null, minute: null }
]);
const interviewTypeCd = ref(null);
const interviewInfo = ref('');

// 면접 제안 내역 데이터
const interviewOffers = ref([
  {
    id: 1,
    user: {
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
      experiences: [
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
      educations: [
        {
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
        }
      ],
      certifications: [
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
    positionDetail: '웹 서비스 프론트엔드 개발 및 유지보수',
    content: '안녕하세요. 귀하의 프로필을 보고 연락드립니다.',
    statusCd: 'JO_ST_1',
    createdAt: '2024-03-20T11:33:35.000Z',
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
      experiences: [
        {
          company: '(주)테크솔루션',
          period: '2021.01 - 2024.03',
          position: '백엔드 개발자/서버팀',
          description: 'REST API 개발 및 서버 관리'
        }
      ],
      educations: [
        {
          school: '베이징대학교',
          degree: '대학교(4년)',
          major: '소프트웨어공학',
          period: '2016.09 - 2020.06',
          description: '소프트웨어공학 전공',
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
      koreanProficiency: '고급',
      koreanStudyDuration: '2년',
      koreanVisitExperience: '없음',
      maritalStatus: '미혼'
    },
    position: 'Backend Developer',
    positionDetail: 'REST API 개발 및 서버 관리',
    content: '안녕하세요. 귀하의 프로필을 보고 연락드립니다.',
    status: 'JO_ST_2',
    createdAt: '2024-03-15T11:33:35.000Z',
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
      experiences: [
        {
          company: '(주)소프트뱅크',
          period: '2020.04 - 2024.03',
          position: '백엔드 개발자/서버개발팀',
          description: '자바 기반 백엔드 서버 개발'
        }
      ],
      educations: [
        {
          school: '도쿄대학교',
          degree: '대학교(4년)',
          major: '정보공학',
          period: '2014.04 - 2018.03',
          description: '정보공학 전공',
          file: {
            name: '도쿄대_졸업증명서.pdf',
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
      maritalStatus: '미혼'
    },
    position: 'Frontend Developer',
    positionDetail: '웹 애플리케이션 프론트엔드 개발',
    content: '귀하의 프로필을 보고 면접 제안드립니다.',
    status: 'JO_ST_2',
    createdAt: '2024-03-14T11:33:35.000Z',
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
    interviewTypeCd: 'INTERVIEW_TY_1',
    interviewInfo: '서울시 강남구 테헤란로 123 OO빌딩 8층',
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
      experiences: [
        {
          company: '(주)소프트뱅크',
          period: '2020.04 - 2024.03',
          position: '백엔드 개발자/서버개발팀',
          description: '자바 기반 백엔드 서버 개발'
        }
      ],
      educations: [
        {
          school: '도쿄대학교',
          degree: '대학교(4년)',
          major: '정보공학',
          period: '2014.04 - 2018.03',
          description: '정보공학 전공',
          file: {
            name: '도쿄대_졸업증명서.pdf',
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
      maritalStatus: '미혼'
    },
    position: 'Full Stack Developer',
    positionDetail: '웹 서비스 풀스택 개발',
    content: '귀하의 경력이 저희 회사와 잘 맞을 것 같습니다.',
    status: 'JO_ST_2',
    createdAt: '2024-03-12T11:33:35.000Z',
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
    interviewTypeCd: 'INTERVIEW_TY_1',
    interviewInfo: 'https://zoom.us/j/123456789',
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
      experiences: [
        {
          company: '(주)테크솔루션',
          period: '2021.01 - 2024.03',
          position: '백엔드 개발자/서버팀',
          description: 'REST API 개발 및 서버 관리'
        }
      ],
      educations: [
        {
          school: '베이징대학교',
          degree: '대학교(4년)',
          major: '소프트웨어공학',
          period: '2016.09 - 2020.06',
          description: '소프트웨어공학 전공',
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
      koreanProficiency: '고급',
      koreanStudyDuration: '2년',
      koreanVisitExperience: '없음',
      maritalStatus: '미혼'
    },
    position: 'Backend Developer',
    positionDetail: '백엔드 서버 개발',
    content: '백엔드 개발자 포지션에 관심 있으신가요?',
    status: 'JO_ST_3',
    createdAt: '2024-03-10T11:33:35.000Z',
    responseDate: '2024-03-11'
  }
]);

// 필터 상태 추가
const selectedFilter = ref('all');

// 면접 제안 상태 필터 옵션
const jobOfferStateOptions = ref([{ name: '전체', code: 'all' }]);

// 면접 방식 옵션
const interviewTypes = [
  { name: '화상 면접', code: 'INTERVIEW_TY_1' },
  { name: '대면 면접', code: 'INTERVIEW_TY_2' }
];

// 직무 필터 상태 추가
const selectedJobFilter = ref('all');

const koreanLevelOptions = ref([]);
const educationLevelOptions = ref([]);
// 전체 직무 카테고리 옵션
const jobCategoryOptions = ref([]);

// 필터링된 제안 목록
const filteredOffers = computed(() => {
  return interviewOffers.value.filter((offer) => {
    // 상태 필터
    const statusMatch = selectedFilter.value === 'all' || offer.statusCd === selectedFilter.value;

    // 직무 필터
    const jobMatch = selectedJobFilter.value === 'all' || offer.jobCategoryCd === selectedJobFilter.value.code;

    return statusMatch && jobMatch;
  });
});

onMounted(() => {
  getJobOfferStateCode();
  getKoreanLevelCode();
  getEducationLevelCode();
  getJobCategoryCode();

  getJobOfferList();
});

// 면접 제안 상태 코드 조회
const getJobOfferStateCode = async () => {
  const response = await getCodeList(`JOB_OFFER_ST`);

  response.map((item) => {
    jobOfferStateOptions.value.push({
      name: item.name,
      code: item.code
    });
  });
};

// 한국어 실력 코드 조회
const getKoreanLevelCode = async () => {
  const response = await getCodeList(`KOREAN_LV`);

  response.map((item) => {
    koreanLevelOptions.value.push({ name: item.name, code: item.code });
  });
};

// 학력 코드 조회
const getEducationLevelCode = async () => {
  const response = await getCodeList(`EDUCATION_LEVEL`);

  response.map((item) => {
    educationLevelOptions.value.push({
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

// 면접 제안 리스트 조회
const getJobOfferList = async () => {
  const response = await getOfferList();

  interviewOffers.value = response.contents;
};

// 각 직무별 제안 수를 계산하는 함수
const getJobCount = (jobValue) => {
  if (!jobValue?.name) {
    // 전체인 경우
    return interviewOffers.value.length;
  } else {
    return interviewOffers.value.filter((offer) => offer.jobCategoryCd === jobValue.code).length;
  }
};

// 상태에 따른 스타일과 텍스트
const getStatusInfo = (status) => {
  switch (status) {
    case 'JO_ST_1':
      return {
        text: '대기중',
        class: 'bg-yellow-50 text-yellow-600'
      };
    case 'JO_ST_2':
      return {
        text: '수락됨',
        class: 'bg-green-50 text-green-600'
      };
    case 'JO_ST_3':
      return {
        text: '거절됨',
        class: 'bg-red-50 text-red-600'
      };
    default:
      return {
        text: '대기중',
        class: 'bg-yellow-50 text-yellow-600'
      };
  }
};

const openDetailModal = (offer) => {
  selectedOffer.value = offer;
  showDetailModal.value = true;
};

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

const openScheduleModal = (offer) => {
  selectedOffer.value = offer;
  showScheduleModal.value = true;
};

// 시간 형식 변경
const convertToTimestamp = (dateTimeStr) => {
  // "2025.04.07 02:30" 형식을 "2025-04-07T02:30:00" 형식으로 변환
  const [date, time] = dateTimeStr.split(' ');
  const [year, month, day] = date.split('.');

  return `${year}-${month}-${day}T${time}:00.000Z`;
};

const scheduleInterview = async () => {
  // 기존 유효성 검사
  // if (!interviewDates.value[0].date || !interviewDates.value[0].hour || !interviewDates.value[0].minute) {
  if (!interviewDates.value.filter((item) => item.date && item.hour && item.minute).length) {
    alert('최소 하나의 면접 일정을 입력해주세요.');
    return;
  }

  if (!interviewTypeCd.value || !interviewInfo.value) {
    alert('면접 방식과 장소를 입력해주세요.');
    return;
  }

  // 제안된 일정들 필터링 (날짜가 입력된 것만)
  let proposedDates = interviewDates.value
    .filter((d) => d.date && d.hour && d.minute)
    .map((d) => ({
      date: d.date
        .toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        })
        .replace(/\. /g, '-')
        .replace('.', '')
        .replaceAll('-', '.'),
      time: formatTime(d.hour, d.minute)
    }));

  proposedDates = proposedDates.map((item) => {
    return convertToTimestamp(`${item.date} ${item.time}`);
  });

  // 첫 번째 확인 팝업 표시
  messagePop.confirm({
    icon: 'info',
    message: `<div class="text-center">
      <p class="text-xl mb-2">면접 일정을 제안하시겠습니까?</p>
      <div class="text-sm text-gray-600 text-left mt-4">
        <p class="font-medium mb-2">제안된 일정:</p>
        ${proposedDates.map((time) => `<div class="mb-2">${time}</div>`).join('')}
        <p class="mt-2">면접 방식: ${interviewTypeCd === 'INTERVIEW_TY_1' ? '화상 면접' : '대면 면접'}</p>
        <p>장소/링크: ${interviewInfo.value}</p>
        <p class="mt-4 text-red-500">* 확인 시 알림과 이메일이 발송됩니다.</p>
      </div>
    </div>`,
    acceptLabel: '제안',
    rejectLabel: '취소',
    onCloseYes: async () => {
      // TODO: 면접 일정 제안 API 연동
      selectedOffer.value.interviewScheduled = true;
      ['reserveTime1', 'reserveTime2', 'reserveTime3']
        .map((item, index) => {
          selectedOffer.value[item] = proposedDates[index];
        })
        .filter((time) => time);

      selectedOffer.value.interviewTypeCd = interviewTypeCd.value;
      selectedOffer.value.interviewInfo = interviewInfo.value;

      const response = await requestOffer(selectedOffer.value);

      if (response && response.success === undefined) {
        // 성공 메시지 표시
        messagePop.confirm({
          icon: 'info',
          message: `<div class="text-center">
          <p class="text-xl mb-2">면접 일정이 제안되었습니다.</p>
          <p class="text-sm text-gray-600">${selectedOffer.value?.resumeSnapshot?.user?.name}님께 알림과 이메일이 발송되었습니다.</p>
        </div>`,
          acceptLabel: '확인',
          showReject: false,
          onCloseYes: () => {
            showScheduleModal.value = false;
            getJobOfferList();

            // 입력값 초기화
            interviewDates.value = [
              { date: null, hour: null, minute: null },
              { date: null, hour: null, minute: null },
              { date: null, hour: null, minute: null }
            ];
            interviewTypeCd.value = null;
            interviewInfo.value = '';
          }
        });
      } else {
        messagePop.toast('시스템 오류입니다.', 'error');
        showScheduleModal.value = false;
      }
    }
  });
};

// 면접 완료 처리
const completeInterview = () => {
  router.push('/company/InterviewResults');
};

// 샘플 파일 정보 수정 (일부는 파일이 없는 상태로)
const sampleFiles = {
  passport: {
    name: '여권사본.pdf',
    size: '2.1MB',
    exists: true
  },
  experiences: {
    name: '경력증명서.pdf',
    size: '1.5MB',
    exists: false // 파일 없음
  },
  educations: {
    name: '졸업증명서.pdf',
    size: '1.8MB',
    exists: true
  },
  certifications: {
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

    <!-- 필터 섹션 -->
    <div class="flex flex-col gap-4 mb-6">
      <!-- 상태 필터 -->
      <div class="flex gap-2">
        <button
          v-for="option in jobOfferStateOptions"
          :key="option.name"
          @click="selectedFilter = option.code"
          :class="[
            'px-4 py-2 rounded-full text-sm transition-colors',
            selectedFilter === option.code ? 'bg-[#8B8BF5] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          ]"
        >
          {{ option.name }}
          <span class="ml-1">
            ({{ interviewOffers.filter((offer) => option.code === 'all' || offer?.statusCd === option.code).length }})
          </span>
        </button>
      </div>

      <!-- 직무 필터 -->
      <div class="flex items-center gap-2">
        <label class="text-sm font-medium text-gray-700">직무</label>
        <Select
          v-model="selectedJobFilter"
          :options="[{ name: '전체', code: 'all' }, ...jobCategoryOptions]"
          optionLabel="name"
          placeholder="직무 선택"
          class="w-[280px]"
        >
          <template #value="slotProps">
            <div class="flex items-center gap-2">
              <span>{{ slotProps.value?.name || '전체' }}</span>
              <span v-if="slotProps.value?.code !== 'all'" class="text-sm text-gray-500">
                ({{ getJobCount(slotProps.value) }})
              </span>
            </div>
          </template>
          <template #option="slotProps">
            <div class="flex items-center justify-between">
              <span>{{ slotProps.option?.name }}</span>
              <span v-if="slotProps.option?.code !== 'all'" class="text-sm text-gray-500">
                ({{ getJobCount(slotProps.option) }})
              </span>
            </div>
          </template>
        </Select>
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
            to="/company/TalentSearchPage"
            class="inline-flex items-center px-6 py-3 bg-[#8B8BF5] text-white rounded-lg hover:bg-[#7A7AE6] transition-colors"
          >
            <i class="pi pi-search mr-2"></i>
            인재 검색
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
            <h3 class="text-lg font-bold notranslate">{{ offer?.resumeSnapshot?.user?.name }}</h3>
            <span class="text-sm text-gray-600">{{ offer?.resumeSnapshot?.nationality?.name }}</span>
            <span class="bg-[#8B8BF5] bg-opacity-10 text-[#8B8BF5] px-3 py-1 rounded-full text-sm">
              {{
                offer?.resumeSnapshot?.experienceDurationMonth
                  ? '경력 ' +
                    parseInt(offer?.resumeSnapshot?.experienceDurationMonth / 12) +
                    '년 ' +
                    (offer?.resumeSnapshot?.experienceDurationMonth % 12) +
                    '개월'
                  : '신입'
              }}
            </span>
            <span :class="`px-3 py-1 rounded-full text-sm ${getStatusInfo(offer?.statusCd)?.class}`">
              {{ getStatusInfo(offer?.statusCd)?.text }}
            </span>
          </div>
          <div class="text-sm text-gray-500">제안일: {{ offer?.createdAt.slice(0, 10).replaceAll('-', '.') }}</div>
        </div>

        <div v-if="offer?.resumeSnapshot?.finalEducation" class="mb-4">
          <p class="text-gray-600">
            {{
              `${offer?.resumeSnapshot?.finalEducation?.schoolName} ${offer?.resumeSnapshot?.finalEducation?.major} ${offer?.resumeSnapshot?.finalEducation?.isGraduated ? '졸업' : '재학중'}`
            }}
          </p>
        </div>

        <div class="border-t pt-4">
          <div class="mb-4">
            <h4 class="text-base font-bold text-gray-900 mb-2">직무 · 제안 포지션</h4>
            <p class="text-gray-600">{{ convertJobCode(offer?.jobCategoryCd) }} | {{ offer?.position }}</p>
          </div>

          <div class="mb-4">
            <h4 class="text-base font-bold text-gray-900 mb-2">상세 업무</h4>
            <p class="text-gray-600">{{ offer?.positionDetail }}</p>
          </div>

          <div class="mb-4">
            <h4 class="text-base font-bold text-gray-900 mb-2">메시지</h4>
            <p class="text-gray-600">{{ offer?.content }}</p>
          </div>
        </div>

        <div v-if="offer?.statusCd === 'JO_ST_2'" class="mt-4 border-t pt-4">
          <p class="text-green-600">
            <i class="pi pi-check-circle mr-2"></i>
            {{ offer?.updatedAt?.slice(0, 10).replaceAll('-', '.') }}에 수락되었습니다
          </p>

          <!-- 면접 일정이 잡히지 않은 경우에만 버튼 표시 -->
          <div v-if="!offer?.interviewTime && !offer?.interviewInfo" class="mt-3">
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
            <div v-if="offer?.interviewTime" class="p-4 bg-green-50 rounded-lg">
              <p class="text-green-600 font-medium mb-3">확정된 면접 일정</p>
              <div class="space-y-2 ml-4">
                <p class="text-gray-600">날짜·시간: {{ offer?.interviewTime }}</p>
                <p class="text-gray-600">
                  방식: {{ offer?.interviewTypeCd === 'INTERVIEW_TY_1' ? '화상 면접' : '대면 면접' }}
                </p>
                <p class="text-gray-600">장소: {{ offer?.interviewInfo }}</p>
              </div>

              <!-- 면접 완료 -->
              <div v-if="!offer?.resultCd" class="mt-4">
                <Button @click="completeInterview" class="bg-[#8B8BF5] text-white"> 면접 완료 </Button>
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
              <div
                v-for="(time, index) in ['reserveTime1', 'reserveTime2', 'reserveTime3']
                  .map((key) => offer[key])
                  .filter((time) => time)"
                :key="index"
                class="mb-2"
              >
                {{ time }}
              </div>
              <p class="text-gray-600">
                방식: {{ offer?.interviewTypeCd === 'INTERVIEW_TY_1' ? '화상 면접' : '대면 면접' }}
              </p>
              <p class="text-gray-600">장소: {{ offer?.interviewInfo }}</p>
            </div>
          </div>
        </div>

        <div v-if="offer?.statusCd === 'JO_ST_3'" class="mt-4 border-t pt-4">
          <p class="text-red-600">
            <i class="pi pi-times-circle mr-2"></i>
            {{ offer?.updatedAt?.slice(0, 10).replaceAll('-', '.') }}에 거절되었습니다
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

    <!-- 상세 정보 모달을 컴포넌트로 교체 -->
    <InterviewResultsDetailModal
      v-if="showDetailModal"
      v-model:visible="showDetailModal"
      :interviewer="selectedOffer"
      :jobCategoryOptions="jobCategoryOptions"
    />

    <!-- 면접 일정 잡기 모달 -->
    <Dialog v-model:visible="showScheduleModal" modal header="면접 일정 제안하기" :style="{ width: '500px' }">
      <div class="p-4">
        <div class="mb-4">
          <h3 class="font-medium mb-2">후보자</h3>
          <p>{{ selectedOffer?.resumeSnapshot?.user?.name }}</p>
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
              <Select v-model="dateSlot.hour" :options="hours" optionLabel="label" placeholder="시" class="w-full" />
            </div>
            <div>
              <label class="block text-sm mb-1">분</label>
              <Select
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
          <Select
            v-model="interviewTypeCd"
            :options="interviewTypes"
            optionLabel="name"
            optionValue="code"
            placeholder="면접 방식 선택"
            class="w-full"
          />
        </div>

        <div class="mb-4">
          <label class="block font-medium mb-2">면접 장소 또는 화상 면접 링크</label>
          <InputText
            v-model="interviewInfo"
            class="w-full"
            :placeholder="
              interviewTypeCd === 'INTERVIEW_TY_1' ? 'Zoom 링크를 입력해주세요' : '면접 장소를 입력해주세요'
            "
          />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2 pt-[15px]">
          <Button @click="showScheduleModal = false" class="bt_btn p-button-text"> 취소 </Button>
          <Button @click="scheduleInterview" class="bt_btn primary bg-[#8B8BF5]"> 일정 제안하기 </Button>
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
