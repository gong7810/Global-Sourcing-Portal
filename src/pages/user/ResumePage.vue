<script setup>
import { onMounted, ref, toRaw, watch, onBeforeUnmount } from 'vue';
import { useAuthStore } from '@/store/auth/authStore';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useMessagePop } from '@/plugins/commonutils';
import { random, randomInt } from 'es-toolkit/compat';
import { useUserStore } from '@/store/user/userStore';
import { computed } from 'vue';

const router = useRouter();
const messagePop = useMessagePop();
const userStore = useUserStore();

const showNationalityModal = ref(false);
const showPassportModal = ref(false);
const showCareerModal = ref(false);
const showEducationModal = ref(false);

const careerModifyIdx = ref(-1);
const educationModifyIdx = ref(-1);

const careerModifyFlag = ref(false);
const educationModifyFlag = ref(false);

// 이력서 공개 설정 관련 상태 추가
const visibilityType = ref('private'); // 'public', 'private', 'selective'

const basicInfo = ref({
  name: '최예지',
  birthDate: '1996.09.01',
  gender: '여성',
  email: 'yeji@naver.com',
  phone: '010-1234-7496',
  address: '윙스타워 505호',
  totalCareer: '5년',
  lastEducation: '대학교(4년) 졸업'
});

// 국가/비자 정보 관련 상태
const nationalityInfo = ref('대한민국');

// 여권 정보 관련 상태
const passportInfo = ref({
  passportNumber: 'M1234****',
  surname: 'CHOI',
  givenNames: 'YEJI',
  nationality: '대한민국',
  birthDate: '1996-09-01',
  issueDate: '2020-01-01',
  expiryDate: '2030-01-01',
  issuingCountry: '대한민국',
  birthPlace: 'SEOUL'
});

// 경력리스트
const careerList = ref([
  {
    companyName: '(주)비티포탈',
    period: '2023.01 - 2024.03',
    jobCategory: { label: 'IT개발·데이터', value: 'it' },
    jobTitle: '프론트엔드 개발자',
    department: '개발팀',
    responsibilities: '웹 서비스 프론트엔드 개발'
  }
]);

// 학력리스트
const educationList = ref([
  {
    educationType: { name: '대학교(4년)', code: 'UNIVERSITY' },
    schoolName: '서울대학교',
    period: '2019.03 - 2023.02',
    major: '컴퓨터공학과',
    isGraduated: true,
    details: '졸업논문: AI 기반 추천 시스템 개발',
    isLastEducation: true,
    certificateFile: {
      name: '서울대학교_졸업증명서.pdf',
      size: 1024 * 1024, // 1MB로 가정
      type: 'application/pdf'
    }
  },
  {
    educationType: { name: '대학교(4년)', code: 'UNIVERSITY' },
    schoolName: '한국대학교',
    period: '2015.03 - 2019.02',
    major: '경영학과',
    isGraduated: true,
    details: '복수전공: 경영정보학',
    isLastEducation: false,
    certificateFile: {
      name: '한국대학교_졸업증명서.pdf',
      size: 1024 * 1024,
      type: 'application/pdf'
    }
  },
  {
    educationType: { name: '고등학교', code: 'HIGH_SCHOOL' },
    schoolName: '한국고등학교',
    period: '2012.03 - 2015.02',
    major: '문과계열',
    isGraduated: true,
    details: '학생회장 활동',
    isLastEducation: false,
    certificateFile: {
      name: '한국고등학교_졸업증명서.pdf',
      size: 1024 * 1024,
      type: 'application/pdf'
    }
  }
]);

// basicInfo는 그대로 두고, 프로필 이미지만 computed로 관리
const profileImage = computed(() => userStore.profileImage || '/default-profile.png');

onMounted(() => {
  // TODO: 이력서 정보 조회 api
  // const body = {
  //   id: user.id,
  // }
  // visibilityType.value = response.visibility;
  // basicInfo.value = response.basicInfo;
  // nationalityInfo.value = response.country;
  // passportInfo.value = response.passportInfo;
  // careerList.value = response.careerInfoList;
  // educationList.value = response.educationInfoList;
});

// 경력 정보 관련 상태
const careerInfo = ref({
  companyName: '',
  startDate: null,
  endDate: null,
  isCurrentJob: false,
  jobCategory: null,
  jobTitle: '',
  department: '',
  responsibilities: '',
  certificateFile: null
});

// 학력 정보 관련 상태
const educationInfo = ref({
  educationType: '',
  schoolName: '',
  major: '',
  startDate: null,
  endDate: null,
  isGraduated: false,
  details: '',
  certificateFile: null
});

const countries = [
  { name: '대한민국', code: 'KR' },
  { name: '일본', code: 'JP' },
  { name: '중국', code: 'CN' },
  { name: '미국', code: 'US' },
  { name: '베트남', code: 'VN' },
  { name: '필리핀', code: 'PH' }
];

const sections = [
  {
    title: '국가',
    placeholder: '국가를 입력해주세요',
    icon: 'pi pi-globe',
    action: () => (showNationalityModal.value = true)
  },
  {
    title: '여권',
    placeholder: '여권 정보를 입력해주세요',
    icon: 'pi pi-id-card',
    action: () => (showPassportModal.value = true)
  },
  {
    title: '경력',
    placeholder: '회사명, 재직기간, 직무',
    icon: 'pi pi-briefcase',
    action: () => (showCareerModal.value = true)
  },
  {
    title: '학력',
    placeholder: '학교명, 재학기간, 전공, 학력',
    icon: 'pi pi-book',
    action: () => (showEducationModal.value = true)
  }
];

// 학력종류
const educationTypes = [
  { name: '고등학교', code: 'HIGH_SCHOOL' },
  { name: '대학교(2,3년)', code: 'COLLEGE' },
  { name: '대학교(4년)', code: 'UNIVERSITY' },
  { name: '대학원(석사)', code: 'MASTERS' },
  { name: '대학원(박사)', code: 'PHD' }
];

const goToEditInfo = () => {
  router.push('/user/userPage');
};

const navigateToSection = (section) => {
  if (section.action) {
    section.action();
  } else if (section.route) {
    router.push(section.route);
  }
};

onMounted(() => {
  getResume();
});

const calculateTotalCareer = (careerList) => {
  // 모든 경력 기간을 합산하는 로직
  let totalMonths = 0;
  careerList.forEach((career) => {
    const [start, end] = career.period.split(' - ');
    const startDate = new Date(start);
    const endDate = end === '재직중' ? new Date() : new Date(end);
    const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
    totalMonths += months;
  });
  return `${Math.floor(totalMonths / 12)}년 ${totalMonths % 12}개월`;
};

const getLastEducation = (educationList) => {
  // 최종학력 찾기
  const sortedEducation = [...educationList].sort((a, b) => {
    const eduOrder = {
      PHD: 5,
      MASTERS: 4,
      UNIVERSITY: 3,
      COLLEGE: 2,
      HIGH_SCHOOL: 1
    };
    return eduOrder[b.educationType.code] - eduOrder[a.educationType.code];
  });

  if (sortedEducation.length === 0) return '학력 정보 없음';

  const lastEdu = sortedEducation[0];
  return `${lastEdu.schoolName} ${lastEdu.educationType.name} ${lastEdu.isGraduated ? '졸업' : '재학중'}`;
};

const getResume = async () => {
  // ... existing code ...

  // 총 경력과 최종학력 계산
  basicInfo.value.totalCareer = calculateTotalCareer(careerList.value);
  basicInfo.value.lastEducation = getLastEducation(educationList.value);
};

const closeCareerModal = () => {
  showCareerModal.value = false;
};

// 경력 모달창 감지
watch(
  () => showCareerModal.value,
  () => {
    if (!showCareerModal.value) {
      careerModifyFlag.value = false;
      careerModifyIdx.value = -1;
    }

    // 경력 추가인 경우
    if (!careerModifyFlag.value) {
      careerInfo.value = {
        companyName: '',
        startDate: null,
        endDate: null,
        isCurrentJob: false,
        jobCategory: null,
        jobTitle: '',
        department: '',
        responsibilities: '',
        certificateFile: null
      };
    }
  }
);

// 경력 추가 로직
const saveCareerInfo = () => {
  // 필수 필드 검증
  const requiredFields = {
    companyName: careerInfo.value.companyName,
    startDate: careerInfo.value.startDate,
    jobCategory: careerInfo.value.jobCategory
  };

  // 재직중이 아닐 경우 endDate도 필수
  if (!careerInfo.value.isCurrentJob) {
    requiredFields.endDate = careerInfo.value.endDate;
  }

  // 빈 값 체크
  const hasEmptyField = Object.values(requiredFields).some(value => 
    value === null || value === '' || value === undefined
  );

  if (hasEmptyField) {
    messagePop.toast('필수 항목을 입력해주세요.', 'warn');
    return;
  }

  const insertCareer = {
    companyName: careerInfo.value.companyName,
    period: careerInfo.value.isCurrentJob
      ? `${careerInfo.value.startDate.getFullYear()}.${(careerInfo.value.startDate.getMonth() + 1).toString().padStart(2, '0')} - 재직중`
      : `${careerInfo.value.startDate.getFullYear()}.${(careerInfo.value.startDate.getMonth() + 1).toString().padStart(2, '0')} - ${careerInfo.value.endDate.getFullYear()}.${(careerInfo.value.endDate.getMonth() + 1).toString().padStart(2, '0')}`,
    jobCategory: careerInfo.value.jobCategory,
    jobTitle: careerInfo.value.jobTitle,
    department: careerInfo.value.department,
    responsibilities: careerInfo.value.responsibilities,
    certificateFile: careerInfo.value.certificateFile
  };

  if (careerModifyFlag.value) {
    careerList.value[careerModifyIdx.value] = insertCareer;
  } else {
    careerList.value.push(insertCareer);
  }

  careerModifyFlag.value = false;
  showCareerModal.value = false;
};

// 경력 삭제 로직
const deleteCareer = (index) => {
  messagePop.confirm({
    message: '해당 경력을 삭제하시겠습니까?',
    onCloseYes: () => {
      careerList.value.splice(index, 1);
    }
  });
};

// 경력 수정 로직
const modifyCareer = (index) => {
  careerModifyFlag.value = true;
  careerModifyIdx.value = index;

  let startDate = careerList.value[index].period.split('-')[0];
  let endDate = careerList.value[index].period.split('-')[1];

  console.log(startDate);
  console.log(endDate);

  careerInfo.value = {
    companyName: careerList.value[index].companyName,
    jobCategory: careerList.value[index].jobCategory,
    startDate: new Date(startDate),
    endDate: endDate.trim() !== '재직중' ? new Date(endDate.trim()) : null,
    isCurrentJob: endDate.trim() !== '재직중' ? false : true,
    jobTitle: careerList.value[index].jobTitle,
    department: careerList.value[index].department,
    responsibilities: careerList.value[index].responsibilities,
    certificateFile: careerList.value[index].certificateFile
  };

  showCareerModal.value = true;
};

const closeEducationModal = () => {
  showEducationModal.value = false;
};

// 학력 모달창 감지
watch(
  () => showEducationModal.value,
  () => {
    if (!showEducationModal.value) {
      educationModifyFlag.value = false;
      educationModifyIdx.value = -1;
    }

    // 경력 추가인 경우
    if (!educationModifyFlag.value) {
      educationInfo.value = {
        educationType: '',
        schoolName: '',
        major: '',
        startDate: null,
        endDate: null,
        isGraduated: false,
        details: '',
        certificateFile: null
      };
    }
  }
);

// 학력 추가 로직
const saveEducationInfo = () => {
  // 필수 필드 검증
  const requiredFields = {
    educationType: educationInfo.value.educationType,
    schoolName: educationInfo.value.schoolName,
    major: educationInfo.value.major,
    startDate: educationInfo.value.startDate
  };

  // 대학 이상인 경우에만 졸업증명서 필수
  if (['UNIVERSITY', 'COLLEGE', 'MASTERS', 'PHD'].includes(educationInfo.value.educationType.code)) {
    requiredFields.certificateFile = educationInfo.value.certificateFile;
  }

  // 졸업인 경우 endDate도 필수
  if (educationInfo.value.isGraduated) {
    requiredFields.endDate = educationInfo.value.endDate;
  }

  const hasEmptyField = Object.values(requiredFields).some(value => 
    value === null || value === '' || value === undefined
  );

  if (hasEmptyField) {
    messagePop.toast('필수 항목을 입력해주세요.', 'warn');
    return;
  }

  const insertEdu = {
    educationType: educationInfo.value.educationType,
    schoolName: educationInfo.value.schoolName,
    major: educationInfo.value.major,
    period: !educationInfo.value.isGraduated
      ? `${educationInfo.value.startDate.getFullYear()}.${(educationInfo.value.startDate.getMonth() + 1).toString().padStart(2, '0')} - 재학중`
      : `${educationInfo.value.startDate.getFullYear()}.${(educationInfo.value.startDate.getMonth() + 1).toString().padStart(2, '0')} - ${educationInfo.value.endDate.getFullYear()}.${(educationInfo.value.endDate.getMonth() + 1).toString().padStart(2, '0')}`,
    details: educationInfo.value.details,
    isGraduated: educationInfo.value.isGraduated,
    isLastEducation: false,
    certificateFile: educationInfo.value.certificateFile
  };

  console.log(insertEdu);

  if (educationModifyFlag.value) {
    educationList.value[educationModifyIdx.value] = insertEdu;
  } else {
    educationList.value.push(insertEdu);
  }

  educationModifyFlag.value = false;
  showEducationModal.value = false;
};

//학력 수정 로직
const modifyEducation = (index) => {
  educationModifyFlag.value = true;
  educationModifyIdx.value = index;

  console.log(educationList.value[index]);

  let startDate = educationList.value[index].period.split('-')[0];
  let endDate = educationList.value[index].period.split('-')[1];

  console.log(startDate);
  console.log(endDate);

  educationInfo.value = {
    educationType: educationList.value[index].educationType,
    schoolName: educationList.value[index].schoolName,
    major: educationList.value[index].major,
    startDate: new Date(startDate),
    endDate: endDate.trim() !== '재학중' ? new Date(endDate.trim()) : null,
    isGraduated: endDate.trim() !== '재학중' ? true : false,
    details: educationList.value[index].details,
    certificateFile: educationList.value[index].certificateFile
  };

  showEducationModal.value = true;
};

// 학력 삭제 로직
const deleteEducation = (index) => {
  messagePop.confirm({
    message: '해당 학력을 삭제하시겠습니까?',
    onCloseYes: () => {
      educationList.value.splice(index, 1);
    }
  });
};

const formatCurrency = (value) => {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

const visibilityOptions = [
  { label: '전체 공개', value: 'public', icon: 'pi pi-globe' },
  { label: '비공개', value: 'private', icon: 'pi pi-lock' }
];

// 저장 버튼 클릭 시 실행되는 함수
const saveResume = () => {
  // 1. 기본 정보 필수값 검증만 남기고
  if (!basicInfo.value.name) {
    messagePop.toast('이름을 입력해주세요.', 'warn');
    return;
  }
  if (!basicInfo.value.birthDate) {
    messagePop.toast('생년월일을 입력해주세요.', 'warn');
    return;
  }
  if (!basicInfo.value.phone) {
    messagePop.toast('연락처를 입력해주세요.', 'warn');
    return;
  }
  if (!basicInfo.value.email) {
    messagePop.toast('이메일을 입력해주세요.', 'warn');
    return;
  }
  if (!basicInfo.value.address) {
    messagePop.toast('주소를 입력해주세요.', 'warn');
    return;
  }

  // 저장 확인
  messagePop.confirm({
    message: '이력서를 저장하시겠습니까?',
    onCloseYes: async () => {
      try {
        messagePop.toast('이력서가 저장되었습니다.', 'success');
      } catch (error) {
        console.error('이력서 저장 중 오류:', error);
        messagePop.toast('이력서 저장 중 오류가 발생했습니다.', 'error');
      }
    }
  });
};

// 자격증 관련 상태
const certificationList = ref([]);

// 자격증 추가 함수
const addCertification = () => {
  certificationList.value.push({
    id: Date.now(),
    name: '',
    date: null
  });
};

// 자격증 삭제 함수
const removeCertification = (index) => {
  certificationList.value.splice(index, 1);
};

// 경력 정보 모달의 직무 부분을 수정
// 직무
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

// 개별 경력 기간 계산 함수
const calculateCareerDuration = (period) => {
  const [start, end] = period.split(' - ');
  const startDate = new Date(start);
  const endDate = end === '재직중' ? new Date() : new Date(end);
  
  const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                (endDate.getMonth() - startDate.getMonth());
  
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

// careerList 변경 감지를 위한 watch 추가
watch(careerList, (newCareerList) => {
  basicInfo.value.totalCareer = calculateTotalCareer(newCareerList);
}, { deep: true });

// 최종학력 설정 함수 추가
const setLastEducation = (selectedIndex) => {
  educationList.value.forEach((edu, index) => {
    edu.isLastEducation = index === selectedIndex;
  });
  
  // 선택된 학력을 최종학력으로 설정
  const selectedEducation = educationList.value[selectedIndex];
  basicInfo.value.lastEducation = `${selectedEducation.schoolName} ${selectedEducation.educationType.name} ${selectedEducation.isGraduated ? '졸업' : '재학중'}`;
};

// 파일 업로드 핸들러
const handleCareerFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    if (file.size > 10 * 1024 * 1024) { // 10MB 제한
      messagePop.toast('파일 크기는 10MB를 초과할 수 없습니다.', 'warn');
      return;
    }
    careerInfo.value.certificateFile = file;
  }
};

const handleEducationFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    if (file.size > 10 * 1024 * 1024) { // 10MB 제한
      messagePop.toast('파일 크기는 10MB를 초과할 수 없습니다.', 'warn');
      return;
    }
    educationInfo.value.certificateFile = file;
  }
};
</script>

<template>
  <!-- 전체 컨테이너에 최대 폭 제한과 중앙 정렬 적용 -->
  <div class="max-w-[1200px] mx-auto px-4 py-12">
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center gap-4">
        <i
          class="pi pi-angle-left text-4xl text-gray-600 cursor-pointer transition-colors hover:text-[#8FA1FF]"
          @click="router.back()"
        ></i>
        <h1 class="text-3xl font-bold">이력서</h1>
      </div>
      <Button class="bt_btn primary" label="저장" icon="pi pi-save" @click="saveResume" />
    </div>

    <!-- 이력서 공개 설정 섹션 -->
    <div class="bg-white rounded-lg p-6 mb-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-6">
          <h2 class="font-bold">이력서 공개 설정</h2>
          <div class="flex gap-4">
            <template v-for="option in visibilityOptions" :key="option.value">
              <div
                @click="visibilityType = option.value"
                class="flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer transition-all"
                :class="
                  visibilityType === option.value
                    ? 'bg-[#8FA1FF] bg-opacity-10 text-[#8FA1FF]'
                    : 'text-gray-600 hover:bg-gray-100'
                "
              >
                <i :class="option.icon"></i>
                <span>{{ option.label }}</span>
              </div>
            </template>
          </div>
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
          <div class="flex justify-between items-start">
            <!-- 기본 정보 -->
            <div class="space-y-3 text-gray-600 flex-grow">
              <!-- 이름과 생년월일 그룹 -->
              <div class="flex items-center">
                <span class="text-xl font-medium">{{ basicInfo.name }}</span>
                <span class="ml-4 text-gray-500">{{ basicInfo.gender }} | {{ basicInfo.birthDate }} (만 28세)</span>
              </div>

              <!-- 연락처 정보 그룹 -->
              <div class="grid grid-cols-[80px_auto] gap-y-2">
                <span class="text-gray-500">휴대폰</span>
                <span>{{ basicInfo.phone }}</span>
                <span class="text-gray-500">이메일</span>
                <span class="notranslate">{{ basicInfo.email }}</span>
                <span class="text-gray-500">주소</span>
                <span>{{ basicInfo.address }}</span>
              </div>
            </div>

            <!-- 프로필 이미지 -->
            <div class="flex-shrink-0 ml-8">
              <div class="w-[120px] h-[160px] overflow-hidden border border-gray-200 rounded-sm">
                <img :src="profileImage" alt="프로필 이미지" class="w-full h-full object-cover" />
              </div>
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
            </div>

            <!-- 국가 정보 카드 -->
            <div
              v-if="nationalityInfo"
              class="border border-gray-200 rounded-lg p-4 hover:border-[#8FA1FF] transition-colors"
            >
              <div class="flex justify-between items-start">
                <div>
                  <h4 class="font-medium text-lg">{{ nationalityInfo }}</h4>
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
            </div>

            <!-- 여권 정보 카드 -->
            <div class="space-y-4">
              <div class="border border-gray-200 rounded-lg p-4 hover:border-[#8FA1FF] transition-colors">
                <div class="flex justify-between items-start">
                  <div>
                    <h4 class="font-medium text-lg">{{ passportInfo.surname }} {{ passportInfo.givenNames }}</h4>
                    <p class="text-gray-600 mt-1">여권번호: {{ passportInfo.passportNumber.slice(0, 5) + '****' }}</p>
                    <p class="text-gray-600">국적: {{ passportInfo.nationality }}</p>
                    <p class="text-gray-600">만료일: {{ passportInfo.expiryDate }}</p>
                  </div>
                </div>
              </div>
            </div>
            <p v-if="!passportInfo" class="text-gray-500 mt-2">여권 정보를 입력해주세요</p>

            <!-- 여권 파일 업로드 -->
            <div class="mt-4 border-t pt-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="font-medium">여권 스캔본</span>
                  <span class="text-red-500 text-sm">*필수</span>
                </div>
                <div>
                  <label class="cursor-pointer px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                    <span class="text-sm">파일 선택</span>
                    <input type="file" class="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- 경력 섹션 -->
          <div class="bg-white rounded-lg p-6">
            <div class="flex justify-between items-center mb-4">
              <div class="flex items-center gap-3">
                <i class="pi pi-briefcase text-gray-600"></i>
                <h3 class="font-bold">경력</h3>
                <span class="text-sm text-gray-500">(총 {{ basicInfo.totalCareer }})</span>
              </div>
              <Button
                label="추가"
                icon="pi pi-plus"
                class="p-button-text p-button-sm"
                @click="navigateToSection(sections[2])"
              />
            </div>

            <!-- 경력 리스트 -->
            <div class="space-y-4">
              <div
                v-for="(career, index) in careerList"
                :key="index"
                class="border border-gray-200 rounded-lg p-4 hover:border-[#8FA1FF] transition-colors"
              >
                <div class="flex justify-between items-start">
                  <div>
                    <h4 class="font-medium text-lg">{{ career.companyName }}</h4>
                    <p class="text-gray-600 mt-1">
                      {{ career.period }}
                      <span class="text-sm text-gray-500">
                        ({{ calculateCareerDuration(career.period) }})
                      </span>
                    </p>
                    <p class="text-gray-600">
                      {{ [
                        career.jobCategory?.label,
                        career.jobTitle,
                        career.department
                      ].filter(Boolean).join(' | ') }}
                    </p>
                    <p class="text-gray-600 mt-2">{{ career.responsibilities }}</p>
                  </div>
                  <div class="flex gap-2">
                    <button class="text-gray-400 hover:text-gray-600" @click="modifyCareer(index)">
                      <i class="pi pi-pencil"></i>
                    </button>
                    <button class="text-gray-400 hover:text-gray-600" @click="deleteCareer(index)">
                      <i class="pi pi-trash"></i>
                    </button>
                  </div>
                </div>

                <!-- 경력 리스트 내 파일 표시 부분 -->
                <div v-if="career.certificateFile" class="mt-4 border-t pt-4">
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600">
                      {{ career.period.includes('재직중') ? '재직증명서' : '경력증명서' }}:
                      {{ career.certificateFile.name }}
                    </span>
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
              <Button
                label="추가"
                icon="pi pi-plus"
                class="p-button-text p-button-sm"
                @click="navigateToSection(sections[3])"
              />
            </div>

            <!-- 최종학력 표시 -->
            <div class="mb-4 p-4 bg-gray-50 rounded-lg">
              <div class="flex items-center gap-2">
                <span class="text-gray-600">최종학력:</span>
                <span class="font-medium">{{ basicInfo.lastEducation }}</span>
              </div>
            </div>

            <!-- 학력 리스트 -->
            <div class="space-y-4">
              <div
                v-for="(education, index) in educationList"
                :key="index"
                class="border border-gray-200 rounded-lg p-4 hover:border-[#8FA1FF] transition-colors"
              >
                <div class="flex justify-between items-start">
                  <div class="flex-grow">
                    <!-- 최종학력 체크박스 추가 -->
                    <div class="flex items-center gap-3 mb-2">
                      <Checkbox
                        :modelValue="education.isLastEducation"
                        @update:modelValue="setLastEducation(index)"
                        :binary="true"
                      />
                      <label class="text-sm text-gray-600">최종학력으로 설정</label>
                    </div>
                    <h4 class="font-medium text-lg">{{ education.schoolName }}</h4>
                    <p class="text-gray-600">{{ education.educationType.name }}</p>
                    <p class="text-gray-600 mt-1">{{ education.period }}</p>
                    <p class="text-gray-600">{{ education.major }}</p>
                    <p v-if="education.details" class="text-gray-600 mt-2">{{ education.details }}</p>
                  </div>
                  <div class="flex gap-2">
                    <button class="text-gray-400 hover:text-gray-600" @click="modifyEducation(index)">
                      <i class="pi pi-pencil"></i>
                    </button>
                    <button class="text-gray-400 hover:text-gray-600" @click="deleteEducation(index)">
                      <i class="pi pi-trash"></i>
                    </button>
                  </div>
                </div>

                <!-- 학력 리스트 내 파일 표시 부분 -->
                <div v-if="education.certificateFile" class="mt-4 border-t pt-4">
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600">
                      졸업증명서: {{ education.certificateFile.name }}
                      <span v-if="['UNIVERSITY', 'COLLEGE', 'MASTERS', 'PHD'].includes(education.educationType.code)" class="text-red-500">*필수</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 자격증 섹션 -->
          <div class="bg-white rounded-lg p-6">
            <div class="flex justify-between items-center mb-4">
              <div class="flex items-center gap-3">
                <i class="pi pi-file text-gray-600"></i>
                <h3 class="font-bold">자격증</h3>
              </div>
              <Button
                label="자격증 추가"
                icon="pi pi-plus"
                class="p-button-text p-button-sm"
                @click="addCertification"
              />
            </div>

            <div class="space-y-4">
              <!-- 자격증이 없을 때 -->
              <div
                v-if="certificationList.length === 0"
                class="text-center py-8 text-gray-500 border border-dashed rounded-lg"
              >
                등록된 자격증이 없습니다
              </div>

              <!-- 자격증 목록 -->
              <div
                v-for="(cert, index) in certificationList"
                :key="cert.id"
                class="border border-gray-200 rounded-lg p-6 hover:border-[#8FA1FF] transition-colors"
              >
                <div class="flex justify-between items-start mb-4">
                  <h4 class="font-medium">자격증 #{{ index + 1 }}</h4>
                  <button class="text-gray-400 hover:text-red-500" @click="removeCertification(index)">
                    <i class="pi pi-times"></i>
                  </button>
                </div>

                <div class="grid grid-cols-2 gap-4 mb-4">
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">자격증명</label>
                    <InputText v-model="cert.name" placeholder="자격증 이름을 입력하세요" class="w-full" />
                  </div>
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">취득일</label>
                    <DatePicker
                      v-model="cert.date"
                      dateFormat="yy.mm.dd"
                      placeholder="취득일을 선택하세요"
                      :showIcon="true"
                      class="w-full"
                    />
                  </div>
                </div>

                <!-- 파일 업로드 영역 -->
                <div class="flex items-center justify-between border-t pt-4">
                  <span class="text-sm text-gray-600">자격증 스캔본</span>
                  <div>
                    <label class="cursor-pointer px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                      <span class="text-sm">파일 선택</span>
                      <input type="file" class="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-4 text-sm text-gray-500">* PDF, JPG, PNG 형식의 파일만 업로드 가능합니다. (최대 10MB)</div>
          </div>
        </div>
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
          <label class="block text-sm font-medium text-gray-700"> 회사명<span class="text-red-500">*</span> </label>
          <InputText v-model="careerInfo.companyName" placeholder="회사명 입력" class="w-full" />
        </div>

        <!-- 재직기간 -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700"> 재직기간<span class="text-red-500">*</span> </label>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <DatePicker
                v-model="careerInfo.startDate"
                dateFormat="yy.mm"
                view="month"
                placeholder="입사일"
                :showIcon="true"
                class="w-full"
              />
            </div>
            <div>
              <DatePicker
                v-model="careerInfo.endDate"
                dateFormat="yy.mm"
                view="month"
                placeholder="퇴사일"
                :showIcon="true"
                class="w-full"
                :disabled="careerInfo.isCurrentJob"
              />
            </div>
          </div>
          <div class="flex items-center gap-2 mt-2">
            <Checkbox v-model="careerInfo.isCurrentJob" :binary="true" />
            <label class="text-sm text-gray-600">재직중</label>
          </div>
        </div>

        <!-- 직무 -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700"> 직무<span class="text-red-500">*</span> </label>
          <Dropdown
            v-model="careerInfo.jobCategory"
            :options="jobCategories"
            optionLabel="label"
            placeholder="직무를 선택해주세요"
            class="w-full"
          />
        </div>

        <!-- 직책 추가 -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">직책</label>
          <InputText v-model="careerInfo.jobTitle" placeholder="직책을 입력해주세요" class="w-full" />
        </div>

        <!-- 부서 -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">부서</label>
          <InputText v-model="careerInfo.department" placeholder="부서명 입력" class="w-full" />
        </div>

        <!-- 담당업무 -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">담당업무</label>
          <textarea
            v-model="careerInfo.responsibilities"
            rows="4"
            placeholder="담당업무를 입력해주세요"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8FA1FF] resize-none"
          ></textarea>
        </div>

        <!-- 파일 업로드 추가 -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <label class="block text-sm font-medium text-gray-700">
              {{ careerInfo.isCurrentJob ? '재직증명서' : '경력증명서' }}
              <span class="text-gray-400 ml-1">(선택)</span>
            </label>
            <div>
              <label class="cursor-pointer px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                <span class="text-sm">파일 선택</span>
                <input
                  type="file"
                  class="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  @change="handleCareerFileUpload"
                />
              </label>
            </div>
          </div>
          <div v-if="careerInfo.certificateFile" class="text-sm text-gray-600">
            선택된 파일: {{ careerInfo.certificateFile.name }}
            <button
              @click="careerInfo.certificateFile = null"
              class="ml-2 text-red-500 hover:text-red-700"
            >
              <i class="pi pi-times"></i>
            </button>
          </div>
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
          <label class="block text-sm font-medium text-gray-700"> 학력<span class="text-red-500">*</span> </label>
          <Select
            v-model="educationInfo.educationType"
            :options="educationTypes"
            optionLabel="name"
            placeholder="학력 선택"
            class="w-full"
          />
        </div>

        <!-- 학교명 -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700"> 학교명<span class="text-red-500">*</span> </label>
          <InputText v-model="educationInfo.schoolName" placeholder="학교명 입력" class="w-full" />
        </div>

        <!-- 전공 -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700"> 전공<span class="text-red-500">*</span> </label>
          <InputText v-model="educationInfo.major" placeholder="전공 입력" class="w-full" />
        </div>

        <!-- 재학기간 -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700"> 재학기간<span class="text-red-500">*</span> </label>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <DatePicker
                v-model="educationInfo.startDate"
                dateFormat="yy.mm"
                view="month"
                placeholder="입학일"
                :showIcon="true"
                class="w-full"
              />
            </div>
            <div>
              <DatePicker
                v-model="educationInfo.endDate"
                dateFormat="yy.mm"
                view="month"
                placeholder="졸업일"
                :showIcon="true"
                class="w-full"
                :disabled="!educationInfo.isGraduated"
              />
            </div>
          </div>
          <div class="flex items-center gap-2 mt-2">
            <Checkbox v-model="educationInfo.isGraduated" :binary="true" />
            <label class="text-sm text-gray-600">졸업</label>
          </div>
        </div>

        <!-- 주요내용 -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700"> 주요내용 </label>
          <textarea
            v-model="educationInfo.details"
            rows="4"
            placeholder="프로젝트, 교육내용, 졸업논문 등에 대해 적어주세요"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8FA1FF] resize-none"
          ></textarea>
        </div>

        <!-- 파일 업로드 추가 -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <label class="block text-sm font-medium text-gray-700">
              졸업증명서
              <span v-if="['UNIVERSITY', 'COLLEGE', 'MASTERS', 'PHD'].includes(educationInfo.educationType?.code)" class="text-red-500">*필수</span>
            </label>
            <div>
              <label class="cursor-pointer px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                <span class="text-sm">파일 선택</span>
                <input
                  type="file"
                  class="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  @change="handleEducationFileUpload"
                />
              </label>
            </div>
          </div>
          <div v-if="educationInfo.certificateFile" class="text-sm text-gray-600">
            선택된 파일: {{ educationInfo.certificateFile.name }}
            <button
              @click="educationInfo.certificateFile = null"
              class="ml-2 text-red-500 hover:text-red-700"
            >
              <i class="pi pi-times"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- 하단 버튼 -->
      <div class="p-6 border-t bg-gray-50 flex justify-center">
        <Button label="저장하기" class="w-full" @click="saveEducationInfo" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.w-96 {
  width: 36rem;
}

.file-upload {
  @apply border rounded-lg p-4;
}

.file-upload:hover {
  @apply border-[#8FA1FF];
}

.file-upload.has-file {
  @apply bg-[#8FA1FF] bg-opacity-5 border-[#8FA1FF];
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
