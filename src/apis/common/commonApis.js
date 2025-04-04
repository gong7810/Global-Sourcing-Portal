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

// FAQ 목록 조회
export const getFaqList = async (params = {}) => {
  try {
    const response = await api.get('/faq/list', params)
    return response.data
  } catch (error) {
    console.error('FAQ 목록 조회 실패:', error)
    throw error
  }
}

// FAQ 저장
export const saveFaq = async (data) => {
  try {
    const response = await api.post('/faq', data);
    return response.data;
  } catch (error) {
    console.error('FAQ 저장 실패:', error);
    throw error;
  }
};

// FAQ 삭제
export const deleteFaq = async (id) => {
  try {
    const response = await api.del(`/faq/${id}`);
    return response.data;
  } catch (error) {
    console.error('FAQ 삭제 실패:', error);
    throw error;
  }
};

/**
 * 문의 목록 조회
 * @param {Object} params - 검색 파라미터
 * @returns {Promise} - API 응답
 */
export const getInquiries = async (params = {}) => {
  try {
    // 파라미터 정리
    const queryParams = {
      page: String(params.page || 1),
      perPage: String(params.perPage || 10),
      sortColumn: String(params.sortColumn || 'id'),
      sortAsc: String(params.sortAsc || false)
    };

    // 검색 조건이 있는 경우 추가
    if (params.type) {
      queryParams.statusCd = String(params.type);
    }
    if (params.keyword) {
      queryParams.subject = String(params.keyword);
    }

    const response = await api.get('/help/list', { params: queryParams });
    return response.data;
  } catch (error) {
    console.error('문의 목록 조회 실패:', error);
    throw error;
  }
};

/**
 * 문의 상세 조회
 * @param {number} id - 문의 ID
 * @returns {Promise} - API 응답
 */
export const getInquiryDetail = async (id) => {
  try {
    const response = await api.get(`/help/find/${id}`);
    return response.data;
  } catch (error) {
    console.error('문의 상세 조회 실패:', error);
    throw error;
  }
};

/**
 * 문의 답변 등록/수정
 * @param {Object} data - 답변 데이터
 * @returns {Promise} - API 응답
 */
export const saveReply = async (data) => {
  try {
    const response = await api.post('/help/reply', {
      helpId: Number(data.helpId),
      reply: data.reply
    });
    return response.data;
  } catch (error) {
    console.error('답변 등록 실패:', error);
    throw error;
  }
};

/**
 * 문의 답변 삭제
 * @param {number} id - 답변 ID
 * @returns {Promise} - API 응답
 */
export const deleteReply = async (id) => {
  try {
    const response = await api.delete(`/help/reply/${id}`);
    return response.data;
  } catch (error) {
    console.error('답변 삭제 실패:', error);
    throw error;
  }
};

export default {
  fileUpload,
  getCodeList,
  getFaqList,
  saveFaq,
  deleteFaq,
  getInquiries,
  getInquiryDetail,
  saveReply,
  deleteReply
};
