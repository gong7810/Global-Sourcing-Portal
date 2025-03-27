<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import MultiSelect from 'primevue/multiselect';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';

// 검색 필터 상태 관리
const searchKeyword = ref('');
const selectedCareer = ref(null);
const selectedNationalities = ref([]);
const selectedSkills = ref([]);

const router = useRouter();

// 필터 옵션
const careerOptions = [
  { label: '신입', value: 'entry' },
  { label: '1~3년', value: 'junior' },
  { label: '4~7년', value: 'middle' },
  { label: '8년 이상', value: 'senior' }
];

const nationalityOptions = [
  { label: '베트남', value: 'VN' },
  { label: '중국', value: 'CN' },
  { label: '일본', value: 'JP' },
  { label: '기타', value: 'OTHER' }
];


// 임시 인재 데이터
const talents = ref([
  {
    id: 1,
    name: '홍길동',
    nationality: '베트남',
    career: '5년',
    birthdate: '1996.09.01',
    gender: '남성',
    phone: '010-1234-5678',
    email: 'hong@example.com',
    address: '서울시 강남구 테헤란로 123',
    profileImage: {
      url: '/images/profile1.jpg',
      exists: true
    },
    passportName: 'HONG GILDONG',
    passportNumber: 'M1234****',
    passportExpiry: '2028-09-01',
    jobCategory: { label: 'IT개발·데이터', value: 'it' },
    isBookmarked: true,
    careers: [
      {
        company: '(주)테크솔루션',
        period: '2021.03 - 2024.03',
        jobCategory: { label: 'IT개발·데이터', value: 'it' },
        position: '프론트엔드 개발자 | 개발팀',
        description: '웹 서비스 프론트엔드 개발 및 유지보수\n- React, TypeScript 기반 웹 애플리케이션 개발\n- 성능 최적화 및 사용자 경험 개선',
        file: {
          name: '테크솔루션_경력증명서.pdf',
          size: '1.2MB',
          exists: true
        }
      },
      {
        company: '(주)스타트업',
        period: '2019.03 - 2021.02',
        jobCategory: { label: 'IT개발·데이터', value: 'it' },
        position: '웹 개발자 | 서비스개발팀',
        description: '자사 웹 서비스 개발\n- Vue.js 기반 프론트엔드 개발\n- REST API 연동 및 기능 구현',
        file: {
          name: '스타트업_경력증명서.pdf',
          size: '1.1MB',
          exists: true
        }
      }
    ],
    education: [
      {
        school: '하노이공과대학교',
        type: '대학교(4년)',
        major: '컴퓨터공학',
        period: '2015.03 - 2019.02',
        description: '학점 4.0/4.5\n웹 개발 동아리 회장\n알고리즘 경진대회 수상',
        file: {
          name: '하노이공과대학교_졸업증명서.pdf',
          size: '1.5MB',
          exists: true
        }
      }
    ],
    certificates: [
      {
        name: 'TOPIK 6급',
        issuedDate: '2023-05-15'
      },
      {
        name: 'AWS Solutions Architect Associate',
        issuedDate: '2023-08-20'
      },
      {
        name: 'JLPT N1',
        issuedDate: '2023-07-10'
      }
    ],
    criminalRecordFile: {
      name: '범죄경력확인서.pdf',
      size: '1.2MB',
      exists: true
    },
    koreanProficiency: '고급',
    koreanStudyDuration: '2년',
    koreanVisitExperience: '없음',
    maritalStatus: '미혼'
  },
  {
    id: 2,
    name: '김철수',
    nationality: '중국',
    career: '3년',
    birthdate: '1997.05.15',
    gender: '남성',
    phone: '010-2345-6789',
    email: 'kim@example.com',
    address: '서울시 서초구 서초대로 456',
    education: '베이징대학교',
    major: '소프트웨어공학',
    passportName: 'KIM CHEOLSOO',
    passportNumber: 'M5678****',
    passportExpiry: '2027-05-15',
    jobCategory: { label: 'IT개발·데이터', value: 'it' },
    isBookmarked: true,
    careers: [
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
        type: '대학교(4년)',
        major: '소프트웨어공학',
        period: '2016.09 - 2020.08',
        description: '학점 3.8/4.0\n클라우드 컴퓨팅 연구실 인턴\n교내 프로그래밍 대회 2위'
      }
    ],
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
      },
      {
        name: '정보처리기사',
        issuedDate: '2022-08-15'
      }
    ]
  },
  {
    id: 3,
    name: '이영희',
    nationality: '일본',
    career: '7년',
    birthdate: '1994.08.20',
    gender: '여성',
    phone: '010-3456-7890',
    email: 'lee@example.com',
    address: '서울시 송파구 올림픽로 789',
    education: '도쿄대학교',
    major: '전자공학',
    passportName: 'LEE YOUNGHEE',
    passportNumber: 'M9012****',
    passportExpiry: '2026-08-20',
    jobCategory: { label: 'IT개발·데이터', value: 'it' },
    isBookmarked: false,
    careers: [
      {
        company: '(주)소프트뱅크',
        period: '2020.04 - 2024.03',
        jobCategory: { label: 'IT개발·데이터', value: 'it' },
        position: '시스템 아키텍트 | 플랫폼개발팀',
        description: '클라우드 플랫폼 설계 및 개발\n- AWS 기반 클라우드 아키텍처 설계\n- 마이크로서비스 아키텍처 구축\n- DevOps 파이프라인 구축'
      },
      {
        company: '(주)테크놀로지',
        period: '2017.03 - 2020.03',
        jobCategory: { label: 'IT개발·데이터', value: 'it' },
        position: '백엔드 개발자 | 백엔드팀',
        description: '자사 서비스 백엔드 개발\n- Java 기반 서버 애플리케이션 개발\n- 데이터베이스 설계 및 최적화'
      }
    ],
    education: [
      {
        school: '도쿄대학교',
        type: '대학교(4년)',
        major: '전자공학',
        period: '2013.04 - 2017.03',
        description: '학점 4.2/4.5\n정보처리기사 자격증 취득\n교내 IT 창업 동아리 부회장'
      }
    ],
    certificates: [
      {
        name: 'TOPIK 6급',
        issuedDate: '2023-06-20'
      },
      {
        name: 'JLPT N1',
        issuedDate: '2023-01-15'
      },
      {
        name: 'Microsoft Azure Administrator',
        issuedDate: '2023-09-05'
      },
      {
        name: '정보보안기사',
        issuedDate: '2022-11-30'
      },
      {
        name: 'OPIC IH',
        issuedDate: '2023-04-25'
      }
    ]
  }
]);

const showResumeModal = ref(false);
const selectedCandidate = ref(null);
const isAccepted = ref(false);

const openResumeModal = (candidate) => {
  selectedCandidate.value = candidate;
  showResumeModal.value = true;
};

const toggleBookmark = (talent) => {
  talent.isBookmarked = !talent.isBookmarked;
};

const openInterviewOffer = (talent) => {
  router.push(`/business/interview-offer/create/${talent.id}`);
};

const searchTalents = () => {
  // 검색 로직 구현
  console.log('Searching with filters:', {
    keyword: searchKeyword.value,
    career: selectedCareer.value,
    nationalities: selectedNationalities.value,
    skills: selectedSkills.value
  });
};

// 직무 카테고리 데이터
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

// 필터 상태
const filters = ref({
  jobCategory: null,
  nationality: null,
  career: null,
  keyword: ''
});

// 필터링된 후보자 목록
const filteredCandidates = computed(() => {
  return talents.value.filter(candidate => {
    // 직무 카테고리 필터
    const categoryMatch = !filters.value.jobCategory || 
      candidate.jobCategory === filters.value.jobCategory;
    
    // 국적 필터
    const nationalityMatch = !filters.value.nationality || 
      candidate.nationality === filters.value.nationality;
    
    // 경력 필터
    const careerMatch = !filters.value.career || 
      candidate.career === filters.value.career;
    
    // 키워드 검색 (이름, 학교, 전공)
    const keyword = filters.value.keyword.toLowerCase();
    const keywordMatch = !keyword || 
      candidate.name.toLowerCase().includes(keyword) ||
      candidate.education.toLowerCase().includes(keyword) ||
      candidate.major.toLowerCase().includes(keyword);

    return categoryMatch && nationalityMatch && careerMatch && keywordMatch;
  });
});

// 향후 일괄 선택을 위한 상태만 준비
const selectedTalentIds = ref([]);

// 개별 경력 기간 계산 함수
const calculateCareerPeriod = (period) => {
  const [start, end] = period.split(' - ');
  const startDate = new Date(start.split('.').join('-'));
  const endDate = end === '현재' ? new Date() : new Date(end.split('.').join('-'));
  
  const years = endDate.getFullYear() - startDate.getFullYear();
  const months = endDate.getMonth() - startDate.getMonth();
  
  let totalMonths = years * 12 + months;
  if (totalMonths < 12) {
    return `${totalMonths}개월`;
  }
  
  const remainingYears = Math.floor(totalMonths / 12);
  const remainingMonths = totalMonths % 12;
  
  if (remainingMonths === 0) {
    return `${remainingYears}년`;
  }
  return `${remainingYears}년 ${remainingMonths}개월`;
};

// 최종학력 표시 함수
const getLatestEducation = (education) => {
  if (!education || education.length === 0) return '정보 없음';
  const latestEdu = education[0]; // 배열의 첫 번째 항목이 가장 최근 학력이라고 가정
  return `${latestEdu.school} ${latestEdu.type} (${latestEdu.major})`;
};

// 총 경력 계산 함수
const calculateTotalCareer = (careers) => {
  if (!careers?.length) return '0년';
  
  let totalMonths = 0;
  
  careers.forEach(career => {
    const [start, end] = career.period.split(' - ');
    const startDate = new Date(start.split('.').join('-'));
    const endDate = end === '현재' ? new Date() : new Date(end.split('.').join('-'));
    
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
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center gap-4">
        <i
          class="pi pi-angle-left text-4xl text-gray-600 cursor-pointer transition-colors hover:text-[#8FA1FF]"
          @click="router.back()"
        ></i>
        <h1 class="text-3xl font-bold">인재 검색</h1>
      </div>
    </div>

    <!-- 검색 필터 섹션 -->
    <div class="bg-white p-6 rounded-lg shadow-sm mb-6">
      <div class="flex items-center gap-4">
        <!-- 국적 필터 -->
        <div class="w-[200px]">
          <label class="block text-sm font-medium text-gray-700 mb-1">국적</label>
          <MultiSelect
            v-model="selectedNationalities"
            :options="nationalityOptions"
            optionLabel="label"
            placeholder="전체"
            class="w-full"
          />
        </div>

        <!-- 경력 필터 -->
        <div class="w-[150px]">
          <label class="block text-sm font-medium text-gray-700 mb-1">경력</label>
          <Dropdown
            v-model="selectedCareer"
            :options="careerOptions"
            optionLabel="label"
            placeholder="전체"
            class="w-full"
          />
        </div>

        <!-- 직무 카테고리 필터 -->
        <div class="w-[200px]">
          <label class="block text-sm font-medium text-gray-700 mb-1">직무</label>
          <Dropdown
            v-model="filters.jobCategory"
            :options="jobCategories"
            optionLabel="label"
            placeholder="전체"
            class="w-full"
          />
        </div>

        <!-- 키워드 검색 -->
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 mb-1">키워드</label>
          <InputText 
            v-model="searchKeyword"
            placeholder="이름, 학교, 전공 등"
            class="w-full"
          />
        </div>

        <!-- 검색 버튼 -->
        <div class="self-end mb-[2px]">
          <Button 
            @click="searchTalents" 
            class="bg-[#8B8BF5] text-white px-6 h-[42px]"
          >
            검색하기
          </Button>
        </div>
      </div>
    </div>

    <!-- 인재 목록 -->
    <div class="grid grid-cols-1 gap-4">
      <div v-for="talent in filteredCandidates" :key="talent.id" 
        class="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200">
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-3">
              <h3 class="text-lg font-bold">{{ talent.name }}</h3>
              <span class="text-sm text-gray-600">{{ talent.nationality }}</span>
              <span class="bg-[#8B8BF5] bg-opacity-10 text-[#8B8BF5] px-3 py-1 rounded-full text-sm">
                경력 {{ talent.career }}
              </span>
            </div>
            
            <div class="text-gray-600">
              <p>{{ talent.education[0].school }} · {{ talent.education[0].major }}</p>
            </div>
          </div>

          <div class="flex flex-col items-end gap-3">
            <button 
              @click="toggleBookmark(talent)" 
              :class="[
                'hover:text-[#8B8BF5]', 
                talent.isBookmarked ? 'text-[#8B8BF5]' : 'text-gray-400'
              ]"
            >
              <i :class="['pi', talent.isBookmarked ? 'pi-bookmark-fill' : 'pi-bookmark']"></i>
            </button>
            <button 
              @click="openResumeModal(talent)" 
              class="w-[140px] px-4 py-2 border border-[#8B8BF5] text-[#8B8BF5] rounded-lg hover:bg-gray-50"
            >
              이력서 보기
            </button>
            <button 
              @click="openInterviewOffer(talent)" 
              class="w-[140px] px-4 py-2 bg-[#8B8BF5] text-white rounded-lg hover:bg-[#7A7AE6]"
            >
              면접 제안하기
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 이력서 상세 모달 -->
    <Dialog 
      v-model:visible="showResumeModal" 
      :modal="true"
      :style="{ width: '80vw' }"
      :maximizable="true"
    >
      <template #header>
        <div class="text-2xl font-bold">이력서</div>
      </template>

      <div class="p-4">
        <!-- 기본 정보 -->
        <div class="mb-8 bg-gray-50 p-6 rounded-lg">
          <h3 class="text-lg font-medium mb-4">기본 정보</h3>
          <div class="grid grid-cols-[1fr_1fr_auto] gap-x-8">
            <!-- 왼쪽 컬럼 -->
            <div class="grid grid-cols-[80px_auto] gap-y-2 text-sm text-gray-600">
              <span class="text-gray-600">이름</span>
              <span>{{ selectedCandidate?.name }}</span>
              <span class="text-gray-600">생년월일</span>
              <span>{{ selectedCandidate?.birthdate }}</span>
              <span class="text-gray-600">성별</span>
              <span>{{ selectedCandidate?.gender }}</span>
              <span class="text-gray-600">휴대폰</span>
              <span>{{ isAccepted ? selectedCandidate?.phone : '면접 제안 수락 후 확인 가능' }}</span>
              <span class="text-gray-600">이메일</span>
              <span>{{ isAccepted ? selectedCandidate?.email : '면접 제안 수락 후 확인 가능' }}</span>
              <span class="text-gray-600">주소</span>
              <span>{{ isAccepted ? selectedCandidate?.address : '면접 제안 수락 후 확인 가능' }}</span>
            </div>

            <!-- 가운데 컬럼 -->
            <div class="grid grid-cols-[100px_auto] gap-y-2 text-sm text-gray-600">
              <span class="text-gray-600">범죄경력</span>
              <span v-if="isAccepted" class="flex items-center gap-2">
                <i class="pi pi-file-pdf text-red-500"></i>
                {{ selectedCandidate?.criminalRecordFile?.name || '미제출' }}
              </span>
              <span v-else>면접 제안 수락 후 확인 가능</span>
              
              <span class="text-gray-600">한국어능력</span>
              <span>{{ selectedCandidate?.koreanProficiency || '미입력' }}</span>
              <span class="text-gray-600">학습기간</span>
              <span>{{ selectedCandidate?.koreanStudyDuration || '미입력' }}</span>
              <span class="text-gray-600">한국방문경험</span>
              <span>{{ selectedCandidate?.koreanVisitExperience || '미입력' }}</span>
              <span class="text-gray-600">혼인여부</span>
              <span>{{ selectedCandidate?.maritalStatus || '미입력' }}</span>
            </div>

            <!-- 프로필 사진 (오른쪽) -->
            <div class="flex flex-col items-center">
              <div class="w-[140px] h-[180px] bg-gray-100 rounded-lg overflow-hidden">
                <img
                  v-if="selectedCandidate?.profileImage?.exists"
                  :src="selectedCandidate.profileImage.url"
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
        <div class="mb-8 bg-gray-50 p-6 rounded-lg">
          <h3 class="text-lg font-medium mb-4">국가</h3>
          <div>
            <span>{{ selectedCandidate?.nationality }}</span>
          </div>
        </div>

        <!-- 여권 -->
        <div class="mb-8 bg-gray-50 p-6 rounded-lg">
          <h3 class="text-lg font-medium mb-4">여권</h3>
          <div class="grid gap-y-4">
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">이름</span>
              <span>{{ selectedCandidate?.passportName }}</span>
            </div>
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">여권번호</span>
              <span>{{ selectedCandidate?.passportNumber }}</span>
            </div>
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">국적</span>
              <span>{{ selectedCandidate?.nationality }}</span>
            </div>
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">만료일</span>
              <span>{{ selectedCandidate?.passportExpiry }}</span>
            </div>
          </div>
        </div>

        <!-- 경력 사항 -->
        <div class="mb-8 bg-gray-50 p-6 rounded-lg">
          <div class="flex items-center gap-2 mb-4">
            <h3 class="text-lg font-medium">경력 사항</h3>
            <span class="text-sm text-[#8B8BF5] bg-[#8B8BF5] bg-opacity-10 px-2 py-1 rounded">
              총 {{ calculateTotalCareer(selectedCandidate?.careers) }}
            </span>
          </div>
          <div v-for="(career, index) in selectedCandidate?.careers" :key="index" 
            class="mb-4 pb-4 border-b last:border-b-0">
            <div class="flex items-center gap-2">
              <div class="font-medium">{{ career.company }}</div>
              <span class="text-sm text-gray-500">({{ calculateCareerPeriod(career.period) }})</span>
            </div>
            <div class="text-gray-600">{{ career.period }}</div>
            <div class="text-gray-600">{{ career.jobCategory.label }} | {{ career.position }}</div>
            <div class="mt-2 whitespace-pre-line">{{ career.description }}</div>
          </div>
        </div>

        <!-- 학력 사항 -->
        <div class="mb-8 bg-gray-50 p-6 rounded-lg">
          <div class="mb-4">
            <h3 class="text-lg font-medium">학력 사항</h3>
          </div>
          <div v-if="selectedCandidate?.education?.length">
            <div class="text-[#8B8BF5] mb-4">
              최종학력: {{ selectedCandidate.education[0].school }} 
              ({{ selectedCandidate.education[0].type }})
            </div>
            <div v-for="(edu, index) in selectedCandidate.education" 
              :key="index"
              class="mb-6 pb-6 border-b last:border-b-0"
            >
              <div class="text-[#8B8BF5] mb-2">
                {{ edu.school }} ({{ edu.type }})
              </div>
              <div class="text-gray-600">{{ edu.major }}</div>
              <div class="text-gray-600">{{ edu.period }}</div>
              <div class="whitespace-pre-line">{{ edu.description }}</div>
            </div>
          </div>
        </div>

        <!-- 자격증 사항 -->
        <div class="mb-8 bg-gray-50 p-6 rounded-lg">
          <div class="mb-4">
            <h3 class="text-lg font-medium">자격증 사항</h3>
          </div>
          <div v-if="selectedCandidate?.certificates?.length" class="space-y-4">
            <div v-for="(cert, index) in selectedCandidate.certificates" 
              :key="index" 
              class="mb-4 pb-4 border-b last:border-b-0"
            >
              <div class="font-medium mb-1">{{ cert.name }}</div>
              <div class="text-gray-600">
                취득일: {{ cert.issuedDate }}
              </div>
            </div>
          </div>
          <div v-else class="text-center text-gray-500">
            등록된 자격증이 없습니다
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-4">
          <Button 
            @click="toggleBookmark(selectedCandidate)" 
            :class="[
              'p-button-text', 
              selectedCandidate?.isBookmarked ? 'text-[#8B8BF5]' : 'text-gray-400'
            ]"
          >
            <i 
              :class="['pi', selectedCandidate?.isBookmarked ? 'pi-bookmark-fill' : 'pi-bookmark']" 
              style="font-size: 1.5rem"
            ></i>
          </Button>
          <Button 
            @click="openInterviewOffer(selectedCandidate)" 
            class="bg-[#8B8BF5] hover:bg-[#7A7AE6]"
          >
            면접 제안하기
          </Button>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
:deep(.p-dropdown),
:deep(.p-multiselect) {
  width: 100%;
}

:deep(.p-dropdown-panel),
:deep(.p-multiselect-panel) {
  width: 100%;
}
</style> 