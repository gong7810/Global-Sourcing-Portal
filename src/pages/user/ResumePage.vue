<script setup>
import { onMounted, ref } from 'vue';
import { useAuthStore } from '@/store/auth/authStore';
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import AppTopbar from '@/layout/AppTopbar.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const details = ref([
  { title: '국가', placeholder: '국가를 입력해주세요' },
  { title: '비자', placeholder: '보유한 비자를 입력해주세요' },
  { title: '한국어 수준', placeholder: '한국어 수준을 입력해주세요' },
  { title: '언어 수준', placeholder: '가능한 언어 수준을 입력해주세요' },
  { title: '경력', placeholder: '회사명, 재직기간, 직무' },
  { title: '학력', placeholder: '학교명, 재학기간, 전공, 학력' },
  { title: '자격증 · 증명서', placeholder: '자격증 및 증명서, 발급기관, 취득일' },
  { title: '자기소개', placeholder: '간단한 자기소개를 입력해주세요' },
  { title: '첨부링크', placeholder: 'URL을 입력해주세요' },
]);

const formatCurrency = (value) => {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};
</script>

<template>
  <AppTopbar />
  <!-- 전체 컨테이너에 최대 폭 제한과 중앙 정렬 적용 -->
  <div class="max-w-[1200px] mx-auto px-4 py-12">
    <div class="grid gap-4">
      <div class="resume-page">
        
      </div>
    </div>
  </div>

  <!-- 푸터 추가 -->
  <div class="mt-12 border-t border-gray-200 bg-gray-50">
    <div class="max-w-[1200px] mx-auto px-4 pt-6">
      <div class="mb-6">
        <h2 class="text-lg font-bold mb-2">BTPOTAL</h2>
        <div class="text-gray-600 text-sm space-y-1">
          <p>대표: 김종진</p>
          <p>사업자 등록번호: 695-87-03015</p>
          <p>주소: 경상남도 진주시 동부로 169번길 12, B동 505호 (충무공동, 윙스타워)</p>
          <p>고객센터: 070-8211-3394</p>
          <p>이메일: jjkim@pbnt.kr</p>
          <p>직업정보제공사업:</p>
          <p class="pb-3 border-b border-gray-200">통신판매업:</p>
        </div>
      </div>

      <div class="flex gap-6 text-sm">
        <a href="#" class="text-blue-900 font-medium">개인정보처리방침</a>
        <a href="#" class="text-gray-600">이용약관</a>
        <a href="#" class="text-gray-600">이용자 준수사항</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mt-12.border-t.border-gray-200.bg-gray-50 {
  background-color: #f1f5f9;
}
</style>
