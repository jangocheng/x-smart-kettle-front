<template>
  <xtl-page hasExtend hasBottom>
        <div slot="extend">
            <Button type="default" @click="pageGoBack">返回</Button>
        </div>
        <Row>
            <Col span="12" offset="6">
            <Form ref="form" :model="form" :label-width="80" :rules="ruleValidate">
                <FormItem v-if="!transId" label="选择转换" prop="transName">
              <Input v-model="form.transName" placeholder="请选择转换" icon="md-apps" style="width:300px"
                     @on-focus="handleCom" @on-click="handleCom"></Input>
            </FormItem>
              <FormItem label="转换名称" v-else  prop="transName">
                <Input v-model="form.transName"  placeholder="请输入转换名称"  style="width:300px"></Input>
              </FormItem>
              <FormItem label="转换描述" prop="transDescription">
                <Input v-model="form.transDescription" placeholder="请输入转换描述" style="width:300px"></Input>
              </FormItem>
              <FormItem label="转换类型" prop="transType">
                <Input v-model="form.transType" readonly  style="width:300px"></Input>
              </FormItem>
              <FormItem v-if="!transId" label="转换路径" prop="transPath">
                <Input v-model="form.transPath"   readonly  style="width:300px"></Input>
              </FormItem>
              <FormItem v-else label="转换路径" prop="transPath">
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
          <Button type="primary" @click="formSubmit" :loading="loading">保存</Button>
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
              loading:false ,
              logLevelDicts:[],
                form: {
                  id:'',
                  transId:'',
                  transName:'',
                  transDescription:'',
                  transType:'',
                  transPath:'',
                  transRepositoryId:'',
                  transLogLevel:'',
                  isDel:0,
                  isMonitorEnabled:false
                },
                systemList: [],
                ruleValidate: {
                    transName: [
                        {required: true, message: '转换名称不能为空', trigger: 'blur'}
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

            handleCom() {
                this.repoModal = true
            },
            onrepoModalOk(node) {
              this.repoModal = false
               if(node !=null ){
                this.form.transId = node.id
                this.form.transName=node.title
                let type=node.repo ;
                if(type && type.indexOf("@")){
                  this.form.transType=type.split('@')[1]
                  this.form.transRepositoryId=type.split('@')[0]
                }
                this.form.transPath=node.path

              }

            },
            onrepoModalCancel() {
                this.repoModal = false
            },
            formSubmit: function () {
                var self = this

                self.$refs.form.validate(valid => {
                    if (valid) {
                      self.loading=true
                        var params = {
                          id:self.form.id,
                          transId:self.form.transId,
                          transName:self.form.transName,
                          transDescription: self.form.transDescription,
                          transType:self.form.transType,
                          transPath:self.form.transPath,
                          transRepositoryId:self.form.transRepositoryId,
                          transLogLevel: self.form.transLogLevel,
                          isDel: self.form.isDel,
                          isMonitorEnabled: self.form.isMonitorEnabled
                        }
                        if (self.transId) {
                            util.ajax
                                .post(
                                    config.xtlServerContext + '/op/xtrans/update' ,
                                    params
                                )
                                .then(function (resp) {
                                    self.$Message.success('转换更新成功')
                                  self.loading=false
                                    self.pageGoBack();
                                })
                                .catch(function (err) {
                                  self.loading=false
                                  self.$Message.error('转换更新失败,请联系角色管理员')
                                })
                        } else {
                            util.ajax
                                .post(config.xtlServerContext + '/op/xtrans/add', params)
                                .then(function (resp) {
                                  let data = resp.data;
                                  if(data.code === 11001){
                                    self.loading=false
                                    self.$Message.warning('转换'+self.form.transName+'已经存在,请重新选择!')
                                    return ;
                                  }
                                    self.$Message.success('新增转换成功')
                                    self.created = true
                                  self.loading=false
                                    self.pageGoBack();
                                })
                                .catch(function (err) {
                                  self.loading=false
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
            }
        },
        mounted: function () {
            this.initData()
        }
    }
</script>

<style>
</style>
