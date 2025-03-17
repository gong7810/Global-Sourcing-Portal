<script setup>
import { useAuthStore } from '@/store/auth/authStore';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';

const authStore = useAuthStore();
const activeTab = ref('personal');

const router = useRouter();

// 개인회원 입력 필드
const id = ref(''); // 정의
const pw = ref(''); // 정의

// 기업회원 입력 필드
const businessId = ref('');
const businessPassword = ref('');

const setActiveTab = (tab) => {
  activeTab.value = tab;
};

const login = () => {
  // 로그인 검증을 비활성화하고 바로 페이지 이동
  let targetPage;

  if (activeTab.value === 'personal') {
    targetPage = 'userIndex'; // 개인회원 페이지
  } else if (activeTab.value === 'business') {
    targetPage = 'businessIndex'; // 기업회원 페이지
  }

  router.push({ name: targetPage }); // 해당 메인 페이지로 이동, ToDo: 라우터 수정하기
};

const { lineState } = storeToRefs(authStore);
const loginGoogle = () => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${import.meta.env.VITE_GOOGLE_CLIENT_ID}&redirect_uri=${import.meta.env.VITE_GOOGLE_REDIRECT_URL}&response_type=code&scope=email profile`;

  window.location.href = url;
};

const loginLine = () => {
  const states = lineState.value;
  const url = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&&client_id=${import.meta.env.VITE_LINE_CLIENT_ID}&redirect_uri=${import.meta.env.VITE_LINE_REDIRECT_URL}&state=${states}&scope=profile%20openid`;

  window.location.href = url;
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-[rgb(229, 231, 235)]">
    <div class="bg-white p-8 rounded-2xl shadow-lg w-[480px]">
      <!-- 로고 -->
      <div class="text-center mb-8">
        <router-link to="/" class="text-3xl font-bold">Global Sourcing Portal</router-link>
      </div>

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

      <!-- 입력 폼 -->
      <div class="space-y-4 mb-6">
        <input
          v-if="activeTab === 'personal'"
          v-model="id"
          type="text"
          placeholder="아이디"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8FA1FF]"
        />
        <input
          v-if="activeTab === 'personal'"
          v-model="pw"
          type="password"
          placeholder="비밀번호"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8FA1FF]"
        />
        <input
          v-if="activeTab === 'business'"
          v-model="businessId"
          type="text"
          placeholder="아이디"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8FA1FF]"
        />
        <input
          v-if="activeTab === 'business'"
          v-model="businessPassword"
          type="password"
          placeholder="비밀번호"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8FA1FF]"
        />
        <div class="flex items-center">
          <input type="checkbox" id="remember" class="mr-2" />
          <label for="remember" class="text-sm text-gray-600">자동 로그인</label>
        </div>
      </div>

      <!-- 로그인 버튼 -->
      <Button class="w-full py-3 bt_btn primary" @click="login">
        로그인
      </Button>

      <!-- 아이디/비밀번호 찾기, 회원가입 -->
      <div class="flex justify-center items-center gap-4 my-4 text-sm text-gray-500">
        <router-link to="/find-id" class="hover:text-[#8FA1FF] transition-colors">아이디찾기</router-link>
        <div class="w-px h-4 bg-gray-300"></div>
        <router-link to="/find-password" class="hover:text-[#8FA1FF] transition-colors">비밀번호찾기</router-link>
        <div class="w-px h-4 bg-gray-300"></div>
        <!-- <button class="hover:text-[#8FA1FF] transition-colors">회원가입</button> -->
        <router-link to="/personal/register" v-if="activeTab === 'personal'" class="hover:text-[#8FA1FF] transition-colors">회원가입</router-link>
        <router-link to="/business/register" v-if="activeTab === 'business'" class="hover:text-[#8FA1FF] transition-colors">회원가입</router-link>
      </div>

      <!-- 소셜 로그인 -->
      <div v-if="activeTab === 'personal'">
        <div class="flex items-center text-sm text-gray-500 mt-6 mb-4">
            <div class="flex-grow border-t border-gray-300"></div>
            <span class="mx-4">소셜 계정 로그인</span>
            <div class="flex-grow border-t border-gray-300"></div>
        </div>

        <!-- Google 로그인 버튼 -->
        <button
          class="w-full flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          @click="loginGoogle"
        >
          <i class="pi pi-google text-[#8FA1FF]"></i>
          <span class="text-gray-600">Sign in with Google</span>
        </button>
        <!-- Line 로그인 버튼 -->
        <button
          class="w-full flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors mt-2"
          @click="loginLine"
        >
          <img src="/demo/icons/btn_base.png" alt="Line Login" class="h-6 w-6" />
          <span class="text-gray-600">Sign in with Line</span>
        </button>
      </div>
    </div>
  </div>
</template>
