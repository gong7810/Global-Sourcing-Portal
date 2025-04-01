import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore(
  'authStore',
  () => {
    const router = useRouter();
    let userInfo = ref(null); // 사용자정보
    let lineState = ref('12345abcde');
    let tokenInfo = ref({});

    /* 로그인 완료후 토큰 정보 설정 */
    const setToken = (accessToken) => {
      tokenInfo.value.accessToken = accessToken;
    };

    /* 로그인 완료후 사용자 정보 설정 */
    const setUserInfo = (info) => {
      userInfo.value = info;
    };

    /* 사용자 정보 초기화 - 로그아웃 시 */
    const reset = () => {
      userInfo.value = null;
      tokenInfo.value = {};
      // referer.value = '';
    };

    /* 로그인 여부 */
    const isLogin = () => {
      return !!userInfo.value;
    };

    /* 로그인 */
    const login = () => {
      router.push('/login');
      // location.href='/login';
    };

    /* 접근 권한 체크 */
    const hasRoles = (meta) => {
      return meta.authorization.includes(userInfo.value.roleCd);
    };

    /* 라인 state 관리 */
    const setState = (state) => {
      lineState.value = state;
    };

    return {
      userInfo,
      tokenInfo,
      setToken,
      lineState,
      setState,
      setUserInfo,
      reset,
      isLogin,
      login,
      hasRoles
    };
  },
  {
    persist: {
      enabled: true,
      strategies: [{ storage: sessionStorage }]
    }
  }
);
