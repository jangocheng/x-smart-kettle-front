<template>
  <xtl-page hasExtend hasBottom>
        <div slot="extend">
            <Button type="default" @click="pageGoBack">返回</Button>
        </div>
        <Row>
            <Col span="12" offset="6">
            <Form ref="form" :model="form" :label-width="80" :rules="ruleValidate">
                <FormItem v-if="!jobId" label="选择转换" prop="jobName">
              <Input v-model="form.jobName" placeholder="请选择转换" icon="md-apps" style="width:300px"
                     @on-focus="handleCom" @on-click="handleCom"></Input>
            </FormItem>
              <FormItem label="转换名称" v-else  prop="jobName">
                <Input v-model="form.jobName"  placeholder="请输入转换名称"  style="width:300px"></Input>
              </FormItem>
              <FormItem label="转换描述" prop="jobDescription">
                <Input v-model="form.jobDescription" placeholder="请输入转换描述" style="width:300px"></Input>
              </FormItem>
              <FormItem label="转换类型" prop="jobType">
                <Input v-model="form.jobType" readonly  style="width:300px"></Input>
              </FormItem>
              <FormItem v-if="!jobId" label="转换路径" prop="jobPath">
                <Input v-model="form.jobPath"   readonly  style="width:300px"></Input>
              </FormItem>
              <FormItem v-else label="转换路径" prop="jobPath">
                <Input v-model="form.jobPath"    style="width:300px"></Input>
              </FormItem>
              <FormItem label="日志级别" prop="jobLogLevel">
                <Select v-model="form.jobLogLevel" transfer :multiple="false" style="width: 200px;">
                  <Option value="">请选择</Option>
                  <Option v-for="item in logLevelDicts" :value="item.dictKey" :key="item.dictKey">
                    {{item.dictValue }}
                  </Option>
                </Select>
               </FormItem>
              <FormItem label="有效性" prop="isDel">
                <RadioGroup v-model="form.isDel" >
                  <Radio :label= 0 >有效</Radio>
                   <Radio :label= 1>无效</Radio>
                </RadioGroup>
               </FormItem>
              <FormItem label="日志监控" prop="isMonitorEnabled">
                <i-switch size="large" v-model="form.isMonitorEnabled"
                        true-olor='#13ce66'   false-color='#646449' >
                  <span slot="open">开启</span>
                  <span slot="close">关闭</span>
                </i-switch>
              </FormItem>
            </Form>
            </Col>
        </Row>
        <div slot="bottom">
          <Button type="primary" @click="formSubmit">保存</Button>
          <Button type="default" @click="formReset">重置</Button>
        </div>
        <repo-modal :repoModal="repoModal" @on-ok="onrepoModalOk" @on-cancel="onrepoModalCancel"></repo-modal>
  </xtl-page>
</template>

<script>
    import util from '@/libs/util.js'
    import config from '@/config/config'
    import repoModal from './repo-modal'

    export default {
        components: {
            repoModal
        },
        data() {
            let self = this
            return {
                repoModal: false,
              logLevelDicts:[],
                form: {
                  id:'',
                  jobId:'',
                  jobName:'',
                  jobDescription:'',
                  jobType:'',
                  jobPath:'',
                  jobRepositoryId:'',
                  jobLogLevel:'',
                  isDel:0,
                  isMonitorEnabled:false
                },
                systemList: [],
                ruleValidate: {
                    jobName: [
                        {required: true, message: '转换名称不能为空', trigger: 'blur'}
                    ],
                  jobPath: [
                    {required: true, message: '转换路径不能为空', trigger: 'blur'}
                  ]

                },
                created: false
            }
        },
        computed: {
            jobId: function () {
                return this.$route.query.jobId
            }
        },
        methods: {

            handleCom() {
                this.repoModal = true
            },
            onrepoModalOk(node) {
              this.repoModal = false
               if(node !=null ){
                this.form.jobId = node.id
                this.form.jobName=node.title
                let type=node.repo ;
                if(type && type.indexOf("@")){
                  this.form.jobType=type.split('@')[1]
                  this.form.jobRepositoryId=type.split('@')[0]
                }
                this.form.jobPath=node.path

              }

            },
            onrepoModalCancel() {
                this.repoModal = false
            },
            formSubmit: function () {
                var self = this
                self.$refs.form.validate(valid => {
                    if (valid) {
                        var params = {
                          id:self.form.id,
                          jobId:self.form.jobId,
                          jobName:self.form.jobName,
                          jobDescription: self.form.jobDescription,
                          jobType:self.form.jobType,
                          jobPath:self.form.jobPath,
                          jobRepositoryId:self.form.jobRepositoryId,
                          jobLogLevel: self.form.jobLogLevel,
                          isDel: self.form.isDel,
                          isMonitorEnabled: self.form.isMonitorEnabled
                        }
                        if (self.jobId) {
                            util.ajax
                                .post(
                                    config.xtlServerContext + '/op/xjob/update' ,
                                    params
                                )
                                .then(function (resp) {
                                    self.$Message.success('转换更新成功')
                                    self.pageGoBack();
                                })
                                .catch(function (err) {
                                    self.$Message.error('转换更新失败,请联系角色管理员')
                                })
                        } else {
                            util.ajax
                                .post(config.xtlServerContext + '/op/xjob/add', params)
                                .then(function (resp) {
                                  let data = resp.data;
                                  if(data.code === 11001){
                                    self.$Message.warning('转换'+self.form.jobName+'已经存在,请重新选择!')
                                    return ;
                                  }
                                    self.$Message.success('新增转换成功')
                                    self.created = true
                                    self.pageGoBack();
                                })
                                .catch(function (err) {
                                    self.$Message.error('新增转换失败,请联系角色管理员')
                                })
                        }
                    }
                })
            },
            pageGoBack: function () {
                this.$router.go(-1)
            },
            formReset: function () {
                this.$refs.form.resetFields()
            },
            initData: function () {
              let self = this;
              if (self.jobId) {
                util.ajax.get(config.xtlServerContext + '/op/xjob/get' , {
                  params:{
                    jobId:self.jobId
                  }
                }).then(function (resp) {
                  var result = resp.data.data
                    self.form.id=result.id
                     self.form.jobId=result.jobId
                    self.form.jobName=result.jobName
                     self.form.jobDescription=result.jobDescription
                    self.form.jobType=result.jobType
                    self.form.jobPath=result.jobPath
                    self.form.jobRepositoryId=result.jobRepositoryId
                     self.form.jobLogLevel=result.jobLogLevel
                     let isDel =result.isDel
                  if(isDel =='null' || isDel=='' || isDel=='0'){
                    self.form.isDel = 0
                  }else
                  {
                    self.form.isDel=1
                  }
                    let isMonitorEnabled =result.isMonitorEnabled
                    if(isMonitorEnabled =='1'){
                      self.form.isMonitorEnabled=true
                    }else {
                      self.form.isMonitorEnabled=false
                    }
                }).catch((err) => {
                  this.$Message.error("获取转换基本信息异常,错误信息:" + err);
                })
              }

              util.ajax.get(config.xtlServerContext+"/api/xrepo/getLogLevelDicts").then(function(resp) {
                self.logLevelDicts = resp.data.data;
              }).catch((err) => {
                this.$Message.error("获取日志级别字典错误,错误信息:" + err);
              })
            }
        },
        mounted: function () {
            this.initData()
        }
    }
</script>

<style>
</style>
