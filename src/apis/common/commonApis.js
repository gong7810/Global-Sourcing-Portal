import { useApi } from '@/apis/index';

const api = useApi();

// 파일 업로드
export const fileUpload = async (body) => {
  try {
    const response = await api.post(`/file/upload`, body);

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 코드 리스트 API
export const getCodeList = async (code) => {
  try {
    const response = await api.get(`/code/active/${code}`);

    return response.data;
  } catch (error) {
    console.error(error);
  }
};
