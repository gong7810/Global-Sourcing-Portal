import { useApi } from '@/apis/index';

const api = useApi();

// 회사 정보 조회 API
export const getCompanyInfo = async () => {
  try {
    const response = await api.get(`/company`);

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 회사 정보 수정 API
export const updateCompanyInfo = async (body) => {
  try {
    const response = await api.post(`/company`, body);

    return response.data;
  } catch (error) {
    console.error(error);
  }
};
