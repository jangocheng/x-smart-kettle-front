import axios from '@/libs/api.request'

/**
 * 获取验证码
 */
export const   getVerifyImage = ({param}) => {
  return axios.request({
    url: '/verification',
    method: 'get',
    params: param
  })
}


export const login = ({userName, password}) => {
  const data = {
    userName,
    password
  }
  return axios.request({
    url:  '/sso/login',
    data,
    method: 'post'
  })
}

export const verifyToken = (token) => {
  const params = {
    token,
  }
  return axios.request({
    url:  '/manage/user/verifyThirdToken',
    params,
    method: 'get'
  })
}

export const getUserInfo = () => {
  return axios.request({
    url:  '/manage/user/getCurrentInfo',
    method: 'get'
  })
}

export const getThirdToken = () => {
  return axios.request({
    url:  '/manage/user/getThirdToken',
    method: 'get'
  })
}

export const logout = () => {
  return axios.request({
    url:  '/sso/logout',
    method: 'get'
  })
}

