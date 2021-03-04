import { getParams } from '@/libs/platformUtil'
const USER_MAP = {
  superadmin: {
    userName: 'superadmin',
    user_id: '1',
    access: ['superadmin', 'admin'],
    token: 'superadmin',
    avatar: 'admin-header.png'
  },
  admin: {
    userName: 'admin',
    user_id: '2',
    access: ['admin'],
    token: 'admin',
    avatar: 'superadmin-header.png'
  }
}

export const login = req => {
  req = getParams(req.body)
   return { code:1,data: USER_MAP[req.userName],msg: '登录成功' }
}

export const verification = req => {
   return {src:Math.round(Math.random()*2)+1} ; //随机生成1-3的整数
}

export const getUserInfo = req => {
   const params = getParams(req.url)
   return {code:1,msg:'success',data:USER_MAP[params.token]}
}

export const logout = req => {
  return {status : -1}
}
