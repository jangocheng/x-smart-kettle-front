import axios from '@/libs/api.request'

export const getPermission = () => {

  return axios.request({
    url: '/manage/menu/getAllPermission',
    method: 'get'
  })

}

