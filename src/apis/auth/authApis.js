import { useApi } from '@/apis/index';

const api = useApi();

// 로그인 API
export const login = async (body) => {
  try {
    const response = await api.post(`/auth/login`, body);

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 로그아웃 API
export const logout = async () => {
  try {
    await api.get(`/auth/logout`);
  } catch (error) {
    console.error(error);
  }
};

// 토큰 갱신 API
export const getRefreshToken = async (body) => {
  try {
    const response = await api.get(`/auth/refresh`, body);

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 내 정보 조회 API (토큰으로 내정보를 가져옴)
export const getAccount = async () => {
  try {
    const response = await api.get(`/auth/account`);

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 내 정보 수정 API
export const updateAccount = async (body) => {
  try {
    const response = await api.post(`/auth/account`, body);

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

// 회원가입 API
export const signUpUser = async (body) => {
  try {
    const response = await api.post(`/auth/joinUser`, body);

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 기업회원가입 API
export const signUpCompany = async (body) => {
  try {
    const response = await api.post(`/company`, body);

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 모바일 인증번호 요청 API
export const requestMobile = async (mobile) => {
  try {
    await api.get(`/auth/checkMobile/${mobile}`);
  } catch (error) {
    console.error(error);
  }
};

// 모바일 인증번호 검증 API
export const checkMobile = async (body) => {
  try {
    const response = await api.post(`/auth/checkMobile`, body);

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 로그인 ID 찾기 API
export const findId = async (body) => {
  try {
    const response = await api.post(`/auth/findId`, body);

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 로그인 비밀번호 찾기 API
export const findPassword = async (body) => {
  try {
    const response = await api.post(`/auth/findPassword`, body);

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 비밀번호 변경 API
export const resetPassword = async (body) => {
  try {
    const response = await api.post(`/auth/resetPassword`, body);

    return response.data;
  } catch (error) {
    console.error(error);
  }
};
