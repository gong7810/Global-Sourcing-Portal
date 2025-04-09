import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { defineStore } from 'pinia';
import { getRefreshToken } from '@/apis/auth/authApis';

export const useAuthStore = defineStore(
  'authStore',
  () => {
    const router = useRouter();

    const tokenInfo = ref({});
    const userInfo = ref(null); // 사용자정보
    const companyData = ref(null); // 기업정보
    let lineState = ref('12345abcde');

    /* 로그인 완료후 토큰 정보 설정 */
    const setToken = (accessToken, isRemember = false) => {
      tokenInfo.value.accessToken = accessToken;

      isRemember ? localStorage.setItem('accessToken', accessToken) : '';
    };

    /* 로그인 완료후 사용자 정보 설정 */
    const setUserInfo = (info, isRemember = false) => {
      userInfo.value = info;

      isRemember ? localStorage.setItem('userInfo', JSON.stringify(info)) : '';
    };
    /* 로그인 완료후 기업 정보 설정 */
    const setCompanyData = (info, isRemember = false) => {
      companyData.value = info;

      isRemember ? localStorage.setItem('companyData', JSON.stringify(info)) : '';
    };

    /* 초기 빌드시 자동로그인 체크 */
    const checkAutoLogin = () => {
      const storedUser = localStorage.getItem('userInfo');
      const storedToken = localStorage.getItem('accessToken');
      if (storedUser && storedToken) {
        // 스토리지에는 json형태로 저장해서 다시 객체화 시켜야함
        userInfo.value = JSON.parse(storedUser);
        tokenInfo.value.accessToken = storedToken;

        setTimeout(() => {
          if (userInfo.value?.isCompany) {
            companyData.value = localStorage.getItem('companyData');
          }
        }, 100);

        router.push('/');
      }
    };

    /* 사용자 정보 초기화 - 로그아웃 시 */
    const reset = () => {
      tokenInfo.value = {};
      userInfo.value = null;
      companyData.value = null;

      localStorage.removeItem('accessToken');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('companyData');
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

    /* 토큰 재발급 요청 */
    const getTokenRefresh = async () => {
      const response = await getRefreshToken();

      if (response?.accessToken) {
        // 자동 로그인 중인 세션인지 체크
        const isAutoLogin = localStorage.getItem('accessToken') !== null;

        setToken(response?.accessToken, isAutoLogin);
      } else {
        return;
      }
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
      companyData,
      tokenInfo,
      setToken,
      lineState,
      setState,
      setUserInfo,
      setCompanyData,
      reset,
      isLogin,
      login,
      getTokenRefresh,
      hasRoles,
      checkAutoLogin
    };
  },
  {
    persist: {
      enabled: true,
      strategies: [{ storage: sessionStorage }]
    }
  }
);
