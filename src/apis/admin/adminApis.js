import { useApi } from '@/apis/index'

const api = useApi();

// 기존 test 함수는 유지
export const test = async () => {
  try {
    const response = await api.get('/v1/st/user/apis')
    console.log(response)
  } catch (error) {
    console.error(error)
  }
}

/**
 * 사용자 목록 조회
 * @param {Object} params - 검색 파라미터
 * @returns {Promise} - API 응답
 */
export const getUserList = async (params = {}) => {
  try {
    // 파라미터 정리
    const queryParams = {
      page: String(params.page || 1),
      perPage: String(params.perPage || 10),
      sortColumn: String(params.sortColumn || 'id'),
      sortAsc: String(params.sortAsc || false)
    };

    // 검색 조건이 있는 경우 추가
    if (params.role) {
      queryParams.roleCd = String(params.role);
    }
    if (params.loginId) {
      queryParams.loginId = String(params.loginId);
    }
    if (params.name) {
      queryParams.name = String(params.name);
    }
    if (params.mobile) {
      queryParams.mobile = String(params.mobile);
    }
    if (params.email) {
      queryParams.email = String(params.email);
    }
    if (params.enabled !== undefined) {
      queryParams.enabled = String(params.enabled);
    }

    const response = await api.get('/user/list', { params: queryParams });
    return response.data;
  } catch (error) {
    console.error('사용자 목록 조회 실패:', error);
    throw error;
  }
};

/**
 * 사용자 상태 이력 조회
 * @param {number} userId - 사용자 ID
 * @returns {Promise} - API 응답
 */
export const getUserStatus = async (userId) => {
  try {
    const response = await api.get(`/user/status/${userId}`);
    return response.data;
  } catch (error) {
    console.error('사용자 상태 조회 실패:', error);
    throw error;
  }
};

/**
 * 사용자 상태 변경
 * @param {Object} data - 상태 변경 데이터
 * @returns {Promise} - API 응답
 */
export const updateUserStatus = async (data) => {
  try {
    const response = await api.post('/user/status', {
      userId: Number(data.userId),
      enabled: Boolean(data.enabled),
      memo: String(data.memo || '')
    });
    return response.data;
  } catch (error) {
    console.error('사용자 상태 변경 실패:', error);
    throw error;
  }
};

/**
 * 사용자 정보 업데이트
 * @param {Object} data - 업데이트할 사용자 데이터
 * @returns {Promise} - API 응답
 */
export const updateUser = async (data) => {
  try {
    // 데이터 타입 변환 및 필드 매핑
    const updateData = {
      id: Number(data.id),
      loginId: String(data.loginId || ''),
      name: String(data.name || ''),
      birth: String(data.birthDate || ''),
      mobile: String(data.mobile || ''),
      email: String(data.email || ''),
      roleCd: String(data.role || ''),
      genderCd: String(data.gender || ''),
      isCompany: Boolean(data.isCompany),
      enabled: Boolean(data.enabled),
      profileImage: data.profileImage || null
    };
    
    // console.log('Sending update data:', updateData); // 디버깅용
    const response = await api.post(`/user`, updateData);
    // console.log('Update response:', response.data); // 디버깅용
    
    // 응답 데이터에 role과 gender 필드가 없으면 추가
    if (response.data && !response.data.role) {
      response.data.role = updateData.roleCd;
    }
    if (response.data && !response.data.gender) {
      response.data.gender = updateData.genderCd;
    }
    
    return response.data;
  } catch (error) {
    console.error('사용자 정보 업데이트 실패:', error);
    throw error;
  }
};

export default {
  getUserList,
  getUserStatus,
  updateUserStatus,
  updateUser
};
