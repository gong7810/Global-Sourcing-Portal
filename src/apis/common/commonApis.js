import { useApi } from '@/apis/index'

const api = useApi();

// 파일 업로드
export const fileUpload = async (body) => {
  try {
    const response = await api.post('/file/upload', body)
    
    return response.data
  } catch (error) {
    console.error(error);
  }
}

// 국적 CODE API
export const getNationality = async () => {
  try {
    const response = await api.get('code/active/NATIONALITY_TY');

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 성별 CODE API
export const getGenderList = async () => {
  try {
    const response = await api.get('code/active/GENDER_TY');

    return response.data;
  } catch (error) {
    console.error(error);
  }
};
