<template>
  <div>
  <xtl-page hasExtend hasBottom>
    <div slot="extend">
      <Button type="default" @click="goBack">返回</Button>
    </div>
    <Form ref="form" :model="form" :label-width="200" :rules="ruleValidate">
      <Row>
        <Col span="12" offset="4">
          <FormItem label="业务库名" prop="name">
            <Input v-model="form.name" placeholder="请输入业务库名"></Input>
          </FormItem>

          <FormItem label="数据库类型" prop="databaseType">
            <Select v-model="form.databaseType" placeholder="数据库类型">
              <Option value="MYSQL"  key="MYSQL">MYSQL</Option>
              <Option value="ORACLE"  key="ORACLE">ORACLE</Option>
            </Select>
          </FormItem>

          <FormItem label="数据库访问方式" prop="databaseContype">
            <Select v-model="form.databaseContype" placeholder="请选择数据库访问方式">
              <Option value="Native" key="Native">Native</Option>
<!--              <Option value="Jndi" key="Jndi">Jndi</Option>-->
            </Select>
          </FormItem>

           <FormItem label="数据源IP" prop="hostName">
          <Input v-model="form.hostName" placeholder="请输入数据源IP"></Input>
        </FormItem>

          <FormItem label="数据库名称" prop="databaseName">
            <Input v-model="form.databaseName" placeholder="请输入数据库名称"></Input>
          </FormItem>


          <FormItem label="数据源端口" prop="port">
            <Input v-model="form.port" placeholder="请输入数据源端口"></Input>
          </FormItem>


        <FormItem label="用户名" prop="username">
          <Input v-model="form.username" placeholder="请输入用户名"></Input>
        </FormItem>

        <FormItem label="密码" prop="password">
          <Input v-model="form.password" placeholder="请输入密码" type="password"></Input>
        </FormItem>

        <FormItem label="服务器名" prop="servername">
          <Input v-model="form.servername" placeholder="请输入服务器名"></Input>
        </FormItem>
        </Col>
      </Row>

    </Form>
    <div slot="bottom">
      <Button type="primary" @click="submitForm">保存</Button>
      <Button type="info" @click="testConnection">测试连接</Button>
      <Button type="default" @click="resetForm">重置</Button>
    </div>
  </xtl-page>
  </div>
</template>

<script>
  import util from '@/libs/util.js'
  import {deepCopy} from '@/libs/assist.js';
  import config from '@/config/config'

  export default {
    data () {
      return {
        form: {
          name: "",
          databaseType:"",
          databaseContype: "",
          hostName: "",
          databaseName: "",
          port: "",
          username:"Native",
          password:"",
          servername:""
        },
        RepoTypeEnum: [],
        ruleValidate: {
          name: this.requiredField('业务库名'),
          databaseType: this.requiredField('数据库类型'),
          databaseContype: this.requiredField('数据库连接方式'),
          databaseName: this.requiredField('数据库名称'),
          hostName: [
            { required: true, message: '数据源IP不能为空', trigger: 'blur' },
            { type: 'string', message: '请输入正确的数据源IP', pattern: /^\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}$/, trigger: 'blur' }
          ],
          port: {
            validator: (rule, value, callback) => {
              if (value == null || value === '') {
                callback(new Error('数据源端口不能为空'))
                return
              }
              if (value * 1 < 0 || value * 1 > 65535) {
                callback(new Error('请输入正确的数据源端口'))
                return
              }
              callback()
            },
            trigger: 'blur',
            required: true
          },
          username: this.requiredField('用户名'),
          password:this.requiredField('密码'),
        },
      }
    },
    computed: {
      id: function () {
        return this.$route.query.id
      }
    },
    methods: {
      initData: function () {
        let self = this
        util.ajax.get(config.xtlServerContext + '/api/xrepo/getRepoTypeDicts').then(function (resp) {
          self.RepoTypeEnum = resp.data.data
        })

        if (self.id) {
          util.ajax.get(config.xtlServerContext + '/op/xdatabase/get/'+self.id).then(function (resp) {
            let result = resp.data.data
              self.form.name=result.name
              self.form.databaseType=result.databaseType
              self.form.databaseContype=result.databaseContype
              self.form.hostName=result.hostName
              self.form.databaseName=result.databaseName
              self.form.port=result.port
              self.form.username=result.username
              self.form.password=result.password
              self.form.servername=result.servername

          }).catch((err) => {
            this.$Message.error("获取业务库基本信息异常,错误信息:" + err);
          })
        }

      },

      testConnection () {
        let self = this
        let params = deepCopy(self.form)
        params.password = btoa(params.password)
        self.$refs.form.validate((valid) => {
          if (valid) {
            const msg = this.$Message.loading({
              content: '正在连接数据库...',
              duration: 0
            })
            util.ajax.post(config.xtlServerContext + '/op/xdatabase/testConnection', params, true)
              .then(function (resp) {
                let data = resp.data
                // 销毁 loading 消息
                setTimeout(msg, 0)
                let code = data.code

                if (code === 11000) {
                  self.$Message.success(data.message)
                } else {
                  self.$Message.error('连接出现异常')
                }
              })
              .catch(function (err) {
                // 销毁 loading 消息
                setTimeout(msg, 0)
                self.$Message.error('测试连接数据库出现异常')
              })
          }
        })
      },
      submitForm () {
        var self = this;
        self.loading=true;
        self.$refs.form.validate((valid) => {
          if(valid) {
            var params = {
              id:self.id,
              name:self.form.name,
              databaseType:self.form.databaseType  ,
              databaseContype:self.form.databaseContype ,
             hostName:self.form.hostName ,
             databaseName:self.form.databaseName  ,
             port:self.form.port ,
             username:self.form.username  ,
             password:self.form.password ,
             servername:self.form.servername
            }
            if(self.id) {
              util.ajax.post(config.xtlServerContext+"/op/xdatabase/update",params).then(function(resp) {
                self.$Message.success('更新业务库成功');
                self.loading=false;
                self.goBack();
              }).catch(function(err) {
                self.$Message.error('保存失败,请联系系统管理员');
                self.loading=false;
                self.goBack();
              });
            } else {
              util.ajax.post(config.xtlServerContext+"/op/xdatabase/add", params).then(function(resp) {
                self.$Message.success('保存业务库成功');
                self.loading=false;
                self.goBack()
              }).catch(function(err) {
                self.$Message.error('新增组织失败,请联系系统管理员');
                self.loading=false;
                self.goBack();
              });

            }
          }
        })
      },
       resetForm () {
        this.$refs.form.resetFields()
       },
      requiredField (fieldName) {
        return [{
          required: true,
          message: fieldName + '不能为空',
          trigger: 'blur'
        }]
      },

      goBack () {
        this.$router.go(-1)
      },
    },
    created () {
      this.initData()
    }
  }
</script>

<style scoped lang="less">

</style>
