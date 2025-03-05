<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const activeIndex = ref(null);

const toggleFaq = (index) => {
  activeIndex.value = activeIndex.value === index ? null : index;
};

const faqs = ref([
  {
    question: '글로벌 소싱 포털은 어떤 서비스인가요?',
    answer: '글로벌 소싱 포털은 해외 인재와 국내 기업을 연결하는 채용 플랫폼입니다. 기업은 다양한 국가의 우수 인재를 만날 수 있으며, 구직자는 국내 기업에 지원할 수 있습니다.'
  },
  {
    question: '어떤 국가의 인재들이 등록되어 있나요?',
    answer: '주로 베트남 등 아시아 국가의 IT 인재들이 등록되어 있으며, 지속적으로 다양한 국가의 인재풀을 확대하고 있습니다.'
  },
  {
    question: '채용 공고는 어떻게 등록하나요?',
    answer: '기업 회원으로 가입 후, 대시보드의 "공고 등록" 메뉴를 통해 채용 공고를 등록할 수 있습니다.'
  },
  {
    question: '인재에게 직접 제안을 할 수 있나요?',
    answer: '네, 가능합니다. 인재풀에서 마음에 드는 후보자를 발견하시면 "제안하기" 버튼을 통해 직접 채용 제안을 보내실 수 있습니다.'
  },
  // {
  //   question: '해외 인재 채용 시 비자 발급은 어떻게 하나요?',
  //   answer: '당사에서 비자 발급을 위한 기본적인 가이드라인을 제공해드리며, 필요시 전문 업체를 통한 지원 서비스도 연계해드립니다.'
  // }
]);
</script>

<template>
  <div class="max-w-[1200px] mx-auto px-4 py-12">
    <div class="flex items-center gap-4 mb-8">
      <i class="pi pi-angle-left text-4xl text-gray-600 cursor-pointer transition-colors hover:text-[#8FA1FF]" 
        @click="router.back()"></i>
      <h1 class="text-3xl font-bold">FAQ</h1>
    </div>
    
    <div class="space-y-2">
      <div v-for="(faq, index) in faqs" 
        :key="index" 
        class="border rounded-lg overflow-hidden bg-white">
        <div 
          class="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50"
          @click="toggleFaq(index)">
          <span class="font-medium">{{ faq.question }}</span>
          <svg 
            class="w-5 h-5 transition-transform duration-200"
            :class="{ 'rotate-180': activeIndex === index }"
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="2">
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        <div 
          v-show="activeIndex === index" 
          class="p-5 border-t bg-gray-50">
          <p class="text-gray-600">{{ faq.answer }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* No specific styles needed for this template */
</style>