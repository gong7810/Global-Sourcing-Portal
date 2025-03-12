<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const jobOffer = ref({
  position: '',
  jobDescription: '',
  message: '안녕하세요. 귀하의 프로필을 보고 연락드립니다.'
});

const candidate = ref({
  id: 1,
  name: '홍길동',
  nationality: '베트남',
  career: '5년',
  education: '하노이공과대학교',
  major: '컴퓨터공학'
});

const submitOffer = () => {
  console.log('면접 제안 전송:', jobOffer.value);
  // TODO: API 연동
  // 제안 전송 후 완료 페이지나 목록으로 이동
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
      </div>
      <p class="text-gray-600">{{ candidate.education }} · {{ candidate.major }}</p>
    </div>

    <!-- 제안 폼 -->
    <div class="bg-white rounded-lg p-6 shadow-sm">
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">포지션</label>
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