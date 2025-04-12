<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { isNull } from 'es-toolkit';

import { useDateFormatter } from '@/plugins/commonutils';
import { useMessagePop } from '@/plugins/commonutils';
import { answerOffer, getOfferListByUser } from '@/apis/user/userApis';
import { getCodeList } from '@/apis/common/commonApis';

const router = useRouter();
const dateFormatter = useDateFormatter();
const messagePop = useMessagePop();

// 전체 직무 카테고리 옵션
const jobCategoryOptions = ref([]);

// 상세 보기 모달 상태
const showDetailModal = ref(false);
const selectedOffer = ref(null);

// 필터 상태 추가
const selectedFilter = ref('all'); // 'all', 'accepted', 'pending', 'rejected'

// 필터 옵션
const filterOptions = [
  { name: '전체', code: 'all' },
  { name: '대기중', code: 'JO_ST_1' },
  { name: '수락', code: 'JO_ST_2' },
  { name: '거절', code: 'JO_ST_3' },
  { name: '일정 조율', code: 'JO_ST_4' },
  { name: '일정 확정', code: 'JO_ST_5' },
  { name: '면접 완료', code: 'JO_ST_6' }
];

// 면접 일정 선택을 위한 상태
const selectedDateIndices = ref({}); // 각 제안별로 선택된 일정을 추적

// 면접 제안 목록
const offerCompanyList = ref([]);

// 거절 사유 모달 상태 추가
const showRejectReasonModal = ref(false);
const rejectReason = ref('');
const offerToReject = ref(null);

onMounted(() => {
  getJobCategoryCode();

  getOfferList();
});

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

// 면접 제안 현황 목록 조회
const getOfferList = async () => {
  const response = await getOfferListByUser();

  offerCompanyList.value = response.contents
    .filter((com) => com?.resumeSnapshot && com?.resumeSnapshot.user)
    .map((com) => {
      return {
        ...com,
        resumeSnapshot: {
          ...com.resumeSnapshot,
          user: {
            ...com.resumeSnapshot.user,
            profileImage: com.resumeSnapshot.user.imageFile.fileName
              ? `${import.meta.env.VITE_UPLOAD_PATH}/${com.resumeSnapshot.user.imageFile.fileName}`
              : null
          }
        }
      };
    });
};

// 필터링된 제안 목록 computed 속성 추가
const filteredJobOffers = computed(() => {
  return offerCompanyList.value.filter((offer) => {
    return selectedFilter.value === 'all' || offer.statusCd === selectedFilter.value;
  });
});

// 제안 상세 보기
const viewOfferDetail = (offer) => {
  selectedOffer.value = offer;
  if (!offer.isRead) {
    offer.isRead = true;
    // API 호출하여 읽음 상태 업데이트
  }
  showDetailModal.value = true;
};

// 제안 수락
const acceptOffer = async (offer) => {
  messagePop.confirm({
    icon: 'info',
    message: `<div class="text-center">
      <p class="text-xl mb-2">${offer.company.name}의 면접 제안을 수락하시겠습니까?</p>
      <p class="text-sm text-gray-600">수락 시 기업 담당자에게 알림과 메일이 발송됩니다.</p>
      <p class="text-sm text-gray-600">이후 면접 일정 조율이 진행됩니다.</p>
    </div>`,
    acceptLabel: '수락',
    rejectLabel: '취소',
    onCloseYes: async () => {
      // 새로운 객체를 생성하여 할당
      // const index = offerCompanyList.value.findIndex((o) => o.id === offer.id);
      // offerCompanyList.value[index] = {
      //   ...offer,
      //   status: 'accepted',
      //   acceptedAt: new Date().toISOString(),
      //   interviewInfo: false,
      //   interviewConfirmed: false
      // };

      const body = { ...offer, statusCd: 'JO_ST_2' };

      const response = await answerOffer(body);

      if (response && response.success === undefined) {
        messagePop.toast('제안을 수락했었습니다.', 'success');

        showDetailModal.value = false;

        getOfferList();
      } else {
        messagePop.toast('시스템 오류입니다.', 'error');
      }
    }
  });
};

// 제안 거절
const rejectOffer = (offer) => {
  offerToReject.value = offer;
  rejectReason.value = ''; // 거절 사유 초기화
  showRejectReasonModal.value = true;
};

// 거절 확인 함수
const confirmReject = () => {
  if (!rejectReason.value.trim()) {
    messagePop.toast('거절 사유를 입력해주세요.', 'warn');
    return;
  }

  messagePop.confirm({
    icon: 'warn',
    message: `<div class="text-center">
      <p class="text-xl mb-2">면접을 거절하시겠습니까?</p>
      <p class="text-sm text-gray-600">거절 시 기업 담당자에게 알림과 메일이 발송됩니다.</p>
      <p class="text-sm text-red-500">이 결정은 되돌릴 수 없습니다.</p>
    </div>`,
    acceptLabel: '거절',
    rejectLabel: '취소',
    acceptClass: 'p-button-danger',
    onCloseYes: async () => {
      const body = { ...offerToReject.value, statusCd: 'JO_ST_3', resultMemo: rejectReason.value };

      await answerOffer(body);

      selectedDateIndices.value = {};

      messagePop.toast('제안이 거절되었습니다.', 'info');

      getOfferList();

      showRejectReasonModal.value = false;
      showDetailModal.value = false;
    }
  });
};

// 제안 상태에 따른 스타일 클래스
const getStatusClass = (statusCd) => {
  switch (statusCd) {
    case 'JO_ST_1':
      return 'bg-yellow-100 text-yellow-700';
    case 'JO_ST_2':
      return 'bg-green-100 text-green-700';
    case 'JO_ST_3':
      return 'bg-red-100 text-red-700';
    case 'JO_ST_4':
      return 'bg-yellow-100 text-yellow-700';
    case 'JO_ST_5':
      return 'bg-green-100 text-green-700';
    case 'JO_ST_6':
      return 'bg-blue-100 text-blue-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

// 남은 기한 계산 함수 수정
const getDaysUntilDeadline = (deadline) => {
  const today = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // 기한이 지난 경우 '마감' 표시
  if (!isNaN(diffDays) && diffDays < 0) {
    return '마감';
  } else if (!isNaN(diffDays) && diffDays === 0) {
    return 'DAY';
  }

  return isNaN(diffDays) ? 7 : diffDays;
};

// 나이 계산 함수 추가
const calculateAge = (birthDate) => {
  const today = new Date();
  const birth = new Date(birthDate.replace(/\./g, '-'));
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
};

// 면접 일정 수락
const acceptInterviewSchedule = (offer) => {
  // TODO: 필드명 reserve로 통일 필요
  const selectedIndex = selectedDateIndices.value[offer.id];
  const selectedDate = offer[`reserveTime${selectedIndex + 1}`];
  const selectedType = offer[`reserveTypeCd${selectedIndex + 1}`];
  const selectedInfo = offer[`reservePlace${selectedIndex + 1}`];

  messagePop.confirm({
    icon: 'info',
    message: `<div class="text-center">
      <p class="text-xl mb-2">면접 일정을 수락하시겠습니까?</p>
      <p class="text-md text-gray-600 mb-2">일시: ${selectedDate?.slice(0, 10)?.replaceAll('-', '.')} | ${selectedDate?.slice(11, 16)}</p>
      <p class="text-sm text-gray-600">면접 방식: ${selectedType === 'INTERVIEW_TY_1' ? '화상면접' : '대면면접'}</p>
      <p class="text-sm text-gray-600 mb-4">
        ${selectedType === 'INTERVIEW_TY_1' ? '링크' : '장소'}: ${selectedInfo}
      </p>
      <p class="text-sm text-blue-600">확인 시 기업 담당자에게 알림과 메일이 발송됩니다.</p>
    </div>`,
    acceptLabel: '수락',
    rejectLabel: '취소',
    onCloseYes: async () => {
      const body = {
        ...offer,
        interviewTime: selectedDate,
        interviewTypeCd: selectedType,
        interviewInfo: selectedInfo,
        statusCd: 'JO_ST_5'
      };

      const response = await answerOffer(body);

      if (response && response.success == undefined) {
        selectedDateIndices.value[offer.id] = undefined;

        messagePop.toast('면접이 확정되었습니다.', 'success');

        getOfferList();

        showDetailModal.value = false;
      } else {
        messagePop.toast('시스템 오류입니다.', 'error');
      }
    }
  });
};

// 면접 일정 거절
const rejectInterviewSchedule = (offer) => {
  offerToReject.value = offer;
  rejectReason.value = ''; // 거절 사유 초기화
  showRejectReasonModal.value = true;
};

// 경력 기간 계산 함수 추가
const calculatePeriod = (period) => {
  const [start, end] = period.split(' - ').map((date) => {
    const [year, month] = date.split('.');
    return new Date(year, month - 1);
  });

  const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
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
</script>

<template>
  <div class="max-w-[1200px] mx-auto px-4 py-12">
    <!-- 헤더 -->
    <div class="flex items-center gap-4 mb-8">
      <i
        class="pi pi-angle-left text-4xl text-gray-600 cursor-pointer transition-colors hover:text-[#8FA1FF]"
        @click="router.back()"
      ></i>
      <h1 class="text-3xl font-bold">면접 제안</h1>
    </div>

    <!-- 필터 버튼 그룹 추가 -->
    <div class="flex gap-2 mb-6">
      <button
        v-for="option in filterOptions"
        :key="option.code"
        @click="selectedFilter = option.code"
        :class="[
          'px-4 py-2 rounded-full text-sm transition-colors',
          selectedFilter === option.code ? 'bg-[#8B8BF5] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        ]"
      >
        {{ option.name }}
        <!-- 각 상태의 개수 표시 -->
        <span class="ml-1" v-if="option.code !== 'all'">
          ({{ offerCompanyList.filter((offer) => offer.statusCd === option.code).length }})
        </span>
        <!-- 전체 개수 표시 -->
        <span class="ml-1" v-else> ({{ offerCompanyList?.length }}) </span>
      </button>
    </div>

    <!-- 제안 목록 -->
    <div class="space-y-4">
      <div
        v-for="offer in filteredJobOffers"
        :key="offer.id"
        :class="[
          'bg-white rounded-lg shadow-sm border hover:shadow-lg transition-shadow duration-200 w-full',
          offer?.interviewInfo ? 'border-[#8B8BF5] ring-2 ring-[#8B8BF5] ring-opacity-50' : 'border-gray-200'
        ]"
      >
        <div class="p-6">
          <!-- 최상위 컨테이너를 flex-col로 변경 -->
          <div class="flex flex-col">
            <!-- 회사 정보 및 상태 -->
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center gap-2">
                <h3 class="text-lg font-bold">{{ offer?.company?.name }}</h3>
                <span :class="getStatusClass(offer?.statusCd)" class="px-2 py-1 text-xs rounded">
                  {{ offer?.status?.name }}
                </span>
                <span
                  v-if="
                    offer?.statusCd === 'JO_ST_1' &&
                    new Date(offer?.createdAt).toDateString() === new Date().toDateString()
                  "
                  class="bg-red-500 text-white px-2 py-1 rounded text-xs"
                >
                  New
                </span>
              </div>
              <!-- 회신기한을 상단으로 이동 -->
              <div v-if="offer?.statusCd === 'JO_ST_1'" class="text-right">
                <span
                  :class="[
                    'text-sm flex items-center gap-2 justify-end',
                    ['마감', 'DAY'].includes(
                      getDaysUntilDeadline(offer?.deadlineDt?.slice(0, 10)?.replaceAll('-', '.'))
                    )
                      ? 'text-red-500'
                      : getDaysUntilDeadline(offer?.deadlineDt?.slice(0, 10)?.replaceAll('-', '.')) <= 3
                        ? 'text-orange-500'
                        : 'text-gray-500'
                  ]"
                >
                  <i class="pi pi-calendar"></i>
                  회신기한:
                  {{
                    getDaysUntilDeadline(offer?.deadlineDt?.slice(0, 10)?.replaceAll('-', '.')) === '마감'
                      ? '마감'
                      : 'D-' + getDaysUntilDeadline(offer?.deadlineDt?.slice(0, 10)?.replaceAll('-', '.'))
                  }}
                </span>
              </div>
            </div>

            <!-- 회사 정보 -->
            <div class="mb-4">
              <p v-if="offer?.company?.content" class="text-gray-600 text-sm mb-2">{{ offer?.company?.content }}</p>
              <p class="text-gray-500 text-sm flex items-center gap-2">
                <i class="pi pi-map-marker"></i>
                {{ offer?.company?.address }}
              </p>
            </div>

            <!-- 직무·제안 포지션 -->
            <div>
              <h4 class="font-medium text-gray-900 mb-2">
                <span class="flex items-center gap-2">
                  <i class="pi pi-briefcase text-[#8B8BF5]"></i>
                  직무·제안 포지션
                </span>
              </h4>
              <div class="bg-gray-50 p-4 rounded-lg">
                <p class="text-base text-gray-700">
                  {{
                    offer?.jobCategoryCd === 'JOB_22'
                      ? `기타(${offer?.jobCategoryEtc})`
                      : convertJobCode(offer?.jobCategoryCd)
                  }}
                  | {{ offer?.position }}
                </p>
              </div>
            </div>

            <!-- 제안 내용 섹션 -->
            <div class="space-y-4">
              <!-- 상세 업무 -->
              <div>
                <h4 class="font-medium text-gray-900 mb-2">
                  <span class="flex items-center gap-2">
                    <i class="pi pi-list text-[#8B8BF5]"></i>
                    상세 업무
                  </span>
                </h4>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <p class="text-base text-gray-700">{{ offer?.positionDetail }}</p>
                </div>
              </div>

              <!-- 면접제안 메시지 -->
              <div>
                <h4 class="font-medium text-gray-900 mb-2">
                  <span class="flex items-center gap-2">
                    <i class="pi pi-comments text-[#8B8BF5]"></i>
                    면접제안 메시지
                  </span>
                </h4>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <p class="text-base text-gray-700 whitespace-pre-line">{{ offer?.content }}</p>
                </div>
              </div>
            </div>
            <!-- 상태별 다른 내용 표시 -->
            <div class="mt-4 border-t pt-4">
              <!-- 대기중인 경우 -->
              <div v-if="offer?.statusCd === 'JO_ST_1'" class="space-y-4">
                <p class="text-gray-600">
                  <i class="pi pi-clock mr-2"></i>
                  제안받은 날짜: {{ dateFormatter.halfDate(offer?.createdAt) }}
                </p>
                <div
                  class="p-4 rounded-lg"
                  :class="
                    ['마감', 'DAY'].includes(
                      getDaysUntilDeadline(offer?.deadlineDt?.slice(0, 10)?.replaceAll('-', '.'))
                    ) || getDaysUntilDeadline(offer?.deadlineDt?.slice(0, 10)?.replaceAll('-', '.')) < 3
                      ? 'bg-red-50'
                      : 'bg-blue-50'
                  "
                >
                  <p
                    :class="
                      ['마감', 'DAY'].includes(
                        getDaysUntilDeadline(offer?.deadlineDt?.slice(0, 10)?.replaceAll('-', '.'))
                      ) || getDaysUntilDeadline(offer?.deadlineDt?.slice(0, 10)?.replaceAll('-', '.')) < 3
                        ? 'text-red-700'
                        : 'text-blue-700'
                    "
                  >
                    <i class="pi pi-info-circle mr-2"></i>
                    회신기한:
                    {{
                      getDaysUntilDeadline(offer?.deadlineDt?.slice(0, 10)?.replaceAll('-', '.')) === '마감'
                        ? '마감'
                        : 'D-' + getDaysUntilDeadline(offer?.deadlineDt?.slice(0, 10)?.replaceAll('-', '.'))
                    }}
                  </p>
                </div>
              </div>

              <!-- 수락에서 이어진 경우 -->
              <div v-else-if="['JO_ST_2', 'JO_ST_4', 'JO_ST_5'].includes(offer?.statusCd)" class="space-y-4">
                <div class="space-y-2">
                  <p class="text-gray-600">
                    <i class="pi pi-clock mr-2"></i>
                    제안받은 날짜: {{ dateFormatter.fullDate(offer?.createdAt) }}
                  </p>
                  <p class="text-green-600">
                    <i class="pi pi-check-circle mr-2"></i>
                    수락 날짜: {{ dateFormatter.fullDate(offer?.updatedAt) }}
                  </p>
                </div>

                <!-- 면접 수락한 경우 -->
                <div v-if="offer?.statusCd === 'JO_ST_2'" class="space-y-4">
                  <div class="bg-yellow-50 p-4 rounded-lg">
                    <p class="text-yellow-700">
                      <i class="pi pi-clock mr-2"></i>
                      면접 일정 조율 중입니다. 기업 담당자가 일정을 전달할 예정입니다.
                    </p>
                  </div>
                </div>

                <!-- 면접 일정 조율 중인 경우 -->
                <div v-else-if="offer?.statusCd === 'JO_ST_4'" class="space-y-4">
                  <!-- 면접 일정 정보를 담은 파란색 박스 -->
                  <div
                    class="p-4 rounded-lg"
                    :class="
                      getDaysUntilDeadline(offer?.deadlineScheduleDt?.slice(0, 10)?.replaceAll('-', '.')) === '마감' ||
                      getDaysUntilDeadline(offer?.deadlineScheduleDt?.slice(0, 10)?.replaceAll('-', '.')) === 'DAY' ||
                      getDaysUntilDeadline(offer?.deadlineScheduleDt?.slice(0, 10)?.replaceAll('-', '.')) <= 1
                        ? 'bg-red-50'
                        : 'bg-blue-50'
                    "
                  >
                    <h4 class="font-medium text-gray-900 mb-2">제안된 면접 일정</h4>
                    <!-- 회신기한 추가 -->
                    <p
                      class="mb-4"
                      :class="
                        ['마감', 'DAY'].includes(
                          getDaysUntilDeadline(offer?.deadlineScheduleDt?.slice(0, 10)?.replaceAll('-', '.'))
                        ) || getDaysUntilDeadline(offer?.deadlineScheduleDt?.slice(0, 10)?.replaceAll('-', '.')) <= 1
                          ? 'text-red-700'
                          : 'text-blue-700'
                      "
                    >
                      <i class="pi pi-info-circle mr-2"></i>
                      회신기한:
                      {{
                        getDaysUntilDeadline(offer?.deadlineScheduleDt?.slice(0, 10)?.replaceAll('-', '.')) === '마감'
                          ? '마감'
                          : 'D-' + getDaysUntilDeadline(offer?.deadlineScheduleDt?.slice(0, 10)?.replaceAll('-', '.'))
                      }}
                    </p>
                    <div class="space-y-4 mb-4">
                      <div
                        v-for="(dateSlot, index) in ['reserveTime1', 'reserveTime2', 'reserveTime3']
                          .map((key, i) => ({
                            time: offer[key],
                            type: offer[`reserveTypeCd${i + 1}`],
                            info: offer[`reservePlace${i + 1}`]
                          }))
                          .filter((item) => item.time)"
                        :key="index"
                        class="flex items-start gap-4 p-3 bg-white rounded-lg"
                      >
                        <input
                          v-model="selectedDateIndices[offer.id]"
                          class="mt-1"
                          type="radio"
                          :name="'interview-date-' + offer.id"
                          :value="index"
                          :disabled="
                            getDaysUntilDeadline(offer?.deadlineScheduleDt?.slice(0, 10)?.replaceAll('-', '.')) ===
                            '마감'
                          "
                          @click.stop
                        />
                        <div class="space-y-2">
                          <div class="font-medium flex items-center gap-2">
                            {{ dateSlot?.time?.slice(0, 10)?.replaceAll('-', '.') }}
                            <span class="text-gray-400">|</span>
                            {{ dateSlot?.time?.slice(11, 16) }}
                          </div>
                          <div class="flex items-center gap-2 text-sm text-gray-600">
                            <i class="pi pi-video"></i>
                            <span>면접 방식: {{ dateSlot?.type === 'INTERVIEW_TY_1' ? '화상면접' : '대면면접' }}</span>
                          </div>
                          <div class="flex items-center gap-2 text-sm text-gray-600">
                            <i class="pi pi-map-marker text-green-600"></i>
                            <span class="text-gray-700">
                              {{ dateSlot?.type === 'INTERVIEW_TY_1' ? '링크: ' : '장소: ' }}
                              <a
                                v-if="dateSlot?.type === 'INTERVIEW_TY_1'"
                                :href="dateSlot?.info"
                                target="_blank"
                                class="text-blue-600 hover:underline"
                              >
                                {{ dateSlot?.info }}
                              </a>
                              <span v-else>{{ dateSlot?.info }}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 면접 일정 확정된 경우 -->
                <div v-else-if="offer?.statusCd === 'JO_ST_5'" class="bg-green-50 p-4 rounded-lg">
                  <h4 class="font-medium text-gray-900 mb-2">확정된 면접 일정</h4>
                  <div class="flex items-center gap-2">
                    <i class="pi pi-calendar text-green-600"></i>
                    <div class="font-medium flex items-center gap-2">
                      {{ offer?.interviewTime?.slice(0, 10)?.replaceAll('-', '.') }}
                      <span class="text-gray-400">|</span>
                      {{ offer?.interviewTime?.slice(11, 16) }}
                    </div>
                  </div>
                  <div class="flex items-center gap-2 mt-2">
                    <i class="pi pi-video text-green-600"></i>
                    <span class="text-gray-700">
                      방식: {{ offer?.interviewTypeCd === 'INTERVIEW_TY_1' ? '화상 면접' : '대면 면접' }}
                      <span class="text-gray-400 mx-2">|</span>
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
                  <p class="mt-4 text-green-600 flex items-center gap-2">
                    <i class="pi pi-check-circle"></i>
                    <span>{{ dateFormatter.fullDate(offer?.updatedAt) }}에 면접 일정이 확정되었습니다</span>
                  </p>
                </div>
              </div>

              <!-- 거절된 경우 -->
              <div v-else-if="offer?.statusCd === 'JO_ST_3'" class="space-y-4">
                <div class="space-y-2">
                  <p class="text-gray-600">
                    <i class="pi pi-clock mr-2"></i>
                    제안받은 날짜: {{ dateFormatter.fullDate(offer?.createdAt) }}
                  </p>
                  <p class="text-red-600">
                    <i class="pi pi-times-circle mr-2"></i>
                    거절한 날짜: {{ dateFormatter.fullDate(offer?.updatedAt) }}
                  </p>
                  <!-- 거절 사유 표시 추가 -->
                  <div v-if="offer?.resultMemo" class="bg-red-50 p-4 rounded-lg mt-2">
                    <p class="text-red-700">
                      <span class="font-medium">거절 사유:</span><br />
                      {{ offer?.resultMemo }}
                    </p>
                  </div>
                </div>
                <!-- <div class="flex gap-2 justify-end">
                  <Button label="상세정보보기" class="p-button-outlined" @click="viewOfferDetail(offer)" />
                </div> -->
              </div>

              <!-- 면접 완료된 경우 표시 -->
              <div v-if="offer?.statusCd === 'JO_ST_6'" class="space-y-4">
                <div class="space-y-2">
                  <p class="text-gray-600">
                    <i class="pi pi-clock mr-2"></i>
                    제안받은 날짜: {{ dateFormatter.fullDate(offer?.createdAt) }}
                  </p>
                  <p class="text-green-600">
                    <i class="pi pi-check-circle mr-2"></i>
                    수락 날짜: {{ dateFormatter.fullDate(offer?.updatedAt) }}
                  </p>
                </div>
                <div class="grid grid-cols-1 gap-4">
                  <div class="flex items-center gap-2">
                    <i class="pi pi-calendar text-blue-600"></i>
                    <div class="space-y-2">
                      <div class="font-medium flex items-center gap-2">
                        {{ offer?.interviewTime?.slice(0, 10)?.replaceAll('-', '.') }}
                        <span class="text-gray-400">|</span>
                        {{ offer?.interviewTime?.slice(11, 16) }}
                      </div>
                    </div>
                    <!-- <p class="text-blue-600">
                      <i class="pi pi-check-circle mr-2"></i>
                      면접 완료
                    </p> -->
                  </div>
                </div>

                <div v-if="!offer?.resultCd || offer?.resultCd === 'INTERVIEW_RESULT_3'" class="space-y-4">
                  <div class="bg-blue-50 p-4 rounded-lg">
                    <p class="text-blue-700">
                      <i class="pi pi-clock mr-2"></i>
                      면접이 완료 되었습니다. 기업 담당자가 결과를 전달할 예정입니다.
                    </p>
                  </div>
                </div>
                <div v-else class="space-y-4">
                  <div class="bg-blue-50 p-4 rounded-lg">
                    <p class="text-blue-700">
                      <i class="pi pi-clock mr-2"></i>
                      채용 결과가 공지되었습니다. 면접 결과 페이지에서 확인해주세요.
                    </p>
                  </div>
                </div>
              </div>

              <div class="mt-4 flex justify-between">
                <button
                  class="text-[#8B8BF5] hover:text-[#7A7AE6] flex items-center gap-1"
                  @click="viewOfferDetail(offer)"
                >
                  <span>상세 정보 보기</span>
                  <i class="pi pi-arrow-right text-sm"></i>
                </button>

                <div v-if="offer?.statusCd === 'JO_ST_1'" class="flex gap-2 justify-end">
                  <Button
                    class="p-button-danger"
                    label="거절하기"
                    :disabled="getDaysUntilDeadline(offer?.deadlineDt?.slice(0, 10)?.replaceAll('-', '.')) === '마감'"
                    @click="rejectOffer(offer)"
                  />
                  <Button
                    class="bt_btn primary"
                    label="수락하기"
                    :disabled="getDaysUntilDeadline(offer?.deadlineDt?.slice(0, 10)?.replaceAll('-', '.')) === '마감'"
                    @click="acceptOffer(offer)"
                  />
                </div>

                <div v-if="offer?.statusCd === 'JO_ST_4'" class="flex gap-2 justify-end">
                  <Button
                    class="p-button-danger"
                    label="면접 거절"
                    :disabled="
                      getDaysUntilDeadline(offer?.deadlineScheduleDt?.slice(0, 10)?.replaceAll('-', '.')) === '마감'
                    "
                    @click="rejectInterviewSchedule(offer)"
                  />
                  <Button
                    class="bt_btn primary"
                    label="일정 수락"
                    :disabled="
                      selectedDateIndices[offer.id] === undefined ||
                      getDaysUntilDeadline(offer?.deadlineScheduleDt?.slice(0, 10)?.replaceAll('-', '.')) === '마감'
                    "
                    @click="acceptInterviewSchedule(offer)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 필터링된 결과가 없을 때 표시할 메시지 -->
    <div v-if="filteredJobOffers.length === 0" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="text-center py-12">
        <div class="text-gray-500">
          <i class="pi pi-inbox text-4xl mb-4"></i>
          <p class="text-lg">해당하는 면접 제안이 없습니다</p>
        </div>
      </div>
    </div>

    <!-- 상세 보기 모달 -->
    <Dialog
      v-if="showDetailModal"
      v-model:visible="showDetailModal"
      modal
      :style="{ width: '55vw', minWidth: '700px' }"
    >
      <!-- 헤더 커스텀 -->
      <template #header>
        <div class="flex items-center gap-2">
          <span class="text-xl font-bold">{{ selectedOffer?.company?.name }}</span>
          <span v-if="selectedOffer" :class="getStatusClass(selectedOffer.statusCd)" class="px-2 py-1 text-xs rounded">
            {{ selectedOffer?.status?.name }}
          </span>
        </div>
      </template>

      <div v-if="selectedOffer" class="p-6 space-y-6">
        <!-- 회사 기본 정보 -->
        <div class="space-y-3">
          <!-- 회사 사업 분야 (business가 있을 때만 표시) -->
          <div v-if="selectedOffer?.company?.content" class="flex gap-8 text-gray-600">
            <span class="flex items-center gap-2">
              <i class="pi pi-briefcase"></i>
              {{ selectedOffer?.company?.content }}
            </span>
          </div>
          <!-- 회사 주소 -->
          <div class="flex gap-8 text-gray-600">
            <span class="flex items-center gap-2">
              <i class="pi pi-map-marker"></i>
              {{ selectedOffer?.company?.address }}
            </span>
          </div>
        </div>

        <!-- 제안 내용 섹션 수정 -->
        <div class="space-y-4">
          <!-- 직무·제안 포지션 -->
          <div>
            <h4 class="font-medium text-gray-900 mb-2">
              <span class="flex items-center gap-2">
                <i class="pi pi-briefcase text-[#8B8BF5]"></i>
                직무·제안 포지션
              </span>
            </h4>
            <div class="bg-gray-50 p-4 rounded-lg">
              <p class="text-base text-gray-700">
                {{
                  selectedOffer?.jobCategoryCd === 'JOB_22'
                    ? `기타(${selectedOffer?.jobCategoryEtc})`
                    : convertJobCode(selectedOffer?.jobCategoryCd)
                }}
                | {{ selectedOffer?.position }}
              </p>
            </div>
          </div>

          <!-- 상세 업무 -->
          <div>
            <h4 class="font-medium text-gray-900 mb-2">
              <span class="flex items-center gap-2">
                <i class="pi pi-list text-[#8B8BF5]"></i>
                상세 업무
              </span>
            </h4>
            <div class="bg-gray-50 p-4 rounded-lg">
              <p class="text-base text-gray-700">{{ selectedOffer?.positionDetail }}</p>
            </div>
          </div>

          <!-- 면접제안 메시지 -->
          <div>
            <h4 class="font-medium text-gray-900 mb-2">
              <span class="flex items-center gap-2">
                <i class="pi pi-comments text-[#8B8BF5]"></i>
                면접제안 메시지
              </span>
            </h4>
            <div class="bg-gray-50 p-4 rounded-lg">
              <p class="text-base text-gray-700 whitespace-pre-line">{{ selectedOffer?.content }}</p>
            </div>
          </div>
        </div>

        <!-- 상태별 다른 내용 표시 -->
        <div class="mt-4 border-t pt-4">
          <!-- 대기중인 경우 -->
          <div v-if="selectedOffer?.statusCd === 'JO_ST_1'" class="space-y-4">
            <p class="text-gray-600">
              <i class="pi pi-clock mr-2"></i>
              제안받은 날짜: {{ dateFormatter.fullDate(selectedOffer?.createdAt) }}
            </p>
            <div
              class="p-4 rounded-lg"
              :class="
                ['마감', 'DAY'].includes(
                  getDaysUntilDeadline(selectedOffer?.deadlineDt?.slice(0, 10)?.replaceAll('-', '.'))
                ) || getDaysUntilDeadline(selectedOffer?.deadlineDt?.slice(0, 10)?.replaceAll('-', '.')) < 3
                  ? 'bg-red-50'
                  : 'bg-blue-50'
              "
            >
              <p
                class="mb-4"
                :class="
                  ['마감', 'DAY'].includes(
                    getDaysUntilDeadline(selectedOffer?.deadlineDt?.slice(0, 10)?.replaceAll('-', '.'))
                  ) || getDaysUntilDeadline(selectedOffer?.deadlineDt?.slice(0, 10)?.replaceAll('-', '.')) <= 1
                    ? 'text-red-700'
                    : 'text-blue-700'
                "
              >
                <i class="pi pi-info-circle mr-2"></i>
                회신기한:
                {{
                  getDaysUntilDeadline(selectedOffer?.deadlineDt?.slice(0, 10)?.replaceAll('-', '.')) === '마감'
                    ? '마감'
                    : 'D-' + getDaysUntilDeadline(selectedOffer?.deadlineDt?.slice(0, 10)?.replaceAll('-', '.'))
                }}
              </p>
            </div>

            <div class="flex gap-2 justify-end">
              <Button
                label="거절하기"
                class="p-button-danger"
                :disabled="
                  getDaysUntilDeadline(selectedOffer?.deadlineDt?.slice(0, 10)?.replaceAll('-', '.')) === '마감'
                "
                @click="rejectOffer(selectedOffer)"
              />
              <Button
                label="수락하기"
                class="bt_btn primary"
                :disabled="
                  getDaysUntilDeadline(selectedOffer?.deadlineDt?.slice(0, 10)?.replaceAll('-', '.')) === '마감'
                "
                @click="acceptOffer(selectedOffer)"
              />
            </div>
          </div>

          <!-- 수락에서 이어진 경우 -->
          <div v-else-if="['JO_ST_2', 'JO_ST_4', 'JO_ST_5'].includes(selectedOffer?.statusCd)" class="space-y-4">
            <div class="space-y-2">
              <p class="text-gray-600">
                <i class="pi pi-clock mr-2"></i>
                제안받은 날짜: {{ dateFormatter.fullDate(selectedOffer?.createdAt) }}
              </p>
              <p class="text-green-600">
                <i class="pi pi-check-circle mr-2"></i>
                수락 날짜: {{ dateFormatter.fullDate(selectedOffer?.updatedAt) }}
              </p>
            </div>

            <!-- 면접 일정 대기 중인 경우 -->
            <div v-if="['JO_ST_2'].includes(selectedOffer?.statusCd)" class="space-y-4">
              <div class="bg-yellow-50 p-4 rounded-lg">
                <p class="text-yellow-700">
                  <i class="pi pi-clock mr-2"></i>
                  면접 일정 조율 중입니다. 기업 담당자가 일정을 전달할 예정입니다.
                </p>
              </div>
            </div>

            <!-- 면접 일정 조율중인 경우 -->
            <div v-else-if="['JO_ST_4'].includes(selectedOffer?.statusCd)" class="space-y-4">
              <!-- 면접 일정 정보를 담은 파란색 박스 -->
              <div
                class="p-4 rounded-lg"
                :class="
                  ['마감', 'DAY'].includes(
                    getDaysUntilDeadline(selectedOffer?.deadlineScheduleDt?.slice(0, 10)?.replaceAll('-', '.'))
                  ) || getDaysUntilDeadline(selectedOffer?.deadlineScheduleDt?.slice(0, 10)?.replaceAll('-', '.')) < 1
                    ? 'bg-red-50'
                    : 'bg-blue-50'
                "
              >
                <h4 class="font-medium text-gray-900 mb-2">제안된 면접 일정</h4>
                <!-- 회신기한 추가 -->
                <p
                  class="mb-4"
                  :class="
                    ['마감', 'DAY'].includes(
                      getDaysUntilDeadline(selectedOffer?.deadlineScheduleDt?.slice(0, 10)?.replaceAll('-', '.'))
                    ) ||
                    getDaysUntilDeadline(selectedOffer?.deadlineScheduleDt?.slice(0, 10)?.replaceAll('-', '.')) <= 1
                      ? 'text-red-700'
                      : 'text-blue-700'
                  "
                >
                  <i class="pi pi-info-circle mr-2"></i>
                  회신기한:
                  {{
                    getDaysUntilDeadline(selectedOffer?.deadlineScheduleDt?.slice(0, 10)?.replaceAll('-', '.')) ===
                    '마감'
                      ? '마감'
                      : 'D-' +
                        getDaysUntilDeadline(selectedOffer?.deadlineScheduleDt?.slice(0, 10)?.replaceAll('-', '.'))
                  }}
                </p>
                <div class="space-y-4 mb-4">
                  <div
                    v-for="(dateSlot, index) in ['reserveTime1', 'reserveTime2', 'reserveTime3']
                      .map((key) => selectedOffer[key])
                      .filter((time) => time)"
                    :key="index"
                    class="flex items-start gap-4 p-3 bg-white rounded-lg"
                  >
                    <input
                      v-model="selectedDateIndices[selectedOffer.id]"
                      class="mt-1"
                      type="radio"
                      :name="'interview-date-' + selectedOffer.id"
                      :value="index"
                      :disabled="
                        getDaysUntilDeadline(selectedOffer?.deadlineScheduleDt?.slice(0, 10)?.replaceAll('-', '.')) ===
                        '마감'
                      "
                      @click.stop
                    />
                    <div class="space-y-2">
                      <div class="font-medium flex items-center gap-2">
                        {{ dateSlot?.slice(0, 10)?.replaceAll('-', '.') }}
                        <span class="text-gray-400">|</span>
                        {{ dateSlot?.slice(11, 16) }}
                      </div>
                      <div class="flex items-center gap-2 text-sm text-gray-600">
                        <i class="pi pi-video"></i>
                        <span>면접 방식: {{ selectedOffer?.interviewType?.name }}</span>
                      </div>
                      <div class="flex items-center gap-2 text-sm text-gray-600">
                        <i class="pi pi-map-marker text-green-600"></i>
                        <span class="text-gray-700">
                          {{ selectedOffer?.interviewType?.code === 'IT_1' ? '장소: ' : '링크: ' }}
                          <a
                            v-if="selectedOffer?.interviewType?.code !== 'IT_1'"
                            :href="selectedOffer?.interviewInfo"
                            target="_blank"
                            class="text-blue-600 hover:underline"
                          >
                            {{ selectedOffer?.interviewInfo }}
                          </a>
                          <span v-else>{{ selectedOffer?.interviewInfo }}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex gap-2 justify-end">
                <Button
                  class="p-button-danger"
                  label="면접 거절"
                  :disabled="
                    getDaysUntilDeadline(selectedOffer?.deadlineScheduleDt?.slice(0, 10)?.replaceAll('-', '.')) ===
                    '마감'
                  "
                  @click="rejectInterviewSchedule(selectedOffer)"
                />
                <Button
                  class="bt_btn primary"
                  label="일정 수락"
                  :disabled="
                    selectedDateIndices[selectedOffer.id] === undefined ||
                    getDaysUntilDeadline(selectedOffer?.deadlineScheduleDt?.slice(0, 10)?.replaceAll('-', '.')) ===
                      '마감'
                  "
                  @click="acceptInterviewSchedule(selectedOffer)"
                />
              </div>
            </div>

            <!-- 면접 일정 확정된 경우 -->
            <div v-else-if="['JO_ST_5'].includes(selectedOffer?.statusCd)" class="bg-green-50 p-4 rounded-lg">
              <h4 class="font-medium text-gray-900 mb-2">확정된 면접 일정</h4>
              <div class="flex items-center gap-2">
                <i class="pi pi-calendar text-green-600"></i>
                <div class="font-medium flex items-center gap-2">
                  {{ selectedOffer?.interviewTime?.slice(0, 10)?.replaceAll('-', '.') }}
                  <span class="text-gray-400">|</span>
                  {{ selectedOffer?.interviewTime?.slice(11, 16) }}
                </div>
              </div>
              <div class="flex items-center gap-2 mt-2">
                <i class="pi pi-video text-green-600"></i>
                <span class="text-gray-700">
                  방식: {{ selectedOffer?.interviewTypeCd === 'INTERVIEW_TY_1' ? '화상 면접' : '대면 면접' }}
                  <span class="text-gray-400 mx-2">|</span>
                  {{ selectedOffer?.interviewTypeCd === 'INTERVIEW_TY_1' ? '링크: ' : '장소: ' }}
                  <a
                    v-if="selectedOffer?.interviewTypeCd === 'INTERVIEW_TY_1'"
                    :href="selectedOffer?.interviewInfo"
                    target="_blank"
                    class="text-blue-600 hover:underline"
                  >
                    {{ selectedOffer?.interviewInfo }}
                  </a>
                  <span v-else>{{ selectedOffer?.interviewInfo }}</span>
                </span>
              </div>
              <p class="mt-4 text-green-600 flex items-center gap-2">
                <i class="pi pi-check-circle"></i>
                <span>{{ dateFormatter.fullDate(selectedOffer?.updatedAt) }}에 면접 일정이 확정되었습니다</span>
              </p>
            </div>
          </div>

          <!-- 면접 완료된 경우 -->
          <div v-else-if="selectedOffer?.statusCd === 'JO_ST_6'" class="flex justify-between mt-1">
            <div class="grid grid-cols-1 gap-4">
              <div class="flex items-center gap-2">
                <i class="pi pi-calendar text-blue-600"></i>
                <div class="space-y-2">
                  <div class="font-medium flex items-center gap-2">
                    {{ selectedOffer?.interviewTime?.slice(0, 10)?.replaceAll('-', '.') }}
                    <span class="text-gray-400">|</span>
                    {{ selectedOffer?.interviewTime?.slice(11, 16) }}
                  </div>
                </div>
              </div>
            </div>

            <p class="text-blue-600 ml-14">
              <i class="pi pi-check-circle mr-2"></i>
              면접 완료
            </p>
          </div>

          <!-- 거절된 경우 -->
          <div v-else-if="selectedOffer?.statusCd === 'JO_ST_3'" class="space-y-4">
            <div class="space-y-2">
              <p class="text-gray-600">
                <i class="pi pi-clock mr-2"></i>
                제안받은 날짜: {{ dateFormatter.fullDate(selectedOffer?.createdAt) }}
              </p>
              <p class="text-red-600">
                <i class="pi pi-times-circle mr-2"></i>
                거절한 날짜: {{ dateFormatter.fullDate(selectedOffer?.updatedAt) }}
              </p>
              <!-- 거절 사유 표시 추가 -->
              <div v-if="selectedOffer?.resultMemo" class="bg-red-50 p-4 rounded-lg mt-2">
                <p class="text-red-700">
                  <span class="font-medium">거절 사유:</span><br />
                  {{ selectedOffer?.resultMemo }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- 제안 당시 이력서 정보 -->
        <div v-if="selectedOffer?.resumeSnapshot" class="border-t mt-6 pt-6">
          <div class="flex items-center justify-between mb-4">
            <h4 class="font-medium text-gray-900">제안 당시 이력서 정보</h4>
            <div class="text-sm text-gray-500">
              <i class="pi pi-clock mr-1"></i>
              {{ dateFormatter.fullDate(selectedOffer?.createdAt) }} 기준
            </div>
          </div>

          <!-- 기본 정보 -->
          <div class="bg-gray-50 p-6 rounded-lg mb-6">
            <h3 class="text-lg font-medium mb-4">기본 정보</h3>
            <div class="grid grid-cols-[1fr_1fr_auto] gap-x-8">
              <!-- 왼쪽 컬럼 -->
              <div class="grid grid-cols-[80px_auto] gap-y-2 text-sm text-gray-600">
                <span class="text-gray-600">이름</span>
                <span translate="no">{{ selectedOffer?.resumeSnapshot?.user?.name }}</span>
                <span class="text-gray-600">생년월일</span>
                <span>{{ selectedOffer?.resumeSnapshot?.user?.birth }}</span>
                <span class="text-gray-600">성별</span>
                <span>{{ selectedOffer?.resumeSnapshot?.user?.gender?.name }}</span>
                <span class="text-gray-600">휴대폰</span>
                <span>{{ selectedOffer?.resumeSnapshot?.user?.mobile }}</span>
                <span class="text-gray-600">이메일</span>
                <span>{{ selectedOffer?.resumeSnapshot?.user?.email }}</span>
                <span class="text-gray-600">주소</span>
                <span>{{ selectedOffer?.resumeSnapshot?.user?.address }}</span>
              </div>

              <!-- 가운데 컬럼 -->
              <div class="grid grid-cols-[100px_auto] gap-y-2 text-sm text-gray-600">
                <span class="text-gray-600">범죄경력</span>
                <span>
                  {{ selectedOffer?.resumeSnapshot?.user?.hasCriminalRecord ? '있음' : '없음' }}
                </span>
                <span class="text-gray-600">한국어 능력</span>
                <span>{{ selectedOffer?.resumeSnapshot?.user?.koreanProficiency?.name || '미입력' }}</span>
                <span class="text-gray-600">학습기간</span>
                <span>{{ selectedOffer?.resumeSnapshot?.user?.koreanStudyPeriod || '미입력' }}</span>
                <span class="text-gray-600">방문경험</span>
                <span>{{ selectedOffer?.resumeSnapshot?.user?.hasVisitedKorea ? '있음' : '없음' }}</span>
                <span class="text-gray-600">혼인여부</span>
                <span>{{
                  isNull(selectedOffer?.resumeSnapshot?.user?.isMarried)
                    ? '미입력'
                    : selectedOffer?.resumeSnapshot?.user?.isMarried
                      ? '기혼'
                      : '미혼'
                }}</span>
              </div>

              <!-- 프로필 사진 (오른쪽) -->
              <div class="flex flex-col items-center">
                <div class="w-[140px] h-[180px] bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    v-if="selectedOffer?.resumeSnapshot?.user?.profileImage"
                    :src="selectedOffer?.resumeSnapshot?.user?.profileImage"
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

          <!-- 국가 정보 -->
          <div class="bg-gray-50 p-6 rounded-lg mb-6">
            <div class="flex items-center gap-8">
              <h3 class="text-lg font-bold w-20">국적</h3>
              <span class="text-gray-600">{{ selectedOffer?.resumeSnapshot?.nationality?.name }}</span>
            </div>
          </div>

          <!-- 여권 정보 -->
          <div class="bg-gray-50 p-6 rounded-lg mb-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-bold">여권</h3>
            </div>
            <div class="grid gap-y-4">
              <div class="flex gap-8">
                <span class="text-gray-600 w-20">이름</span>
                <span translate="no"
                  >{{ selectedOffer?.resumeSnapshot?.passportFirstName }}
                  {{ selectedOffer?.resumeSnapshot?.passportLastName }}</span
                >
              </div>
              <div class="flex gap-8">
                <span class="text-gray-600 w-20">여권번호</span>
                <span>{{ selectedOffer?.resumeSnapshot?.passport }}</span>
              </div>
              <div class="flex gap-8">
                <span class="text-gray-600 w-20">발급국가</span>
                <span>{{ selectedOffer?.resumeSnapshot?.passportCountry?.name }}</span>
              </div>
              <div class="flex gap-8">
                <span class="text-gray-600 w-20">만료일</span>
                <span>{{ selectedOffer?.resumeSnapshot?.passportExpiryDt?.slice(0, 10)?.replaceAll('-', '.') }}</span>
              </div>
            </div>
          </div>

          <!-- 경력 정보 -->
          <div class="bg-gray-50 p-6 rounded-lg mb-6">
            <div class="flex items-center gap-2 mb-4">
              <h3 class="text-lg font-medium">경력 사항</h3>
              <span class="text-sm text-[#8B8BF5] bg-[#8B8BF5] bg-opacity-10 px-2 py-1 rounded">
                {{
                  selectedOffer?.resumeSnapshot?.experienceDurationMonth
                    ? '총 ' +
                      parseInt(selectedOffer?.resumeSnapshot?.experienceDurationMonth / 12) +
                      '년 ' +
                      (selectedOffer?.resumeSnapshot?.experienceDurationMonth % 12) +
                      '개월'
                    : '신입'
                }}
              </span>
            </div>
            <div v-if="selectedOffer?.resumeSnapshot?.experiences?.length">
              <div
                v-for="career in selectedOffer?.resumeSnapshot?.experiences"
                :key="career?.id"
                class="mb-4 pb-4 border-b last:border-b-0"
              >
                <div class="flex items-center gap-2">
                  <div class="font-medium">{{ career?.companyName }}</div>
                  <span class="text-sm text-gray-500">
                    ({{
                      `${career?.startDt?.slice(0, 7)?.replaceAll('-', '.')} ~ ${career?.endDt?.slice(0, 7) ? career?.endDt?.slice(0, 7)?.replaceAll('-', '.') : '재직중'}`
                    }})
                  </span>
                </div>
                <div class="text-gray-600">
                  {{ career?.jobCategory?.name }} | {{ career?.position }} |
                  {{ career?.department }}
                </div>
                <div class="mt-2 whitespace-pre-line">{{ career?.content }}</div>
              </div>
            </div>
            <div v-else class="text-center text-gray-500">등록된 경력이 없습니다</div>
          </div>

          <!-- 학력 정보 -->
          <div class="bg-gray-50 p-6 rounded-lg mb-6">
            <div class="flex items-center gap-2 mb-4">
              <h3 class="text-lg font-medium">학력 사항</h3>
              <span class="text-sm text-[#8B8BF5] bg-[#8B8BF5] bg-opacity-10 px-2 py-1 rounded">
                {{
                  selectedOffer?.resumeSnapshot?.finalEducation
                    ? '최종학력 : ' +
                      `${selectedOffer?.resumeSnapshot?.finalEducation?.schoolName} ${selectedOffer?.resumeSnapshot?.finalEducation?.major} ${selectedOffer?.resumeSnapshot?.finalEducation?.isGraduated ? '졸업' : '재학중'}`
                    : ''
                }}
              </span>
            </div>
            <div v-if="selectedOffer?.resumeSnapshot?.educations?.length">
              <div
                v-for="education in selectedOffer?.resumeSnapshot?.educations"
                :key="education.schoolName"
                class="mb-6 pb-6 border-b last:border-b-0"
              >
                <div class="text-[#8B8BF5] mb-2">
                  {{ education?.schoolName }} {{ `(${education?.educationLevel?.name})` }}
                </div>
                <div class="text-gray-600">{{ education?.major }}</div>
                <div class="text-gray-600">
                  {{ `${education?.startDt} ~ ${education?.endDt ? education?.endDt : '재학중'}` }}
                </div>
                <div class="whitespace-pre-line">{{ education?.content }}</div>
              </div>
            </div>

            <div v-else class="text-center text-gray-500">등록된 학력이 없습니다</div>
          </div>

          <!-- 자격증 정보 -->
          <div class="bg-gray-50 p-6 rounded-lg">
            <div class="mb-4">
              <h3 class="text-lg font-medium">자격증 사항</h3>
            </div>
            <div v-if="selectedOffer?.resumeSnapshot?.certifications?.length" class="space-y-4">
              <div
                v-for="(cert, index) in selectedOffer?.resumeSnapshot?.certifications"
                :key="index"
                class="mb-4 pb-4 border-b last:border-b-0"
              >
                <div class="flex items-start">
                  <div>
                    <div class="font-medium mb-1">{{ cert?.name }}</div>
                    <div class="font-medium mb-1">발급기관 : {{ cert?.issuer }}</div>
                    <div class="text-gray-600">취득일 : {{ cert?.acquiredDt?.slice(0, 10)?.replaceAll('-', '.') }}</div>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="text-center text-gray-500">등록된 자격증이 없습니다</div>
          </div>
        </div>
      </div>
    </Dialog>

    <!-- 거절 사유 입력 모달 추가 -->
    <Dialog
      v-model:visible="showRejectReasonModal"
      modal
      header="면접 거절 사유"
      draggable="false"
      :style="{ width: '500px' }"
    >
      <div class="p-6">
        <div class="space-y-4">
          <p class="text-xl mb-2">면접을 거절하시겠습니까?</p>
          <div class="space-y-2">
            <p class="text-gray-600">거절 사유를 입력해주세요.</p>
            <Textarea
              v-model="rejectReason"
              rows="4"
              placeholder="예: 다른 회사의 채용 과정이 진행 중입니다."
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8FA1FF] resize-none"
            ></Textarea>
          </div>
          <div class="space-y-1 mt-4">
            <p class="text-sm text-gray-600">거절 시 기업 담당자에게 알림과 메일이 발송됩니다.</p>
            <p class="text-sm text-red-500">이 결정은 되돌릴 수 없습니다.</p>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <Button
            label="취소"
            class="bt_btn secondary p-button-text"
            style="width: 100px"
            @click="showRejectReasonModal = false"
          />
          <Button label="거절" style="width: 100px" severity="danger" @click="confirmReject" />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
:deep(.p-dialog-header) {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

:deep(.p-dialog-content) {
  padding: 0;
}

:deep(.p-button.p-button-success) {
  background: #10b981;
  border-color: #10b981;
}

:deep(.p-button.p-button-success:hover) {
  background: #059669;
  border-color: #059669;
}

:deep(.p-button.p-button-danger) {
  padding: 8px 16px;
  border: 0;
  /* background: #ef4444;
  border-color: #ef4444; */
  background: tomato;
  border-color: tomato;
}

:deep(.p-button.p-button-danger:hover) {
  padding: 8px 16px;
  border: 0;
  background: #dc2626;
  border-color: #dc2626;
}

:deep(.p-button.p-button-outlined) {
  background: transparent;
  border-color: #8b8bf5;
  color: #8b8bf5;
}

:deep(.p-button.p-button-outlined:hover) {
  background: rgba(139, 139, 245, 0.04);
  border-color: #7070f3;
  color: #7070f3;
}

/* 프로필 이미지 관련 스타일 추가 */
.profile-image-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e5e7eb;
  color: #9ca3af;
}
</style>
