<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth/authStore';

const router = useRouter();
const authStore = useAuthStore();

onMounted(() => {
  const query = new URLSearchParams(window.location.search);
  const code = query.get('code');

  if (code) {
    console.log(code);
    // code가 존재하면 백엔드로 전송
    // sendCodeToBackend(code);
    authStore.setUser({
      user: '공성욱',
      email: 'testmail@gmail.com',
      type: 'user'
    });

    setTimeout(() => {
      router.push('/');
    }, 1000);
  } else {
    // code가 없으면 에러 처리
    console.error('No code found in the URL');
  }
});
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-[rgb(229, 231, 235)]">
    <div class="bg-white p-8 rounded-2xl shadow-lg w-[480px]">
      <!-- 로고 -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold">Global Sourcing Portal</h1>
      </div>

      <!-- 탭 메뉴 -->
      <!-- <div class="flex justify-center mb-8">
        <button class="px-8 py-2 font-medium text-[#8FA1FF] border-b-2 border-[#8FA1FF]">개인회원</button>
        <button class="px-8 py-2 font-medium text-gray-400">기업회원</button>
      </div> -->

      <!-- 입력 폼 -->
      <!-- <div class="space-y-4 mb-6">
        <input
          type="text"
          placeholder="아이디"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8FA1FF]"
        />
        <input
          type="password"
          placeholder="비밀번호"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8FA1FF]"
        />
        <div class="flex items-center">
          <input type="checkbox" id="remember" class="mr-2" />
          <label for="remember" class="text-sm text-gray-600">자동 로그인</label>
        </div>
      </div> -->

      <!-- 로그인 버튼 -->
      <button class="w-full py-3 bg-[#8FA1FF] text-white rounded-lg font-medium transition-colors" disabled>
        Login With Google..
      </button>

      <!-- 아이디/비밀번호 찾기, 회원가입 -->
      <!-- <div class="flex justify-center items-center gap-4 my-4 text-sm text-gray-500">
        <button class="hover:text-[#8FA1FF] transition-colors">아이디찾기</button>
        <div class="w-px h-4 bg-gray-300"></div>
        <button class="hover:text-[#8FA1FF] transition-colors">비밀번호찾기</button>
        <div class="w-px h-4 bg-gray-300"></div>
        <button class="hover:text-[#8FA1FF] transition-colors">회원가입</button>
      </div> -->

      <!-- 소셜 로그인 -->
      <!-- <div class="text-center text-sm text-gray-500 mt-6 mb-4">소셜 계정 로그인</div>
      <button
        class="w-full flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        @click="loginGoogle"
      >
        <i class="pi pi-google text-[#8FA1FF]"></i>
        <span class="text-gray-600">Sign in with Google</span>
      </button> -->
    </div>
  </div>
</template>
