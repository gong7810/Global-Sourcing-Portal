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

// 파일 다운로드
export const fileDownload = async (id) => {
  try {
    const response = await api.get(`/file/download/${id}`, null, {
      responseType: 'blob'
    });

    return response;
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

// 노티 목록 조회 API
export const getNotificationList = async () => {
  try {
    const response = await api.get(`/notification/list`);

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 노티 읽음 처리 API
export const updateNotification = async (id) => {
  try {
    await api.post(`/notification/read/${id}`, {});
  } catch (error) {
    console.error(error);
  }
};

// 노티 삭제 API
export const delNotification = async (id) => {
  try {
    await api.del(`/notification/${id}`);
  } catch (error) {
    console.error(error);
  }
};

// 노티 전체 삭제 API
export const delNotificationAll = async (body) => {
  try {
    const response = api.post(`/notification/delete`, body);

    return response;
  } catch (error) {
    console.error(error);
  }
};

// FAQ 목록 조회
export const getFaqList = async (params = {}) => {
  try {
    const response = await api.get(`/faq/list`, params);
    return response.data;
  } catch (error) {
    console.error('FAQ 목록 조회 실패:', error);
    throw error;
  }
};

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
      page: params.page,
      perPage: params.perPage,
      sortColumn: params.sortColumn,
      sortAsc: params.sortAsc
    };

    // 검색 조건이 있는 경우 추가
    if (params.typeCd) {
      queryParams.typeCd = params.typeCd; // 문의유형 필터링
    }
    if (params.keyword) {
      // 키워드 검색은 subject나 content 중 하나만 사용
      queryParams.keyword = params.keyword; // 키워드 검색
    }

    const response = await api.get(`/help/list`, { params: queryParams });
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
    // 요청 데이터 형식 변환 - helpService.upsertReply에서 필요한 필드만 전송
    const requestData = {
      helpId: Number(data.helpId),
      adminId: Number(data.userId),
      reply: data.reply
    };

    console.log('답변 등록 요청 데이터:', requestData);
    const response = await api.post(`/help/reply`, requestData);
    console.log('답변 등록 응답:', response);

    if (response.status === 200) {
      // 답변이 성공적으로 등록되었으므로 상태를 '답변완료'로 변경
      try {
        // 먼저 현재 문의 정보를 가져옴
        const inquiry = await getInquiryDetail(data.helpId);

        // 기존 데이터를 유지하면서 상태만 변경
        const updateData = {
          id: Number(data.helpId),
          userId: inquiry.userId,
          subject: inquiry.subject,
          content: inquiry.content,
          statusCd: 'HELP_ST_2', // 답변완료 상태
          typeCd: inquiry.typeCd,
          email: inquiry.email
        };

        await api.post(`/help`, updateData);
      } catch (statusError) {
        console.warn('상태 변경 실패:', statusError);
      }

      return response.data;
    } else {
      throw new Error(response.data?.message || '답변 등록에 실패했습니다.');
    }
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

/**
 * 문의하기 등록
 * @param {Object} data - 문의 데이터
 * @returns {Promise} - API 응답
 */
export const createInquiry = async (data) => {
  try {
    // 요청 데이터 형식 변환
    const requestData = {
      typeCd: data.category?.value || '', // Proxy 객체에서 value 값 추출
      subject: data.title || '',
      content: data.content || '',
      email: data.email || '',
      status: 'WAIT', // 문의 상태: 대기중
      useYn: 'Y' // 사용 여부
    };

    console.log('문의하기 요청 데이터:', requestData);
    const response = await api.post('/help', requestData);
    console.log('문의하기 응답:', response);

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(response.data?.message || '문의하기 등록에 실패했습니다.');
    }
  } catch (error) {
    console.error('문의하기 등록 실패:', error);
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
  deleteReply,
  createInquiry
};
