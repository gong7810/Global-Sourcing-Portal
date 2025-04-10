<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth/authStore';

const router = useRouter();
const authStore = useAuthStore();

onMounted(() => {
  const query = new URLSearchParams(window.location.search);
  const code = query.get('code');

  // 메인 창으로 메시지 전송
  window.opener.postMessage(
    {
      type: 'LOGIN_SUCCESS',
      code: code
    },
    '*'
  );

  // 팝업 창 닫기
  // window.close();
});
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-[rgb(229, 231, 235)]">
    <div class="bg-white p-8 rounded-2xl shadow-lg w-[480px]">
      <!-- 로고 -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold">Global Sourcing Portal</h1>
      </div>

      <button class="w-full py-3 bg-[#8FA1FF] text-white rounded-lg font-medium transition-colors" disabled>
        Login With SNS..
      </button>
    </div>
  </div>
</template>
