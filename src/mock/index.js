import Mock from 'mockjs'
import { verification,login, logout, getUserInfo } from './login'
import { getTableData, getDragList, uploadImage, getOrgData, getPermissionData } from './data'
import {getVersion,getThirdToken,verifyToken, getMessageInit, getContentByMsgId, hasRead,
  removeReaded, restoreTrash, messageCount } from './user'

// 配置Ajax请求延时，可用来测试网络延迟大时项目中一些效果
Mock.setup({
  timeout: 1000
})

// 登录相关和获取用户信息
Mock.mock(/\/getVersion/,getVersion)
 Mock.mock(/\/manage\/user\/verifyThirdToken/,verifyToken)
Mock.mock(/\/manage\/user\/getThirdToken/,getThirdToken)
Mock.mock(/\/verification/,verification)
Mock.mock(/\/sso\/login/, login)
Mock.mock(/\/manage\/user\/getCurrentInfo/, getUserInfo)
Mock.mock(/\/sso\/logout/, logout)
Mock.mock(/\/get_table_data/, getTableData)
Mock.mock(/\/get_drag_list/, getDragList)
Mock.mock(/\/save_error_logger/, 'success')
Mock.mock(/\/image\/upload/, uploadImage)
Mock.mock(/\/message\/init/, getMessageInit)
Mock.mock(/\/message\/content/, getContentByMsgId)
Mock.mock(/\/message\/has_read/, hasRead)
Mock.mock(/\/message\/remove_readed/, removeReaded)
Mock.mock(/\/message\/restore/, restoreTrash)
Mock.mock(/\/message\/count/, messageCount)
Mock.mock(/\/get_org_data/, getOrgData)
Mock.mock(/\/manage\/menu\/getAllPermission/, getPermissionData)

export default Mock
