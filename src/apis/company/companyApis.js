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

// 면접 제안 등록 API
export const requestOffer = async (body) => {
  try {
    const response = await api.post(`/jobOffer`, body);

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 면접 제안 리스트 조회 API
export const getOfferList = async () => {
  try {
    const response = await api.get(`/jobOffer/listByCompany`);

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 면접 결과 설정 API
export const setOfferResult = async (body) => {
  try {
    const response = await api.post(`/jobOffer/result`, body);

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 미승인 기업 회원 신청 목록 조회 API
export const getPendingCompanyApplications = async () => {
  try {
    const response = await api.get(`/company/notApproved`);
    return response.data;
  } catch (error) {
    console.error('미승인 기업 회원 신청 목록 조회 실패:', error);
    throw error;
  }
};

// 기업 회원 승인/거절 처리 API
export const approveCompanyApplication = async (data) => {
  try {
    const response = await api.post(`/company/approval`, data);
    return response.data;
  } catch (error) {
    console.error('기업 회원 승인/거절 처리 실패:', error);
    throw error;
  }
};

// 모든 기업 회원 신청 목록 조회 API (승인/미승인 모두)
export const getAllCompanyApplications = async (query = '') => {
  try {
    const response = await api.get(`/company/list${query ? '?' + query : ''}`);
    return response.data;
  } catch (error) {
    console.error('기업 회원 신청 목록 조회 실패:', error);
    throw error;
  }
};
