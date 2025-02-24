<script setup>
import { ref } from 'vue';

const personalId = ref('');
const personalPassword = ref('');
const personalPasswordCheck = ref('');

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
          v-model="personalId"
          type="text"
          placeholder="아이디"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8FA1FF]"
        />
        <input
          v-model="personalPassword"
          type="password"
          placeholder="비밀번호(8~16자의 영문, 숫자, 특수기호)"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8FA1FF]"
        />
        <input
          v-model="personalPasswordCheck"
          type="password"
          placeholder="비밀번호 확인"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8FA1FF]"
        />
        <input
          v-model="personalName"
          type="text"
          placeholder="이름(실명)"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8FA1FF]"
        />
        <input
          v-model="birthdate"
          type="text"
          placeholder="생년월일(예시: 20000131)"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8FA1FF]"
        />
        <div class="flex space-x-4">
          <label>
            <input type="radio" v-model="gender" value="male" />
            남자
          </label>
          <label>
            <input type="radio" v-model="gender" value="female" />
            여자
          </label>
        </div>
        <input
          type="email"
          placeholder="이메일"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8FA1FF]"
        />
        <input
          v-model="personalPhone"
          type="text"
          placeholder="휴대폰번호"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8FA1FF]"
        />
        <input
          v-model="passportNumber"
          type="text"
          placeholder="여권번호"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8FA1FF]"
        />
        <button
          type="button"
          @click="verifyPassport"
          class="w-full py-2 bg-blue-500 text-white rounded-lg"
        >
          여권번호 확인
        </button>
      </div>

      <!-- 회원가입 버튼 -->
      <button class="w-full py-3 bg-[#8FA1FF] text-white rounded-lg font-medium hover:bg-[#7B8FFF] transition-colors">
        회원가입
      </button>
    </div>
  </div>
</template>