<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

import { useMessagePop } from '@/plugins/commonutils';
import { useAuthStore } from '@/store/auth/authStore';
import { useCompanyStore } from '@/store/company/companyStore';
import { getCodeList } from '@/apis/common/commonApis';
import { requestOffer } from '@/apis/company/companyApis';
import { isNull } from 'es-toolkit';

const router = useRouter();
const authStore = useAuthStore();
const companyStore = useCompanyStore();
const messagePop = useMessagePop();

const { userInfo } = storeToRefs(authStore);
const { offerUserResume } = storeToRefs(companyStore);

// 직무 카테고리 데이터
const jobCategoryOptions = ref([]);
const koreanLevelOptions = ref([]);

const jobOffer = ref({
  jobCategoryCd: null,
  position: '',
  positionDetail: '',
  content: '안녕하세요. 귀하의 프로필을 보고 연락드립니다.'
});

const candidate = ref();

onMounted(() => {
  getKoreanLevelCode();
  getJobCategoryCode();

  candidate.value = offerUserResume.value;

  candidate.value.user = {
    ...candidate.value.user,
    profileImage: `${import.meta.env.VITE_UPLOAD_PATH}/${candidate.value?.user?.imageFile?.fileName}`
  };
});

// 한국어 실력 코드 조회
const getKoreanLevelCode = async () => {
  const response = await getCodeList(`KOREAN_LV`);

  response.map((item) => {
    koreanLevelOptions.value.push({ name: item.name, code: item.code });
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

// 만 나이 계산 함수
const getGlobalAge = (birth) => {
  if (birth) {
    let birthList = birth?.split('.');
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

    return `${age}세`;
  }
};

// 면접 제안
const submitOffer = () => {
  if (!jobOffer.value.jobCategoryCd) {
    alert('직무 카테고리를 선택해주세요.');
    return;
  }

  // 확인 팝업 표시
  messagePop.confirm({
    icon: 'info',
    message: '면접을 제안하시겠습니까?',
    onCloseYes: async () => {
      const body = {
        companyId: userInfo.value.id,
        resumeId: candidate.value.id,
        statusCd: 'JO_ST_1',
        result: true,
        ...jobOffer.value
      };

      const response = await requestOffer(body);

      if (response && response.success === undefined) {
        companyStore.setOfferUserResume({});

        messagePop.confirm({
          icon: 'info',
          message: '면접 제안이 전송되었습니다.',
          acceptLabel: '확인',
          showReject: false,
          onCloseYes: () => {
            router.back();
          }
        });
      }
    }
  });
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
      <h1 class="text-3xl font-bold">면접 제안하기</h1>
    </div>

    <!-- 선택된 인재 정보 -->
    <div class="bg-white rounded-lg p-6 shadow-sm mb-6">
      <h2 class="text-xl font-bold mb-4">인재 정보</h2>
      <div class="flex justify-between items-start">
        <div class="flex-1">
          <div class="flex items-start gap-3 mb-4">
            <h3 class="text-lg font-bold">{{ candidate?.user?.name }}</h3>
            <span class="bg-[#8B8BF5] bg-opacity-10 text-[#8B8BF5] px-3 py-1 rounded-full text-sm">{{
              candidate?.nationality?.name
            }}</span>
            <span class="bg-[#8B8BF5] bg-opacity-10 text-[#8B8BF5] px-3 py-1 rounded-full text-sm">
              {{
                candidate?.experienceDurationMonth
                  ? '경력 ' +
                    parseInt(candidate?.experienceDurationMonth / 12) +
                    '년 ' +
                    (candidate?.experienceDurationMonth % 12) +
                    '개월'
                  : '신입'
              }}
            </span>
          </div>

          <div class="flex flex-col items-start gap-5">
            <div>
              나이 &nbsp;
              <span class="bg-[#8B8BF5] bg-opacity-10 text-[#8B8BF5] px-3 py-1 rounded-full text-md">
                {{ getGlobalAge(candidate?.user?.birth) }}
              </span>
            </div>
            <div>
              최종학력 &nbsp;
              <span
                v-if="candidate?.finalEducation"
                class="bg-[#8B8BF5] bg-opacity-10 text-[#8B8BF5] px-3 py-1 rounded-full text-md"
              >
                {{ candidate?.finalEducation?.schoolName }} {{ candidate?.finalEducation?.major }}
                {{ candidate?.finalEducation?.isGraduated ? '졸업' : '재학중' }}
              </span>
              <span v-else class="bg-[#e97844] bg-opacity-10 text-[#e97844] px-3 py-1 rounded-full text-md">
                미입력
              </span>
            </div>
            <div>
              혼인여부 &nbsp;
              <span
                v-if="!isNull(candidate?.user?.isMarried)"
                class="bg-[#8B8BF5] bg-opacity-10 text-[#8B8BF5] px-3 py-1 rounded-full text-md"
              >
                {{ candidate?.user?.isMarried ? '기혼' : '미혼' }}
              </span>
              <span v-else class="bg-[#e97844] bg-opacity-10 text-[#e97844] px-3 py-1 rounded-full text-md">
                미입력
              </span>
            </div>
            <div>
              한국어 실력 &nbsp;
              <span
                v-if="!isNull(candidate?.user?.koreanProficiencyCd)"
                class="bg-[#8B8BF5] bg-opacity-10 text-[#8B8BF5] px-3 py-1 rounded-full text-md"
              >
                {{ convertCode(candidate?.user?.koreanProficiencyCd) }}
              </span>
              <span v-else class="bg-[#e97844] bg-opacity-10 text-[#e97844] px-3 py-1 rounded-full text-md">
                미입력
              </span>
            </div>
          </div>
        </div>

        <!-- 프로필 사진 (오른쪽) -->
        <div class="flex-shrink-0">
          <div class="w-[140px] h-[180px] bg-gray-100 rounded-lg overflow-hidden">
            <img
              v-if="candidate?.user?.profileImage"
              :src="candidate?.user?.profileImage || '/default-profile.jpg'"
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

    <!-- 제안 폼 -->
    <div class="bg-white rounded-lg p-6 shadow-sm">
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2"
          >직무 카테고리<span class="text-red-500 ml-1">*</span></label
        >
        <Dropdown
          v-model="jobOffer.jobCategoryCd"
          :options="jobCategoryOptions"
          optionLabel="name"
          optionValue="code"
          placeholder="직무 카테고리를 선택해주세요"
          class="w-full"
        />
      </div>

      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2"
          >포지션<span class="text-red-500 ml-1">*</span></label
        >
        <input
          v-model="jobOffer.position"
          type="text"
          class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8B8BF5]"
          placeholder="제안하실 포지션을 입력해주세요"
        />
      </div>

      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">상세업무</label>
        <textarea
          v-model="jobOffer.positionDetail"
          rows="5"
          class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8B8BF5]"
          placeholder="해당 포지션의 상세 업무를 입력해주세요"
        ></textarea>
      </div>

      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">메시지</label>
        <textarea
          v-model="jobOffer.content"
          rows="3"
          class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8B8BF5]"
          placeholder="면접 제안 메시지를 입력해주세요"
        ></textarea>
      </div>

      <div class="flex justify-end gap-3">
        <button @click="router.back()" class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          취소
        </button>
        <button @click="submitOffer" class="px-6 py-2 bg-[#8B8BF5] text-white rounded-lg hover:bg-[#7A7AE6]">
          제안하기
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.p-dropdown) {
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
}

:deep(.p-dropdown:hover) {
  border-color: #8b8bf5;
}

:deep(.p-dropdown:not(.p-disabled).p-focus) {
  box-shadow: none;
  border-color: #8b8bf5;
  color: #e97844;
}
</style>
