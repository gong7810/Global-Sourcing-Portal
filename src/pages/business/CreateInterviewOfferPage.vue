<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useInterviewStore } from '@/store/interview/interviewStore';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const route = useRoute();
const toast = useToast();
const interviewStore = useInterviewStore();

const jobOffer = ref({
  position: '',
  jobDescription: '',
  message: '안녕하세요. 귀하의 프로필을 보고 연락드립니다.'
});

// 전달받은 인재 정보로 초기화
const candidate = ref({
  id: Number(route.query.id),
  name: route.query.name,
  nationality: route.query.nationality,
  career: route.query.career,
  education: route.query.education,
  major: route.query.major
});

const submitOffer = () => {
  try {
    const formattedOffer = {
      id: Date.now(),
      candidate: {
        id: Number(route.params.id),
        name: candidate.value.name,
        nationality: candidate.value.nationality,
        career: candidate.value.career,
        education: {
          school: candidate.value.education,
          major: candidate.value.major
        }
      },
      position: jobOffer.value.position,
      jobDescription: jobOffer.value.jobDescription,
      message: jobOffer.value.message,
      status: 'pending',
      offerDate: new Date().toISOString().split('T')[0],
      responseDate: null
    };

    console.log('Creating offer with data:', formattedOffer);

    // 면접 제안 생성
    interviewStore.createInterviewOffer(formattedOffer, {
      companyName: '(주)비티포탈',
      managerName: '김관리',
      email: 'manager@btportal.com',
      phoneNumber: '010-1234-5678'
    });

    // 성공 메시지 표시
    toast.add({
      severity: 'success',
      summary: '면접 제안 완료',
      detail: `${candidate.value.name}님께 면접을 제안했습니다.`,
      life: 3000
    });

    // 면접 제안 내역 페이지로 이동
    router.push('/business/InterviewOffers');
  } catch (error) {
    console.error('면접 제안 에러:', error);
    toast.add({
      severity: 'error',
      summary: '면접 제안 실패',
      detail: '면접 제안 중 오류가 발생했습니다.',
      life: 3000
    });
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