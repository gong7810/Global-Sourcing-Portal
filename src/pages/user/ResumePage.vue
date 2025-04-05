<script setup>
import { onMounted, ref, watch, toRaw, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useMessagePop } from '@/plugins/commonutils';

import { getAccount } from '@/apis/auth/authApis';
import { getCodeList, fileUpload } from '@/apis/common/commonApis';
import {
  getMyResume,
  updateResume,
  upsertExperience,
  deleteExperience,
  upsertEducation,
  deleteEducation,
  upsertCertification,
  deleteCertification
} from '@/apis/user/userApis';
import { isInteger, isLength, isNil } from 'es-toolkit/compat';

const router = useRouter();
const messagePop = useMessagePop();

const showCareerModal = ref(false);
const showEducationModal = ref(false);

const careerModifyIdx = ref(-1);
const educationModifyIdx = ref(-1);

const careerModifyFlag = ref(false);
const educationModifyFlag = ref(false);

const profileImage = ref();
const experienceImage = ref();
const educationImage = ref();
const certificationImage = ref();

const educationTypes = ref([]); // 학력종류
const jobCategories = ref([]); // 직무종류
const koreanLevels = ref([]); // 한국어실력

// 이력서 공개여부
const visibilityType = ref(null);
const resumeFlag = ref(false);

const visibilityOptions = [
  { label: '전체 공개', value: true, icon: 'pi pi-globe' },
  { label: '비공개', value: false, icon: 'pi pi-lock' }
];

// 구직자 기본정보
const basicInfo = ref({
  name: '',
  birthDate: '',
  gender: '',
  email: '',
  phone: '',
  address: '',
  finalEducation: null,
  hasCriminalRecord: {},
  hasVisitedKorea: false,
  isMarried: false,
  koreanProficiency: '',
  koreanStudyPeriod: ''
});

const resumeInfo = ref();
const globalAge = ref('');

// 국가/비자 정보 관련 상태
const nationalityInfo = ref();

// 여권 정보 관련 상태
const passportInfo = ref({});

// 경력리스트
const careerList = ref([]);
// 학력리스트
const educationList = ref([]);
// 자격증리스트
const certificationList = ref([]);

// 경력 정보 관련 상태
const totalCareer = ref('');
const careerInfo = ref({
  companyName: '',
  startDate: null,
  endDate: null,
  isCurrent: false,
  jobCategoryCd: null,
  position: '',
  department: '',
  content: '',
  fileId: null
});

// 학력 정보 관련 상태
const educationInfo = ref({
  educationType: '',
  schoolName: '',
  major: '',
  startDate: null,
  endDate: null,
  isGraduated: false,
  content: '',
  fileId: null
});

const sections = [
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

// 필수 기본정보 체크 함수 추가
const checkRequiredInfo = () => {
  const requiredFields = {
    name: { value: basicInfo.value.name, label: '이름' },
    birthDate: { value: basicInfo.value.birth, label: '생년월일' },
    gender: { value: basicInfo.value.gender, label: '성별' },
    email: { value: basicInfo.value.email, label: '이메일' },
    phone: { value: basicInfo.value.mobile, label: '전화번호' },
    address: { value: basicInfo.value.address, label: '주소' },
    hasCriminalRecord: { value: basicInfo.value.hasCriminalRecord, label: '범죄경력확인서' }
  };

  const missingFields = Object.entries(requiredFields)
    .filter(([_, field]) => isNil(field.value) && isLength(field.value))
    .map(([_, field]) => field.label);

  if (missingFields.length > 0) {
    messagePop.confirm({
      message: `필수 정보(${missingFields.join(', ')})가 누락되었습니다.\n기본정보를 입력하시겠습니까?`,
      onCloseYes: () => {
        router.push('/user/userPage');
      }
    });
    return false;
  }
  return true;
};

onMounted(async () => {
  // 기본 코드 정보 조회
  getEduCode();
  getJobCategoryCode();
  getKoreanLevelCode();

  await nextTick();
  // 사용자 정보 조회
  getUserInfo();
  // 이력서 정보 조회
  getResumeInfo();
});

// 학력 코드 조회
const getEduCode = async () => {
  const response = await getCodeList(`EDUCATION_LEVEL`);

  response.map((type) => {
    educationTypes.value.push({
      name: type.name,
      code: type.code
    });
  });
};

// 직무 코드 조회
const getJobCategoryCode = async () => {
  const response = await getCodeList(`JOB_CATEGORY`);

  response.map((item) => {
    jobCategories.value.push({
      name: item.name,
      code: item.code
    });
  });
};

// 한국어 실력코드드 조회
const getKoreanLevelCode = async () => {
  const response = await getCodeList(`KOREAN_LV`);

  response.map((item) => {
    koreanLevels.value.push({
      name: item.name,
      code: item.code
    });
  });
};

// 사용자 정보 조회
const getUserInfo = async () => {
  const response = await getAccount();

  basicInfo.value = response;

  koreanLevels.value.map((item) => {
    if (item.code === basicInfo.value.koreanProficiencyCd) {
      basicInfo.value = { ...basicInfo.value, koreanProficiency: item.name };
    }
  });

  // 프로필 이미지 세팅
  if (basicInfo.value.imageFile) {
    profileImage.value = `${import.meta.env.VITE_UPLOAD_PATH}/${basicInfo.value.imageFile.fileName}`;
  }

  setTimeout(() => {
    // 페이지 진입 시 필수 정보 체크
    const requiredFields = {
      name: { value: basicInfo.value.name, label: '이름' },
      birthDate: { value: basicInfo.value.birth, label: '생년월일' },
      gender: { value: basicInfo.value.gender.name, label: '성별' },
      email: { value: basicInfo.value.email, label: '이메일' },
      mobile: { value: basicInfo.value.mobile, label: '전화번호' },
      address: { value: basicInfo.value.address, label: '주소' },
      hasCriminalRecord: { value: basicInfo.value?.hasCriminalRecord, label: '범죄경력확인서' }
      // criminalRecordFile: { value: basicInfo.value?.criminalRecordFile, label: '범죄경력확인서' }
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([_, field]) => isNil(field.value) && isLength(field.value))
      .map(([_, field]) => field.label);

    if (missingFields.length > 0) {
      messagePop.confirm({
        message: `필수 정보(${missingFields.join(', ')})가 누락되었습니다.\n저장하기 전에 기본정보를 입력해주세요.`,
        onCloseYes: () => {
          router.push('/user/userPage');
        }
      });
    } else {
      resumeFlag.value = true;
    }
  }, 0);

  getGlobalAge();
};

// 만 나이 계산 함수
const getGlobalAge = () => {
  if (basicInfo.value.birth) {
    // 생년월일 문자열 파싱
    let birthList = basicInfo.value.birth.split('.');
    const year = parseInt(birthList[0]);
    const month = parseInt(birthList[1]);
    const day = parseInt(birthList[2]);

    // 현재 날짜
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1; // getMonth()는 0부터 시작
    const currentDay = today.getDate();

    // 만 나이 계산
    let age = currentYear - year;

    // 생일이 지나지 않았으면 1살 빼기
    if (currentMonth < month || (currentMonth === month && currentDay < day)) {
      age--;
    }
    globalAge.value = `(만 ${age}세)`;
  }
};

// 이력서 정보 조회
const getResumeInfo = async () => {
  const response = await getMyResume();

  resumeInfo.value = response;

  // 공개여부 설정
  visibilityType.value = response.isPublic;

  // 국적 설정
  nationalityInfo.value = response.nationality.name;

  passportInfo.value = {
    passportNo: response.passport,
    firstName: response.passportLastName,
    lastName: response.passportFirstName,
    nationality: response.passportCountry.name,
    issueDate: response.passportIssueDt.slice(0, 10),
    expiryDate: response.passportExpiryDt.slice(0, 10),
    fileImage: response.passportFileId
  };

  setTimeout(() => {
    setCareerInfo();

    setEducationInfo();

    setCertificationInfo();
  }, 100);
};

// 경력 정보 세팅
const setCareerInfo = () => {
  careerList.value = [];

  resumeInfo.value.experiences.map((exp) => {
    jobCategories.value.map((cate) => {
      if (cate.code === exp.jobCategoryCd) {
        careerList.value.push({
          careerId: exp.id,
          companyName: exp.companyName,
          period: `${exp?.startDt?.slice(0, 7).replace('-', '.')} - ${exp?.endDt ? exp?.endDt?.slice(0, 7).replace('-', '.') : '재직중'}`,
          isCurrent: exp.isCurrent,
          jobCategory: toRaw(cate), //직무
          position: exp.position, //직책
          department: exp.department, //부서
          content: exp.content, //담당업무
          fileId: exp.fileId
        });
      }
    });
  });
};

// 학력 정보 세팅
const setEducationInfo = () => {
  educationList.value = [];

  resumeInfo.value.educations.map((edu) => {
    educationTypes.value.map((type) => {
      if (type.code === edu.educationLevelCd) {
        educationList.value.push({
          id: edu.id,
          resumeId: edu.resumeId,
          schoolName: edu.schoolName,
          period: `${edu?.startDt} - ${edu?.endDt ? edu?.endDt : '재학중'}`,
          isGraduated: edu.isGraduated,
          educationType: toRaw(type),
          educationLevelCd: edu.educationLevelCd,
          isFinal: edu.isFinal,
          major: edu.major,
          content: edu.content,
          fileId: edu.fileId
        });
      }

      if (edu.isFinal) {
        basicInfo.value.finalEducation = `${edu.schoolName} ${edu.major} ${edu.isGraduated ? '졸업' : '재학중'}`;
      }
    });
  });

  // basicInfo.value.finalEducation = getFinalEducation(educationList.value);
};

// 자격증 정보 세팅
const setCertificationInfo = () => {
  certificationList.value = [];

  resumeInfo.value.certifications.map((cer) => {
    certificationList.value.push({
      id: cer.id,
      name: cer.name,
      issuer: cer.issuer,
      certificationNo: cer.certificationNo,
      acquiredDt: cer.acquiredDt.slice(0, 10).replaceAll('-', '.'),
      fileId: cer.fileId
    });
  });
};

// 이력서 공개전 체크사항 확인
const checkResumeClear = (value) => {
  if (!value || (resumeFlag.value && passportInfo.value.fileImage)) {
    visibilityType.value = value;
  } else if (!passportInfo.value.fileImage) {
    messagePop.toast('여권 스캔파일을 업로드 해주세요.', 'warn');
  } else {
    messagePop.toast('기본 정보를 모두 입력해 주세요.', 'warn');
  }
};

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

const closeCareerModal = () => {
  showCareerModal.value = false;
};

// 개별 경력 기간 계산 함수
const calculateCareerDuration = (period) => {
  const [start, end] = period.split(' - ');
  const startDate = new Date(start);
  const endDate = end === '재직중' ? new Date() : new Date(end);

  const months =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth() + 1);

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

// 경력리스트 실시간 반영
watch(
  () => careerList.value,
  () => {
    totalCareer.value = calculateTotalCareer(careerList.value);
  },
  { deep: true }
);

// 모든 경력 기간을 합산하는 로직
const calculateTotalCareer = (careerList) => {
  let totalMonth = resumeInfo.value.experienceDurationMonth;
  return totalMonth % 12
    ? `(총 ${Math.floor(totalMonth / 12)}년 ${totalMonth % 12}개월)`
    : `(총 ${Math.floor(totalMonth / 12)}년)`;
  // let totalMonths = 0;
  // careerList.forEach((career) => {
  //   const [start, end] = career.period.split(' - ');
  //   const startDate = new Date(start);
  //   const endDate = end === '재직중' ? new Date() : new Date(end);
  //   const months =
  //     (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth() + 1);
  //   totalMonths += months;
  // });

  // return totalMonths % 12
  //   ? `(총 ${Math.floor(totalMonths / 12)}년 ${totalMonths % 12}개월)`
  //   : `(총 ${Math.floor(totalMonths / 12)}년)`;
};

// ISO문자열 처리를 위한 다음달 구하는 함수
const getNextMonth = (yearMonth) => {
  const [year, month] = yearMonth.split('.');
  const date = new Date(year, month, 1); // 다음 달 1일
  return date.toISOString();
};

// YYYY.MM 형식으로 추출 (점으로 구분)
const formatYearMonthWithDot = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}.${month}`;
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
        isCurrent: false,
        jobCategory: null,
        position: '',
        department: '',
        content: '',
        certificateFile: null
      };
    }
  }
);

// 경력 추가, 수정 로직
const saveCareerInfo = async () => {
  // 필수 필드 검증
  const requiredFields = {
    companyName: careerInfo.value.companyName,
    startDate: careerInfo.value.startDate,
    jobCategory: careerInfo.value.jobCategory
  };

  // 재직중이 아닐 경우 endDate도 필수
  if (!careerInfo.value.isCurrent) {
    requiredFields.endDate = careerInfo.value.endDate;
  }

  // 빈 값 체크
  const hasEmptyField = Object.values(requiredFields).some(
    (value) => value === null || value === '' || value === undefined
  );

  if (hasEmptyField) {
    messagePop.toast('필수 항목을 입력해주세요.', 'warn');
    return;
  }

  // DONE: 저장 로직 시작
  let body = {};

  // 경력 증빙파일이 있는 경우
  // if (experienceImage.value) {
  if (careerInfo.value.fileId) {
    let formData = saveImage(careerInfo.value.fileId);

    const response = await fileUpload(formData);

    body = {
      id: careerInfo.value.careerId,
      resumeId: resumeInfo.value.id,
      companyName: careerInfo.value.companyName,
      startDt: new Date(`${careerInfo.value.startDate}-01`).toISOString(),
      endDt: careerInfo.value.isCurrent ? null : getNextMonth(formatYearMonthWithDot(careerInfo.value.endDate)),
      isCurrent: careerInfo.value.isCurrent,
      jobCategoryCd: careerInfo.value.jobCategory.code,
      position: careerInfo.value.position,
      department: careerInfo.value.department,
      content: careerInfo.value.content,
      fileId: response.id
    };
  } else {
    // 경력 증빙파일이 없는 경우
    body = {
      id: careerInfo.value.careerId,
      resumeId: resumeInfo.value.id,
      companyName: careerInfo.value.companyName,
      startDt: new Date(`${careerInfo.value.startDate}-01`).toISOString(),
      endDt: careerInfo.value.isCurrent ? null : getNextMonth(formatYearMonthWithDot(careerInfo.value.endDate)),
      isCurrent: careerInfo.value.isCurrent,
      jobCategoryCd: careerInfo.value.jobCategory.code,
      position: careerInfo.value.position,
      department: careerInfo.value.department,
      content: careerInfo.value.content
    };
  }

  await upsertExperience(body);

  getResumeInfo();

  careerModifyFlag.value = false;
  showCareerModal.value = false;
};

// 경력 삭제 로직
const deleteCareer = (career) => {
  messagePop.confirm({
    message: '해당 경력을 삭제하시겠습니까?',
    onCloseYes: async () => {
      await deleteExperience(career.careerId);

      getResumeInfo();
      // careerList.value.splice(index, 1);
    }
  });
};

// 경력 수정 모달값 세팅
const modifyCareer = (index) => {
  careerModifyFlag.value = true;
  careerModifyIdx.value = index;

  let startDate = careerList.value[index].period.split('-')[0];
  let endDate = careerList.value[index].period.split('-')[1];

  careerInfo.value = {
    careerId: careerList.value[index].careerId,
    companyName: careerList.value[index].companyName,
    jobCategory: careerList.value[index].jobCategory,
    startDate: new Date(startDate),
    endDate: endDate.trim() !== '재직중' ? new Date(endDate.trim()) : null,
    isCurrent: endDate.trim() !== '재직중' ? false : true,
    position: careerList.value[index].position,
    department: careerList.value[index].department,
    content: careerList.value[index].content,
    fileId: careerList.value[index].fileId
  };

  showCareerModal.value = true;
};

// 최종학력 찾기
const getFinalEducation = (educationList) => {
  for (const edu of educationList) {
    if (edu.isFinal) {
      return `${edu.schoolName} ${edu.major} ${edu.isGraduated ? '졸업' : '재학중'}`;
    }
  }

  return '';
};

// 최종학력 변경 감지
watch(
  () => educationList.value,
  () => {
    basicInfo.value.finalEducation = getFinalEducation(educationList.value);
  },
  { deep: true }
);

// 최종학력 교체
const setLastEducation = (selectedIndex) => {
  educationList.value.forEach((edu, index) => {
    edu.isFinal = index === selectedIndex;

    basicInfo.value.finalEducation = `${edu.schoolName} ${edu.major} ${edu.isGraduated ? '졸업' : '재학중'}`;
  });
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
        educationType: {},
        schoolName: '',
        startDate: null,
        endDate: null,
        isGraduated: false,
        isFinal: false,
        major: '',
        content: '',
        fileId: null
      };
    }
  }
);

// 학력 추가, 수정 로직
const saveEducationInfo = async () => {
  // 필수 필드 검증
  const requiredFields = {
    educationType: educationInfo.value.educationType,
    schoolName: educationInfo.value.schoolName,
    major: educationInfo.value.major,
    startDate: educationInfo.value.startDate
  };

  // 대학 이상인 경우에만 졸업증명서 필수
  if (educationTypes.value.slice(1).includes(educationInfo.value.educationType)) {
    requiredFields.fileId = educationInfo.value.fileId;
  }

  // 졸업인 경우 endDate도 필수
  if (educationInfo.value.isGraduated) {
    requiredFields.endDate = educationInfo.value.endDate;
  }

  const hasEmptyField = Object.values(requiredFields).some(
    (value) => value === null || value === '' || value === undefined
  );

  if (hasEmptyField) {
    messagePop.toast('필수 항목을 입력해주세요.', 'warn');
    return;
  }

  // DONE: 저장 로직 시작
  let body = {};
  // let startDate = `${educationInfo.value.startDate.getFullYear()}.${(educationInfo.value.startDate.getMonth() + 1).toString().padStart(2, '0')}`;
  let startDate =
    educationInfo.value.startDate?.length === 7
      ? educationInfo.value.startDate
      : `${educationInfo.value.startDate.getFullYear()}.${(educationInfo.value.startDate.getMonth() + 1).toString().padStart(2, '0')}`;
  let endDate = educationInfo.value.isGraduated
    ? educationInfo.value.endDate?.length === 7
      ? educationInfo.value.endDate
      : `${educationInfo.value.endDate.getFullYear()}.${(educationInfo.value.endDate.getMonth() + 1).toString().padStart(2, '0')}`
    : null;

  if (educationInfo.value.fileId) {
    let formData = saveImage(educationInfo.value.fileId);

    const response = await fileUpload(formData);

    body = {
      id: educationInfo.value.id,
      resumeId: resumeInfo.value.id,
      schoolName: educationInfo.value.schoolName,
      startDt: startDate,
      endDt: endDate,
      isGraduated: educationInfo.value.isGraduated,
      educationLevelCd: educationInfo.value.educationType.code,
      isFinal: educationInfo.value.isFinal,
      major: educationInfo.value.major,
      content: educationInfo.value.content,
      fileId: response.id
    };
  } else {
    // 학력 증빙파일이 없는 경우
    body = {
      id: educationInfo.value.id,
      resumeId: resumeInfo.value.id,
      schoolName: educationInfo.value.schoolName,
      startDt: startDate,
      endDt: endDate,
      isGraduated: educationInfo.value.isGraduated,
      educationLevelCd: educationInfo.value.educationType.code,
      isFinal: educationInfo.value.isFinal,
      major: educationInfo.value.major,
      content: educationInfo.value.content
    };
  }

  await upsertEducation(body);

  getResumeInfo();

  // const insertEdu = {
  //   educationType: educationInfo.value.educationType,
  //   schoolName: educationInfo.value.schoolName,
  //   major: educationInfo.value.major,
  //   period: !educationInfo.value.isGraduated
  //     ? `${educationInfo.value.startDate.getFullYear()}.${(educationInfo.value.startDate.getMonth() + 1).toString().padStart(2, '0')} - 재학중`
  //     : `${educationInfo.value.startDate.getFullYear()}.${(educationInfo.value.startDate.getMonth() + 1).toString().padStart(2, '0')} - ${educationInfo.value.endDate.getFullYear()}.${(educationInfo.value.endDate.getMonth() + 1).toString().padStart(2, '0')}`,
  //   content: educationInfo.value.content,
  //   isGraduated: educationInfo.value.isGraduated,
  //   isLastEducation: false,
  //   certificateFile: educationInfo.value.certificateFile
  // };

  // if (educationModifyFlag.value) {
  //   educationList.value[educationModifyIdx.value] = insertEdu;
  // } else {
  //   educationList.value.push(insertEdu);
  // }

  educationModifyFlag.value = false;
  showEducationModal.value = false;
};

//학력 수정 모달값 세팅
const modifyEducation = (index) => {
  educationModifyFlag.value = true;
  educationModifyIdx.value = index;

  let startDate = educationList.value[index].period.split('-')[0].trim();
  let endDate = educationList.value[index].period.split('-')[1].trim();

  educationInfo.value = {
    id: educationList.value[index].id,
    schoolName: educationList.value[index].schoolName,
    isGraduated: educationList.value[index].isGraduated,
    startDate: startDate,
    endDate: educationList.value[index].isGraduated ? endDate : null,
    educationType: educationList.value[index].educationType,
    educationLevelCd: educationList.value[index].educationLevelCd,
    major: educationList.value[index].major,
    content: educationList.value[index].content,
    fileId: educationList.value[index].fileId
  };

  showEducationModal.value = true;
};

// 학력 삭제 로직
const deleteEducations = (education, index) => {
  messagePop.confirm({
    message: '해당 학력을 삭제하시겠습니까?',
    onCloseYes: async () => {
      await deleteEducation(education.id);

      educationList.value.splice(index, 1);
    }
  });
};

// 자격증 추가, 수정 로직
const saveCertificationInfo = async () => {
  // 필수 필드 검증
  for (const cer of certificationList.value) {
    const requiredFields = {
      name: cer.name,
      issuer: cer.issuer,
      acquiredDt: new Date(cer.acquiredDt).toISOString()
    };

    const hasEmptyField = Object.values(requiredFields).some(
      (value) => value === null || value === '' || value === undefined
    );

    if (hasEmptyField) {
      messagePop.toast('필수 항목을 입력해주세요.', 'warn');
      return true;
    }
  }

  // DONE: 저장 로직 시작
  for (const cer of certificationList.value) {
    let body = {};

    if (cer.fileId && !isInteger(cer.fileId)) {
      let formData = saveImage(cer.fileId);

      const response = await fileUpload(formData);

      body = {
        id: cer.id,
        resumeId: resumeInfo.value.id,
        name: cer.name,
        issuer: cer.issuer,
        certificationNo: cer.certificationNo,
        acquiredDt: new Date(cer.acquiredDt).toISOString(),
        fileId: response.id
      };
    } else {
      body = {
        id: cer.id,
        resumeId: resumeInfo.value.id,
        name: cer.name,
        issuer: cer.issuer,
        certificationNo: cer.certificationNo,
        acquiredDt: new Date(cer.acquiredDt).toISOString(),
        fileId: cer.fileId
      };
    }

    await upsertCertification(body);
  }
};

// 자격증 행 추가
const addCertification = () => {
  certificationList.value.push({
    name: null,
    issuer: null,
    certificationNo: null,
    acquiredDt: null,
    fileId: null
  });
};

// 자격증 삭제 함수
const removeCertification = (index) => {
  messagePop.confirm({
    message: '해당 자격증을 삭제하시겠습니까?',
    onCloseYes: async () => {
      await deleteCertification(certificationList.value[index].id);

      certificationList.value.splice(index, 1);
    }
  });
};

// 이력서 공개여부 저장
const saveResume = () => {
  // 저장 전 필수 정보 체크
  if (!checkRequiredInfo()) {
    return;
  }

  // 저장 확인
  messagePop.confirm({
    message: '이력서를 저장하시겠습니까?',
    onCloseYes: async () => {
      try {
        // 이력서 공개여부, 자격증 저장
        const res = await saveCertificationInfo();
        if (res) {
          // 에러나면 return
          return;
        }

        const body = {
          isPublic: visibilityType.value
        };

        const response = await updateResume(body);

        if (response && response.success === undefined) {
          messagePop.toast('이력서가 저장되었습니다.', 'success');
        }
      } catch (error) {
        console.error('이력서 저장 중 오류:', error);
        messagePop.toast('이력서 저장 중 오류가 발생했습니다.', 'error');
      }
    }
  });
};

// 이미지 바이너리 변환
const saveImage = (file) => {
  const formData = new FormData();
  formData.append('file', file);

  return formData;
};

// 여권증빙파일 업로드 핸들러
const handlePassportFileUpload = async (event) => {
  const file = event.target.files[0];
  if (file) {
    if (file.size > 10 * 1024 * 1024) {
      // 10MB 제한
      messagePop.toast('파일 크기는 10MB를 초과할 수 없습니다.', 'warn');
      return;
    }

    const formData = new FormData();

    formData.append('file', file);

    const res = await fileUpload(formData);

    if (res && res.success === undefined) {
      const body = {
        passportFileId: res.id
      };

      const response = await updateResume(body);

      resumeInfo.value = response;
    }
  }
};

// 경력증빙파일 업로드 핸들러
const handleCareerFileUpload = (event) => {
  experienceImage.value = event.target.files[0];
  if (experienceImage.value) {
    if (experienceImage.value.size > 10 * 1024 * 1024) {
      // 10MB 제한
      messagePop.toast('파일 크기는 10MB를 초과할 수 없습니다.', 'warn');

      experienceImage.value = null;
      return;
    }
    careerInfo.value.fileId = experienceImage.value;
  }
};

// 학력증빙파일 업로드 핸들러
const handleEducationFileUpload = (event) => {
  educationImage.value = event.target.files[0];
  if (educationImage.value) {
    if (educationImage.value.size > 10 * 1024 * 1024) {
      // 10MB 제한
      messagePop.toast('파일 크기는 10MB를 초과할 수 없습니다.', 'warn');

      educationImage.value = null;
      return;
    }
    educationInfo.value.fileId = educationImage.value;
  }
};

// 자격증빙파일 업로드 핸들러
const handleCertificationFileUpload = (index, event) => {
  certificationImage.value = event.target.files[0];
  if (certificationImage.value) {
    if (certificationImage.value.size > 10 * 1024 * 1024) {
      // 10MB 제한
      messagePop.toast('파일 크기는 10MB를 초과할 수 없습니다.', 'warn');

      certificationImage.value = null;
      return;
    }
    certificationList.value[index].fileId = certificationImage.value;
  }

  console.log(certificationList.value);
};

// 자격증빙파일 초기화
const clearCertificationFile = (index) => {
  certificationImage.value = null;
  certificationList.value[index].fileId = null;
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
            <div v-for="option in visibilityOptions" :key="option.value">
              <div
                @click="checkResumeClear(option.value)"
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
            </div>
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
                <span class="text-xl font-medium">{{ basicInfo?.name }}</span>
                <span class="ml-4 text-gray-500"
                  >{{ basicInfo?.gender.name }} | {{ basicInfo?.birth }} &nbsp; {{ globalAge }}</span
                >
              </div>

              <!-- 연락처 정보 그룹 -->
              <div class="grid grid-cols-2 gap-x-8 gap-y-2">
                <!-- 1행: 휴대폰, 한국어실력 -->
                <div class="grid grid-cols-[120px_auto]">
                  <span class="text-gray-500">휴대폰</span>
                  <span>{{ basicInfo?.mobile }}</span>
                </div>
                <div class="grid grid-cols-[120px_auto]">
                  <span class="text-gray-500">한국어 실력</span>
                  <span>{{ basicInfo?.koreanProficiency }}</span>
                </div>

                <!-- 2행: 이메일, 한국어학습기간 -->
                <div class="grid grid-cols-[120px_auto]">
                  <span class="text-gray-500">이메일</span>
                  <span class="notranslate">{{ basicInfo?.email }}</span>
                </div>
                <div class="grid grid-cols-[120px_auto]">
                  <span class="text-gray-500">한국어 학습기간</span>
                  <span>{{ basicInfo?.koreanStudyPeriod }}</span>
                </div>

                <!-- 3행: 주소, 한국방문경험 -->
                <div class="grid grid-cols-[120px_auto]">
                  <span class="text-gray-500">주소</span>
                  <span>{{ basicInfo?.address }}</span>
                </div>
                <div class="grid grid-cols-[120px_auto]">
                  <span class="text-gray-500">한국방문경험</span>
                  <span>{{ basicInfo?.hasVisitedKorea ? '있음' : '없음' }}</span>
                </div>

                <!-- 4행: 범죄경력, 혼인사항 -->
                <div class="grid grid-cols-[120px_auto]">
                  <span class="text-gray-500">범죄경력</span>
                  <span class="flex items-center gap-2">
                    <!-- <i class="pi pi-file-pdf text-red-500"></i> -->
                    <span>{{ basicInfo?.hasCriminalRecord ? '있음' : '없음' }}</span>
                  </span>
                </div>
                <div class="grid grid-cols-[120px_auto]">
                  <span class="text-gray-500">혼인사항</span>
                  <span>{{ basicInfo?.isMarried ? '기혼' : '미혼' }}</span>
                </div>
              </div>
            </div>

            <!-- 프로필 이미지 -->
            <div class="flex-shrink-0 ml-8">
              <div class="w-[120px] h-[160px] overflow-hidden border border-gray-200 rounded-sm">
                <img
                  :src="profileImage || '/default-profile.jpg'"
                  alt="프로필 이미지"
                  class="w-full h-full object-cover"
                />
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
                    <h4 class="font-medium text-lg">{{ passportInfo?.firstName }} {{ passportInfo?.lastName }}</h4>
                    <p class="text-gray-600 mt-1">여권번호: {{ passportInfo?.passportNo?.slice(0, 5) + '****' }}</p>
                    <p class="text-gray-600">국적: {{ passportInfo?.nationality }}</p>
                    <p class="text-gray-600">만료일: {{ passportInfo?.expiryDate }}</p>
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
                <div v-if="!passportInfo.fileImage">
                  <label class="cursor-pointer px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                    <span class="text-sm">파일 선택</span>
                    <input
                      type="file"
                      class="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      @change="handlePassportFileUpload"
                    />
                  </label>
                </div>
                <div v-else>
                  <label class="cursor-default px-4 py-2 bg-gray-200 rounded-lg transition-colors cursor-default">
                    <span class="text-sm">첨부완료</span>
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
                <span v-if="resumeInfo?.experiences?.length" class="text-sm text-gray-500">
                  <!-- (총 {{ resumeInfo.experienceDurationMonth || 0 }} 개월) -->
                  {{ totalCareer }}
                </span>
              </div>
              <Button
                label="추가"
                icon="pi pi-plus"
                class="p-button-text p-button-sm"
                @click="navigateToSection(sections[0])"
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
                      <span class="text-sm text-gray-500"> ({{ calculateCareerDuration(career.period) }}) </span>
                    </p>
                    <p class="text-gray-600">
                      {{ [career.jobCategory.name, career.position, career.department].filter(Boolean).join(' | ') }}
                    </p>
                    <p class="text-gray-600 mt-2">{{ career.content }}</p>
                  </div>
                  <div class="flex gap-2">
                    <button class="text-gray-400 hover:text-gray-600" @click="modifyCareer(index)">
                      <i class="pi pi-pencil"></i>
                    </button>
                    <button class="text-gray-400 hover:text-gray-600" @click="deleteCareer(career)">
                      <i class="pi pi-trash"></i>
                    </button>
                  </div>
                </div>

                <!-- 경력 리스트 내 파일 표시 부분 -->
                <div v-if="career.fileId" class="mt-4 border-t pt-4">
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600">
                      {{ career.period.includes('재직중') ? '재직증명서' : '경력증명서' }}: 제출완료
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
                @click="navigateToSection(sections[1])"
              />
            </div>

            <!-- 최종학력 표시 -->
            <div class="mb-4 p-4 bg-gray-50 rounded-lg">
              <div class="flex items-center gap-2">
                <span class="text-gray-600">최종학력 :</span>
                <span class="font-medium">{{ basicInfo?.finalEducation }}</span>
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
                        :modelValue="education.isFinal"
                        @update:modelValue="setLastEducation(index)"
                        :binary="true"
                      />
                      <label class="text-sm text-gray-600">최종학력으로 설정</label>
                    </div>
                    <h4 class="font-medium text-lg">{{ education.schoolName }}</h4>
                    <p class="text-gray-600">{{ education.educationType.name }}</p>
                    <p class="text-gray-600 mt-1">{{ education.period }}</p>
                    <p class="text-gray-600">{{ education.major }}</p>
                    <p v-if="education.content" class="text-gray-600 mt-2">{{ education.content }}</p>
                  </div>
                  <div class="flex gap-2">
                    <button class="text-gray-400 hover:text-gray-600" @click="modifyEducation(index)">
                      <i class="pi pi-pencil"></i>
                    </button>
                    <button class="text-gray-400 hover:text-gray-600" @click="deleteEducations(education, index)">
                      <i class="pi pi-trash"></i>
                    </button>
                  </div>
                </div>

                <!-- 학력 리스트 내 파일 표시 부분 -->
                <div v-if="education.fileId" class="mt-4 border-t pt-4">
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600">
                      {{ education.period.includes('재학중') ? '재학증명서' : '졸업증명서' }}: 제출완료
                      <span v-if="educationTypes.slice(1).includes(education.educationType)" class="text-red-500">
                        &nbsp;*필수
                      </span>
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
                    <label class="block text-sm font-medium text-gray-700">
                      자격증 명<span class="text-red-500">*</span>
                    </label>
                    <InputText v-model="cert.name" placeholder="자격증 이름을 입력하세요" class="w-full" />
                  </div>
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">
                      발급기관<span class="text-red-500">*</span>
                    </label>
                    <InputText v-model="cert.issuer" placeholder="발급기관을 입력하세요" class="w-full" />
                  </div>
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">자격 번호</label>
                    <InputText v-model="cert.certificationNo" placeholder="자격증 번호를 입력하세요" class="w-full" />
                  </div>
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">
                      취득일<span class="text-red-500">*</span>
                    </label>
                    <DatePicker
                      v-model="cert.acquiredDt"
                      dateFormat="yy.mm.dd"
                      placeholder="취득일을 선택하세요"
                      :showIcon="true"
                      class="w-full"
                    />
                  </div>
                </div>

                <!-- 파일 업로드 영역 -->
                <div class="flex items-center justify-between border-t pt-4">
                  <span class="text-sm text-gray-600">
                    자격증 스캔본 {{ cert.fileId ? ' : ' + (cert.fileId?.name || '제출완료') : '' }}
                    <button
                      v-if="cert.fileId?.name"
                      class="ml-2 text-red-500 hover:text-red-700"
                      @click="clearCertificationFile(index)"
                    >
                      <i class="pi pi-times"></i>
                    </button>
                  </span>
                  <div>
                    <label class="cursor-pointer px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                      <span class="text-sm">파일 선택</span>
                      <input
                        type="file"
                        class="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        @change="
                          (event) => {
                            handleCertificationFileUpload(index, event);
                            event.target.value = '';
                          }
                        "
                      />
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
    <div class="bg-white rounded-lg w-[600px] max-h-[90vh]">
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
      <div class="p-6 space-y-6 h-[500px] overflow-y-auto">
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
                :disabled="careerInfo.isCurrent"
              />
            </div>
          </div>
          <div class="flex items-center gap-2 mt-2">
            <Checkbox v-model="careerInfo.isCurrent" :binary="true" />
            <label class="text-sm text-gray-600">재직중</label>
          </div>
        </div>

        <!-- 직무 -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700"> 직무<span class="text-red-500">*</span> </label>
          <Dropdown
            v-model="careerInfo.jobCategory"
            :options="jobCategories"
            optionLabel="name"
            placeholder="직무를 선택해주세요"
            class="w-full"
          />
        </div>

        <!-- 직책 추가 -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">직책</label>
          <InputText v-model="careerInfo.position" placeholder="직책을 입력해주세요" class="w-full" />
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
            v-model="careerInfo.content"
            rows="4"
            placeholder="담당업무를 입력해주세요"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8FA1FF] resize-none"
          ></textarea>
        </div>

        <!-- 파일 업로드 추가 -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <label class="block text-sm font-medium text-gray-700">
              {{ careerInfo.isCurrent ? '재직증명서' : '경력증명서' }}
              <span class="text-gray-400 ml-1">(선택)</span>
            </label>
            <div>
              <label class="cursor-pointer px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                <span class="text-sm">파일 선택</span>
                <input
                  type="file"
                  class="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  @change="
                    (event) => {
                      handleCareerFileUpload(event);
                      event.target.value = '';
                    }
                  "
                />
              </label>
            </div>
          </div>
          <div v-if="careerInfo.fileId" class="text-sm text-gray-600">
            {{ careerInfo.fileId?.name ? `${careerInfo.fileId.name}` : '증빙서류 제출 완료' }}
            <button
              v-if="careerInfo.fileId?.name"
              class="ml-2 text-red-500 hover:text-red-700"
              @click="careerInfo.fileId = null"
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
    <div class="bg-white rounded-lg w-[600px] max-h-[90vh]">
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
      <div class="p-6 space-y-6 h-[500px] overflow-y-auto">
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
            v-model="educationInfo.content"
            rows="4"
            placeholder="프로젝트, 교육내용, 졸업논문 등에 대해 적어주세요"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8FA1FF] resize-none"
          ></textarea>
        </div>

        <!-- 파일 업로드 추가 -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <label class="block text-sm font-medium text-gray-700">
              {{ educationInfo.isGraduated ? '졸업증명서' : '재학증명서' }}
              <span v-if="educationTypes.slice(1).includes(educationInfo.educationType)" class="text-red-500">
                *필수
              </span>
            </label>
            <div>
              <label class="cursor-pointer px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                <span class="text-sm">파일 선택</span>
                <input
                  type="file"
                  class="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  @change="
                    (event) => {
                      handleEducationFileUpload(event);
                      event.target.value = '';
                    }
                  "
                />
              </label>
            </div>
          </div>
          <div v-if="educationInfo.fileId" class="text-sm text-gray-600">
            {{
              educationInfo.fileId?.name
                ? `${educationInfo.fileId.name}`
                : educationInfo.isGraduated
                  ? '졸업증명서 : 제출 완료'
                  : '재학증명서 : 제출 완료'
            }}
            <button
              v-if="educationInfo.fileId?.name"
              class="ml-2 text-red-500 hover:text-red-700"
              @click="educationInfo.fileId = null"
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
