<template>
  <div>
   <Card dis-hover :bordered="isbordered">
    <p slot="title">
      {{title}}
    </p>
    <div slot="extra">
      <Button type="default" @click="pageGoBack">返回</Button>
    </div>
    <Row>
      <Col span="14" offset="6">
      <Form v-if="eventType==='edit' && (datas.type==='db' || datas.type ==='file')"
            ref="form" :model="form" :label-width="120" :rules="ruleValidate">
        <FormItem label="资源库名称" prop="repoName">
          <Input v-model="form.repoName" placeholder="请输入资源库名称"></Input>
        </FormItem>
        <FormItem v-if="form.type ==='file'" label="基础路径" prop="baseDir">
          <Input v-model="form.baseDir" placeholder="请输入文件资源库的基础路径"></Input>
        </FormItem>
        <FormItem v-if="form.type ==='db'" label="资源库用户名" prop="repoUsername">
          <Input v-model="form.repoUsername" placeholder="请输入资源库登录用户名"></Input>
        </FormItem>
        <FormItem v-if="form.type ==='db'" label="资源库密码" prop="repoPassword">
          <Input    v-model="form.repoPassword" placeholder="请输入资源库登录密码" ></Input>
        </FormItem>
        <FormItem v-if="form.type ==='db'" label="数据库类型" prop="repoType">
          <Select v-model="form.repoType" placeholder="数据库类型">
            <Option v-for="item in RepoTypeEnum" :value="item.dictValue" :key="item.dictValue">{{ item.dictValue }}</Option>
          </Select>
        </FormItem>
        <FormItem v-if="form.type ==='db'" label="数据库访问方式" prop="dbAccess">
          <Select v-model="form.dbAccess" placeholder="请选择数据库访问方式">
            <Option  value="Native" key="Native">Native</Option>
            <Option  value="Jndi" key="Jndi">Jndi</Option>
          </Select>
        </FormItem>
        <FormItem v-if="form.type ==='db'" label="数据库地址" prop="dbHost">
          <Input   v-model="form.dbHost" placeholder="请输入数据库连接地址" ></Input>
        </FormItem>
        <FormItem  v-if="form.type ==='db'" label="数据库端口" prop="dbPort">
          <Input   v-model="form.dbPort" placeholder="请输入数据库连接端口" ></Input>
        </FormItem>
        <FormItem v-if="form.type ==='db'" label="数据库实例名" prop="dbName">
          <Input   v-model="form.dbName" placeholder="请输入数据库实例名" ></Input>
        </FormItem>
        <FormItem v-if="form.type ==='db'" label="数据库用户名" prop="dbUsername">
          <Input   v-model="form.dbUsername" placeholder="请输入数据库用户名" ></Input>
        </FormItem>
        <FormItem v-if="form.type ==='db'" label="数据库密码" prop="dbPassword">
          <Input   v-model="form.dbPassword" placeholder="请输入数据库密码" ></Input>
        </FormItem>
        <FormItem label="资源库有效性" prop="isDel">
          <RadioGroup v-model="form.isDel" >
            <Radio :label=1>有效</Radio>
            <Radio :label=0>无效</Radio>
          </RadioGroup>
        </FormItem>

        <FormItem>
          <Button type="primary" @click="formSubmit" :loading="loading">保存</Button>
          <Button type="default" @click="formReset">重置</Button>
          <Button v-if="form.type ==='db'"  type="info"  @click="testConnection">测试连接</Button>
         </FormItem>
      </Form>
              <Form v-if="eventType==='create' && datas.type==='root'"
                    ref="form" :model="form" :label-width="120" :rules="ruleValidate">
                <FormItem label="资源库名称" prop="repoName">
                  <Input v-model="form.repoName" placeholder="请输入资源库名称"></Input>
                </FormItem>
                <FormItem   label="资源库类型" prop="type">
                  <Select v-model="form.type" placeholder="资源库类型" >
                    <Option  value="db" key="db">数据库</Option>
                    <Option  value="file" key="file">文件库</Option>
                  </Select>
                </FormItem>
                <FormItem v-if="form.type ==='file'" label="基础路径" prop="baseDir">
                  <Input v-model="form.baseDir" placeholder="请输入文件资源库的基础路径"></Input>
                </FormItem>
                <FormItem v-if="form.type ==='db'" label="资源库用户名" prop="repoUsername">
                  <Input v-model="form.repoUsername" placeholder="请输入资源库登录用户名"></Input>
                </FormItem>
                <FormItem v-if="form.type ==='db'" label="资源库密码" prop="repoPassword">
                  <Input  v-model="form.repoPassword" placeholder="请输入资源库登录密码" ></Input>
                </FormItem>
                <FormItem v-if="form.type ==='db'" label="数据库类型" prop="repoType">
                  <Select v-model="form.repoType" placeholder="数据库类型">
                    <Option v-for="item in RepoTypeEnum" :value="item.dictValue" :key="item.dictValue">{{ item.dictValue }}</Option>
                  </Select>
                </FormItem>
                <FormItem v-if="form.type ==='db'" label="数据库访问方式" prop="dbAccess">
                  <Select v-model="form.dbAccess" placeholder="请选择数据库访问方式">
                    <Option  value="Native" key="Native">Native</Option>
                    <Option  value="Jndi" key="Jndi">Jndi</Option>
                  </Select>
                </FormItem>
                <FormItem v-if="form.type ==='db'" label="数据库地址" prop="dbHost">
                  <Input   v-model="form.dbHost" placeholder="请输入数据库连接地址" ></Input>
                </FormItem>
                <FormItem  v-if="form.type ==='db'" label="数据库端口" prop="dbPort">
                  <Input   v-model="form.dbPort" placeholder="请输入数据库连接端口" ></Input>
                </FormItem>
                <FormItem v-if="form.type ==='db'" label="数据库实例名" prop="dbName">
                  <Input   v-model="form.dbName" placeholder="请输入数据库实例名" ></Input>
                </FormItem>
                <FormItem v-if="form.type ==='db'" label="数据库用户名" prop="dbUsername">
                  <Input   v-model="form.dbUsername" placeholder="请输入数据库用户名" ></Input>
                </FormItem>
                <FormItem v-if="form.type ==='db'" label="数据库密码" prop="dbPassword">
                  <Input type="password"   v-model="form.dbPassword" placeholder="请输入数据库密码" ></Input>
                </FormItem>
                <FormItem label="资源库有效性" prop="isDel">
                  <RadioGroup v-model="form.isDel" >
                    <Radio :label=1>有效</Radio>
                    <Radio :label=0>无效</Radio>
            </RadioGroup>
          </FormItem>

          <FormItem>
            <Button type="primary" @click="formSubmit" :loading="loading">保存</Button>
            <Button type="default" @click="formReset">重置</Button>
            <Button v-if="form.type ==='db'"   type="info" @click="testConnection">测试连接</Button>
          </FormItem>
        </Form>
      </Col>
    </Row>
  </Card>
  </div>
</template>

<script>
  import util from '@/libs/util.js';
  import {deepCopy} from '@/libs/assist.js';
  import config from '@/config/config';
   export default {
   props: {
      datas: {
        type: Object,
        required: true
      },
      eventType: {
        type: String,
        required: true
      }
    },
    data() {

      return {
        isbordered:false,
        loading:false,
        form: {
          id:"",
          repoName: "",
         type:"db",
          baseDir: "",
          repoUsername: "",
          repoPassword: "",
          repoType: "",
          dbAccess:"Native",
          dbHost:"",
          dbPort:"",
          dbName:"",
          dbUsername:'',
          dbPassword:'',
          isDel:''
        },
        ruleValidate: {
        	 repoName: [
             {required:true,max: 30,message: '资源库名称不能为空',trigger: 'blur'}
          ],
          baseDir: [
            {required: true, message: '必须输入文件库基础路径', trigger: 'blur'},
          ],
          repoUsername:[
            {required: true,max:30, message: '必须输入资源库登录名称', trigger: 'blur'}
          ],
          repoPassword:[
            {required: true, max:30,message: '必须输入资源库登录密码', trigger: 'blur'}
          ],
          repoType:[
            {required: true, message: '必须选择数据库类型', trigger: 'blur'}
          ],
          dbHost:[
            {required: true, message: '请输入数据库连接地址', trigger: 'blur'}
          ],
          dbPort:[
            {required: true, message: '请输入数据库端口', trigger: 'blur'},
            {validator:this.$Valid.isInteger}
          ],
          dbName:[
            {required: true, message: '请输入数据库实例名', trigger: 'blur'}
          ],
          dbUsername:[
            {required: true,max:30, message: '请输入数据库用户名', trigger: 'blur'}
          ],
          dbPassword:[
            {required: true,max:30, message: '请输入数据库密码', trigger: 'blur'}
          ]
        },
        created: false,
        RepoTypeEnum: [],
      }
    },
     created() {
       if (this.eventType === 'create' && this.datas.type==='root') {
        this.form.id = this.datas.id
      }else if(this.eventType === 'edit' && (this.datas.type==='db' || this.datas.type==='file' )) {
      this.initRepoTree(this.datas.id);
      }else {
        this.$Message.warning("当前节点不能创建或编辑!")
      }
    },
    computed:{
    	 title: function() {
        return this.$route.meta.title;
      }
    },

    methods: {
      testConnection() {
        let self = this;
        let params = deepCopy(self.form);
        params.dbPassword = btoa(params.dbPassword);
        self.$refs.form.validate((valid) => {
          if (valid) {
            const msg = this.$Message.loading({
              content: "正在连接数据库...",
              duration: 0
            });
            util.ajax.post(config.xtlServerContext + "/api/xrepo/testConnection", params, true)
              .then(function (resp) {
                let data = resp.data;
                  // 销毁 loading 消息
                setTimeout(msg, 0);
                let code =data.code ;

                 if (code === 11000) {
                  self.$Message.success(data.message);
              } else {
                  self.$Message.error('连接出现异常');
                }
              })
              .catch(function (err) {
                // 销毁 loading 消息
                setTimeout(msg, 0);
                 self.$Message.error("测试连接数据库出现异常");
              });
          }
        });
      },
      formSubmit: function() {
        var self = this;
        self.loading=true;
        self.$refs.form.validate((valid) => {
          if(valid) {
             var params = {
              repoId:self.form.id,
             repoName:self.form.repoName,
              type:self.form.type,
              baseDir:self.form.baseDir,
              repoUsername:self.form.repoUsername,
              repoPassword:self.form.repoPassword,
              repoType:self.form.repoType,
              dbAccess:self.form.dbAccess,
              dbHost:self.form.dbHost,
              dbPort:self.form.dbPort,
              dbName:self.form.dbName,
              dbUsername:self.form.dbUsername,
              dbPassword:self.form.dbPassword,
              isDel:self.form.isDel
            }
            if(self.eventType === 'edit') {
              util.ajax.post(config.xtlServerContext+"/op/xrepository/update",params).then(function(resp) {
                self.$Message.success('更新资源库成功');
                self.loading=false;
                 self.pageGoBack();
              }).catch(function(err) {
                self.$Message.error('保存失败,请联系系统管理员');
                self.loading=false;
                 self.pageGoBack();
              });
            } else {
             		  util.ajax.post(config.xtlServerContext+"/op/xrepository/add", params).then(function(resp) {
                self.$Message.success('保存资源库成功');
                    self.loading=false;
                 self.pageGoBack()
              }).catch(function(err) {
                self.$Message.error('新增组织失败,请联系系统管理员');
                    self.loading=false;
                 self.pageGoBack();
              });

            }
          }
        })
      },

      formReset() {
        this.$refs.form.resetFields();
      },
      pageGoBack() {
        this.$emit('go-back','show')
      },
      initData: function() {
        var self = this;
        util.ajax.get(config.xtlServerContext+"/api/xrepo/getRepoTypeDicts").then(function(resp) {
          self.RepoTypeEnum = resp.data.data;
        })
      },
      initRepoTree:function (id) {
        let self = this;
         util.ajax.get(config.xtlServerContext+"/op/xrepository/get/"+id).then(function (resp) {
          self.form=resp.data.data;
        }).catch(function(err) {
        self.$Message.error('获取资源库数据失败,请联系系统管理员');
        self.pageGoBack();
      });
      }
    },
    mounted: function() {
      this.initData()

    }
  }
</script>

<style>

</style>
