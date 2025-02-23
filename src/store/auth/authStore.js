import { defineStore } from 'pinia';
import { ref } from 'vue';
import { isEmpty } from 'es-toolkit/compat';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore(
  'authStore',
  () => {
    const router = useRouter();
    let userInfo = ref({}); // 사용자정보

    /* 로그인 완료후 사용자 정보 설정 */
    const setUser = (param) => {
      userInfo.value = param;
    };

    /* 사용자 정보 초기화 - 로그아웃 시 */
    const reset = () => {
      userInfo.value = {};
      referer.value = '';
    };

    /* 로그인 여부 */
    const isLogin = () => {
      return !isEmpty(userInfo.value);
    };

    /* 로그인 */

    const login = () => {
      router.push('/login');
    };

    return {
      userInfo,
      setUser,
      reset,
      isLogin,
      login
    };
  },
  {
    persist: {
      enabled: true,
      strategies: [{ storage: sessionStorage }]
    }
  }
);
