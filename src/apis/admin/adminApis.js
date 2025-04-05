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
    const queryParams = new URLSearchParams();
    
    // 기본 파라미터 추가
    queryParams.append('page', String(params.page || 1));
    queryParams.append('perPage', String(params.perPage || 10));
    queryParams.append('sortColumn', String(params.sortColumn || 'id'));
    queryParams.append('sortAsc', String(params.sortAsc || false));

    // 검색 조건이 있는 경우 추가
    if (params.roleCd) {
      queryParams.append('roleCd', String(params.roleCd));
      // console.log('API에 전달되는 roleCd:', params.roleCd);
    }
    if (params.loginId) {
      queryParams.append('loginId', String(params.loginId));
    }
    if (params.name) {
      queryParams.append('name', String(params.name));
    }
    if (params.mobile) {
      queryParams.append('mobile', String(params.mobile));
    }
    if (params.email) {
      queryParams.append('email', String(params.email));
    }
    if (params.enabled !== undefined) {
      queryParams.append('enabled', String(params.enabled));
    }

    // console.log('API 요청 파라미터:', Object.fromEntries(queryParams));
    
    // API 엔드포인트 확인
    const endpoint = '/user/list';
    // console.log('API 엔드포인트:', endpoint);
    
    const response = await api.get(`${endpoint}?${queryParams.toString()}`);
    // console.log('API 응답 데이터:', response.data);
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
