<script setup>
import { ref, toRaw } from 'vue';
import { useRouter } from 'vue-router';

import { getAccount, login } from '@/apis/auth/authApis';
import { useAuthStore } from '@/store/auth/authStore';
import { useMessagePop } from '@/plugins/commonutils';

const router = useRouter();
const authStore = useAuthStore();
const messagePop = useMessagePop();

const loginForm = ref({
  loginId: '',
  password: ''
});

const loading = ref(false);

const getLogin = async () => {
  if (!loginForm.value.loginId || !loginForm.value.password) {
    alert('아이디와 비밀번호를 입력해주세요.');
    return;
  }

  loading.value = true;
  try {
    const response = await login(toRaw(loginForm.value));

    if (response && response.success === undefined) {
      authStore.setToken(response?.accessToken);

      getUserInfo();
    } else {
      messagePop.toast('ID, 또는 PW가 틀렸습니다.', 'error');
      return;
    }
  } catch (error) {
    console.error('로그인 실패:', error);
  } finally {
    loading.value = false;
  }
};

// 관리자 정보 조회
const getUserInfo = async () => {
  const response = await getAccount();

  if (response && response.success === undefined) {
    // 사용자 정보 저장
    authStore.setUserInfo(response);

    // 로그인 성공 시 사용자 관리 페이지로 이동
    router.push('/admin/users');
  }
};
</script>

<template>
  <div class="admin-login">
    <div class="login-container">
      <div class="login-header">
        <h1 class="text-2xl font-bold text-gray-800">관리자 로그인</h1>
      </div>

      <form @submit.prevent="getLogin" class="login-form">
        <div class="form-group">
          <div class="flex items-center gap-2 mb-2">
            <i class="pi pi-user text-gray-500"></i>
            <label for="loginId">아이디</label>
          </div>
          <InputText
            id="loginId"
            v-model="loginForm.loginId"
            type="text"
            class="w-full"
            placeholder="아이디를 입력하세요"
          />
        </div>

        <div class="form-group">
          <div class="flex items-center gap-2 mb-2">
            <i class="pi pi-lock text-gray-500"></i>
            <label for="password">비밀번호</label>
          </div>
          <InputText
            id="password"
            v-model="loginForm.password"
            type="password"
            class="w-full"
            placeholder="비밀번호를 입력하세요"
          />
        </div>

        <Button type="submit" label="로그인" :loading="loading" class="w-full" />
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.admin-login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
  padding: 1rem;

  .login-container {
    width: 100%;
    max-width: 400px;
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 2rem;
  }

  .login-header {
    text-align: center;
    margin-bottom: 2.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;

    h1 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: bold;
      color: #1f2937;
    }
  }

  .login-form {
    .form-group {
      margin-bottom: 1.5rem;

      label {
        color: #4b5563;
        font-weight: 500;
      }
    }

    input {
      width: 100%;
      border-radius: 8px;

      &:enabled:focus {
        border-color: #8b8bf5;
        box-shadow: 0 0 0 2px rgba(139, 139, 245, 0.1);
      }
    }

    .p-button {
      height: 2.75rem;
      border-radius: 8px;
      background-color: #8b8bf5;
      border-color: #8b8bf5;

      &:enabled:hover {
        background-color: darken(#8b8bf5, 5%);
        border-color: darken(#8b8bf5, 5%);
      }
    }
  }
}
</style>
