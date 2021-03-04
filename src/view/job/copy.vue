<template>
  <xtl-page hasExtend hasBottom>
        <div slot="extend">
            <Button type="default" @click="pageGoBack">返回</Button>
        </div>
        <Row>
            <Col span="12" offset="6">
            <Form ref="form" :model="form" :label-width="120" :rules="ruleValidate">
              <FormItem label="源作业名称"  prop="jobName">
                <Input v-model="form.jobName" readonly  placeholder="请输入作业名称"  style="width:300px"></Input>
              </FormItem>
              <FormItem label="目标作业名称"   prop="jobName">
                <Input v-model="form.newName"  placeholder="请输入目标作业名称"  style="width:300px"></Input>
              </FormItem>
              <FormItem label="复制数量"   prop="copyNum">
                <InputNumber v-model="form.copyNum" :editable="false" :min=1  :max=10 size="large"></InputNumber>
              </FormItem>
              <FormItem label="目标资源库"   prop="jobRepositoryId">
                <Select v-model="form.jobRepositoryId" transfer :multiple="false" style="width: 200px;">
                  <Option value="">请选择</Option>
                  <Option v-for="item in jobRepositories" :value="item.repoId" :key="item.repoId">
                    {{item.repoName }}
                  </Option>
                </Select>
               </FormItem>
              <FormItem label="目标作业描述" prop="jobDescription">
                <Input v-model="form.jobDescription" placeholder="请输入作业描述" style="width:300px"></Input>
              </FormItem>
              <FormItem label="目标作业类型" prop="jobType">
                <Input v-model="form.jobType" readonly  style="width:300px"></Input>
              </FormItem>
              <FormItem  label="目标作业路径" prop="jobPath">
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
                        true-color='#13ce66'   false-color='#646449' >
                  <span slot="open">开启</span>
                  <span slot="close">关闭</span>
                </i-switch>
              </FormItem>
            </Form>
            </Col>
        </Row>
        <div slot="bottom">
          <Button type="primary" @click="formSubmit" :loading="loading"  >保存</Button>
          <Button type="default" @click="formReset">重置</Button>
        </div>
   </xtl-page>
</template>

<script>
    import util from '@/libs/util.js'
    import config from '@/config/config'

    export default {
        components: {
         },
        data() {
            let self = this
            return {
                repoModal: false,
              loading:false,
              logLevelDicts:[],
              jobRepositories:[],
                form: {
                  id:'',
                  jobId:'',
                  jobName:'',
                  copyNum:1,
                  newName:'',
                  jobDescription:'',
                  jobType:'',
                  jobPath:'',
                  jobRepositoryId:'',
                  jobLogLevel:null,
                  isDel:0,
                  isMonitorEnabled:false
                },
                systemList: [],
                ruleValidate: {
                    newName: [
                        {required: true, message: '作业名称不能为空', trigger: 'blur'}
                    ],
                  jobPath: [
                    {required: true, message: '作业路径不能为空', trigger: 'blur'}
                  ],
                  jobRepositoryId: [
                    {required: true, message: '请选择目标资源库', trigger: 'blur'}
                  ],
                  jobPath: [
                    {required: true, message: '请输入路径', trigger: 'blur'},
                    {
                      validator: (rule, value, callback) => {
                        if (value == null || value == '') {
                          callback(new Error('路径不能为空!'))
                        } else if (!/[\/]{1}.*/.test(value)){
                          callback(new Error('路径必须/开头!'))
                        } else {
                          callback()
                        }
                      },
                      trigger: 'blur'
                    }
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

            formSubmit: function () {

                var self = this
              self.loading=true
                self.$refs.form.validate(valid => {
                    if (valid) {

                        var params = {
                          jobId:self.form.jobId,//源作业id
                          newName:self.form.newName,//目标作业名称
                          copyNum:self.form.copyNum,//复制数量
                          jobDescription: self.form.jobDescription,
                          jobType:self.form.jobType,
                          jobPath:self.form.jobPath,
                          jobRepositoryId:self.form.jobRepositoryId,//目标资源库
                          jobLogLevel: self.form.jobLogLevel,
                          isDel: self.form.isDel,
                          isMonitorEnabled: self.form.isMonitorEnabled
                        }

                        if(self.form.copyNum > 1 ){
                          self.$Message.warning('复制数量超过1个,目标作业名称将会按照顺序号编排！')
                        }
                         self.$Message.loading({
                           content:"正在复制,请稍后....",
                           duration:0
                         });
                            util.ajax
                                .post(config.xtlServerContext + '/op/xjob/copy', params)
                                .then(function (resp) {
                                  let data = resp.data;
                                  if(data.code === 11000){
                                    self.$Message.success('作业复制成功')
                                    self.created = true
                                    self.loading=false
                                    self.$Message.destroy()
                                    self.pageGoBack();

                                  }else {
                                    self.$Message.error(data.message)
                                    self.$Message.destroy()
                                    self.pageGoBack();
                                  }

                                })
                                .catch(function (err) {
                                    self.$Message.error('作业复制失败,异常信息'+err)
                                  self.loading=false
                                  self.$Message.destroy()
                                  self.pageGoBack();
                                })

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
                  self.form.newName=result.jobName+"_copy"
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
                  this.$Message.error("获取作业基本信息异常,错误信息:" + err);
                })
              }

              util.ajax.get(config.xtlServerContext+"/api/xrepo/getLogLevelDicts").then(function(resp) {
                self.logLevelDicts = resp.data.data;
              }).catch((err) => {
                this.$Message.error("获取日志级别字典错误,错误信息:" + err);
              })

              util.ajax.get(config.xtlServerContext+"/op/xrepository/listPage?limit=1000&offset=0").then(function(resp) {
                self.jobRepositories = resp.data.data.rows;
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
