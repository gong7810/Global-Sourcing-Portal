<script setup>
import { isNull } from 'es-toolkit';
import { defineProps, defineEmits, ref, onBeforeUnmount, onMounted, toRaw } from 'vue';

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  interviewer: {
    type: Object,
    default: null
  },
  jobCategoryOptions: {
    type: Object,
    default: null
  },
  koreanLevelOptions: {
    type: Object,
    default: null
  },
  educationLevelOptions: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['update:visible']);

// 필터 옵션
const jobCategoryOptions = ref([]);
const koreanLevelOptions = ref([]);
const educationLevelOptions = ref([]);

// 이력서 스냅샷 정보
const offerUserInfo = ref();

onBeforeUnmount(() => {
  onHide();
});

onMounted(() => {
  jobCategoryOptions.value = props.jobCategoryOptions;
  koreanLevelOptions.value = props.koreanLevelOptions;
  educationLevelOptions.value = props.educationLevelOptions;

  offerUserInfo.value = toRaw(props.interviewer);
  offerUserInfo.value.resumeSnapshot.user = {
    ...offerUserInfo.value.resumeSnapshot.user,
    profileImage: `${import.meta.env.VITE_UPLOAD_PATH}/${offerUserInfo.value.resumeSnapshot.user?.imageFile?.fileName}`
  };

  console.log(offerUserInfo.value);
});

// Dialog가 닫힐 때 호출되는 함수
const onHide = () => {
  emit('update:visible', false);
};

// 한국어 실력 코드 변환
const convertCode = (code) => {
  if (!code) return null;

  let name = '';

  koreanLevelOptions.value.filter((item) => {
    if (item.code === code) {
      name = item.name;
    }
  });

  return name;
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

// 학력 코드 변환
const convertEduLevelCode = (code) => {
  if (!code) return null;

  let name = '';

  educationLevelOptions.value.filter((item) => {
    if (item.code === code) {
      name = item.name;
    }
  });

  return name;
};

// 샘플 파일 정보
const sampleFiles = {
  passport: {
    name: '여권사본.pdf',
    size: '2.1MB',
    exists: true
  },
  career: {
    name: '경력증명서.pdf',
    size: '1.5MB',
    exists: false
  },
  education: {
    name: '졸업증명서.pdf',
    size: '1.8MB',
    exists: true
  },
  certificate: {
    name: '자격증.pdf',
    size: '1.2MB',
    exists: true
  }
};

// 파일 다운로드 함수
const downloadFile = (fileType, fileInfo, certName = '') => {
  if (!fileInfo?.exists) {
    alert('업로드된 파일이 없습니다.');
    return;
  }
  const message = certName
    ? `${certName} ${fileType} 파일 다운로드 시도\n파일명: ${fileInfo.name}`
    : `${fileType} 파일 다운로드 시도\n파일명: ${fileInfo.name}`;

  alert(`${message}\n(실제 다운로드는 백엔드 연동 후 구현 예정)`);
};

// 경력 기간 계산 함수
const calculateCareerPeriod = (period) => {
  console.log(period);
  if (!period) return '';

  const [start, end] = period.split(' - ');
  if (!start || !end) return '';

  const startDate = new Date(start.replace('.', '-'));
  const endDate = end === '재직중' ? new Date() : new Date(end.replace('.', '-'));

  const monthDiff =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth() + 1);

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

  careerHistory.forEach((career) => {
    const [start, end] = career.period.split(' - ');
    const startDate = new Date(start.replace('.', '-'));
    const endDate = end === '현재' ? new Date() : new Date(end.replace('.', '-'));

    const monthDiff =
      (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
    totalMonths += monthDiff;
  });

  if (totalMonths >= 12) {
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    return months > 0 ? `${years}년 ${months}개월` : `${years}년`;
  }

  return `${totalMonths}개월`;
};

// 이력서 출력 함수
const printResume = () => {
  const printWindow = window.open('', '_blank');

  // 스타일 정의
  const styles = `
    <style>
      @media print {
        @page {
          size: A4;
          margin: 0;
        }
        body {
          margin: 24px;
        }
        .page-break {
          page-break-before: always;
        }
      }
      .resume-container {
        font-family: Arial;
        max-width: 800px;
        margin: auto;
        padding: 24px;
        font-size: 11px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 0.5rem;
      }
      th, td {
        border: 1px solid #333;
        padding: 4px 6px;
        text-align: left;
        vertical-align: top;
        font-size: 11px;
      }
      th {
        background-color: #f0f0f0;
        width: 20%;
      }
      .mb-4 { margin-bottom: 1rem; }
      .mb-2 { margin-bottom: 0.5rem; }
      .whitespace-pre-line { white-space: pre-line; }
    </style>
  `;

  // printResume 함수 내부의 education 처리 부분 수정
  const educationData = Array.isArray(offerUserInfo.value?.resumeSnapshot?.educations)
    ? offerUserInfo.value?.resumeSnapshot?.educations
    : [offerUserInfo.value?.resumeSnapshot?.educations].filter(Boolean);

  // 이력서 내용 생성
  const resumeContent = `
    <div class="resume-container">
      <h1 style="text-align: center; font-size: 16px; font-weight: bold; margin-bottom: 1rem;">이력서</h1>

      <!-- 프로필 사진 및 기본 정보 -->
      <section class="mb-4">
        <div style="display: flex; gap: 1rem; margin-bottom: 0.5rem;">
          <div style="width: 112px; height: 144px; border: 1px solid #ccc; overflow: hidden;">
            <img src="${offerUserInfo.value?.resumeSnapshot?.user?.profileImage || '/default-profile.jpg'}"
                alt="프로필 사진"
                style="width: 100%; height: 100%; object-fit: cover;" />
          </div>
          <div style="flex: 1;">
            <table>
              <tr><th>성명</th><td>${offerUserInfo.value?.resumeSnapshot?.user?.name}</td><th>국적</th><td>${offerUserInfo.value?.resumeSnapshot?.nationality?.name}</td></tr>
              <tr><th>생년월일</th><td>${offerUserInfo.value?.resumeSnapshot?.user?.birth}</td><th>성별</th><td>${offerUserInfo.value?.resumeSnapshot?.user?.genderCd === 'GENDER_MALE' ? '남성' : '여성'}</td></tr>
              <tr><th>연락처</th><td colspan="3">${offerUserInfo?.statusCd === 'JO_ST_2' ? offerUserInfo.value?.resumeSnapshot?.user?.mobile : '🔒'}</td></tr>
              <tr><th>이메일</th><td colspan="3">${offerUserInfo?.statusCd === 'JO_ST_2' ? offerUserInfo.value?.resumeSnapshot?.user?.email : '🔒'}</td></tr>
              <tr><th>주소</th><td colspan="3">${offerUserInfo?.statusCd === 'JO_ST_2' ? offerUserInfo.value?.resumeSnapshot?.user?.address : '🔒'}</td></tr>
              <tr><th>여권번호</th><td colspan="3">${offerUserInfo.value?.resumeSnapshot?.passport || '-'}</td></tr>
            </table>
          </div>
        </div>
      </section>

      <!-- 기타 사항 -->
      <section class="mb-4">
        <table>
          <tr><th>범죄 여부</th><td colspan="3">${offerUserInfo?.statusCd === 'JO_ST_2' ? (offerUserInfo.value?.resumeSnapshot?.user?.hasCriminalRecord ? '있음' : '없음') : '🔒'}</td></tr>
          <tr><th>한국어 능력</th><td>${!isNull(offerUserInfo.value?.resumeSnapshot?.user?.koreanProficiencyCd) ? convertCode(offerUserInfo.value?.resumeSnapshot?.user?.koreanProficiencyCd) : '-'}</td><th>공부 기간</th><td>${offerUserInfo.value?.resumeSnapshot?.user?.koreanStudyPeriod || '-'}</td></tr>
          <tr><th>한국 방문 경험</th><td>${!isNull(offerUserInfo.value?.resumeSnapshot?.user?.hasVisitedKorea) ? (offerUserInfo.value?.resumeSnapshot?.user?.hasVisitedKorea ? '있음' : '없음') : '-'}</td><th>혼인 사항</th><td>${!isNull(offerUserInfo.value?.resumeSnapshot?.user?.isMarried) ? (offerUserInfo.value?.resumeSnapshot?.user?.isMarried ? '기혼' : '미혼') : '-'}</td></tr>
        </table>
      </section>

      <!-- 학력 사항 -->
      <section class="mb-4">
        <table>
          <tr><th colspan="4" style="text-align: center; background-color: #e5e5e5;">학력</th></tr>
          <tr><th>최종학력</th><td colspan="3" style="font-weight: bold;">${
            offerUserInfo.value?.resumeSnapshot?.finalEducation
              ? `${offerUserInfo.value?.resumeSnapshot?.finalEducation?.schoolName} ${offerUserInfo.value?.resumeSnapshot?.finalEducation?.major} ${offerUserInfo.value?.resumeSnapshot?.finalEducation?.isGraduated ? '졸업' : '재학중'}`
              : '-'
          }</td></tr>
        </table>
        ${educationData
          .map(
            (edu, index) => `
          <div class="mb-2">
            <table>
              <tr><th>학교명</th><td>${edu?.schoolName || '-'}</td><th>학위</th><td>${convertEduLevelCode(edu.educationLevelCd) || '-'}</td></tr>
              <tr><th>전공</th><td>${edu?.major || '-'}</td><th>재학 기간</th><td>${edu?.startDt + ' - ' + (edu?.endDt || '재학중') || '-'}</td></tr>
            </table>
          </div>
        `
          )
          .join('')}
      </section>

      <!-- 경력 사항 -->
      <section class="mb-4">
        <table>
          <tr><th colspan="4" style="text-align: center; background-color: #e5e5e5;">경력</th></tr>
          <tr><th>총 경력</th><td colspan="3" style="font-weight: bold;">${
            offerUserInfo.value?.resumeSnapshot?.experienceDurationMonth
              ? parseInt(offerUserInfo.value?.resumeSnapshot?.experienceDurationMonth / 12) +
                '년 ' +
                (offerUserInfo.value?.resumeSnapshot?.experienceDurationMonth % 12) +
                '개월'
              : '신입'
          }</td></tr>
        </table>
        ${
          offerUserInfo.value?.resumeSnapshot?.experiences
            ?.map(
              (career) => `
          <div class="mb-2">
            <table>
              <tr><th>회사명</th><td>${career?.companyName}</td><th>근무 기간</th><td>${career?.startDt?.slice(0, 7).replaceAll('-', '.') + ' - ' + (career?.endDt ? career?.endDt?.slice(0, 7).replaceAll('-', '.') : '재직중')}</td></tr>
              <tr><th>직무</th><td colspan="3">${career?.position}</td></tr>
              <tr><th>업무 설명</th><td colspan="3" class="whitespace-pre-line">${career?.content || '-'}</td></tr>
              <tr><th>근무 기간(계산)</th><td colspan="3">${calculateCareerPeriod(`${career?.startDt?.slice(0, 7) + ' - ' + (career?.endDt ? career?.endDt?.slice(0, 7).replaceAll('-', '.') : '재직중')}`)}</td></tr>
            </table>
          </div>
        `
            )
            .join('') || '<p style="text-align: center; color: #666;">등록된 경력 사항이 없습니다</p>'
        }
      </section>

      <!-- 자격증 사항 -->
      <section class="mb-4">
        <table>
          <tr><th colspan="4" style="text-align: center; background-color: #e5e5e5;">자격증</th></tr>
        </table>
        ${
          offerUserInfo.value?.resumeSnapshot?.certifications
            ?.map(
              (cert) => `
          <div class="mb-2">
            <table>
              <tr><th>자격증명</th><td colspan="3">${cert?.name || '-'}</td><th>발급기관</th><td colspan="3">${cert?.issuer || '-'}</td></tr>
              <tr><th>취득일</th><td colspan="3">${cert?.acquiredDt.slice(0, 10).replaceAll('-', '.') || '-'}</td><th>자격번호</th><td colspan="3">${cert?.certificationNo || '-'}</td></tr>
            </table>
          </div>
        `
            )
            .join('') || '<p style="text-align: center; color: #666;">등록된 자격증이 없습니다</p>'
        }
      </section>

      <p style="font-size: 10px; text-align: right; color: #999; margin-top: 1.5rem;">
        <!-- 출력일: ${new Date().toLocaleDateString()} -->
        생성일: ${new Date().toLocaleDateString()}
      </p>
    </div>
  `;

  const printContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>이력서 출력</title>
        ${styles}
      </head>
      <body>
        ${resumeContent}
      </body>
    </html>
  `;

  printWindow.document.write(printContent);
  printWindow.document.close();

  printWindow.onload = function () {
    printWindow.print();
    printWindow.onafterprint = function () {
      printWindow.close();
    };
  };
};
</script>

<template>
  <Dialog
    :visible="props.visible"
    modal
    :style="{ width: '80vw', maxHeight: '90vh' }"
    :closable="true"
    :closeOnEscape="true"
    @update:visible="emit('update:visible', $event)"
  >
    <template #header>
      <div class="flex items-center justify-between w-full pr-8">
        <h2 class="text-xl font-bold">제안 당시 이력서 정보</h2>
        <Button
          @click="printResume"
          class="bt_btn primary flex items-center gap-2 px-4 py-2 bg-[#8B8BF5] text-white rounded hover:bg-[#7A7AE6] transition-colors"
        >
          <i class="pi pi-print"></i>
          <span>이력서 출력</span>
        </Button>
      </div>
    </template>

    <div v-if="offerUserInfo" class="p-4">
      <div class="bg-gray-50 p-6 rounded-lg mb-6">
        <h3 class="text-lg font-medium mb-4">기본 정보</h3>
        <div class="grid grid-cols-[1fr_1fr_auto] gap-x-8">
          <!-- 왼쪽 컬럼 -->
          <div class="grid grid-cols-[80px_auto] gap-y-2 text-sm text-gray-600">
            <span class="text-gray-600">이름</span>
            <span class="notranslate">{{ offerUserInfo?.resumeSnapshot?.user?.name }}</span>
            <span class="text-gray-600">생년월일</span>
            <span>{{ offerUserInfo?.resumeSnapshot?.user?.birth }}</span>
            <span class="text-gray-600">성별</span>
            <span>{{ offerUserInfo?.resumeSnapshot?.user?.genderCd === 'GENDER_MALE' ? '남성' : '여성' }}</span>
            <span class="text-gray-600">휴대폰</span>
            <span v-if="offerUserInfo?.statusCd === 'JO_ST_2'">{{ offerUserInfo?.resumeSnapshot?.user?.mobile }}</span>
            <span v-else class="text-[#8B8BF5]">{{ '면접 제안 수락 후 확인 가능' }}</span>
            <span class="text-gray-600">이메일</span>
            <span v-if="offerUserInfo?.statusCd === 'JO_ST_2'">{{ offerUserInfo?.resumeSnapshot?.user?.email }}</span>
            <span v-else class="text-[#8B8BF5]">{{ '면접 제안 수락 후 확인 가능' }}</span>
            <span class="text-gray-600">주소</span>
            <span v-if="offerUserInfo?.statusCd === 'JO_ST_2'">{{ offerUserInfo?.resumeSnapshot?.user?.address }}</span>
            <span v-else class="text-[#8B8BF5]">{{ '면접 제안 수락 후 확인 가능' }}</span>
          </div>

          <!-- 가운데 컬럼 -->
          <div class="grid grid-cols-[100px_auto] gap-y-2 text-sm text-gray-600">
            <span class="text-gray-600">범죄경력</span>
            <span v-if="offerUserInfo?.statusCd === 'JO_ST_2'">
              <!-- <i class="pi pi-file-pdf text-red-500"></i> -->
              {{ offerUserInfo?.resumeSnapshot?.user?.hasCriminalRecord ? '있음' : '없음' }}
            </span>
            <span v-else class="text-[#8B8BF5]">{{ '면접 제안 수락 후 확인 가능' }}</span>
            <span class="text-gray-600">한국어 능력</span>
            <span>{{ convertCode(offerUserInfo?.resumeSnapshot?.user?.koreanProficiencyCd) || '미입력' }}</span>
            <span class="text-gray-600">학습기간</span>
            <span>{{ offerUserInfo?.resumeSnapshot?.user?.koreanStudyPeriod || '미입력' }}</span>
            <span class="text-gray-600">한국방문경험</span>
            <span>{{
              offerUserInfo?.resumeSnapshot?.user?.hasVisitedKorea === false
                ? '없음'
                : offerUserInfo?.resumeSnapshot?.user?.hasVisitedKorea
                  ? '있음'
                  : '미입력'
            }}</span>
            <span class="text-gray-600">혼인여부</span>
            <span>{{
              offerUserInfo?.resumeSnapshot?.user?.isMarried === false
                ? '미혼'
                : offerUserInfo?.resumeSnapshot?.user?.isMarried
                  ? '기혼'
                  : '미입력'
            }}</span>
          </div>

          <!-- 프로필 사진 (오른쪽) -->
          <div class="flex flex-col items-center">
            <div class="w-[140px] h-[180px] bg-gray-100 rounded-lg overflow-hidden">
              <img
                v-if="offerUserInfo?.resumeSnapshot?.user?.profileImage"
                :src="offerUserInfo?.resumeSnapshot?.user?.profileImage || '/default-profile.jpg'"
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

      <div class="bg-gray-50 p-6 rounded-lg mb-6">
        <div class="flex items-center gap-8">
          <h3 class="text-lg font-bold w-20">국적</h3>
          <span class="text-gray-600">{{ offerUserInfo?.resumeSnapshot?.nationality?.name }}</span>
        </div>
      </div>

      <div class="bg-gray-50 p-6 rounded-lg mb-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold">여권</h3>
          <div>
            <button
              v-if="offerUserInfo?.resumeSnapshot?.passportFile"
              @click="downloadFile('여권', offerUserInfo?.resumeSnapshot?.passportFile)"
              class="flex items-center gap-2 text-[#8B8BF5] hover:text-[#7A7AE6]"
            >
              <i class="pi pi-download"></i>
              <span>파일 다운로드</span>
              <span class="text-sm text-gray-500"
                >({{ parseInt(offerUserInfo?.resumeSnapshot?.passportFile?.size / 1024) }}KB)</span
              >
            </button>
            <span v-else class="text-sm text-gray-500"> 업로드된 파일 없음 </span>
          </div>
        </div>
        <div v-if="offerUserInfo?.resumeSnapshot?.passportName" class="grid gap-y-4">
          <div class="flex gap-8">
            <span class="text-gray-600 w-20">이름</span>
            <span class="notranslate">{{ offerUserInfo?.resumeSnapshot?.passportName || '-' }}</span>
          </div>
          <div class="flex gap-8">
            <span class="text-gray-600 w-20">여권번호</span>
            <span>{{ offerUserInfo?.resumeSnapshot?.passport || '-' }}</span>
          </div>
          <div class="flex gap-8">
            <span class="text-gray-600 w-20">발급국가</span>
            <span>{{ offerUserInfo?.resumeSnapshot?.passportCountry?.name }}</span>
          </div>
          <div class="flex gap-8">
            <span class="text-gray-600 w-20">만료일</span>
            <span>{{ offerUserInfo?.resumeSnapshot?.passportExpiryDt.slice(0, 10).replaceAll('-', '.') || '-' }}</span>
          </div>
        </div>
        <div v-else class="text-center text-gray-500">등록된 여권 정보가 없습니다</div>
      </div>

      <!-- 경력 사항 섹션 -->
      <div class="bg-gray-50 p-6 rounded-lg mb-6">
        <div class="flex items-center gap-2 mb-4">
          <h3 class="text-lg font-bold">경력 사항</h3>
          <span class="text-sm text-[#8B8BF5] bg-[#8B8BF5] bg-opacity-10 px-2 py-1 rounded">
            {{
              offerUserInfo?.resumeSnapshot?.experienceDurationMonth
                ? '경력 ' +
                  parseInt(offerUserInfo?.resumeSnapshot?.experienceDurationMonth / 12) +
                  '년 ' +
                  (offerUserInfo?.resumeSnapshot?.experienceDurationMonth % 12) +
                  '개월'
                : '신입'
            }}
          </span>
        </div>
        <div v-if="offerUserInfo?.resumeSnapshot?.experiences?.length">
          <div
            v-for="(career, index) in offerUserInfo?.resumeSnapshot?.experiences"
            :key="index"
            class="mb-4 pb-4 border-b last:border-b-0"
          >
            <div class="flex justify-between items-start">
              <div>
                <div class="flex items-center gap-2">
                  <div class="font-medium">{{ career?.companyName }}</div>
                  <span class="text-sm text-gray-500"
                    >({{
                      `${career?.startDt?.slice(0, 7).replaceAll('-', '.')} ~ ${career?.endDt?.slice(0, 7) ? career?.endDt?.slice(0, 7).replaceAll('-', '.') : '재직중'}`
                    }})</span
                  >
                </div>
                <div class="text-gray-600">{{ career?.department }}</div>
                <div class="text-gray-600">{{ convertJobCode(career?.jobCategoryCd) }}</div>
                <div class="mt-2 whitespace-pre-line">{{ career?.content }}</div>
              </div>
              <button
                v-if="career?.fileId"
                @click="downloadFile('경력증명서', career?.fileId, career?.companyName)"
                class="flex items-center gap-2 text-[#8B8BF5] hover:text-[#7A7AE6] ml-4"
              >
                <i class="pi pi-download"></i>
                <span class="text-sm">증명서</span>
                <!-- <span class="text-sm text-gray-500">({{ career.file.size }})</span> -->
              </button>
              <span v-else class="text-sm text-gray-500 ml-4"> 증명서 없음 </span>
            </div>
          </div>
        </div>
        <div v-else class="text-center text-gray-500">등록된 경력 사항이 없습니다</div>
      </div>

      <div class="bg-gray-50 p-6 rounded-lg mb-6">
        <div class="flex items-center gap-2 mb-4">
          <h3 class="text-lg font-bold">학력 사항</h3>
          <span class="text-sm text-[#8B8BF5] bg-[#8B8BF5] bg-opacity-10 px-2 py-1 rounded">
            {{
              offerUserInfo?.resumeSnapshot?.finalEducation
                ? '최종학력 : ' +
                  `${offerUserInfo?.resumeSnapshot?.finalEducation?.schoolName} ${offerUserInfo?.resumeSnapshot?.finalEducation?.major} ${offerUserInfo?.resumeSnapshot?.finalEducation?.isGraduated ? '졸업' : '재학중'}`
                : ''
            }}
          </span>
        </div>
        <div v-if="offerUserInfo?.resumeSnapshot?.educations?.length">
          <!-- <div class="text-[#8B8BF5] mb-4">
            최종학력:
            {{
              offerUserInfo?.resumeSnapshot?.finalEducation
                ? `${offerUserInfo?.resumeSnapshot?.finalEducation?.schoolName} ${offerUserInfo?.resumeSnapshot?.finalEducation?.major} ${offerUserInfo?.resumeSnapshot?.finalEducation?.isGraduated ? '졸업' : '재학중'}`
                : ''
            }}
          </div> -->
          <div
            v-for="(edu, index) in offerUserInfo?.resumeSnapshot?.educations"
            :key="index"
            class="mb-6 pb-6 border-b last:border-b-0"
          >
            <div class="flex justify-between items-start">
              <div>
                <div class="text-gray-900 font-medium mb-2">
                  {{ edu?.schoolName }} ({{ convertEduLevelCode(edu?.educationLevelCd) }})
                </div>
                <div class="text-gray-600">{{ edu?.major }}</div>
                <div class="text-gray-600">{{ `${edu?.startDt} ~ ${edu?.endDt ? edu?.endDt : '재학중'}` }}</div>
                <div v-if="edu.description">{{ edu?.content }}</div>
              </div>
              <button
                v-if="edu?.fileId"
                @click="downloadFile('졸업증명서', edu.fileId, edu.schoolName)"
                class="flex items-center gap-2 text-[#8B8BF5] hover:text-[#7A7AE6] ml-4"
              >
                <i class="pi pi-download"></i>
                <span class="text-sm">졸업증명서</span>
                <!-- <span class="text-sm text-gray-500">({{ edu.file.size }})</span> -->
              </button>
              <span v-else class="text-sm text-gray-500 ml-4"> 증명서 없음 </span>
            </div>
          </div>
        </div>
        <div v-else class="text-center text-gray-500">등록된 학력 사항이 없습니다</div>
      </div>

      <div class="bg-gray-50 p-6 rounded-lg">
        <div class="mb-4">
          <h3 class="text-lg font-bold">자격증 사항</h3>
        </div>
        <div v-if="offerUserInfo?.resumeSnapshot?.certifications?.length" class="space-y-4">
          <div
            v-for="(cert, index) in offerUserInfo?.resumeSnapshot?.certifications"
            :key="index"
            class="border-b last:border-b-0"
          >
            <div class="flex justify-between items-start">
              <div class="mb-2">
                <div class="flex items-center gap-2 mb-1">
                  <div class="font-medium mb-1">{{ cert?.name }}</div>
                </div>
                <div class="font-medium mb-1">발급기관 : {{ cert?.issuer }}</div>
                <div class="text-sm text-gray-600">
                  <div>취득일 : {{ cert?.acquiredDt?.slice(0, 10).replaceAll('-', '.') }}</div>
                </div>
              </div>
              <button
                v-if="cert?.fileId"
                @click="downloadFile('자격증', sampleFiles.certificate, cert?.fileId)"
                class="flex items-center gap-2 text-[#8B8BF5] hover:text-[#7A7AE6] ml-4"
              >
                <i class="pi pi-download"></i>
                <span class="text-sm">첨부파일</span>
                <!-- <span class="text-sm text-gray-500">({{ sampleFiles.certificate.size }})</span> -->
              </button>
              <span v-else class="text-sm text-gray-500 ml-4"> 첨부파일 없음 </span>
            </div>
          </div>
        </div>
        <div v-else class="text-center text-gray-500">등록된 자격증이 없습니다</div>
      </div>
    </div>
  </Dialog>
</template>
