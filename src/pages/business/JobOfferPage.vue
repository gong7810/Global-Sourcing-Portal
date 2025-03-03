<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Select from 'primevue/select';

const route = useRoute();
const router = useRouter();

// 선택된 구직자 정보
const candidate = ref({
  id: 1,
  name: '홍길동',
  career: '5년',
  lastPosition: '프론트엔드 개발자',
  skills: ['Vue.js', 'React', 'TypeScript', 'Node.js'],
  education: '한국국대학교 컴퓨터공학과',
  status: '구직중',
  lastUpdate: '2024-03-20'
});

// 채용공고 목록
const jobPostings = ref([
  { label: '시니어 프론트엔드 개발자', value: 1 },
  { label: '주니어 백엔드 개발자', value: 2 },
]);

// 제안 폼 데이터
const offerForm = ref({
  jobPostingId: null,
  title: '',
  message: ''
});

// 구직자 정보 로드
onMounted(async () => {
  const candidateId = route.params.id;
  // TODO: API 호출하여 구직자 정보 가져오기
  // candidate.value = await fetchCandidateInfo(candidateId);
});

// 제안 전송
const sendOffer = async () => {
  try {
    // TODO: API 호출하여 제안 전송
    // await sendJobOffer({
    //   candidateId: candidate.value.id,
    //   ...offerForm.value
    // });
    
    // 성공 메시지 표시
    // messagePop.alert('제안이 성공적으로 전송되었습니다.', 'success');
    router.back();
  } catch (error) {
    // 에러 메시지 표시
    // messagePop.alert('제안 전송에 실패했습니다.', 'error');
  }
};
</script>

<template>
  <div class="max-w-[1200px] mx-auto px-4 py-12">
    <!-- 헤더 -->
    <div class="flex items-center gap-4 mb-8">
      <i class="pi pi-angle-left text-4xl text-gray-600 cursor-pointer transition-colors hover:text-[#8FA1FF]" 
        @click="router.back()"></i>
      <h1 class="text-3xl font-bold">채용 제안하기</h1>
    </div>

    <!-- 구직자 정보 카드 -->
    <div class="bg-white rounded-lg p-6 mb-6">
      <div class="flex items-center gap-2 mb-4">
        <span class="font-bold text-xl">{{ candidate.name }}</span>
        <span class="bg-[#8B8BF5] bg-opacity-10 text-[#8B8BF5] px-3 py-1 rounded-full text-sm">{{ candidate.career }}</span>
        <span class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">{{ candidate.status }}</span>
      </div>
      
      <div class="space-y-4">
        <div>
          <h3 class="text-lg font-bold text-gray-800 mb-2">{{ candidate.lastPosition }}</h3>
          <p class="text-gray-600">{{ candidate.introduction }}</p>
        </div>

        <div class="flex items-center gap-8 text-gray-600">
          <span class="flex items-center gap-2">
            <i class="pi pi-building"></i>
            {{ candidate.education }}
          </span>
        </div>

        <div>
          <h4 class="text-sm font-medium text-gray-700 mb-2">보유 기술</h4>
          <div class="flex flex-wrap gap-2">
            <span v-for="skill in candidate.skills" :key="skill"
              class="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
              {{ skill }}
            </span>
          </div>
        </div>

        <div class="text-sm text-gray-500 text-right">
          마지막 업데이트: {{ candidate.lastUpdate }}
        </div>
      </div>
    </div>

    <!-- 제안 폼 -->
    <div class="bg-white rounded-lg p-6">
      <form @submit.prevent="sendOffer" class="space-y-6">
        <!-- 채용공고 선택 -->
        <div class="form-group">
          <label class="block text-sm font-medium text-gray-700 mb-2">채용공고 선택</label>
          <Select v-model="offerForm.jobPostingId" 
            :options="jobPostings"
            optionLabel="label"
            placeholder="제안할 채용공고를 선택해주세요"
            class="w-full" />
        </div>

        <!-- 제목 -->
        <div class="form-group">
          <label class="block text-sm font-medium text-gray-700 mb-2">제목</label>
          <InputText v-model="offerForm.title" 
            placeholder="제안 제목을 입력해주세요"
            class="w-full" />
        </div>

        <!-- 메시지 -->
        <div class="form-group">
          <label class="block text-sm font-medium text-gray-700 mb-2">메시지</label>
          <Textarea v-model="offerForm.message" 
            placeholder="제안 메시지를 입력해주세요"
            rows="5"
            class="w-full" />
        </div>

        <!-- 버튼 영역 -->
        <div class="flex justify-end gap-4">
          <Button type="button" 
            label="취소" 
            class="p-button-secondary"
            @click="router.back()" />
          <Button type="submit" 
            label="제안하기" 
            class="p-button-primary bg-gradient-to-r from-[#8FA1FF] to-[#8B8BF5] border-none" />
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
:deep(.p-inputtext),
:deep(.p-dropdown),
:deep(.p-textarea) {
  width: 100%;
  border-radius: 8px;
}

:deep(.p-button) {
  border-radius: 8px;
}

:deep(.p-button.p-button-secondary) {
  background-color: white;
  border-color: #e5e7eb;
  color: #374151;
}

:deep(.p-button.p-button-secondary:hover) {
  background-color: #f3f4f6;
  border-color: #e5e7eb;
  color: #374151;
}
</style> 