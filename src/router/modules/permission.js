import IframeView from '@/components/iframe-view'
import config from '@/config/config'
export default {
  '资源库管理': {
     url: '/xtl/repo',
    component: 'repo/tree'
  },

  '业务数据库': {
    url: '/xtl/business/db',
    component: 'business/db'
  },
  '业务库编辑': {
    url: '/xtl/business/db/edit',
    component: 'business/db_edit'
  },

  '业务字典': {
    url: '/xtl/business/dict',
    component: 'business/dict'
  },

  '业务字典编辑': {
    url: '/xtl/business/dict/edit',
    component: 'business/dict_edit'
  },

  '作业调度': {
    url: '/xtl/task/job',
    component: 'job/index'
  },

  '新增作业': {
    url: '/xtl/task/job/add',
    component: 'job/edit',
    notCache:true
  },

  '创建作业': {
    url: '/xtl/task/job/create',
    component: 'job/create',
    notCache:true
  },

  '编辑作业': {
    url: '/xtl/task/job/edit',
    component: 'job/edit',
    notCache:true
  },
  '复制作业': {
    url: '/xtl/task/job/copy',
    component: 'job/copy',
    notCache:true
  },
  '作业详情': {
    url: '/xtl/task/job/detail',
    component: 'job/detail',
    notCache:true
  },
  '作业参数': {
    url: '/xtl/task/job/params',
    component: 'job/params',
    notCache:true
  },
  '转换参数': {
    url: '/xtl/task/trans/params',
    component: 'trans/params',
    notCache:true
  },
  '新增转换': {
    url: '/xtl/task/trans/add',
    component: 'trans/edit',
    notCache:true
  },
  '编辑转换': {
    url: '/xtl/task/trans/edit',
    component: 'trans/edit',
    notCache:true
  },
  '复制转换': {
    url: '/xtl/task/trans/copy',
    component: 'trans/copy',
    notCache:true
  },

  '转换调度': {

    url: '/xtl/task/trans',
    component: 'trans/index'
  },

  '作业定时': {

    url: '/xtl/job/run',
    component: 'task/job-run'
  },

  '转换定时': {

    url: '/xtl/trans/run',
    component: 'task/trans-run'
  },

  '定时管理': {
    url: '/xtl/scheduler',
    component: 'scheduler/index'
  },



  '日志管理': {

    url: '/xtl/log',
    component: 'log/index'
  },

  '数据库监控': {

    url: '/xtl/help/db',
    frameUrl:config.xtlServerContext+'/drd/sql.html',
    component: IframeView
  },
  '定时正则': {

    url: '/xtl/help/cron',
    frameUrl:'/cron/index.htm',
    component: IframeView
  },
  '在线JSON': {
    url: '/xtl/help/json',
    frameUrl:'/json/index.htm',
    component: IframeView
  },
  '告警监控': {

    url: '/xtl/warning',
    component: 'warning/index'
  },


}
