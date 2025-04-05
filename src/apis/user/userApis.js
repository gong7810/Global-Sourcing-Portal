import { useApi } from '@/apis/index';

const api = useApi();

// 사용자 이력서 조회 API
export const getMyResume = async () => {
  try {
    const response = await api.get(`/resume`);

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 사용자 이력서 수정 API
export const updateResume = async (body) => {
  try {
    const response = await api.post(`/resume`, body);

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 사용자 경력 추가, 수정 API
export const upsertExperience = async (body) => {
  try {
    const response = await api.post(`/experience`, body);

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 사용자 경력 삭제 API
export const deleteExperience = async (id) => {
  try {
    const response = await api.del(`/experience/${id}`);

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 사용자 학력 추가, 수정 API
export const upsertEducation = async (body) => {
  try {
    const response = await api.post(`/education`, body);

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 사용자 학력 삭제 API
export const deleteEducation = async (id) => {
  try {
    const response = await api.del(`/education/${id}`);

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 사용자 자격증 추가, 수정 API
export const upsertCertification = async (body) => {
  try {
    const response = await api.post(`/certification`, body);

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 사용자 자격증 삭제 API
export const deleteCertification = async (id) => {
  try {
    const response = await api.del(`/certification/${id}`);

    return response.data;
  } catch (error) {
    console.error(error);
  }
};
