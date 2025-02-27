<script setup>
import { onMounted, ref } from 'vue';
import { useAuthStore } from '@/store/auth/authStore';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import AppTopbar from '@/layout/AppTopbar.vue';
import AppFooter from '@/layout/AppFooter.vue';
import Select from 'primevue/select';
import DatePicker from 'primevue/datepicker';
import InputText from 'primevue/inputtext';
import Checkbox from 'primevue/checkbox';

const router = useRouter();
const showNationalityModal = ref(false);
const showPassportModal = ref(false);
const showCareerModal = ref(false);
const showEducationModal = ref(false);

// 이력서 공개 설정 관련 상태 추가
const visibilityType = ref('private'); // 'public', 'private', 'selective'
const selectedCompanies = ref([]);
const showCompanySelectModal = ref(false);

// 국가/비자 정보 관련 상태
const nationalityInfo = ref({
  country: { name: '대한민국', code: 'KR' }
});

// 여권 정보 관련 상태
const passportInfo = ref({
  passportNumber: '',
  surname: '',
  givenNames: '',
  nationality: '',
  birthDate: null,
  issueDate: null,
  expiryDate: null,
  issuingCountry: '',
  birthPlace: ''
});

// 경력 정보 관련 상태
const careerInfo = ref({
  companyName: '',
  startDate: null,
  endDate: null,
  isCurrentJob: false,
  jobTitle: '',
  department: '',
  responsibilities: ''
});

// 학력 정보 관련 상태
const educationInfo = ref({
  educationType: '',
  schoolName: '',
  major: '',
  startDate: null,
  endDate: null,
  isGraduated: false,
  details: ''
});

// 여권 정보 리스트 상태 추가
const passportList = ref([
  {
    passportNumber: 'M1234****',
    surname: 'CHOI',
    givenNames: 'YEJI',
    nationality: { name: '대한민국', code: 'KR' },
    birthDate: '1996-09-01',
    issueDate: '2020-01-01',
    expiryDate: '2030-01-01',
    issuingCountry: { name: '대한민국', code: 'KR' },
    birthPlace: 'SEOUL'
  }
]);

const countries = [
  { name: '대한민국', code: 'KR' },
  { name: '일본', code: 'JP' },
  { name: '중국', code: 'CN' },
  { name: '미국', code: 'US' },
  { name: '베트남', code: 'VN' },
  { name: '필리핀', code: 'PH' }
];

const basicInfo = ref({
  name: '최예지',
  birthDate: '1996.09.01',
  gender: '여성',
  email: 'ye****@naver.com',
  phone: '010-****-7496',
  address: '윙스타워 505호'
});

const sections = [
  {
    title: '국가',
    placeholder: '국가를 입력해주세요',
    icon: 'pi pi-globe',
    action: () => showNationalityModal.value = true
  },
  {
    title: '여권',
    placeholder: '여권 정보를 입력해주세요',
    icon: 'pi pi-id-card',
    action: () => showPassportModal.value = true
  },
  {
    title: '경력',
    placeholder: '회사명, 재직기간, 직무',
    icon: 'pi pi-briefcase',
    action: () => showCareerModal.value = true
  },
  {
    title: '학력',
    placeholder: '학교명, 재학기간, 전공, 학력',
    icon: 'pi pi-book',
    action: () => showEducationModal.value = true
  }
];

const careerList = ref([
  {
    companyName: '(주)비티포탈',
    period: '2023.03 - 2024.03',
    jobTitle: '프론트엔드 개발자',
    department: '개발팀',
    responsibilities: '웹 서비스 프론트엔드 개발'
  }
]);

const educationList = ref([
  {
    educationType: { name: '대학교(4년)', code: 'UNIVERSITY' },
    schoolName: '한국대학교',
    period: '2015.03 - 2019.02',
    major: '컴퓨터공학과',
    isGraduated: true,
    details: '웹 개발 동아리 활동'
  }
]);

const educationTypes = [
  { name: '고등학교', code: 'HIGH_SCHOOL' },
  { name: '대학교(2,3년)', code: 'COLLEGE' },
  { name: '대학교(4년)', code: 'UNIVERSITY' },
  { name: '대학원(석사)', code: 'MASTERS' },
  { name: '대학원(박사)', code: 'PHD' }
];

const goToEditInfo = () => {
  router.push({ name: 'Profile' });
};

const navigateToSection = (section) => {
  if (section.action) {
    section.action();
  } else if (section.route) {
    router.push(section.route);
  }
};

const closeNationalityModal = () => {
  showNationalityModal.value = false;
};

const saveNationalityInfo = () => {
  // TODO: 저장 로직 구현
  showNationalityModal.value = false;
};

const closePassportModal = () => {
  showPassportModal.value = false;
};

const savePassportInfo = () => {
  // TODO: 저장 로직 구현
  showPassportModal.value = false;
};

const closeCareerModal = () => {
  showCareerModal.value = false;
};

const saveCareerInfo = () => {
  // TODO: 저장 로직 구현
  showCareerModal.value = false;
};

const closeEducationModal = () => {
  showEducationModal.value = false;
};

const saveEducationInfo = () => {
  // TODO: 저장 로직 구현
  showEducationModal.value = false;
};

const formatCurrency = (value) => {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

// 기업 목록 (예시 데이터)
const companies = [
  { name: '(주)비티포탈', id: 1 },
  { name: '삼성전자', id: 2 },
  { name: '네이버', id: 3 },
  { name: '카카오', id: 4 },
];

const visibilityOptions = [
  { label: '전체 공개', value: 'public', icon: 'pi pi-globe' },
  { label: '비공개', value: 'private', icon: 'pi pi-lock' },
  { label: '특정 기업 공개', value: 'selective', icon: 'pi pi-users' }
];

const openCompanySelect = () => {
  showCompanySelectModal.value = true;
};

const closeCompanySelect = () => {
  showCompanySelectModal.value = false;
};

const saveCompanySelection = () => {
  showCompanySelectModal.value = false;
};
</script>

<template>
  <AppTopbar />
  <!-- 전체 컨테이너에 최대 폭 제한과 중앙 정렬 적용 -->
  <div class="max-w-[1200px] mx-auto px-4 py-12">
    <div class="flex items-center gap-4 mb-8">
      <i class="pi pi-angle-left text-4xl text-gray-600 cursor-pointer transition-colors hover:text-[#8FA1FF]"
        @click="router.back()"></i>
      <h1 class="text-3xl font-bold">이력서</h1>
    </div>

    <!-- 이력서 공개 설정 섹션 추가 -->
    <div class="bg-white rounded-lg p-6 mb-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-6">
          <h2 class="font-bold">이력서 공개 설정</h2>
          <div class="flex gap-4">
            <template v-for="option in visibilityOptions" :key="option.value">
              <div @click="visibilityType = option.value"
                class="flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer transition-all"
                :class="visibilityType === option.value ? 'bg-[#8FA1FF] bg-opacity-10 text-[#8FA1FF]' : 'text-gray-600 hover:bg-gray-100'">
                <i :class="option.icon"></i>
                <span>{{ option.label }}</span>
              </div>
            </template>
          </div>
        </div>
        <Button v-if="visibilityType === 'selective'" label="기업 선택" icon="pi pi-search" class="p-button-outlined"
          @click="openCompanySelect" />
      </div>
      <!-- 선택된 기업 표시 영역 -->
      <div v-if="visibilityType === 'selective' && selectedCompanies.length > 0" class="mt-4">
        <div class="flex flex-wrap gap-2">
          <div v-for="company in selectedCompanies" :key="company.id"
            class="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
            <span class="text-sm">{{ company.name }}</span>
            <button @click="selectedCompanies = selectedCompanies.filter(c => c.id !== company.id)"
              class="text-gray-400 hover:text-gray-600">
              <i class="pi pi-times"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 기업 선택 모달 -->
    <div v-if="showCompanySelectModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg w-[600px] max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center p-6 border-b">
          <h2 class="text-xl font-bold">공개할 기업 선택</h2>
          <button @click="closeCompanySelect" class="text-gray-400 hover:text-gray-600">
            <i class="pi pi-times text-xl"></i>
          </button>
        </div>

        <div class="p-6">
          <div class="space-y-4">
            <div v-for="company in companies" :key="company.id"
              class="flex items-center justify-between p-4 border rounded-lg hover:border-[#8FA1FF] cursor-pointer"
              @click="selectedCompanies = selectedCompanies.includes(company)
                ? selectedCompanies.filter(c => c.id !== company.id)
                : [...selectedCompanies, company]">
              <span>{{ company.name }}</span>
              <i :class="selectedCompanies.some(c => c.id === company.id)
                ? 'pi pi-check-circle text-[#8FA1FF]'
                : 'pi pi-circle text-gray-300'"></i>
            </div>
          </div>
        </div>

        <div class="p-6 border-t bg-gray-50 flex justify-center">
          <Button label="선택 완료" class="w-full" @click="saveCompanySelection" />
        </div>
      </div>
    </div>

    <div class="grid gap-4">
      <div class="resume-page">
        <!-- 기본 정보 섹션 -->
        <div class="bg-white rounded-lg p-6 mb-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-bold">기본 정보</h2>
            <Button label="수정" icon="pi pi-pencil" class="p-button-text p-button-sm" @click="goToEditInfo" />
          </div>
          <div class="space-y-4 text-gray-600">
            <div class="flex items-center gap-4">
              <i class="pi pi-user"></i>
              <span>{{ basicInfo.name }}</span>
            </div>
            <div class="flex items-center gap-4">
              <i class="pi pi-calendar"></i>
              <span>{{ basicInfo.birthDate }}</span>
              <span>{{ basicInfo.gender }}</span>
            </div>
            <div class="flex items-center gap-4">
              <i class="pi pi-envelope"></i>
              <span>{{ basicInfo.email }}</span>
            </div>
            <div class="flex items-center gap-4">
              <i class="pi pi-phone"></i>
              <span>{{ basicInfo.phone }}</span>
            </div>
            <div class="flex items-center gap-4">
              <i class="pi pi-map-marker"></i>
              <span>{{ basicInfo.address }}</span>
            </div>
          </div>
        </div>

        <!-- 상세 정보 섹션 -->
        <div class="space-y-6">
          <!-- 국가 섹션 -->
          <div class="bg-white rounded-lg p-6">
            <div class="flex justify-between items-center mb-4">
              <div class="flex items-center gap-3">
                <i class="pi pi-globe text-gray-600"></i>
                <h3 class="font-bold">국가</h3>
              </div>
              <Button label="추가" icon="pi pi-plus" class="p-button-text p-button-sm"
              @click="navigateToSection(sections[0])" />
            </div>

            <!-- 국가 정보 카드 -->
            <div v-if="nationalityInfo.country"
              class="border border-gray-200 rounded-lg p-4 hover:border-[#8FA1FF] transition-colors">
              <div class="flex justify-between items-start">
                <div>
                  <h4 class="font-medium text-lg">{{ nationalityInfo.country.name }}</h4>
                </div>
                <div class="flex gap-2">
                  <button class="text-gray-400 hover:text-gray-600">
                    <i class="pi pi-pencil"></i>
                  </button>
                  <button class="text-gray-400 hover:text-gray-600">
                    <i class="pi pi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
            <p v-else class="text-gray-500 mt-2">국가를 입력해주세요</p>
          </div>

          <!-- 여권 섹션 -->
          <div class="bg-white rounded-lg p-6">
            <div class="flex justify-between items-center mb-4">
              <div class="flex items-center gap-3">
                <i class="pi pi-id-card text-gray-600"></i>
                <h3 class="font-bold">여권</h3>
              </div>
              <Button label="추가" icon="pi pi-plus" class="p-button-text p-button-sm"
                @click="navigateToSection(sections[1])" />
            </div>

            <!-- 여권 정보 카드 -->
            <div class="space-y-4">
              <div v-for="(passport, index) in passportList" :key="index"
                class="border border-gray-200 rounded-lg p-4 hover:border-[#8FA1FF] transition-colors">
                <div class="flex justify-between items-start">
                  <div>
                    <h4 class="font-medium text-lg">{{ passport.surname }} {{ passport.givenNames }}</h4>
                    <p class="text-gray-600 mt-1">여권번호: {{ passport.passportNumber.slice(0, 5) + '****' }}</p>
                    <p class="text-gray-600">국적: {{ passport.nationality.name }}</p>
                    <p class="text-gray-600">만료일: {{ passport.expiryDate }}</p>
                  </div>
                  <div class="flex gap-2">
                    <button class="text-gray-400 hover:text-gray-600">
                      <i class="pi pi-pencil"></i>
                    </button>
                    <button class="text-gray-400 hover:text-gray-600">
                      <i class="pi pi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <p v-if="!passportList.length" class="text-gray-500 mt-2">여권 정보를 입력해주세요</p>
          </div>

          <!-- 경력 섹션 -->
          <div class="bg-white rounded-lg p-6">
            <div class="flex justify-between items-center mb-4">
              <div class="flex items-center gap-3">
                <i class="pi pi-briefcase text-gray-600"></i>
                <h3 class="font-bold">경력</h3>
              </div>
              <Button label="추가" icon="pi pi-plus" class="p-button-text p-button-sm"
                @click="navigateToSection(sections[2])" />
            </div>

            <!-- 경력 리스트 -->
            <div class="space-y-4">
              <div v-for="(career, index) in careerList" :key="index"
                class="border border-gray-200 rounded-lg p-4 hover:border-[#8FA1FF] transition-colors">
                <div class="flex justify-between items-start">
                  <div>
                    <h4 class="font-medium text-lg">{{ career.companyName }}</h4>
                    <p class="text-gray-600 mt-1">{{ career.period }}</p>
                    <p class="text-gray-600">{{ career.jobTitle }} | {{ career.department }}</p>
                    <p class="text-gray-600 mt-2">{{ career.responsibilities }}</p>
                  </div>
                  <div class="flex gap-2">
                    <button class="text-gray-400 hover:text-gray-600">
                      <i class="pi pi-pencil"></i>
                    </button>
                    <button class="text-gray-400 hover:text-gray-600">
                      <i class="pi pi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 학력 섹션 -->
          <div class="bg-white rounded-lg p-6">
            <div class="flex justify-between items-center mb-4">
              <div class="flex items-center gap-3">
                <i class="pi pi-book text-gray-600"></i>
                <h3 class="font-bold">학력</h3>
              </div>
              <Button label="추가" icon="pi pi-plus" class="p-button-text p-button-sm"
                @click="navigateToSection(sections[3])" />
            </div>

            <!-- 학력 리스트 -->
            <div class="space-y-4">
              <div v-for="(education, index) in educationList" :key="index"
                class="border border-gray-200 rounded-lg p-4 hover:border-[#8FA1FF] transition-colors">
                <div class="flex justify-between items-start">
                  <div>
                    <h4 class="font-medium text-lg">{{ education.schoolName }}</h4>
                    <p class="text-gray-600">{{ education.educationType.name }}</p>
                    <p class="text-gray-600 mt-1">{{ education.period }}</p>
                    <p class="text-gray-600">{{ education.major }}</p>
                    <p v-if="education.details" class="text-gray-600 mt-2">{{ education.details }}</p>
                  </div>
                  <div class="flex gap-2">
                    <button class="text-gray-400 hover:text-gray-600">
                      <i class="pi pi-pencil"></i>
                    </button>
                    <button class="text-gray-400 hover:text-gray-600">
                      <i class="pi pi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 국가/비자 정보 모달 -->
  <div v-if="showNationalityModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg w-[600px] max-h-[90vh] overflow-y-auto">
      <!-- 헤더 -->
      <div class="flex justify-between items-center p-6 border-b">
        <h2 class="text-xl font-bold">국적</h2>
        <div class="flex items-center gap-2">
          <button @click="closeNationalityModal" class="text-gray-400 hover:text-gray-600">
            <i class="pi pi-times text-xl"></i>
          </button>
        </div>
      </div>

      <!-- 내용 -->
      <div class="p-6 space-y-6">
        <!-- 국가 선택 -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            국적<span class="text-red-500">*</span>
          </label>
          <Select v-model="nationalityInfo.country" :options="countries" optionLabel="name" placeholder="국적 선택"
            class="w-full" />
        </div>
      </div>

      <!-- 하단 버튼 -->
      <div class="p-6 border-t bg-gray-50 flex justify-center">
        <Button label="저장하기" class="w-full" @click="saveNationalityInfo" />
      </div>
    </div>
  </div>

  <!-- 여권 정보 모달 -->
  <div v-if="showPassportModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg w-[600px] max-h-[90vh] overflow-y-auto">
      <!-- 헤더 -->
      <div class="flex justify-between items-center p-6 border-b">
        <h2 class="text-xl font-bold">여권 정보</h2>
        <div class="flex items-center gap-2">
          <button @click="closePassportModal" class="text-gray-400 hover:text-gray-600">
            <i class="pi pi-times text-xl"></i>
          </button>
        </div>
      </div>

      <!-- 내용 -->
      <div class="p-6 space-y-6">
        <!-- 여권번호 -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            여권번호<span class="text-red-500">*</span>
          </label>
          <InputText v-model="passportInfo.passportNumber" placeholder="여권번호 입력" class="w-full" />
        </div>

        <!-- 성 -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            성 (영문)<span class="text-red-500">*</span>
          </label>
          <InputText v-model="passportInfo.surname" placeholder="영문 성 입력" class="w-full" />
        </div>

        <!-- 이름 -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            이름 (영문)<span class="text-red-500">*</span>
          </label>
          <InputText v-model="passportInfo.givenNames" placeholder="영문 이름 입력" class="w-full" />
        </div>

        <!-- 국적 -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            국적<span class="text-red-500">*</span>
          </label>
          <Select v-model="passportInfo.nationality" :options="countries" optionLabel="name" placeholder="국적 선택"
            class="w-full" />
        </div>

        <!-- 생년월일 -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            생년월일<span class="text-red-500">*</span>
          </label>
          <DatePicker v-model="passportInfo.birthDate" dateFormat="yy.mm.dd" placeholder="YYYY.MM.DD" :showIcon="true"
            class="w-full" />
        </div>

        <!-- 발급일 -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            발급일<span class="text-red-500">*</span>
          </label>
          <DatePicker v-model="passportInfo.issueDate" dateFormat="yy.mm.dd" placeholder="YYYY.MM.DD" :showIcon="true"
            class="w-full" />
        </div>

        <!-- 만료일 -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            만료일<span class="text-red-500">*</span>
          </label>
          <DatePicker v-model="passportInfo.expiryDate" dateFormat="yy.mm.dd" placeholder="YYYY.MM.DD" :showIcon="true"
            class="w-full" />
        </div>

        <!-- 발급국가 -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            발급국가<span class="text-red-500">*</span>
          </label>
          <Select v-model="passportInfo.issuingCountry" :options="countries" optionLabel="name" placeholder="발급국가 선택"
            class="w-full" />
        </div>

        <!-- 출생지 -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            출생지<span class="text-red-500">*</span>
          </label>
          <InputText v-model="passportInfo.birthPlace" placeholder="출생지 입력" class="w-full" />
        </div>
      </div>

      <!-- 하단 버튼 -->
      <div class="p-6 border-t bg-gray-50 flex justify-center">
        <Button label="저장하기" class="w-full" @click="savePassportInfo" />
      </div>
    </div>
  </div>

  <!-- 경력 정보 모달 -->
  <div v-if="showCareerModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg w-[600px] max-h-[90vh] overflow-y-auto">
      <!-- 헤더 -->
      <div class="flex justify-between items-center p-6 border-b">
        <h2 class="text-xl font-bold">경력 정보</h2>
        <div class="flex items-center gap-2">
          <button @click="closeCareerModal" class="text-gray-400 hover:text-gray-600">
            <i class="pi pi-times text-xl"></i>
          </button>
        </div>
      </div>

      <!-- 내용 -->
      <div class="p-6 space-y-6">
        <!-- 회사명 -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            회사명<span class="text-red-500">*</span>
          </label>
          <InputText v-model="careerInfo.companyName" placeholder="회사명 입력" class="w-full" />
        </div>

        <!-- 재직기간 -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            재직기간<span class="text-red-500">*</span>
          </label>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <DatePicker v-model="careerInfo.startDate" dateFormat="yy.mm.dd" placeholder="입사일" :showIcon="true"
                class="w-full" />
            </div>
            <div>
              <DatePicker v-model="careerInfo.endDate" dateFormat="yy.mm.dd" placeholder="퇴사일" :showIcon="true"
                class="w-full" :disabled="careerInfo.isCurrentJob" />
            </div>
          </div>
          <div class="flex items-center gap-2 mt-2">
            <Checkbox v-model="careerInfo.isCurrentJob" :binary="true" />
            <label class="text-sm text-gray-600">재직중</label>
          </div>
        </div>

        <!-- 직무 -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            직무<span class="text-red-500">*</span>
          </label>
          <InputText v-model="careerInfo.jobTitle" placeholder="직무 입력" class="w-full" />
        </div>

        <!-- 부서 -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            부서<span class="text-red-500">*</span>
          </label>
          <InputText v-model="careerInfo.department" placeholder="부서명 입력" class="w-full" />
        </div>

        <!-- 담당업무 -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            담당업무<span class="text-red-500">*</span>
          </label>
          <textarea v-model="careerInfo.responsibilities" rows="4" placeholder="담당업무를 입력해주세요"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8FA1FF] resize-none"></textarea>
        </div>
      </div>

      <!-- 하단 버튼 -->
      <div class="p-6 border-t bg-gray-50 flex justify-center">
        <Button label="저장하기" class="w-full" @click="saveCareerInfo" />
      </div>
    </div>
  </div>

  <!-- 학력 정보 모달 -->
  <div v-if="showEducationModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg w-[600px] max-h-[90vh] overflow-y-auto">
      <!-- 헤더 -->
      <div class="flex justify-between items-center p-6 border-b">
        <h2 class="text-xl font-bold">학력 정보</h2>
        <div class="flex items-center gap-2">
          <button @click="closeEducationModal" class="text-gray-400 hover:text-gray-600">
            <i class="pi pi-times text-xl"></i>
          </button>
        </div>
      </div>

      <!-- 내용 -->
      <div class="p-6 space-y-6">
        <!-- 학력 선택 -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            학력<span class="text-red-500">*</span>
          </label>
          <Select v-model="educationInfo.educationType" :options="educationTypes" optionLabel="name" placeholder="학력 선택"
            class="w-full" />
        </div>

        <!-- 학교명 -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            학교명<span class="text-red-500">*</span>
          </label>
          <InputText v-model="educationInfo.schoolName" placeholder="학교명 입력" class="w-full" />
        </div>

        <!-- 전공 -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            전공<span class="text-red-500">*</span>
          </label>
          <InputText v-model="educationInfo.major" placeholder="전공 입력" class="w-full" />
        </div>

        <!-- 재학기간 -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            재학기간<span class="text-red-500">*</span>
          </label>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <DatePicker v-model="educationInfo.startDate" dateFormat="yy.mm.dd" placeholder="입학일" :showIcon="true"
                class="w-full" />
            </div>
            <div>
              <DatePicker v-model="educationInfo.endDate" dateFormat="yy.mm.dd" placeholder="졸업일" :showIcon="true"
                class="w-full" :disabled="!educationInfo.isGraduated" />
            </div>
          </div>
          <div class="flex items-center gap-2 mt-2">
            <Checkbox v-model="educationInfo.isGraduated" :binary="true" />
            <label class="text-sm text-gray-600">졸업</label>
          </div>
        </div>

        <!-- 주요내용 -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            주요내용
          </label>
          <textarea v-model="educationInfo.details" rows="4" placeholder="프로젝트, 교육내용, 졸업논문 등에 대해 적어주세요"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8FA1FF] resize-none"></textarea>
        </div>
      </div>

      <!-- 하단 버튼 -->
      <div class="p-6 border-t bg-gray-50 flex justify-center">
        <Button label="저장하기" class="w-full" @click="saveEducationInfo" />
      </div>
    </div>
  </div>
  <AppFooter />
</template>

<style scoped>
.w-96 {
  width: 36rem;
}
</style>