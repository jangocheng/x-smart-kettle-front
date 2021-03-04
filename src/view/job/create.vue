<template>
  <xtl-page hasExtend hasBottom>
    <div slot="extend">
      <Button type="default" @click="pageGoBack">返回</Button>
    </div>
    <Row>
      <Col span="12" offset="6">
        <Form ref="form" :model="form" :label-width="120" :rules="ruleValidate">
          <FormItem label="作业名称" prop="jobName">
            <Input v-model="form.jobName" placeholder="请输入作业名称" style="width:300px"></Input>
          </FormItem>
          <FormItem label="作业描述" prop="jobDescription">
            <Input v-model="form.jobDescription" placeholder="请输入作业描述" style="width:300px"></Input>
          </FormItem>
          <FormItem label="选择模板" prop="jobTpl">
            <Select v-model="form.jobTpl" transfer :multiple="false" style="width: 200px;" @on-change="selectChange">
              <Option value="">请选择</Option>
              <Option v-for="item in templateEnum" :value="item.templateKey" :key="item.templateKey">
                {{item.templateName}}
              </Option>
            </Select>
            <Button type='dashed' icon="ios-cash" @click="goPreview">预览</Button>
          </FormItem>
          <FormItem v-if="js_show" label="JS代码" prop="content">
            <Input v-model="form.content" type="textarea" :rows="4"
                   style="overflow-y:scroll" placeholder="请输入JS代码..."/>
          </FormItem>
          <FormItem v-if="sql_show" label="业务库" prop="database">
            <Select v-model="form.database" transfer :multiple="false" style="width: 200px;"  >
              <Option value="">请选择</Option>
              <Option v-for="item in databaseEnum" :value="item.name" :key="item.name">
                {{item.name}}
              </Option>
            </Select>
          </FormItem>
          <FormItem v-if="sql_show" label="SQL脚本" prop="content">
            <Input v-model="form.content" type="textarea" :rows="4"
                   style="overflow-y:scroll" placeholder="请输入可执行SQL脚本"/>
          </FormItem>

          <FormItem v-if="shell_show" label="SHELL脚本" prop="content">
            <Input v-model="form.content" type="textarea" :rows="4"
                   style="overflow-y:scroll" placeholder="请输入SHELL脚本..."/>
          </FormItem>
          <FormItem label="作业路径" prop="jobPath">
            <Input   v-model="form.jobPath" style="width:300px"></Input>
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
            <RadioGroup v-model="form.isDel">
              <Radio :label=0>有效</Radio>
              <Radio :label=1>无效</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="日志监控" prop="isMonitorEnabled">
            <i-switch size="large" v-model="form.isMonitorEnabled"
                      true-color='#13ce66' false-color='#646449'>
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
    <preview-modal :imgModal="imgModal" :tplKey="form.jobTpl"
                   @on-ok="onrepoModalOk" @on-cancel="onrepoModalCancel"></preview-modal>
  </xtl-page>
</template>

<script>
  import util from '@/libs/util.js'
  import config from '@/config/config'
  import previewModal from './preview-modal'

  export default {
    components: {
      previewModal
    },
    data () {
      let self = this
      return {
        js_show: false,
        sql_show: false,
        shell_show: false,
        repoModal: false,
        imgModal: false,
        logLevelDicts: [],
        templateEnum: [],
        databaseEnum: [],
        form: {
          id: '',
          jobId: '',
          jobName: '',
          jobDescription: '',
          jobType: '',
          jobPath: '',
          jobRepositoryId: '',
          jobLogLevel: '',
          isDel: 0,
          isMonitorEnabled: false,
          jobTpl: '',
          content:'',
          database:''
        },
        systemList: [],
        ruleValidate: {
          jobName: [
            { required: true, message: '作业名称不能为空', trigger: 'blur' }
          ],
          jobTpl: [
            { required: true, message: '必须选择模板', trigger: 'blur' }
          ],
          database: [
            { required: true, message: '必须选择业务库', trigger: 'blur' }
          ],
          content: [
            { required: true, message: '内容不能为空', trigger: 'blur' }
          ],
          jobPath: [
            { required: true, message: '作业路径不能为空', trigger: 'blur' },
            {
              validator: (rule, value, callback) => {
                if (value == null || value == '') {
                  callback(new Error('路径不能为空!'))
                } else if (!/[\/]{1}.*/.test(value)) {
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

      goPreview () {
        let self = this
        if (self.form.jobTpl) {
          self.imgModal = true
        } else {
          self.$Message.warning('请选择模板!')
        }
      },

      selectChange () {
        let self = this
        if (self.form.jobTpl == 'javascriptTpl') {
          self.js_show = true
          self.sql_show = false
          self.shell_show = false
        } else if (self.form.jobTpl == 'shellTpl') {
          self.js_show = false
          self.sql_show = false
          self.shell_show = true
        } else if (self.form.jobTpl == 'sqlTpl') {
          self.js_show = false
          self.sql_show = true
          self.shell_show = false
        } else {
          self.js_show = false
          self.sql_show = false
          self.shell_show = false
        }
      },
      onrepoModalOk (node) {
        this.imgModal = false
      },
      onrepoModalCancel () {
        this.imgModal = false
      },
      formSubmit: function () {
        var self = this
        self.$refs.form.validate(valid => {
          if (valid) {
            var params = {
              jobName: self.form.jobName,
              jobDescription: self.form.jobDescription,
              jobPath: self.form.jobPath,
              jobLogLevel: self.form.jobLogLevel,
              isDel: self.form.isDel,
              isMonitorEnabled: self.form.isMonitorEnabled,
              tplKey: self.form.jobTpl,
              content:self.form.content,
              database:self.form.database
            }
            if (self.jobId) {
              util.ajax
                .post(
                  config.xtlServerContext + '/op/xjob/update',
                  params
                )
                .then(function (resp) {
                  self.$Message.success('作业更新成功')
                  self.pageGoBack()
                })
                .catch(function (err) {
                  self.$Message.error('作业更新失败,请联系角色管理员')
                })
            } else {
              util.ajax
                .post(config.xtlServerContext + '/op/xjob/addJobByTpl', params)
                .then(function (resp) {
                  let data = resp.data
                  if (data.code === 11001) {
                    self.$Message.warning('作业' + self.form.jobName + '已经存在,请重新选择!')
                    return
                  }
                  self.$Message.success('新增作业成功')
                  self.created = true
                  self.pageGoBack()
                })
                .catch(function (err) {
                  self.$Message.error('新增作业失败,请联系角色管理员')
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
        let self = this
        if (self.jobId) {
          util.ajax.get(config.xtlServerContext + '/op/xjob/get', {
            params: {
              jobId: self.jobId
            }
          }).then(function (resp) {
            var result = resp.data.data
            self.form.id = result.id
            self.form.jobId = result.jobId
            self.form.jobName = result.jobName
            self.form.jobDescription = result.jobDescription
            self.form.jobType = result.jobType
            self.form.jobPath = result.jobPath
            self.form.jobRepositoryId = result.jobRepositoryId
            self.form.jobLogLevel = result.jobLogLevel
            self.form.tplKey = result.tplKey
            let isDel = result.isDel
            if (isDel == 'null' || isDel == '' || isDel == '0') {
              self.form.isDel = 0
            } else {
              self.form.isDel = 1
            }
            let isMonitorEnabled = result.isMonitorEnabled
            if (isMonitorEnabled == '1') {
              self.form.isMonitorEnabled = true
            } else {
              self.form.isMonitorEnabled = false
            }
          }).catch((err) => {
            this.$Message.error('获取作业基本信息异常,错误信息:' + err)
          })
        }

        util.ajax.get(config.xtlServerContext + '/op/xtemplate/listPage?limit=1000&offset=0').then(function (resp) {
          self.templateEnum = resp.data.data.rows
        }).catch((err) => {
          this.$Message.error('获取作业模板错误,错误信息:' + err)
        })
        util.ajax.get(config.xtlServerContext + '/op/xdatabase/listPage?limit=1000&offset=0').then(function (resp) {
          self.databaseEnum = resp.data.data.rows
        }).catch((err) => {
          this.$Message.error('获取业务数据库,错误信息:' + err)
        })
        util.ajax.get(config.xtlServerContext + '/api/xrepo/getLogLevelDicts').then(function (resp) {
          self.logLevelDicts = resp.data.data
        }).catch((err) => {
          this.$Message.error('获取日志级别字典错误,错误信息:' + err)
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
