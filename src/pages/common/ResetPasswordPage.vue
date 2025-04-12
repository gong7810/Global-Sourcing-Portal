<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { resetPassword } from '@/apis/auth/authApis';
import { useMessagePop } from '@/plugins/commonutils';

const messagePop = useMessagePop();
const route = useRoute();
const router = useRouter();

const authKey = route.params.authKey;

const newPassword = ref('');
const confirmPassword = ref('');

const isValidPassword = (password) => {
  // 8~16자의 영문, 숫자, 특수문자 조합
  const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,16}$/;
  return regex.test(password);
};

const containsInvalidCharacters = (password) => {
  // 특정 특수문자를 포함하는지 확인
  return /[~^()\-_+=`\[\]{}|;':",.\\/<>]/.test(password);
};

const handleResetPassword = async () => {
  if (!newPassword.value.length) {
    messagePop.alert('비밀번호는 공백일 수 없습니다.', 'bad');
    return;
  } else if (newPassword.value !== confirmPassword.value) {
    messagePop.alert('비밀번호가 일치하지 않습니다.', 'bad');
    return;
  } else if (containsInvalidCharacters(newPassword.value)) {
    messagePop.alert('사용할 수 없는 특수문자가 포함되어 있습니다.', 'bad');
    return;
  } else if (!isValidPassword(newPassword.value)) {
    messagePop.alert('8~16자의 영문, 숫자, 특수문자 조합으로 입력해 주세요.', 'bad');
    return;
  }

  try {
    if (!authKey) {
      messagePop.alert('유효하지 않은 링크입니다.', 'error');
      return;
    }

    const response = await resetPassword({
      authKey: authKey,
      password: newPassword.value
    });

    if (response && response.success === undefined) {
      messagePop.confirm({
        icon: 'good',
        message: '비밀번호가 성공적으로 변경되었습니다.\n로그인창으로 이동 하시겠습니까?',
        onCloseYes: async () => {
          router.push('/login');
        }
      });
    } else {
      messagePop.alert('비밀번호 변경에 실패했습니다.', 'error');
    }
  } catch (error) {
    messagePop.alert('오류가 발생했습니다. 다시 시도해주세요.', 'error');
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-[rgb(229, 231, 235)]">
    <div class="bg-white p-8 rounded-2xl shadow-lg w-[480px]">
      <!-- 로고 -->
      <div class="text-center mb-8">
        <span class="text-3xl font-bold notranslate">Global Sourcing Portal</span>
      </div>

      <h2 class="text-2xl font-bold text-center mb-6">비밀번호 재설정</h2>

      <div class="space-y-4 mb-6">
        <input
          v-model="newPassword"
          type="password"
          placeholder="새 비밀번호 (8자 이상)"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8FA1FF]"
        />
        <input
          v-model="confirmPassword"
          type="password"
          placeholder="새 비밀번호 확인"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8FA1FF]"
        />
      </div>

      <Button class="w-full py-3 bt_btn primary" @click="handleResetPassword"> 비밀번호 변경 </Button>

      <div class="flex justify-center mt-4">
        <router-link to="/login" class="text-sm text-gray-500 hover:text-[#8FA1FF]"
          >로그인 페이지로 돌아가기</router-link
        >
      </div>
    </div>
  </div>
</template>
