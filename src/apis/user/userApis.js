import { useApi } from '@/apis/index';

const api = useApi();

// 사용자 이력서 조회 API
export const getResume = async () => {
  try {
    const response = await api.get('resume');

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 사용자 이력서 수정 API
export const updateResume = async (body) => {
  try {
    const response = await api.post('resume', body);

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 사용자 경력 수정 API
export const updateExperience = async (body) => {
  try {
    const response = await api.post('experience', body);

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 사용자 경력 수정 API
export const updateEducation = async (body) => {
  try {
    const response = await api.post('Education', body);

    return response.data;
  } catch (error) {
    console.error(error);
  }
};
