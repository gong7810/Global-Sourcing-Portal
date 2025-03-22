import { useApi } from '@/apis/index';

const api = useApi();

// 로그인 API
export const login = async (body) => {
  try {
    const response = await api.post('/auth/login', body);

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 아이디 중복체크 API
export const checkDuplicate = async (loginId) => {
  try {
    const response = await api.get(`/auth/checkDuplicate/${loginId}`);

    return response.data;
  } catch (error) {
    console.error(error);
  }
};
