import { useApi } from '@/apis/index'

const api = useApi();

// 파일 업로드
export const fileUpload = async (body) => {
  try {
    const response = await api.post('/file/upload', body)
    
    return response.data
  } catch (error) {
    console.error(error);
  }
}
