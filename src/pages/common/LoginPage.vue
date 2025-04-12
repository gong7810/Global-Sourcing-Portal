<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useMessagePop } from '@/plugins/commonutils';

import { useAuthStore } from '@/store/auth/authStore';
import { getAccount, login } from '@/apis/auth/authApis';
import { getCompanyInfo } from '@/apis/company/companyApis';

const messagePop = useMessagePop();
const authStore = useAuthStore();
const activeTab = ref('personal');

// 자동 로그인
const isRemember = ref(false);

const router = useRouter();

// 개인회원 입력 필드
const id = ref(''); // 정의
const pw = ref(''); // 정의

// 기업회원 입력 필드
const businessId = ref('');
const businessPassword = ref('');

// FIXME: 테스트용
// const id = ref('user1');
// const pw = ref('1q2w3e4r5t!');

// const businessId = ref('com1');
// const businessPassword = ref('1q2w3e4r5t!');

const setActiveTab = (tab) => {
  activeTab.value = tab;
};

onMounted(() => {
  // FIXME: 테스트용
  if (import.meta.env.MODE === 'localhost') {
    id.value = 'user1';
    pw.value = '1q2w3e4r5t!';

    businessId.value = 'com1';
    businessPassword.value = '1q2w3e4r5t!';
  }
});

// 로그인
const getLogin = async () => {
  const body = {
    loginId: activeTab.value === 'personal' ? id.value : businessId.value,
    password: activeTab.value === 'personal' ? pw.value : businessPassword.value
  };

  const response = await login(body);

  if (response && response.success === undefined) {
    authStore.setToken(response?.accessToken, isRemember.value);

    getUserInfo();
  } else {
    messagePop.toast('ID, 또는 PW가 틀렸습니다.', 'error');
  }
};

// 사용자 정보 조회
const getUserInfo = async () => {
  const response = await getAccount();
  // 사용자 정보 저장
  authStore.setUserInfo(response, isRemember.value);

  if (activeTab.value !== 'personal') {
    const res = await getCompanyInfo();
    // 회사 정보 저장
    authStore.setCompanyData(res, isRemember.value);
  }

  // 탭에 따라 다른 경로로 이동
  if (!response?.isCompany) {
    router.push('/'); // 개인회원 메인 페이지
  } else if (response?.isCompany) {
    router.push('/company/index'); // 기업회원 대시보드
  }
};

// 소셜 로그인 - Google
const loginGoogle = () => {
  // const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${import.meta.env.VITE_GOOGLE_CLIENT_ID}&redirect_uri=${import.meta.env.VITE_GOOGLE_REDIRECT_URL}&response_type=code&scope=email profile`;

  window.open(`${import.meta.env.VITE_PROXY_URL}/auth/google`, 'snsLogin', 'width=500,height=600');

  // 메시지 리스너 설정
  window.addEventListener('message', (event) => {
    const token = event.data?.accessToken;

    if (token) {
      authStore.setToken(token, false);

      setTimeout(async () => {
        await getUserInfo();
      }, 1000);
    } else if (!token || !event.data?.success) {
      messagePop.alert('등록된 사용자가 아닙니다.\n회원가입을 먼저 진행해주세요.', 'info');
    }
  });
};

// 소셜 로그인 - Line
const loginLine = async () => {
  // const url = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&&client_id=${import.meta.env.VITE_LINE_CLIENT_ID}&redirect_uri=${import.meta.env.VITE_LINE_REDIRECT_URL}&state=${states}&scope=profile%20openid`;
  messagePop.toast('준비중입니다.', 'info');
  return;

  window.open(`${import.meta.env.VITE_PROXY_URL}/auth/line`, 'snsLogin', 'width=500,height=600');

  // 메시지 리스너 설정
  window.addEventListener('message', (event) => {
    const token = event.data?.accessToken;

    console.log(token);
  });
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-[rgb(229, 231, 235)]">
    <div class="bg-white p-8 rounded-2xl shadow-lg w-[480px]">
      <!-- 로고 -->
      <div class="text-center mb-8">
        <router-link to="/" class="text-3xl font-bold notranslate">Global Sourcing Portal</router-link>
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
          <input v-model="isRemember" type="checkbox" id="remember" class="mr-2" />
          <label for="remember" class="text-sm text-gray-600">자동 로그인</label>
        </div>
      </div>

      <!-- 로그인 버튼 -->
      <Button class="w-full py-3 bt_btn primary" @click="getLogin"> 로그인 </Button>

      <!-- 아이디/비밀번호 찾기, 회원가입 -->
      <div class="flex justify-center items-center gap-4 my-4 text-sm text-gray-500">
        <router-link to="/find-id" class="hover:text-[#8FA1FF] transition-colors">아이디찾기</router-link>
        <div class="w-px h-4 bg-gray-300"></div>
        <router-link to="/find-password" class="hover:text-[#8FA1FF] transition-colors">비밀번호찾기</router-link>
        <div class="w-px h-4 bg-gray-300"></div>
        <router-link to="/register-select" class="hover:text-[#8FA1FF] transition-colors">회원가입</router-link>
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
