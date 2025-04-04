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

export default {
  getFaqList
} 