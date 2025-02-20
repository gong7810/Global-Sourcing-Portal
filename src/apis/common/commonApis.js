import api from '@/apis/index'

export const test = async () => {
  try {
    const response = await api.get('/v1/st/user/apis')
    console.log(response)
  } catch (error) {
    console.error(error)
  }
}
