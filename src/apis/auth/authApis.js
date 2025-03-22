import api from '@/apis/index';

// 로그인 API
export const login = async (body) => {
  try {
    const response = await api.post('/auth/login', body);

    return response;
  } catch (error) {
    console.error(error);
  }
};
