<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import MultiSelect from 'primevue/multiselect';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import { useBookmarkStore } from '@/store/bookmark/bookmarkStore';
import { useInterviewStore } from '@/store/interview/interviewStore';

// 검색 필터 상태 관리
const searchKeyword = ref('');
const selectedCareer = ref(null);
const selectedNationalities = ref([]);
const selectedSkills = ref([]);

const router = useRouter();
const bookmarkStore = useBookmarkStore();
const interviewStore = useInterviewStore();

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

const skillOptions = [
  { label: 'JavaScript', value: 'js' },
  { label: 'Python', value: 'python' },
  { label: 'Java', value: 'java' },
  { label: 'React', value: 'react' },
  { label: 'Vue.js', value: 'vue' }
];

// 임시 인재 데이터
const talents = ref([
  {
    id: 1,
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
        name: '정보처리기사',
        date: '2020-12',
        organization: '한국산업인력공단'
      }
    ],
    isBookmarked: false
  },
  {
    id: 2,
    basicInfo: {
      name: '김철수',
      birthDate: '1995.05.15',
      gender: '남성',
      email: 'cheolsu@naver.com',
      phone: '010-5678-1234',
      address: '서울시 강남구',
      totalCareer: '3년',
      lastEducation: '대학교(4년) 졸업'
    },
    nationalityInfo: '대한민국',
    passportInfo: {
      passportNumber: 'M5678****',
      surname: 'KIM',
      givenNames: 'CHEOLSU',
      nationality: '대한민국',
      birthDate: '1995-05-15',
      issueDate: '2021-01-01',
      expiryDate: '2031-01-01',
      issuingCountry: '대한민국',
      birthPlace: 'BUSAN'
    },
    careers: [
      {
        companyName: '테크솔루션(주)',
        period: '2021.01 - 2024.01',
        jobTitle: '백엔드 개발자',
        department: '서버개발팀',
        responsibilities: 'Java 기반 백엔드 서버 개발'
      }
    ],
    educations: [
      {
        educationType: { name: '대학교(4년)', code: 'UNIVERSITY' },
        schoolName: '서울대학교',
        period: '2014.03 - 2018.02',
        major: '전기전자공학과',
        isGraduated: true,
        details: '알고리즘 동아리 활동'
      }
    ],
    certifications: [],
    isBookmarked: false
  },
  {
    id: 3,
    basicInfo: {
      name: '응우옌반안',
      birthDate: '1997.11.22',
      gender: '남성',
      email: 'vanan@gmail.com',
      phone: '010-9876-5432',
      address: '서울시 마포구',
      totalCareer: '2년',
      lastEducation: '대학교(4년) 졸업'
    },
    nationalityInfo: '베트남',
    passportInfo: {
      passportNumber: 'P8765****',
      surname: 'NGUYEN',
      givenNames: 'VAN ANH',
      nationality: '베트남',
      birthDate: '1997-11-22',
      issueDate: '2022-06-01',
      expiryDate: '2032-06-01',
      issuingCountry: '베트남',
      birthPlace: 'HANOI'
    },
    careers: [
      {
        companyName: '하노이테크(주)',
        period: '2022.01 - 2024.01',
        jobTitle: '모바일 개발자',
        department: '앱개발팀',
        responsibilities: 'Android 앱 개발 및 유지보수'
      }
    ],
    educations: [
      {
        educationType: { name: '대학교(4년)', code: 'UNIVERSITY' },
        schoolName: '하노이공과대학교',
        period: '2016.09 - 2020.06',
        major: '소프트웨어공학과',
        isGraduated: true,
        details: '모바일 앱 개발 프로젝트 다수 참여'
      }
    ],
    certifications: [
      {
        name: 'TOPIK 5급',
        date: '2023-08',
        organization: '국립국제교육원'
      },
      {
        name: 'Android Developer Certificate',
        date: '2022-03',
        organization: 'Google'
      }
    ],
    isBookmarked: false
  }
]);

const showResumeModal = ref(false);
const selectedCandidate = ref(null);

const openResumeModal = (candidate) => {
  selectedCandidate.value = candidate;
  showResumeModal.value = true;
};

// talents 배열이 생성된 후에 북마크 상태를 동기화
onMounted(() => {
  // 각 인재의 북마크 상태를 store의 상태와 동기화
  talents.value.forEach(talent => {
    talent.isBookmarked = bookmarkStore.isBookmarked(talent.id);
  });
});

const toggleBookmark = (talent) => {
  talent.isBookmarked = !talent.isBookmarked;
  bookmarkStore.toggleBookmark(talent);
};

const proposeInterview = (talent) => {
  router.push({
    name: 'CreateInterviewOffer',
    params: { id: talent.id },
    query: {
      name: talent.basicInfo.name,
      nationality: talent.nationalityInfo,
      career: talent.basicInfo.totalCareer,
      education: talent.educations[0].schoolName,
      major: talent.educations[0].major
    }
  });
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

// 버튼 텍스트와 스타일을 계산하는 computed 속성 추가
const getInterviewButtonStyle = computed(() => (talentId) => {
  const hasProposed = interviewStore.hasProposedInterview(talentId);
  console.log('talent id:', talentId, 'has proposed:', hasProposed); // 디버깅용
  return {
    class: hasProposed 
      ? 'w-[120px] px-4 py-2 text-gray-500 border border-gray-300 rounded-lg cursor-default'
      : 'w-[120px] px-4 py-2 bg-[#8B8BF5] text-white rounded-lg hover:bg-[#7A7AE6] transition-colors',
    text: hasProposed ? '제안 완료' : '면접 제안하기',
    disabled: hasProposed
  };
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
        <h1 class="text-3xl font-bold">인재 검색</h1>
      </div>
    </div>

    <!-- 검색 필터 섹션 -->
    <div class="bg-white p-6 rounded-lg shadow-sm mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- 경력 필터 -->
        <div class="col-span-1">
          <label class="block text-sm font-medium text-gray-700 mb-1">경력</label>
          <Dropdown
            v-model="selectedCareer"
            :options="careerOptions"
            optionLabel="label"
            placeholder="경력 선택"
            class="w-full"
          />
        </div>

        <!-- 국적 필터 -->
        <div class="col-span-1">
          <label class="block text-sm font-medium text-gray-700 mb-1">국적</label>
          <MultiSelect
            v-model="selectedNationalities"
            :options="nationalityOptions"
            optionLabel="label"
            placeholder="국적 선택"
            class="w-full"
          />
        </div>

        <!-- 키워드 검색 -->
        <div class="col-span-1">
          <label class="block text-sm font-medium text-gray-700 mb-1">키워드</label>
          <InputText 
            v-model="searchKeyword"
            placeholder="이름, 학교, 전공 등"
            class="w-full"
          />
        </div>
      </div>

      <!-- 검색 버튼 -->
      <div class="mt-4 flex justify-end">
        <Button @click="searchTalents" class="bg-[#8B8BF5] text-white px-6">
          검색하기
        </Button>
      </div>
    </div>

    <!-- 인재 목록 -->
    <div class="grid grid-cols-1 gap-4">
      <div v-for="talent in talents" :key="talent.id" 
        class="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200">
        <div class="flex justify-between items-start">
          <div>
            <div class="flex items-center gap-3 mb-3">
              <h3 class="text-lg font-bold">{{ talent.basicInfo.name }}</h3>
              <span class="text-sm text-gray-600">{{ talent.nationalityInfo }}</span>
              <span class="bg-[#8B8BF5] bg-opacity-10 text-[#8B8BF5] px-3 py-1 rounded-full text-sm">
                경력 {{ talent.basicInfo.totalCareer }}
              </span>
            </div>
            
            <p class="text-gray-600">
              {{ talent.educations[0].schoolName }} · {{ talent.educations[0].major }}
            </p>
          </div>

          <div class="flex flex-col items-end gap-3">
            <button 
              @click.stop="toggleBookmark(talent)"
              class="text-[#8B8BF5] hover:text-[#7A7AE6] transition-colors"
            >
              <i :class="[
                'pi text-xl',
                talent.isBookmarked ? 'pi-bookmark-fill' : 'pi-bookmark'
              ]"></i>
            </button>
            <div class="flex flex-col gap-2">
              <button 
                @click.stop="openResumeModal(talent)"
                class="w-[120px] px-4 py-2 text-[#8B8BF5] border border-[#8B8BF5] rounded-lg hover:bg-[#8B8BF5] hover:text-white transition-colors"
              >
                이력서 보기
              </button>
              <button 
                @click.stop="proposeInterview(talent)"
                :class="getInterviewButtonStyle(talent.id).class"
                :disabled="getInterviewButtonStyle(talent.id).disabled"
              >
                {{ getInterviewButtonStyle(talent.id).text }}
              </button>
            </div>
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
          <div class="grid grid-cols-2 gap-y-4">
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">이름</span>
              <span>{{ selectedCandidate?.basicInfo.name }}</span>
            </div>
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">생년월일</span>
              <span>{{ selectedCandidate?.basicInfo.birthDate }}</span>
            </div>
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">성별</span>
              <span>{{ selectedCandidate?.basicInfo.gender }}</span>
            </div>
            <!-- 연락처 정보는 면접 제안 수락 후에만 표시 -->
            <div v-if="isAccepted" class="flex gap-8">
              <span class="text-gray-600 w-20">연락처</span>
              <span>{{ selectedCandidate?.basicInfo.phone }}</span>
            </div>
            <div v-if="isAccepted" class="flex gap-8">
              <span class="text-gray-600 w-20">이메일</span>
              <span>{{ selectedCandidate?.basicInfo.email }}</span>
            </div>
            <div v-if="isAccepted" class="flex gap-8">
              <span class="text-gray-600 w-20">주소</span>
              <span>{{ selectedCandidate?.basicInfo.address }}</span>
            </div>
            <!-- 연락처 정보가 없을 때 표시할 메시지 -->
            <div v-else class="col-span-2 text-gray-500 italic">
              * 연락처 정보는 면접 제안이 수락된 후 확인하실 수 있습니다
            </div>
          </div>
        </div>

        <!-- 국가 -->
        <div class="mb-8 bg-gray-50 p-6 rounded-lg">
          <h3 class="text-lg font-medium mb-4">국가</h3>
          <div>
            <span>{{ selectedCandidate?.nationalityInfo }}</span>
          </div>
        </div>

        <!-- 여권 -->
        <div class="mb-8 bg-gray-50 p-6 rounded-lg">
          <h3 class="text-lg font-medium mb-4">여권</h3>
          <div class="grid gap-y-4">
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">이름</span>
              <span>{{ selectedCandidate?.passportInfo.givenNames }} {{ selectedCandidate?.passportInfo.surname }}</span>
            </div>
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">여권번호</span>
              <span>{{ selectedCandidate?.passportInfo.passportNumber }}</span>
            </div>
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">국적</span>
              <span>{{ selectedCandidate?.passportInfo.nationality }}</span>
            </div>
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">만료일</span>
              <span>{{ selectedCandidate?.passportInfo.expiryDate }}</span>
            </div>
          </div>
        </div>

        <!-- 경력 사항 -->
        <div class="mb-8 bg-gray-50 p-6 rounded-lg">
          <h3 class="text-lg font-medium mb-4">경력 사항</h3>
          <div v-for="(career, index) in selectedCandidate?.careers" :key="index" class="mb-4">
            <div class="font-medium">{{ career.companyName }}</div>
            <div class="text-gray-600">{{ career.period }}</div>
            <div class="text-gray-600">{{ career.jobTitle }}/{{ career.department }}</div>
            <div class="mt-2">{{ career.responsibilities }}</div>
          </div>
        </div>

        <!-- 학력 사항 -->
        <div class="mb-8 bg-gray-50 p-6 rounded-lg">
          <h3 class="text-lg font-medium mb-4">학력 사항</h3>
          <div v-for="(edu, index) in selectedCandidate?.educations" :key="index" class="mb-4">
            <div class="font-medium">{{ edu.schoolName }}</div>
            <div class="text-gray-600">{{ edu.educationType.name }}</div>
            <div class="text-gray-600">{{ edu.major }}</div>
            <div class="text-gray-600">{{ edu.period }}</div>
            <div>{{ edu.details }}</div>
          </div>
        </div>

        <!-- 자격증 사항 -->
        <div class="mb-8 bg-gray-50 p-6 rounded-lg">
          <h3 class="text-lg font-medium mb-4">자격증 사항</h3>
          <div v-if="selectedCandidate?.certifications?.length > 0">
            <div v-for="(cert, index) in selectedCandidate.certifications" 
                :key="index" 
                class="mb-4 last:mb-0">
              <div class="space-y-1">
                <p class="font-medium text-gray-900">{{ cert.name }}</p>
                <p class="text-sm text-gray-600">취득일: {{ cert.date }}</p>
                <p class="text-sm text-gray-600">발급기관: {{ cert.organization }}</p>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-4 text-gray-500">
            등록된 자격증이 없습니다
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-4">
          <Button 
            @click="toggleBookmark(selectedCandidate)" 
            :class="['p-button-text', selectedCandidate?.isBookmarked ? 'text-[#8B8BF5]' : 'text-gray-400']"
          >
            <i :class="['pi', selectedCandidate?.isBookmarked ? 'pi-bookmark-fill' : 'pi-bookmark']" style="font-size: 1.5rem"></i>
          </Button>
          <Button 
            @click="proposeInterview(selectedCandidate)" 
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