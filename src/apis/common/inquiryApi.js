import { useApi } from '@/apis/index'

const api = useApi();

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
  getInquiries,
  getInquiryDetail,
  saveReply,
  deleteReply
}; 