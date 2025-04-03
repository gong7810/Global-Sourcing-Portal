import { useApi } from '@/apis/index'

const api = useApi();

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

// FAQ 저장 (추가/수정)
export const saveFaq = async (faqData) => {
  try {
    const response = await api.post('/faq', faqData)
    return response.data
  } catch (error) {
    console.error('FAQ 저장 실패:', error)
    throw error
  }
}

// FAQ 삭제
export const deleteFaq = async (id) => {
  try {
    const response = await api.delete(`/faq/${id}`)
    return response.data
  } catch (error) {
    console.error('FAQ 삭제 실패:', error)
    throw error
  }
}

// 기존 test 함수는 유지
export const test = async () => {
  try {
    const response = await api.get('/v1/st/user/apis')
    console.log(response)
  } catch (error) {
    console.error(error)
  }
}
