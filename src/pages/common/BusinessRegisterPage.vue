<script setup>
import { ref } from 'vue';

const businessId = ref('');
const businessPassword = ref('');
const businessPasswordCheck = ref('');

</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-[rgb(229, 231, 235)]">
    <div class="bg-white p-8 rounded-2xl shadow-lg w-[480px]">
      <!-- 로고 -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold">회원가입</h1>
      </div>

      <!-- 입력 폼 -->
      <div class="space-y-4 mb-6">
        <input
          v-model="businessId"
          type="text"
          placeholder="아이디"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8FA1FF]"
        />
        <input
          type="email"
          placeholder="이메일"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8FA1FF]"
        />
        <input
          v-model="businessPassword"
          type="password"
          placeholder="비밀번호"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8FA1FF]"
        />
        <input
          v-model="businessPasswordCheck"
          type="password"
          placeholder="비밀번호 확인"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8FA1FF]"
        />
      </div>

      <!-- 회원가입 버튼 -->
      <button class="w-full py-3 bg-[#8FA1FF] text-white rounded-lg font-medium hover:bg-[#7B8FFF] transition-colors">
        회원가입
      </button>
    </div>
  </div>
</template>