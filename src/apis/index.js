import axios from 'axios';
import { useAuthStore } from '@/store/auth/authStore';
import { storeToRefs } from 'pinia';
import { useMessagePop } from '@/plugins/commonutils';
import { logout } from '@/apis/auth/authApis';

// 토큰 재발급 중복 방지를 위한 플래그
let isTokenRefreshing = false;

export function useApi() {
  // API 호출 함수 (공통 함수)
  const request = async (method, url, data = null, config = {}) => {
    const authStore = useAuthStore();
    const { tokenInfo } = storeToRefs(authStore);
    const messagePop = useMessagePop();

    // Axios 인스턴스 생성
    const api = axios.create({
      baseURL: import.meta.env.VITE_PROXY_URL,
      headers: {
        'Content-Type': 'application/json',
        Authorization: tokenInfo.value?.accessToken ? `Bearer ${tokenInfo.value.accessToken}` : ''
      },
      timeout: 1800000 // 30분 타임아웃
    });

    // 헤더 및 context-type 설정
    api.interceptors.request.use(
      (config) => config,
      (error) => Promise.reject(error)
    );

    const headers = {
      ...config.headers,
      Authorization: tokenInfo.value?.accessToken ? `Bearer ${tokenInfo.value.accessToken}` : ''
    };

    // 이미지를 보내는 FormData인 경우 Content-Type 수정 필요
    if (data instanceof FormData) {
      headers['Content-Type'] = 'multipart/form-data';
    }

    try {
      const response =
        method === 'GET'
          ? await api.get(url, { params: data, headers, ...config })
          : method === 'POST'
            ? await api.post(url, data, { headers, ...config })
            : await api.delete(url, data, { headers, ...config });

      return {
        status: response?.status,
        data: response?.data,
        header: response?.headers
      };
    } catch (err) {
      // 로그인 여부 체크
      if (err.response?.status === 400) {
        messagePop.toast('시스템 오류입니다. \n관리자에게 문의바랍니다.', 'error');

        // setTimeout(() => {
        //   authStore.login();
        // }, 1000);

        return;
      } else if (err.response?.status === 401 && err.response?.data.error === 'TokenExpiredError') {
        // 이미 토큰 갱신 중이면 추가 처리하지 않음 (중복 처리 방지)
        if (!isTokenRefreshing) {
          isTokenRefreshing = true;
          messagePop.toast('인증이 만료되었습니다.', 'warn');

          await authStore.getTokenRefresh();

          setTimeout(() => {
            isTokenRefreshing = false; // 페이지 새로고침 전에 플래그 초기화
            window.location.reload();
          }, 1500);
        }

        return;
      } else if (err.response?.status === 401) {
        messagePop.toast('인증 정보가 유효하지 않습니다.', 'warn');

        await logout();
        authStore.reset();

        setTimeout(() => {
          authStore.login();
        }, 1500);

        return;
      } else if (err.response?.status === 500) {
        messagePop.toast('시스템 오류입니다.', 'error');
        // System User is not existed. (시스템 유저가 존재하지 않습니다.)
        // authStore.login();
        return;
      }

      return {
        status: err.response?.status,
        errorInfo: err.response?.data || {}
      };
    }
  };

  // API 호출 유틸 함수 제공
  const get = (url, params, config) => request('GET', url, params, config);
  const post = (url, params, config) => request('POST', url, params, config);
  const del = (url, params, config) => request('DELETE', url, params, config);

  return { get, post, del };
}
