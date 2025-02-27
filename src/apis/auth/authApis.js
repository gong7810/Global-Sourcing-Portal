import api from '@/apis/index';
import axios from 'axios';

// 회원가입 여권 확인 API
export const verifypassportNo = async (body) => {
  try {
    const response = await api.get('/passport', body);

    return response;
  } catch (error) {
    console.error(error);
  }
};
