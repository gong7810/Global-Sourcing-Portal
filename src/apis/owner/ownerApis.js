import { useApi } from '@/apis/index';

const api = useApi();

// 회사 정보 조회 API
export const getCompanyInfo = async (id) => {
  try {
    const response = await api.get(`/company/find/${id}`);

    return response.data;
  } catch (error) {
    console.error(error);
  }
};
