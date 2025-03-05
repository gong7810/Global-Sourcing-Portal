<script setup>
import { ref } from 'vue';
import Button from 'primevue/button';

const activeTab = ref('personal');
const name = ref('');
const email = ref('');
const businessName = ref('');
const businessEmail = ref('');

const setActiveTab = (tab) => {
  activeTab.value = tab;
};

const findId = () => {
  const currentName = activeTab.value === 'personal' ? name.value : businessName.value;
  const currentEmail = activeTab.value === 'personal' ? email.value : businessEmail.value;

  if (currentName && currentEmail) {
    alert('입력하신 정보로 아이디를 찾을 수 없습니다.');
    // 실제 구현시에는 서버에 요청하여 아이디를 찾아야 합니다.
  } else {
    alert('모든 필드를 입력해주세요.');
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-[rgb(229, 231, 235)]">
    <div class="bg-white p-8 rounded-2xl shadow-lg w-[480px]">
      <!-- 로고 -->
      <div class="text-center mb-8">
        <router-link to="/" class="text-3xl font-bold">Global Sourcing Portal</router-link>
      </div>

      <h2 class="text-2xl font-bold text-center mb-6">아이디 찾기</h2>

      <!-- 탭 메뉴 -->
      <div class="flex justify-center mb-8">
        <button
          @click="setActiveTab('personal')"
          :class="activeTab === 'personal' ? 'text-[#8FA1FF] border-b-2 border-[#8FA1FF]' : 'text-gray-400'"
          class="px-8 py-2 font-medium"
        >
          개인회원
        </button>
        <button
          @click="setActiveTab('business')"
          :class="activeTab === 'business' ? 'text-[#8FA1FF] border-b-2 border-[#8FA1FF]' : 'text-gray-400'"
          class="px-8 py-2 font-medium"
        >
          기업회원
        </button>
      </div>
      
      <div class="space-y-4 mb-6">
        <!-- 개인회원 입력 폼 -->
        <template v-if="activeTab === 'personal'">
          <input
            v-model="name"
            type="text"
            placeholder="이름"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8FA1FF]"
          />
          <input
            v-model="email"
            type="email"
            placeholder="이메일"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8FA1FF]"
          />
        </template>

        <!-- 기업회원 입력 폼 -->
        <template v-if="activeTab === 'business'">
          <input
            v-model="businessName"
            type="text"
            placeholder="가입자명"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8FA1FF]"
          />
          <input
            v-model="businessEmail"
            type="email"
            placeholder="사업자등록번호"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8FA1FF]"
          />
        </template>
      </div>

      <Button class="w-full py-3 bt_btn primary" @click="findId">
        아이디 찾기
      </Button>

      <div class="flex justify-center mt-4">
        <router-link to="/login" class="text-sm text-gray-500 hover:text-[#8FA1FF]">로그인 페이지로 돌아가기</router-link>
      </div>
    </div>
  </div>
</template> 