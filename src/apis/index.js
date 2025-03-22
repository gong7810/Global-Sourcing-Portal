import axios from 'axios';

// Axios 인스턴스 생성
const api = axios.create({
  // baseURL: import.meta.env.VITE_API_URL,
  baseURL: 'http://localhost:5173/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 1800000 // 30분 타임아웃
});

// API 호출 함수 (공통 함수)
const request = async (method, url, data = null, config = {}) => {
  try {
    const response =
      method === 'GET'
        ? await api.get(url, { params: data, ...config })
        : method === 'POST'
          ? await api.post(url, data, config)
          : await api.delete(url, data, config);

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
export const get = (url, params, config) => request('GET', url, params, config);
export const post = (url, params, config) => request('POST', url, params, config);
export const deletes = (url, params, config) => request('DELETE', url, params, config);

export default api;
