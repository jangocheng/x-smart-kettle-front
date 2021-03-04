<template>
  <xtl-page hasExtend hasBottom>
        <div slot="extend">
            <Button type="default" @click="pageGoBack">返回</Button>
        </div>
        <Row>
            <Col span="12" offset="6">
            <Form ref="form" :model="form" :label-width="120" :rules="ruleValidate">
              <FormItem label="源转换名称"  prop="transName">
                <Input v-model="form.transName" readonly  placeholder="请输入转换名称"  style="width:300px"></Input>
              </FormItem>
              <FormItem label="目标转换名称"   prop="transName">
                <Input v-model="form.newName"  placeholder="请输入目标转换名称"  style="width:300px"></Input>
              </FormItem>

              <FormItem label="目标资源库"   prop="transRepositoryId">
                <Select v-model="form.transRepositoryId" transfer :multiple="false" style="width: 200px;">
                  <Option value="">请选择</Option>
                  <Option v-for="item in transRepositories" :value="item.repoId" :key="item.repoId">
                    {{item.repoName }}
                  </Option>
                </Select>
               </FormItem>
              <FormItem label="目标转换描述" prop="transDescription">
                <Input v-model="form.transDescription" placeholder="请输入转换描述" style="width:300px"></Input>
              </FormItem>
              <FormItem label="目标转换类型" prop="transType">
                <Input v-model="form.transType" readonly  style="width:300px"></Input>
              </FormItem>
              <FormItem  label="目标转换路径" prop="transPath">
                <Input v-model="form.transPath"    style="width:300px"></Input>
              </FormItem>
              <FormItem label="日志级别" prop="transLogLevel">
                <Select v-model="form.transLogLevel" transfer :multiple="false" style="width: 200px;">
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
              transRepositories:[],
                form: {
                  id:'',
                  transId:'',
                  transName:'',
                  copyNum:1,
                  newName:'',
                  transDescription:'',
                  transType:'',
                  transPath:'',
                  transRepositoryId:'',
                  transLogLevel:null,
                  isDel:0,
                  isMonitorEnabled:false
                },
                systemList: [],
                ruleValidate: {
                    newName: [
                        {required: true, message: '转换名称不能为空', trigger: 'blur'}
                    ],
                  transPath: [
                    {required: true, message: '转换路径不能为空', trigger: 'blur'}
                  ],
                  transRepositoryId: [
                    {required: true, message: '请选择目标资源库', trigger: 'blur'}
                  ],
                  transPath: [
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
            transId: function () {
                return this.$route.query.transId
            }
        },
        methods: {

            formSubmit: function () {

                var self = this
              self.loading=true
                self.$refs.form.validate(valid => {
                    if (valid) {

                        var params = {
                          transId:self.form.transId,//源转换id
                          newName:self.form.newName,//目标转换名称
                          copyNum:self.form.copyNum,//复制数量
                          transDescription: self.form.transDescription,
                          transType:self.form.transType,
                          transPath:self.form.transPath,
                          transRepositoryId:self.form.transRepositoryId,//目标资源库
                          transLogLevel: self.form.transLogLevel,
                          isDel: self.form.isDel,
                          isMonitorEnabled: self.form.isMonitorEnabled
                        }

                        if(self.form.copyNum > 1 ){
                          self.$Message.warning('复制数量超过1个,目标转换名称将会按照顺序号编排！')
                        }
                         self.$Message.loading({
                           content:"正在复制,请稍后....",
                           duration:0
                         });
                            util.ajax
                                .post(config.xtlServerContext + '/op/xtrans/copy', params)
                                .then(function (resp) {
                                  let data = resp.data;
                                  if(data.code === 11000){
                                    self.$Message.success('转换复制成功')
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
                                    self.$Message.error('转换复制失败,异常信息'+err)
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
              if (self.transId) {
                util.ajax.get(config.xtlServerContext + '/op/xtrans/get' , {
                  params:{
                    transId:self.transId
                  }
                }).then(function (resp) {
                  var result = resp.data.data
                    self.form.id=result.id
                     self.form.transId=result.transId
                    self.form.transName=result.transName
                  self.form.newName=result.transName+"_copy"
                     self.form.transDescription=result.transDescription
                    self.form.transType=result.transType
                    self.form.transPath=result.transPath
                    self.form.transRepositoryId=result.transRepositoryId
                     self.form.transLogLevel=result.transLogLevel
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

              util.ajax.get(config.xtlServerContext+"/op/xrepository/listPage?limit=1000&offset=0").then(function(resp) {
                self.transRepositories = resp.data.data.rows;
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
