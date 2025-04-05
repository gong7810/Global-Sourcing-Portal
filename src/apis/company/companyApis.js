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

// 인재 이력서 리스트 조회 API
export const getResumeList = async (query) => {
  try {
    const response = await api.get(`/resume/list${query ? '?' + query : ''}`);

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 인재 이력서 개별 조회 API
export const getUserResume = async (resumeId) => {
  try {
    const response = await api.get(`/resume/find/${resumeId}`);

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 인재 북마크 등록 API
export const insertFavoriteResume = async (body) => {
  try {
    const response = await api.post(`/favoriteResume`, body);

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 인재 북마크 삭제 API
export const deleteFavoriteResume = async (favoriteId, resumeId) => {
  try {
    const response = await api.del(`/favoriteResume/${favoriteId ? favoriteId : `resume/${resumeId}`}`);

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 북마크 인재 리스트 조회 API
export const getFavoriteResumeList = async (query) => {
  try {
    const response = await api.get(`/favoriteResume/list${query ? '?' + query : ''}`);

    return response.data;
  } catch (error) {
    console.error(error);
  }
};
