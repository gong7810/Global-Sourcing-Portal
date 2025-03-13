<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import Dialog from 'primevue/dialog';
import Calendar from 'primevue/calendar';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { useInterviewStore } from '@/store/interview/interviewStore';
import { storeToRefs } from 'pinia';

const router = useRouter();
const interviewStore = useInterviewStore();
const { interviewOffers: storeOffers } = storeToRefs(interviewStore);

// 면접 제안 내역 데이터
const interviewOffers = computed(() => {
  // store의 면접 제안과 기존 샘플 데이터를 합침
  const sampleOffer = {
    id: 999, // 임의의 ID
    candidate: {
      name: '응우옌반안',
      nationality: '베트남',
      career: '2년',
      birth: '1997.11.22',
      gender: '남성',
      phone: '010-9876-5432',
      email: 'vanan@gmail.com',
      address: '서울시 마포구',
      passportName: 'NGUYEN VAN ANH',
      visaInfo: {
        type: 'P8765****',
        country: '베트남',
        expiryDate: '2032-06-01'
      },
      careerHistory: [
        {
          company: '하노이테크(주)',
          period: '2022.01 - 2024.01',
          position: '모바일 개발자/앱개발팀',
          description: 'Android 앱 개발 및 유지보수'
        }
      ],
      education: {
        school: '하노이공과대학교',
        degree: '대학교(4년)',
        major: '소프트웨어공학과',
        period: '2016.09 - 2020.06',
        description: '모바일 앱 개발 프로젝트 다수 참여'
      }
    },
    position: 'Android Developer',
    jobDescription: '안드로이드 앱 개발 및 유지보수',
    message: '안녕하세요. 귀하의 프로필을 보고 연락드립니다.',
    status: 'pending',
    offerDate: '2024-03-15',
    responseDate: null
  };

  // store의 면접 제안을 우선 표시하고, 그 다음에 샘플 데이터 표시
  return [...storeOffers.value, sampleOffer];
});

// 상태에 따른 스타일과 텍스트
const getStatusInfo = (status) => {
  switch (status) {
    case 'pending':
      return {
        text: '대기중',
        class: 'bg-yellow-50 text-yellow-600'
      };
    case 'accepted':
      return {
        text: '수락됨',
        class: 'bg-green-50 text-green-600'
      };
    case 'declined':
      return {
        text: '거절됨',
        class: 'bg-red-50 text-red-600'
      };
  }
};

const showDetailModal = ref(false);
const selectedOffer = ref(null);

const openDetailModal = (offer) => {
  selectedOffer.value = offer;
  showDetailModal.value = true;
};

// 면접 일정 관련 상태
const showScheduleModal = ref(false);
const interviewDate = ref(null);
const interviewHour = ref(null);
const interviewMinute = ref(null);
const interviewType = ref(null);
const interviewLocation = ref('');

// 시간 선택 옵션
const hours = Array.from({ length: 24 }, (_, i) => ({
  label: `${i.toString().padStart(2, '0')}`,
  value: i
}));

const minutes = [
  { label: '00', value: 0 },
  { label: '30', value: 30 }
];

// 면접 방식 옵션
const interviewTypes = [
  { label: '대면 면접', value: 'offline' },
  { label: '화상 면접', value: 'online' }
];

const openScheduleModal = (offer) => {
  selectedOffer.value = offer;
  showScheduleModal.value = true;
};

const scheduleInterview = () => {
  if (!interviewDate.value || !interviewHour.value || !interviewMinute.value || !interviewType.value || !interviewLocation.value) {
    alert('모든 항목을 입력해주세요.');
    return;
  }

  // 선택된 제안의 면접 일정 업데이트
  selectedOffer.value.interviewScheduled = true;
  selectedOffer.value.interviewDate = interviewDate.value.toLocaleDateString();
  selectedOffer.value.interviewTime = `${interviewHour.value.toString().padStart(2, '0')}:${interviewMinute.value.toString().padStart(2, '0')}`;
  selectedOffer.value.interviewType = interviewType.value;
  selectedOffer.value.interviewLocation = interviewLocation.value;

  // 여기에 API 호출 추가

  showScheduleModal.value = false;
  // 입력값 초기화
  interviewDate.value = null;
  interviewHour.value = null;
  interviewMinute.value = null;
  interviewType.value = null;
  interviewLocation.value = '';
};
</script>

<template>
  <div class="max-w-[1200px] mx-auto px-4 py-12">
    <!-- 헤더 -->
    <div class="flex items-center gap-4 mb-8">
      <i
        class="pi pi-angle-left text-4xl text-gray-600 cursor-pointer transition-colors hover:text-[#8FA1FF]"
        @click="router.push('/business/index')"
      ></i>
      <h1 class="text-3xl font-bold">면접 제안 내역</h1>
    </div>

    <!-- 제안 목록 -->
    <div class="grid grid-cols-1 gap-4">
      <div v-for="offer in interviewOffers" :key="offer.id"
        class="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200">
        <div class="flex justify-between items-start mb-4">
          <div class="flex items-center gap-3">
            <h3 class="text-lg font-bold">{{ offer.candidate.name }}</h3>
            <span class="text-sm text-gray-600">{{ offer.candidate.nationality }}</span>
            <span class="bg-[#8B8BF5] bg-opacity-10 text-[#8B8BF5] px-3 py-1 rounded-full text-sm">
              경력 {{ offer.candidate.career }}
            </span>
            <span :class="`px-3 py-1 rounded-full text-sm ${getStatusInfo(offer.status).class}`">
              {{ getStatusInfo(offer.status).text }}
            </span>
          </div>
          <div class="text-sm text-gray-500">
            제안일: {{ offer.offerDate }}
          </div>
        </div>

        <div class="mb-4">
          <p class="text-gray-600">{{ offer.candidate.education.school }} · {{ offer.candidate.education.major }}</p>
        </div>

        <div class="border-t pt-4">
          <div class="mb-3">
            <h4 class="font-medium text-gray-900 mb-1">제안 포지션</h4>
            <p class="text-gray-600">{{ offer.position }}</p>
          </div>
          <div class="mb-3">
            <h4 class="font-medium text-gray-900 mb-1">상세 업무</h4>
            <p class="text-gray-600">{{ offer.jobDescription }}</p>
          </div>
          <div>
            <h4 class="font-medium text-gray-900 mb-1">메시지</h4>
            <p class="text-gray-600">{{ offer.message }}</p>
          </div>
        </div>

        <div v-if="offer.status === 'accepted'" class="mt-4 border-t pt-4">
          <p class="text-green-600">
            <i class="pi pi-check-circle mr-2"></i>
            {{ offer.responseDate }}에 수락되었습니다
          </p>
          
          <!-- 면접 일정이 잡히지 않은 경우에만 버튼 표시 -->
          <div v-if="!offer.interviewScheduled" class="mt-3">
            <button 
              @click="openScheduleModal(offer)"
              class="px-4 py-2 bg-[#8B8BF5] text-white rounded-lg hover:bg-[#7A7AE6]"
            >
              면접 일정 잡기
            </button>
          </div>
          
          <!-- 면접 일정이 이미 잡힌 경우 일정 정보 표시 -->
          <div v-else class="mt-3">
            <h4 class="font-medium text-gray-900 mb-2">면접 일정</h4>
            <p class="text-gray-600">날짜: {{ offer.interviewDate }}</p>
            <p class="text-gray-600">시간: {{ offer.interviewTime }}</p>
            <p class="text-gray-600">방식: {{ offer.interviewType === 'online' ? '화상 면접' : '대면 면접' }}</p>
            <p class="text-gray-600">장소: {{ offer.interviewLocation }}</p>
          </div>
        </div>

        <div v-if="offer.status === 'declined'" class="mt-4 border-t pt-4">
          <p class="text-red-600">
            <i class="pi pi-times-circle mr-2"></i>
            {{ offer.responseDate }}에 거절되었습니다
          </p>
          <p class="text-gray-600 mt-2">
            거절 사유: {{ offer.declineReason }}
          </p>
        </div>

        <div class="mt-4">
          <button
            class="text-[#8B8BF5] hover:text-[#7A7AE6] flex items-center gap-1"
            @click="openDetailModal(offer)"
          >
            <span>상세 정보 보기</span>
            <i class="pi pi-arrow-right text-sm"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- 상세 정보 모달 -->
    <Dialog 
      v-model:visible="showDetailModal"
      modal
      :style="{ width: '80vw', maxHeight: '90vh' }"
      :header="'제안 당시 이력서 정보'"
      :closable="true"
      :closeOnEscape="true"
    >
      <div v-if="selectedOffer" class="p-4">
        <!-- 기본 정보 -->
        <div class="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 class="text-lg font-medium mb-4">기본 정보</h3>
          <div class="grid grid-cols-2 gap-y-4">
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">이름</span>
              <span>{{ selectedOffer.candidate.name }}</span>
            </div>
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">국적</span>
              <span>{{ selectedOffer.candidate.nationality }}</span>
            </div>
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">경력</span>
              <span>{{ selectedOffer.candidate.career }}</span>
            </div>
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">학교</span>
              <span>{{ selectedOffer.candidate.education.school }}</span>
            </div>
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">전공</span>
              <span>{{ selectedOffer.candidate.education.major }}</span>
            </div>
          </div>
        </div>

        <!-- 제안 정보 -->
        <div class="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 class="text-lg font-medium mb-4">제안 정보</h3>
          <div class="grid gap-y-4">
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">포지션</span>
              <span>{{ selectedOffer.position }}</span>
            </div>
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">상세업무</span>
              <span>{{ selectedOffer.jobDescription }}</span>
            </div>
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">메시지</span>
              <span>{{ selectedOffer.message }}</span>
            </div>
          </div>
        </div>

        <!-- 회사 정보 -->
        <div class="bg-gray-50 p-6 rounded-lg">
          <h3 class="text-lg font-medium mb-4">회사 정보</h3>
          <div class="grid gap-y-4">
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">회사명</span>
              <span>{{ selectedOffer.companyInfo?.companyName }}</span>
            </div>
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">담당자</span>
              <span>{{ selectedOffer.companyInfo?.managerName }}</span>
            </div>
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">연락처</span>
              <span>{{ selectedOffer.companyInfo?.phoneNumber }}</span>
            </div>
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">이메일</span>
              <span>{{ selectedOffer.companyInfo?.email }}</span>
            </div>
          </div>
        </div>
      </div>
    </Dialog>

    <!-- 면접 일정 잡기 모달 -->
    <Dialog 
      v-model:visible="showScheduleModal" 
      :modal="true"
      header="면접 일정 잡기"
      :style="{ width: '500px' }"
    >
      <div class="p-4">
        <div class="mb-4">
          <h3 class="font-medium mb-2">후보자</h3>
          <p>{{ selectedOffer?.candidate.name }}</p>
        </div>

        <div class="mb-4">
          <label class="block font-medium mb-2">면접 날짜</label>
          <Calendar 
            v-model="interviewDate" 
            :minDate="new Date()"
            dateFormat="yy-mm-dd"
            class="w-full"
          />
        </div>

        <div class="mb-4">
          <label class="block font-medium mb-2">면접 시간</label>
          <div class="grid grid-cols-2 gap-2">
            <Dropdown
              v-model="interviewHour"
              :options="hours"
              placeholder="시간"
              class="w-full"
            />
            <Dropdown
              v-model="interviewMinute"
              :options="minutes"
              placeholder="분"
              class="w-full"
            />
          </div>
        </div>

        <div class="mb-4">
          <label class="block font-medium mb-2">면접 방식</label>
          <Dropdown
            v-model="interviewType"
            :options="interviewTypes"
            optionLabel="label"
            placeholder="면접 방식 선택"
            class="w-full"
          />
        </div>

        <div class="mb-4">
          <label class="block font-medium mb-2">면접 장소 또는 화상 면접 링크</label>
          <InputText 
            v-model="interviewLocation" 
            class="w-full"
            :placeholder="interviewType?.value === 'online' ? 'Zoom 링크를 입력해주세요' : '면접 장소를 입력해주세요'"
          />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <Button 
            @click="showScheduleModal = false"
            class="p-button-text"
          >
            취소
          </Button>
          <Button 
            @click="scheduleInterview"
            class="bg-[#8B8BF5]"
          >
            확인
          </Button>
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