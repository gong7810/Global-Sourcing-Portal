import { useApi } from '@/apis/index'

const api = useApi();

export const test = async () => {
  try {
    const response = await api.get('/v1/st/user/apis')
    console.log(response)
  } catch (error) {
    console.error(error)
  }
}
