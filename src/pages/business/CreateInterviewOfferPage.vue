<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Dropdown from 'primevue/dropdown';
import { useMessagePop } from '@/plugins/commonutils';

const router = useRouter();
const messagePop = useMessagePop();

// 직무 카테고리 데이터
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

const jobOffer = ref({
  position: '',
  jobCategory: null, // 직무 카테고리 추가
  jobDescription: '',
  message: '안녕하세요. 귀하의 프로필을 보고 연락드립니다.'
});

const candidate = ref({
  id: 1,
  name: '홍길동',
  nationality: '베트남',
  career: '5년',
  education: '하노이공과대학교',
  major: '컴퓨터공학',
  jobCategory: 'it' // 후보자의 직무 카테고리 추가
});

const submitOffer = () => {
  if (!jobOffer.value.jobCategory) {
    alert('직무 카테고리를 선택해주세요.');
    return;
  }

  // 확인 팝업 표시
  messagePop.confirm({
    icon: 'info',
    message: `${candidate.value.name}님께 ${jobOffer.value.position} 포지션에 대한 면접을 제안하시겠습니까?`,
    detail: '제안이 전송되면 취소할 수 없습니다.',
    acceptLabel: '제안하기',
    rejectLabel: '취소',
    onCloseYes: () => {
      console.log('면접 제안 전송:', jobOffer.value);
      // TODO: API 연동
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
      <div class="flex items-start gap-3 mb-3">
        <h3 class="text-lg font-bold">{{ candidate.name }}</h3>
        <span class="text-sm text-gray-600">{{ candidate.nationality }}</span>
        <span class="bg-[#8B8BF5] bg-opacity-10 text-[#8B8BF5] px-3 py-1 rounded-full text-sm">
          경력 {{ candidate.career }}
        </span>
        <span class="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600">
          {{ jobCategories.find(cat => cat.value === candidate.jobCategory)?.label }}
        </span>
      </div>
      <p class="text-gray-600">{{ candidate.education }} · {{ candidate.major }}</p>
    </div>

    <!-- 제안 폼 -->
    <div class="bg-white rounded-lg p-6 shadow-sm">
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">직무 카테고리<span class="text-red-500 ml-1">*</span></label>
        <Dropdown
          v-model="jobOffer.jobCategory"
          :options="jobCategories"
          optionLabel="label"
          placeholder="직무 카테고리를 선택해주세요"
          class="w-full"
        />
      </div>

      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">포지션<span class="text-red-500 ml-1">*</span></label>
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
          v-model="jobOffer.jobDescription"
          rows="5"
          class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8B8BF5]"
          placeholder="해당 포지션의 상세 업무를 입력해주세요"
        ></textarea>
      </div>

      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">메시지</label>
        <textarea
          v-model="jobOffer.message"
          rows="3"
          class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8B8BF5]"
          placeholder="면접 제안 메시지를 입력해주세요"
        ></textarea>
      </div>

      <div class="flex justify-end gap-3">
        <button
          @click="router.back()"
          class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          취소
        </button>
        <button
          @click="submitOffer"
          class="px-6 py-2 bg-[#8B8BF5] text-white rounded-lg hover:bg-[#7A7AE6]"
        >
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
  border-color: #8B8BF5;
}

:deep(.p-dropdown:not(.p-disabled).p-focus) {
  box-shadow: none;
  border-color: #8B8BF5;
}
</style> 