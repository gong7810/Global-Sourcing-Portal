import axios from 'axios';
import { useAuthStore } from '@/store/auth/authStore';
import { storeToRefs } from 'pinia';

export function useApi() {
  const authStore = useAuthStore();
  const { tokenInfo } = storeToRefs(authStore);

  // Axios 인스턴스 생성
  const api = axios.create({
    baseURL: 'http://localhost:5173/api',
    headers: {
      'Content-Type': 'application/json',
      Authorization: tokenInfo.value?.accessToken ? `Bearer ${tokenInfo.value.accessToken}` : ''
    },
    timeout: 1800000 // 30분 타임아웃
  });

  // API 호출 함수 (공통 함수)
  const request = async (method, url, data = null, config = {}) => {
    try {
      const headers = {
        ...config.headers,
        Authorization: tokenInfo.value?.accessToken ? `Bearer ${tokenInfo.value.accessToken}` : ''
      };

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
      return {
        status: err.response?.status,
        errorInfo: err.response?.data || {}
      };
    }
  };

  // API 호출 유틸 함수 제공
  const get = (url, params, config) => request('GET', url, params, config);
  const post = (url, params, config) => request('POST', url, params, config);
  const deletes = (url, params, config) => request('DELETE', url, params, config);

  return { get, post, deletes };
}
