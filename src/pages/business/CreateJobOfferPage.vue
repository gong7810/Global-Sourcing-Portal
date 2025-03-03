<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Button from 'primevue/button';
import Select from 'primevue/select';
import Textarea from 'primevue/textarea';

const router = useRouter();
const route = useRoute();

const goBack = () => {
  router.back();
};

// 선택된 구직자 정보
const candidate = ref({
  id: null,
  name: '홍길동',
  career: '5년',
  lastPosition: '프론트엔드 개발자',
  skills: ['Vue.js', 'React', 'TypeScript'],
  education: '서울대학교',
  location: '서울',
  status: '구직중'
});

// 제안 폼 데이터
const selectedJob = ref(null);
const offerMessage = ref('');

// 회사의 진행중인 채용공고 목록
const jobPosts = ref([
  {
    id: 1,
    title: '프론트엔드 개발자 (React/Vue)',
    status: '진행중',
    deadline: '2024-04-20'
  },
  {
    id: 2,
    title: '백엔드 개발자 (Node.js/Python)',
    status: '진행중',
    deadline: '2024-04-15'
  }
]);

// 제안하기
const submitOffer = () => {
  if (!selectedJob.value) {
    alert('제안할 채용공고를 선택해주세요.');
    return;
  }

  if (!offerMessage.value.trim()) {
    alert('제안 메시지를 입력해주세요.');
    return;
  }

  // TODO: API 연동
  console.log({
    candidateId: candidate.value.id,
    jobPostId: selectedJob.value.id,
    message: offerMessage.value
  });

  // 제안 완료 후 북마크 페이지로 이동
  router.push('/business/TalentPoolPage');
};

onMounted(() => {
  // URL에서 구직자 ID 가져오기
  const candidateId = route.params.candidateId;
  // TODO: API 호출하여 구직자 정보 가져오기
  candidate.value.id = candidateId;
});
</script>

<template>
  <div class="max-w-[1200px] mx-auto px-4 py-12">
    <!-- 헤더 -->
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center gap-4">
        <i class="pi pi-angle-left text-4xl text-gray-600 cursor-pointer transition-colors hover:text-[#8FA1FF]" 
          @click="goBack"></i>
        <h1 class="text-3xl font-bold">채용 제안하기</h1>
      </div>
    </div>

    <!-- 메인 컨텐츠 영역 -->
    <div class="bg-white rounded-lg p-6">
      <!-- 구직자 정보 -->
      <div class="bg-gray-50 rounded-lg p-6 mb-8">
        <div class="flex items-center gap-2 mb-2">
          <span class="font-bold text-xl">{{ candidate.name }}</span>
          <span class="bg-[#8B8BF5] bg-opacity-10 text-[#8B8BF5] px-3 py-1 rounded-full text-sm">
            {{ candidate.career }}
          </span>
          <span class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
            {{ candidate.status }}
          </span>
        </div>
        <h3 class="text-lg font-medium text-gray-600 mb-4">{{ candidate.lastPosition }}</h3>
        <div class="flex gap-8 text-gray-600">
          <span class="flex items-center gap-2">
            <i class="pi pi-tag"></i>
            {{ candidate.skills.join(', ') }}
          </span>
          <span class="flex items-center gap-2">
            <i class="pi pi-building"></i>
            {{ candidate.location }}
          </span>
        </div>
      </div>

      <!-- 제안 폼 -->
      <div class="space-y-6">
        <!-- 채용공고 선택 -->
        <div>
          <label class="block text-gray-700 font-medium mb-2">채용공고 선택</label>
          <Select
            v-model="selectedJob"
            :options="jobPosts"
            optionLabel="title"
            placeholder="제안할 채용공고를 선택해주세요"
            class="w-full" />
        </div>

        <!-- 제안 메시지 -->
        <div>
          <label class="block text-gray-700 font-medium mb-2">제안 메시지</label>
          <Textarea
            v-model="offerMessage"
            placeholder="구직자에게 전달할 메시지를 작성해주세요"
            rows="5"
            class="w-full" />
        </div>

        <!-- 버튼 영역 -->
        <div class="flex justify-end gap-4 pt-4">
          <Button 
            label="취소" 
            class="p-button-outlined p-button-secondary" 
            @click="goBack" />
          <Button 
            label="제안하기" 
            @click="submitOffer" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.p-select) {
  width: 100%;
}

:deep(.p-select-input) {
  border-radius: 8px;
  padding: 0.75rem;
}

:deep(.p-inputtextarea) {
  width: 100%;
  border-radius: 8px;
  padding: 0.75rem;
}

:deep(.p-button) {
  border-radius: 8px;
}

:deep(.p-button.p-button-outlined) {
  color: #8FA1FF;
  border-color: #8FA1FF;
}

:deep(.p-button.p-button-outlined:hover) {
  background: rgba(143, 161, 255, 0.1);
  border-color: #8FA1FF;
  color: #8FA1FF;
}

:deep(.p-button.p-button-outlined.p-button-secondary) {
  color: #64748B;
  border-color: #64748B;
}

:deep(.p-button.p-button-outlined.p-button-secondary:hover) {
  background: rgba(100, 116, 139, 0.1);
  border-color: #64748B;
  color: #64748B;
}
</style> 