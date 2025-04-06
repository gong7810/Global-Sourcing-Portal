<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

import { useAuthStore } from '@/store/auth/authStore';
import { useCompanyStore } from '@/store/company/companyStore';
import { useMessagePop } from '@/plugins/commonutils';
import { getCodeList } from '@/apis/common/commonApis';
import { deleteFavoriteResume, getResumeList, getUserResume, insertFavoriteResume } from '@/apis/company/companyApis';

const router = useRouter();
const authStore = useAuthStore();
const companyStore = useCompanyStore();
const messagePop = useMessagePop();

const { userInfo } = storeToRefs(authStore);

const showResumeModal = ref(false);
const selectedCandidate = ref(null);
const isAccepted = ref(false);
const isLoading = ref(false);

// 필터 옵션
const nationalityOptions = ref([]);
const careerOptions = ref([]);
const jobCategoryOptions = ref([]);
const genderOptions = ref([
  { name: '남성', code: 'GENDER_MALE' },
  { name: '여성', code: 'GENDER_FEMALE' }
]);

// 검색 필터 상태 관리
const filters = ref({
  nationalityCd: null,
  careerHistory: null,
  jobCategoryCd: null,
  genderCd: null
});

// 인재 데이터
const talents = ref([]);

onMounted(() => {
  getNationCode();
  getCareerPeriodCode();
  getJobCategoryCode();

  searchTalents();
});

// 국적 코드 조회
const getNationCode = async () => {
  const response = await getCodeList(`NATIONALITY_TY`);

  response.map((item) => {
    nationalityOptions.value.push({
      name: item.name,
      code: item.code
    });
  });
};

// 경력 코드 조회
const getCareerPeriodCode = async () => {
  const response = await getCodeList(`CAREER_PERIOD`);

  response.map((item) => {
    careerOptions.value.push({
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

// 인재 필터 조회
const searchTalents = async () => {
  isLoading.value = true;
  let fromPeriod = '';
  let toPeriod = '';

  if (filters.value.careerHistory) {
    switch (filters.value.careerHistory) {
      case careerOptions.value[0].code:
        fromPeriod = 0;
        toPeriod = 1;
        break;
      case careerOptions.value[1].code:
        fromPeriod = 1;
        toPeriod = 3;
        break;
      case careerOptions.value[2].code:
        fromPeriod = 3;
        toPeriod = 7;
        break;
      case careerOptions.value[3].code:
        fromPeriod = 7;
        toPeriod = 50;
        break;
    }
  }

  let queryList = Object.entries(filters.value).reduce((acc, cur, idx) => {
    if (idx !== 1 && cur[1]) {
      acc.push(`${cur[0]}=${cur[1]}`);
    } else if (cur[1]) {
      acc.push(`fromPeriod=${fromPeriod}&toPeriod=${toPeriod}`);
    }
    return acc;
  }, []);

  try {
    const response = await getResumeList(queryList.join('&'));
    talents.value = response.contents;
  } catch (error) {
    console.error('Error fetching talents:', error);
    talents.value = [];
  } finally {
    isLoading.value = false;
  }
};

// 이력서 모달 열기
const openResumeModal = async (candidate) => {
  // 북마킹 표시 연동을 위해 shallow-copy로 처리
  let resumeId = candidate.id;

  const response = await getUserResume(resumeId);

  if (response && response.success === undefined) {
    selectedCandidate.value = response;

    selectedCandidate.value.user = {
      ...selectedCandidate.value.user,
      profileImage: `${import.meta.env.VITE_UPLOAD_PATH}/${selectedCandidate.value.user?.imageFile?.fileName}`
    };

    showResumeModal.value = true;
  } else {
    messagePop.toast('시스템 오류입니다.', 'error');
  }
};

// 인재 북마크 등록 / 해제
const toggleBookmark = async (talent, isPage) => {
  if (!talent.isBookmarked) {
    const body = {
      userId: userInfo.value.id,
      resumeId: talent.id
    };

    const response = await insertFavoriteResume(body);

    if (response && response.success === undefined) {
      messagePop.toast('북마크 등록되었습니다.', 'success');

      talent.isBookmarked = !talent.isBookmarked;
      talent.favorites = [{ id: response.id }];

      if (!isPage) {
        for (const tal of talents.value) {
          if (tal.id === talent.id) {
            tal.isBookmarked = !tal.isBookmarked;
            tal.favorites = [{ id: response.id }];
            return;
          }
        }
      }
    }
  } else {
    messagePop.confirm({
      icon: 'info',
      message: '북마크 해제하시겠습니까?',
      onCloseYes: async () => {
        const response = await deleteFavoriteResume(null, talent.id);

        if (response && response.success === undefined) {
          messagePop.toast('북마크 삭제되었습니다.', 'info');

          talent.isBookmarked = !talent.isBookmarked;
          talent.favorites = [];

          if (!isPage) {
            for (const tal of talents.value) {
              if (tal.id === talent.id) {
                tal.isBookmarked = !tal.isBookmarked;
                tal.favorites = [];
                return;
              }
            }
          }
        }
      }
    });
  }
};

// 면접 제안
const openInterviewOffer = async (talent, isPage) => {
  if (talent.isInterviewOffered) return;

  console.log(talent);

  let response = {};
  let id = talent.id;

  if (isPage) {
    response = await getUserResume(talent.id);

    companyStore.setOfferUserResume(response);
    id = talent.resumeId;
  } else {
    companyStore.setOfferUserResume(talent);
  }

  router.push(`/company/interview-offer/create/${id}`);
  talent.isInterviewOffered = true;

  // 모달이 열려있는 경우 selectedCandidate도 업데이트
  if (selectedCandidate.value?.id === talent.id) {
    selectedCandidate.value.isInterviewOffered = true;
  }
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
        <div class="w-[250px]">
          <label class="block text-sm font-medium text-gray-700 mb-1">국적</label>
          <Select
            v-model="filters.nationalityCd"
            :options="nationalityOptions"
            class="w-full"
            optionLabel="name"
            optionValue="code"
            placeholder="--Select--"
            showClear
          />
        </div>

        <!-- 경력 필터 -->
        <div class="w-[250px]">
          <label class="block text-sm font-medium text-gray-700 mb-1">경력</label>
          <Select
            v-model="filters.careerHistory"
            :options="careerOptions"
            class="w-full"
            optionLabel="name"
            optionValue="code"
            placeholder="--Select--"
            showClear
          />
        </div>

        <!-- 직무 카테고리 필터 -->
        <div class="w-[250px]">
          <label class="block text-sm font-medium text-gray-700 mb-1">직무</label>
          <Select
            v-model="filters.jobCategoryCd"
            :options="jobCategoryOptions"
            class="w-full"
            optionLabel="name"
            optionValue="code"
            placeholder="--Select--"
            showClear
          />
        </div>

        <!-- 성별 카테고리 필터 -->
        <div class="w-[250px]">
          <label class="block text-sm font-medium text-gray-700 mb-1">성별</label>
          <Select
            v-model="filters.genderCd"
            :options="genderOptions"
            class="w-full"
            optionLabel="name"
            optionValue="code"
            placeholder="--Select--"
            showClear
          />
        </div>

        <!-- 검색 버튼 -->
        <div class="self-end">
          <Button @click="searchTalents" class="bt_btn widthFixed primary"> 검색 </Button>
        </div>
      </div>
    </div>

    <!-- 인재 목록 조회 대기중 -->
    <div class="grid grid-cols-1 gap-4">
      <div v-if="isLoading" class="bg-white rounded-lg p-6 shadow-sm text-center">
        <div class="flex flex-col items-center justify-center gap-4">
          <i class="pi pi-spin pi-spinner text-4xl text-[#8B8BF5]"></i>
          <p class="text-gray-600">인재 정보를 조회중입니다...</p>
        </div>
      </div>
      <div v-else-if="talents.length === 0" class="bg-white rounded-lg p-6 shadow-sm text-center text-gray-500">
        등록된 인재가 없습니다.
      </div>

      <div
        v-else
        v-for="talent in talents"
        :key="talent.id"
        class="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200"
      >
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-3">
              <h3 class="text-lg font-bold notranslate">{{ talent?.userName }}</h3>
              <span class="text-sm text-gray-600">{{ talent?.nationalityName }}</span>
              <span class="bg-[#8B8BF5] bg-opacity-10 text-[#8B8BF5] px-3 py-1 rounded-full text-sm">
                {{
                  talent?.experienceDurationMonth
                    ? '경력 ' +
                      parseInt(talent?.experienceDurationMonth / 12) +
                      '년 ' +
                      (talent?.experienceDurationMonth % 12) +
                      '개월'
                    : '신입'
                }}
              </span>
            </div>

            <div class="text-gray-600">
              <p>
                {{
                  talent?.schoolName
                    ? `${talent?.schoolName} ${talent?.major} ${talent?.isGraduated ? '졸업' : '재학중'}`
                    : '-'
                }}
              </p>
            </div>
          </div>

          <div class="flex flex-col items-end gap-3">
            <button
              @click="toggleBookmark(talent, true)"
              :class="['hover:text-[#8B8BF5]', talent.isBookmarked ? 'text-[#8B8BF5]' : 'text-gray-400']"
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
              class="w-[140px] px-4 py-2 text-white rounded-lg transition-colors"
              :class="talent?.isInterviewOffered ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#8B8BF5] hover:bg-[#7A7AE6]'"
              :disabled="talent?.isInterviewOffered"
              @click="openInterviewOffer(talent, true)"
            >
              {{ talent.isInterviewOffered ? '제안 완료' : '면접 제안' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 이력서 상세 모달 -->
    <Dialog v-model:visible="showResumeModal" modal :style="{ width: '80vw' }" :maximizable="true">
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
              <span class="notranslate">{{ selectedCandidate?.user?.name }}</span>
              <span class="text-gray-600">생년월일</span>
              <span>{{ selectedCandidate?.user?.birth }}</span>
              <span class="text-gray-600">성별</span>
              <span>{{ selectedCandidate?.user?.genderCd === 'GENDER_MALE' ? '남성' : '여성' }}</span>
              <span class="text-gray-600">휴대폰</span>
              <span class="text-[#8B8BF5]">{{
                isAccepted ? selectedCandidate?.user?.mobile : '면접 제안 수락 후 확인 가능'
              }}</span>
              <span class="text-gray-600">이메일</span>
              <span class="text-[#8B8BF5]">{{
                isAccepted ? selectedCandidate?.user?.email : '면접 제안 수락 후 확인 가능'
              }}</span>
              <span class="text-gray-600">주소</span>
              <span class="text-[#8B8BF5]">{{
                isAccepted ? selectedCandidate?.user?.address : '면접 제안 수락 후 확인 가능'
              }}</span>
            </div>

            <!-- 가운데 컬럼 -->
            <div class="grid grid-cols-[100px_auto] gap-y-2 text-sm text-gray-600">
              <span class="text-gray-600">범죄경력</span>
              <span v-if="isAccepted">
                <!-- <i class="pi pi-file-pdf text-red-500"></i> -->
                {{ selectedCandidate?.user?.hasCriminalRecord ? '있음' : '없음' }}
              </span>
              <span v-else class="text-[#8B8BF5]">면접 제안 수락 후 확인 가능</span>

              <span class="text-gray-600">한국어 능력</span>
              <span>{{ selectedCandidate?.user?.koreanProficiency?.name || '미입력' }}</span>
              <span class="text-gray-600">학습기간</span>
              <span>{{ selectedCandidate?.user?.koreanStudyPeriod || '미입력' }}</span>
              <span class="text-gray-600">한국방문경험</span>
              <span>{{
                selectedCandidate?.user?.hasVisitedKorea === false
                  ? '없음'
                  : selectedCandidate?.user?.hasVisitedKorea
                    ? '있음'
                    : '미입력'
              }}</span>
              <span class="text-gray-600">혼인여부</span>
              <span>{{
                selectedCandidate?.user?.isMarried === false
                  ? '미혼'
                  : selectedCandidate?.user?.isMarried
                    ? '기혼'
                    : '미입력'
              }}</span>
            </div>

            <!-- 프로필 사진 (오른쪽) -->
            <div class="flex flex-col items-center">
              <div class="w-[140px] h-[180px] bg-gray-100 rounded-lg overflow-hidden">
                <img
                  v-if="selectedCandidate?.user?.profileImage"
                  :src="selectedCandidate?.user?.profileImage || '/default-profile.jpg'"
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
          <h3 class="text-lg font-medium mb-4">국적</h3>
          <div>
            <span>{{ selectedCandidate?.nationality?.name }}</span>
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
              <span>{{ selectedCandidate?.passport }}</span>
            </div>
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">발급국가</span>
              <span>{{ selectedCandidate?.nationality?.name }}</span>
            </div>
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">만료일</span>
              <span>{{ selectedCandidate?.passportExpiryDt.slice(0, 10).replaceAll('-', '.') }}</span>
            </div>
          </div>
        </div>

        <!-- 경력 사항 -->
        <div class="mb-8 bg-gray-50 p-6 rounded-lg">
          <div class="flex items-center gap-2 mb-4">
            <h3 class="text-lg font-medium">경력 사항</h3>
            <span class="text-sm text-[#8B8BF5] bg-[#8B8BF5] bg-opacity-10 px-2 py-1 rounded">
              {{
                selectedCandidate?.experienceDurationMonth
                  ? '총 ' +
                    parseInt(selectedCandidate?.experienceDurationMonth / 12) +
                    '년 ' +
                    (selectedCandidate?.experienceDurationMonth % 12) +
                    '개월'
                  : '신입'
              }}
            </span>
          </div>
          <div v-if="selectedCandidate?.experiences.length">
            <div
              v-for="(career, index) in selectedCandidate?.experiences"
              :key="index"
              class="mb-4 pb-4 border-b last:border-b-0"
            >
              <div class="flex items-center gap-2">
                <div class="font-medium">{{ career?.companyName }}</div>
                <!-- <span class="text-sm text-gray-500">({{ calculateCareerPeriod(career) }})</span> -->
                <span class="text-sm text-gray-500">
                  ({{
                    `${career?.startDt?.slice(0, 7).replaceAll('-', '.')} ~ ${career?.endDt?.slice(0, 7) ? career?.endDt?.slice(0, 7).replaceAll('-', '.') : '재직중'}`
                  }})
                </span>
              </div>
              <div class="text-gray-600">{{ career?.department }}</div>
              <div class="text-gray-600">{{ career?.jobCategory?.name }} | {{ career.position }}</div>
              <div class="mt-2 whitespace-pre-line">{{ career?.content }}</div>
            </div>
          </div>

          <div v-else class="text-center text-gray-500">등록된 경력이 없습니다</div>
        </div>

        <!-- 학력 사항 -->
        <div class="mb-8 bg-gray-50 p-6 rounded-lg">
          <div class="flex items-center gap-2 mb-4">
            <h3 class="text-lg font-medium">학력 사항</h3>
            <span
              v-if="selectedCandidate?.finalEducation"
              class="text-sm text-[#8B8BF5] bg-[#8B8BF5] bg-opacity-10 px-2 py-1 rounded"
            >
              {{
                '최종학력 : ' +
                `${selectedCandidate?.finalEducation?.schoolName} ${selectedCandidate?.finalEducation?.major} ${selectedCandidate?.finalEducation?.isGraduated ? '졸업' : '재학중'}`
              }}
            </span>
          </div>
          <div v-if="selectedCandidate?.educations.length">
            <div
              v-for="(edu, index) in selectedCandidate?.educations"
              :key="index"
              class="mb-6 pb-6 border-b last:border-b-0"
            >
              <div class="text-[#8B8BF5] mb-2">{{ edu?.schoolName }} {{ `(${edu?.educationLevel?.name})` }}</div>
              <div class="text-gray-600">{{ edu?.major }}</div>
              <div class="text-gray-600">{{ `${edu?.startDt} ~ ${edu?.endDt ? edu?.endDt : '재학중'}` }}</div>
              <div class="whitespace-pre-line">{{ edu?.content }}</div>
            </div>
          </div>

          <div v-else class="text-center text-gray-500">등록된 학력이 없습니다</div>
        </div>

        <!-- 자격증 사항 -->
        <div class="mb-8 bg-gray-50 p-6 rounded-lg">
          <div class="mb-4">
            <h3 class="text-lg font-medium">자격증 사항</h3>
          </div>
          <div v-if="selectedCandidate?.certifications?.length" class="space-y-4">
            <div
              v-for="(cert, index) in selectedCandidate?.certifications"
              :key="index"
              class="mb-4 pb-4 border-b last:border-b-0"
            >
              <div class="font-medium mb-1">{{ cert?.name }}</div>
              <div class="font-medium mb-1">발급기관 : {{ cert?.issuer }}</div>
              <div class="text-gray-600">취득일 : {{ cert?.acquiredDt?.slice(0, 10).replaceAll('-', '.') }}</div>
            </div>
          </div>
          <div v-else class="text-center text-gray-500">등록된 자격증이 없습니다</div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-4 pt-[15px]">
          <Button
            @click="toggleBookmark(selectedCandidate, false)"
            :class="['p-button-text', selectedCandidate?.isBookmarked ? 'text-[#8B8BF5]' : 'text-gray-400']"
          >
            <i
              :class="['pi', selectedCandidate?.isBookmarked ? 'pi-bookmark-fill' : 'pi-bookmark']"
              style="font-size: 1.5rem"
            ></i>
          </Button>
          <Button
            class="bt_btn primary transition-colors"
            :class="selectedCandidate?.isInterviewOffered ? 'bg-gray-400' : 'bg-[#8B8BF5] hover:bg-[#7A7AE6]'"
            :disabled="selectedCandidate?.isInterviewOffered"
            @click="openInterviewOffer(selectedCandidate, false)"
          >
            {{ selectedCandidate?.isInterviewOffered ? '제안 완료' : '면접 제안' }}
          </Button>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
:deep(.p-select) {
  width: 100%;
}

:deep(.p-select-panel) {
  width: 100%;
}
</style>
