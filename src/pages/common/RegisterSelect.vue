<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

const goToRegister = (type) => {
  router.push(`/${type}/register`);
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-[rgb(229, 231, 235)]">
    <div class="bg-white p-8 rounded-2xl shadow-lg w-[800px]">
      <div class="text-center mb-8">
        <h2 class="text-2xl font-bold">회원가입 유형 선택</h2>
      </div>
      
      <div class="flex gap-6 justify-center">
        <!-- 개인회원 카드 -->
        <div 
          @click="goToRegister('personal')"
          class="w-[300px] p-6 border rounded-lg cursor-pointer hover:border-[#8FA1FF] transition-colors text-center"
        >
          <h3 class="text-xl font-bold mb-4">개인회원</h3>
          <p class="text-gray-600 mb-4">개인 사용자를 위한 회원가입</p>
          <button class="px-6 py-2 bg-[#8FA1FF] text-white rounded-lg hover:bg-[#7B8FFF]">
            선택하기
          </button>
        </div>

        <!-- 기업회원 카드 -->
        <div 
          @click="goToRegister('business')"
          class="w-[300px] p-6 border rounded-lg cursor-pointer hover:border-[#8FA1FF] transition-colors text-center"
        >
          <h3 class="text-xl font-bold mb-4">기업회원</h3>
          <p class="text-gray-600 mb-4">기업 사용자를 위한 회원가입</p>
          <button class="px-6 py-2 bg-[#8FA1FF] text-white rounded-lg hover:bg-[#7B8FFF]">
            선택하기
          </button>
        </div>
      </div>
    </div>
  </div>
</template> 