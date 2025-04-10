<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import { useDateFormatter } from '@/plugins/commonutils';
import { useMessagePop } from '@/plugins/commonutils';
import { getCodeList } from '@/apis/common/commonApis';
import { getOfferList, requestOffer } from '@/apis/company/companyApis';
import { isNull } from 'es-toolkit';

const router = useRouter();
const dateFormatter = useDateFormatter();
const messagePop = useMessagePop();

const showDetailModal = ref(false);
const selectedOffer = ref(null);

// 면접 일정 관련 상태
const showScheduleModal = ref(false);
const interviewOptions = ref([
  { date: null, hour: null, minute: null, type: null, info: null },
  { date: null, hour: null, minute: null, type: null, info: null },
  { date: null, hour: null, minute: null, type: null, info: null }
]);
const interviewTypeCd = ref(null);
const interviewInfo = ref('');

// 면접 제안 내역 데이터
const interviewOffers = ref([]);

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
const selectedJobFilter = ref({ name: '전체', code: 'all' });

const educationLevelOptions = ref([]);
// 전체 직무 카테고리 옵션
const jobCategoryOptions = ref([]);

// 필터링된 제안 목록
const filteredOffers = computed(() => {
  return interviewOffers.value.filter((offer) => {
    // 상태 필터
    const statusMatch = selectedFilter.value === 'all' || offer.statusCd === selectedFilter.value;

    // 직무 필터
    const jobMatch = selectedJobFilter.value.code === 'all' || offer.jobCategoryCd === selectedJobFilter.value.code;

    return statusMatch && jobMatch;
  });
});

onMounted(() => {
  getJobOfferStateCode();
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
        text: '수락',
        class: 'bg-green-50 text-green-600'
      };
    case 'JO_ST_3':
      return {
        text: '거절',
        class: 'bg-red-50 text-red-600'
      };
    case 'JO_ST_4':
      return {
        text: '일정 조율',
        class: 'bg-yellow-50 text-yellow-600'
      };
    case 'JO_ST_5':
      return {
        text: '일정 확정',
        class: 'bg-blue-50 text-blue-600'
      };
    case 'JO_ST_6':
      return {
        text: '완료',
        class: 'bg-green-50 text-green-600'
      };
    default:
      return {
        text: '오류',
        class: 'bg-gray-50 text-gray-600'
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

// 면접 일정 제안 모달
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
  if (
    !interviewOptions.value.filter((item) => item.date && item.hour && item.minute && item.type && item.info).length
  ) {
    alert('최소 하나의 면접 일정 정보를 입력해주세요.');
    return;
  }

  // if (!interviewTypeCd.value || !interviewInfo.value) {
  //   alert('면접 방식과 장소를 입력해주세요.');
  //   return;
  // }

  // 제안된 일정들 필터링 (날짜가 입력된 것만)
  let proposedDates = interviewOptions.value
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
        <p class="font-medium">제안된 일정:</p><hr class="mt-1 mb-1"/>
        ${proposedDates
          .map(
            (
              time,
              index
            ) => `<div class="mt-1">${time.slice(0, 10).replaceAll('-', '.')} ${time.slice(11, 16)}</div> <p>면접 방식: ${interviewOptions.value[index].type === 'INTERVIEW_TY_1' ? '화상 면접' : '대면 면접'}</p>
        <p>장소/링크: ${interviewOptions.value[index].info}</p> <hr class="mb-1"/>`
          )
          .join('')}
        <p class="mt-2 text-red-500">* 확인 시 알림과 이메일이 발송됩니다.</p>
      </div>
    </div>`,
    // <p class="mt-2">면접 방식: ${interviewTypeCd === 'INTERVIEW_TY_1' ? '화상 면접' : '대면 면접'}</p>
    // <p>장소/링크: ${interviewInfo.value}</p>
    acceptLabel: '제안',
    rejectLabel: '취소',
    onCloseYes: async () => {
      // 면접 일정 제안 API
      selectedOffer.value.interviewScheduled = true;
      ['reserveTime1', 'reserveTime2', 'reserveTime3']
        .map((item, index) => {
          selectedOffer.value[item] = proposedDates[index];
        })
        .filter((time) => time);

      ['interviewTypeCd1', 'interviewTypeCd2', 'interviewTypeCd3']
        .map((item, index) => {
          selectedOffer.value[item] = interviewOptions.value[index].type;
        })
        .filter((type) => type);

      ['interviewPlace1', 'interviewPlace2', 'interviewPlace3']
        .map((item, index) => {
          selectedOffer.value[item] = interviewOptions.value[index].info;
        })
        .filter((info) => info);
      selectedOffer.value.interviewTypeCd = selectedOffer.value.interviewTypeCd1;
      selectedOffer.value.interviewInfo = selectedOffer.value.interviewPlace1;
      selectedOffer.value.statusCd = 'JO_ST_4';

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
            interviewOptions.value = [
              { date: null, hour: null, minute: null, type: null, info: null },
              { date: null, hour: null, minute: null, type: null, info: null },
              { date: null, hour: null, minute: null, type: null, info: null }
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
const completeInterview = async (offer) => {
  const body = {
    ...offer,
    statusCd: 'JO_ST_6'
  };

  const response = await requestOffer(body);

  if (response && response.success === undefined) {
    router.push('/company/InterviewResults');
  }
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
          checkmark
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
          <div class="text-sm text-gray-500">제안일: {{ dateFormatter.halfDate(offer?.createdAt) }}</div>
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
            <p class="text-gray-600">
              {{
                offer?.jobCategoryCd === 'JOB_22'
                  ? `기타(${offer?.jobCategoryEtc})`
                  : convertJobCode(offer?.jobCategoryCd)
              }}
              | {{ offer?.position }}
            </p>
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

        <!-- 수락에서 이어진 경우 -->
        <div v-if="['JO_ST_2', 'JO_ST_4', 'JO_ST_5'].includes(offer?.statusCd)" class="mt-4 border-t pt-4">
          <p class="text-green-600">
            <i class="pi pi-check-circle mr-2"></i>
            {{ dateFormatter.fullDate(offer?.updatedAt) }} 에 수락되었습니다
          </p>

          <!-- 면접 일정이 잡히지 않은 경우에만 버튼 표시 -->
          <div v-if="['JO_ST_2'].includes(offer?.statusCd)" class="mt-3">
            <button
              @click="openScheduleModal(offer)"
              class="px-4 py-2 bg-[#8B8BF5] text-white rounded-lg hover:bg-[#7A7AE6]"
            >
              면접 일정 잡기
            </button>
          </div>

          <!-- 면접 일정 조율중인 경우 일정 정보 표시 -->
          <div v-else class="mt-3">
            <!-- JO_ST_4 -->
            <!-- 일정이 아직 확정되지 않은 경우 제안된 일정들 표시 -->
            <div v-if="['JO_ST_4'].includes(offer?.statusCd)" class="space-y-4">
              <div
                v-for="(dateSlot, index) in ['reserveTime1', 'reserveTime2', 'reserveTime3']
                  .map((key, i) => ({
                    time: offer[key],
                    type: offer[`interviewTypeCd${i + 1}`],
                    info: offer[`interviewPlace${i + 1}`]
                  }))
                  .filter((item) => item.time)"
                :key="index"
                class="mb-2"
              >
                <p class="text-gray-600">
                  날짜·시간: {{ dateSlot.time.slice(0, 10).replaceAll('-', '.') }} &nbsp;
                  {{ dateSlot.time.slice(11, 16) }}
                </p>
                <p class="text-gray-600">방식: {{ dateSlot.type === 'INTERVIEW_TY_1' ? '화상 면접' : '대면 면접' }}</p>
                <p class="text-gray-600">장소: {{ dateSlot.info }}</p>
              </div>
            </div>

            <!-- JO_ST_5 -->
            <!-- 면접 일정이 확정된 경우 -->
            <div v-else class="p-4 bg-green-50 rounded-lg">
              <!-- <p class="text-green-600 font-medium mb-3">확정된 면접 일정</p>
              <div class="space-y-2 ml-4">
                <p class="text-gray-600">
                  날짜·시간: {{ offer?.interviewTime.slice(0, 10).replaceAll('-', '.') }} &nbsp;
                  {{ offer?.interviewTime.slice(11, 16) }}
                </p>
                <p class="text-gray-600">
                  방식: {{ offer?.interviewTypeCd === 'INTERVIEW_TY_1' ? '화상 면접' : '대면 면접' }}
                </p>
                <p class="text-gray-600">장소: {{ offer?.interviewInfo }}</p>
              </div> -->
              <h4 class="font-medium text-gray-900 mb-2">확정된 면접 일정</h4>
              <div class="grid grid-cols-2 gap-4">
                <div class="flex items-center gap-2">
                  <i class="pi pi-calendar text-green-600"></i>
                  <div class="space-y-2">
                    <div class="font-medium flex items-center gap-2">
                      {{ offer?.interviewTime.slice(0, 10).replaceAll('-', '.') }}
                      <span class="text-gray-400">|</span>
                      {{ offer?.interviewTime.slice(11, 16) }}
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <i class="pi pi-video text-green-600"></i>
                  <span class="text-gray-700">
                    {{ offer?.interviewType?.name }}
                  </span>
                </div>
                <div class="flex items-center gap-2 text-md text-gray-600">
                  <i class="pi pi-map-marker text-green-600"></i>
                  <span class="text-gray-700">
                    {{ offer?.interviewTypeCd === 'INTERVIEW_TY_1' ? '링크: ' : '장소: ' }}
                    <a
                      v-if="offer?.interviewTypeCd === 'INTERVIEW_TY_1'"
                      :href="offer?.interviewInfo"
                      target="_blank"
                      class="text-blue-600 hover:underline"
                    >
                      {{ offer?.interviewInfo }}
                    </a>
                    <span v-else>{{ offer?.interviewInfo }}</span>
                  </span>
                </div>
              </div>

              <!-- JO_ST_5 -->
              <div v-if="!offer?.resultCd" class="mt-4">
                <Button @click="completeInterview(offer)" style="border-color: none"> 면접 완료 </Button>
              </div>
            </div>
          </div>
        </div>

        <!-- 면접 거절된 경우 -->
        <div v-if="offer?.statusCd === 'JO_ST_3'" class="mt-4 border-t pt-4">
          <p class="text-red-600">
            <i class="pi pi-times-circle mr-2"></i>
            {{ offer?.updatedAt?.slice(0, 10).replaceAll('-', '.') }}에 거절되었습니다
          </p>
          <!-- 거절 사유 표시 추가 -->
          <div v-if="offer?.resultMemo" class="bg-red-50 p-4 rounded-lg mt-2">
            <p class="text-red-700">
              <span class="font-medium">거절 사유:</span><br />
              {{ offer?.resultMemo }}
            </p>
          </div>
        </div>

        <!-- 면접 완료된 경우 표시 -->
        <div v-if="offer?.statusCd === 'JO_ST_6'" class="flex mt-4">
          <div class="grid grid-cols-1 gap-4">
            <div class="flex items-center gap-2">
              <i class="pi pi-calendar text-blue-600"></i>
              <div class="space-y-2">
                <div class="font-medium flex items-center gap-2">
                  {{ offer?.interviewTime.slice(0, 10).replaceAll('-', '.') }}
                  <span class="text-gray-400">|</span>
                  {{ offer?.interviewTime.slice(11, 16) }}
                </div>
              </div>
            </div>
          </div>

          <p class="text-blue-600 ml-14">
            <i class="pi pi-check-circle mr-2"></i>
            면접 완료
          </p>
        </div>

        <div class="flex justify-between">
          <div class="mt-4">
            <button
              class="text-[#8B8BF5] hover:text-[#7A7AE6] flex items-center gap-1"
              @click.stop="openDetailModal(offer)"
            >
              <span>상세 정보 보기</span>
              <i class="pi pi-arrow-right text-sm"></i>
            </button>
          </div>

          <!-- 면접 결과 입력 안됐을때 표시 -->
          <div v-if="['JO_ST_6'].includes(offer?.statusCd) && isNull(offer?.resultCd)" class="mt-3">
            <button
              @click="router.push('/company/InterviewResults')"
              class="px-4 py-2 bg-[#8B8BF5] text-white rounded-lg hover:bg-[#7A7AE6]"
            >
              결과 입력
            </button>
          </div>
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
        <div v-for="(dateSlot, index) in interviewOptions" :key="index" class="mb-6">
          <h1 class="text-lg mb-2 underline">면접 일정 {{ index + 1 }}</h1>
          <div class="mb-2">
            <label class="block text-sm mb-1">날짜</label>
            <DatePicker v-model="dateSlot.date" class="w-full" :minDate="new Date()" dateFormat="yy-mm-dd" />
          </div>
          <div class="grid grid-cols-2 gap-2 mb-4">
            <div>
              <label class="block text-sm mb-1">시간</label>
              <Select
                v-model="dateSlot.hour"
                :options="hours"
                optionLabel="label"
                placeholder="시"
                checkmark
                class="w-full"
              />
            </div>
            <div>
              <label class="block text-sm mb-1">분</label>
              <Select
                v-model="dateSlot.minute"
                :options="minutes"
                optionLabel="label"
                placeholder="분"
                checkmark
                class="w-full"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2 mb-4">
            <div>
              <label class="block font-medium mb-2">면접 방식</label>
              <Select
                v-model="dateSlot.type"
                :options="interviewTypes"
                optionLabel="name"
                optionValue="code"
                placeholder="면접 방식 선택"
                checkmark
                class="w-full"
              />
            </div>

            <div>
              <label class="block font-medium mb-2">장소 / 링크</label>
              <InputText
                v-model="dateSlot.info"
                class="w-full"
                :placeholder="
                  dateSlot.info === 'INTERVIEW_TY_1' ? 'Zoom 링크를 입력해주세요' : '면접 장소를 입력해주세요'
                "
              />
            </div>
          </div>
        </div>

        <!-- <div class="mb-4">
          <label class="block font-medium mb-2">면접 방식</label>
          <Select
            v-model="interviewTypeCd"
            :options="interviewTypes"
            optionLabel="name"
            optionValue="code"
            placeholder="면접 방식 선택"
            checkmark
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
        </div> -->
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
