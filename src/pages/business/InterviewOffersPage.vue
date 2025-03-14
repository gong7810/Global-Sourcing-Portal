<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Dialog from 'primevue/dialog';
import Calendar from 'primevue/calendar';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

const router = useRouter();

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
      }
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
      }
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
      }
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
      }
    },
    position: 'Backend Developer',
    jobDescription: '백엔드 서버 개발',
    message: '백엔드 개발자 포지션에 관심 있으신가요?',
    status: 'declined',
    offerDate: '2024-03-10',
    responseDate: '2024-03-11'
  }
]);

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
    label: hourStr,  // "00", "01", "02" 등의 형식으로 표시
  value: i
  };
});

// 분 선택 옵션을 10분 단위로 수정
const minutes = Array.from({ length: 6 }, (_, i) => {
  const minuteValue = i * 10;
  return {
    label: minuteValue.toString().padStart(2, '0'),  // "00", "10", "20", "30", "40", "50"
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
  // 최소 하나의 일정은 필수
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
    .filter(d => d.date && d.hour !== null && d.minute !== null)
    .map(d => ({
      date: d.date.toLocaleDateString('ko-KR', { 
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).replace(/\. /g, '-').replace('.', ''),
      time: formatTime(d.hour, d.minute)
    }));

  // 선택된 제안의 면접 일정 업데이트
  selectedOffer.value.interviewScheduled = true;
  selectedOffer.value.proposedDates = proposedDates;
  selectedOffer.value.interviewType = interviewType.value;
  selectedOffer.value.interviewLocation = interviewLocation.value;

  showScheduleModal.value = false;
  // 입력값 초기화
  interviewDates.value = [
    { date: null, hour: null, minute: null },
    { date: null, hour: null, minute: null },
    { date: null, hour: null, minute: null }
  ];
  interviewType.value = null;
  interviewLocation.value = '';
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

    <!-- 제안 목록 -->
    <div class="grid grid-cols-1 gap-4">
      <!-- 면접 제안이 없을 때 표시할 빈 상태 -->
      <div v-if="interviewOffers.length === 0" class="bg-white rounded-lg p-12 shadow-sm text-center">
        <div class="flex flex-col items-center gap-4">
          <div class="w-16 h-16 rounded-full bg-[#8B8BF5] bg-opacity-10 flex items-center justify-center mb-2">
            <i class="pi pi-users text-[#8B8BF5] text-3xl"></i>
          </div>
          <h3 class="text-xl font-medium text-gray-900">아직 면접 제안 내역이 없습니다</h3>
          <p class="text-gray-500 mb-6">인재 검색 페이지에서 적합한 인재를 찾아 면접을 제안해보세요</p>
          <router-link 
            to="/business/TalentSearchPage"
            class="inline-flex items-center px-6 py-3 bg-[#8B8BF5] text-white rounded-lg hover:bg-[#7A7AE6] transition-colors"
          >
            <i class="pi pi-search mr-2"></i>
            인재 검색하기
          </router-link>
        </div>
      </div>

      <!-- 기존 면접 제안 목록 -->
      <div v-else v-for="offer in interviewOffers" :key="offer.id"
        class="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200">
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
          <div class="text-sm text-gray-500">
            제안일: {{ offer.offerDate }}
          </div>
        </div>

        <div class="mb-4">
          <p class="text-gray-600">{{ offer.candidate.education.school }} · {{ offer.candidate.education.major }}</p>
        </div>

        <div class="border-t pt-4">
          <div class="mb-3">
            <h4 class="font-medium text-gray-900 mb-1">제안 포지션</h4>
            <p class="text-gray-600">{{ offer.position }}</p>
          </div>
          <div class="mb-3">
            <h4 class="font-medium text-gray-900 mb-1">상세 업무</h4>
            <p class="text-gray-600">{{ offer.jobDescription }}</p>
          </div>
          <div>
            <h4 class="font-medium text-gray-900 mb-1">메시지</h4>
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
          <div class="grid grid-cols-2 gap-y-4">
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">이름</span>
              <span>{{ selectedOffer.candidate.name }}</span>
            </div>
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">생년월일</span>
              <span>{{ selectedOffer.candidate.birth }}</span>
            </div>
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">성별</span>
              <span>{{ selectedOffer.candidate.gender }}</span>
            </div>
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">휴대폰</span>
              <span>{{ selectedOffer.candidate.phone }}</span>
            </div>
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">이메일</span>
              <span>{{ selectedOffer.candidate.email }}</span>
            </div>
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">주소</span>
              <span>{{ selectedOffer.candidate.address }}</span>
            </div>
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">경력</span>
              <span>{{ selectedOffer.candidate.career }}</span>
            </div>
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">학력</span>
              <span>{{ selectedOffer.candidate.education.degree }}</span>
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
          <h3 class="text-lg font-medium mb-4">여권</h3>
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
          <h3 class="text-lg font-medium mb-4">경력 사항</h3>
          <div v-for="(career, index) in selectedOffer.candidate.careerHistory" 
            :key="index" 
            class="mb-4"
          >
            <div class="font-medium">{{ career.company }}</div>
            <div class="text-gray-600">{{ career.period }}</div>
            <div class="text-gray-600">{{ career.jobCategory?.label || 'IT개발·데이터' }} | {{ career.position.replace('/', ' | ') }}</div>
            <div class="mt-2">{{ career.description }}</div>
          </div>
        </div>

        <!-- 학력 사항 -->
        <div class="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 class="text-lg font-medium mb-4">학력 사항</h3>
          <div>
            <div class="mb-2">{{ selectedOffer.candidate.education.school }}</div>
            <div class="text-gray-600">{{ selectedOffer.candidate.education.degree }}</div>
            <div class="text-gray-600">{{ selectedOffer.candidate.education.major }}</div>
            <div class="text-gray-600">{{ selectedOffer.candidate.education.period }}</div>
            <div>{{ selectedOffer.candidate.education.description }}</div>
            </div>
            </div>

        <!-- 자격증 사항 -->
        <div class="bg-gray-50 p-6 rounded-lg">
          <h3 class="text-lg font-medium mb-4">자격증 사항</h3>
          <div class="text-center text-gray-500">
            등록된 자격증이 없습니다
          </div>
        </div>
      </div>
    </Dialog>

    <!-- 면접 일정 잡기 모달 -->
    <Dialog 
      v-model:visible="showScheduleModal" 
      :modal="true"
      header="면접 일정 제안하기"
      :style="{ width: '500px' }"
    >
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
          <Calendar 
              v-model="dateSlot.date" 
            :minDate="new Date()"
            dateFormat="yy-mm-dd"
            class="w-full"
          />
        </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-sm mb-1">시간</label>
            <Dropdown
                v-model="dateSlot.hour"
              :options="hours"
                optionLabel="label"
                placeholder="시"
              class="w-full"
            />
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
          <Button 
            @click="showScheduleModal = false"
            class="p-button-text"
          >
            취소
          </Button>
          <Button 
            @click="scheduleInterview"
            class="bg-[#8B8BF5]"
          >
            일정 제안하기
          </Button>
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