<template>
  <xtl-page hasExtend hasBottom>
    <Row>
      <Col span="12" offset="8">
        <Form ref="form" :model="form" :label-width="120" :rules="ruleValidate">
          <FormItem label="运行方式" >
            <RadioGroup v-model="form.runType" @on-change="selectChange">
              <Radio label="1" >立即运行</Radio>
              <Radio label="2">定时运行</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="任务定时规则" prop="cron" v-if="form.runType=='2'">
            <input-cron type="text" v-model="form.cron" :exeStartTime="exeStartTime"
                        :hideSecond="false" placeholder="请输入cron表达式" />
          </FormItem>
          <FormItem label="任务定时描述" prop="description" v-if="form.runType=='2'">
            <Input v-model="form.description"    placeholder="请输入任务定时描述" style="width: 260px"></Input>
          </FormItem>
        </Form>
      </Col>
    </Row>
    <div slot="bottom">
      <Button type="primary" @click="run" :loading="loading" >确定</Button>
      <Button type="default" @click="cancel">取消</Button>
    </div>
    </xtl-page>
</template>

<script>
  import util from '@/libs/util.js';
  import config from '@/config/config';
  import InputCron from '@/components/cron/input-cron';

  export default {
    name: "job-modal",
    components: {
       InputCron
    },

    data() {
      return {
         //预览时间
        exeStartTime: new Date().Format('yyyy-MM-dd HH:mm:ss'),
        loading:false,
        form: {
          //时间类型
          runType: "1",
          //cron表达式
          cron: "",
          description: ""
        },
        ruleValidate: {
          cron: [{
            // pattern: /1[3456789]\d{9}/,
            required: true,
            message: 'cron表达式不能为空',
            // trigger: 'blur'
          }],
          description: [{
            // pattern: /1[3456789]\d{9}/,
            required: true,
            message: '任务定时描述不能为空',
            // trigger: 'blur'
          }],

        },
        created:false
       }
    },
    created() {

     },
    mounted () {
      this.initData();
    },
    watch:{

    },

    computed: {
      jobId: function () {
        return this.$route.query.jobId
      },
      result: function () {
        return this.$route.query.result
      }
    },

    methods: {
      initData(){
        let self = this
        util.ajax.get(config.xtlServerContext+"/op/xquartz/get",{
          params:{
            id:self.jobId,
            type:'job'
          }
        }).then(function(resp) {
          let result = resp.data.data;
           if(resp.data.code === 11000){
            self.form.cron = result.quartzCron
            self.form.description = result.quartzDescription
          }
        }).catch((err) => {
          this.$Message.error("获取定时规则异常,错误信息:" + err);
        })
      },
      run(){
        let self = this
        if(self.result ==='运行中' ||self.result ==='等待中'  ){
          self.$Message.warning("非停止状态,不能执行此操作!")
          return ;
        }
        self.$refs.form.validate(valid => {
          if (valid) {
            self.loading=true
            if(self.form.runType ==='1'){
              util.ajax.get(config.xtlServerContext + "/api/xjob/startJob",{
              params:{
                jobId:self.jobId
              }
              }).then(resp => {
                if (resp.data.code === 11000) {
                  self.loading=false
                  self.$Modal.confirm({
                    title: '操作成功提示',
                    content: '<p>作业已提交至任务池,详情请移步日志管理!</p>',
                    okText: '移步日志管理',
                    cancelText: '取消',
                    onOk: () => {
                      this.$router.push({name:'日志管理'})
                    },
                    onCancel: () => {
                      self.cancel();
                    }
                  });
                }else {
                  self.loading=false
                  self.$Message.error(resp.data.message);
                }
              }).catch((err) => {
                self.loading=false
                this.$Message.error("作业运行异常,错误信息:" + err);
              })
            }else {
              util.ajax.get(config.xtlServerContext + "/api/xjob/addJob2Sche",{
                params:{
                  jobId:self.jobId,
                  cron:self.form.cron,
                  description:self.form.description
                }
              }).then(resp => {
                if (resp.data.code === 11000) {
                  self.loading=false
                  self.$Modal.confirm({
                    title: '操作成功提示',
                    content: '<p>作业已提交到定时任务中,请移步日志管理查看详情!</p>',
                    okText: '移步日志管理',
                    cancelText: '取消',
                    onOk: () => {
                      this.$router.push({name:'日志管理'})
                    },
                    onCancel: () => {
                      self.cancel();
                    }
                  });
                }else if(resp.data.code === 11002){
                  self.loading=false
                  self.$Modal.confirm({
                    title: '操作失败提示',
                    content: '<p>'+resp.data.message+'</p>',
                    okText: '移步定时管理',
                    cancelText: '取消',
                    onOk: () => {
                      this.$router.push({name:'定时管理'})
                    },
                    onCancel: () => {
                      self.cancel();
                    }
                  });

                }
              }).catch((err) => {
                self.loading=false
                this.$Message.error("作业运行异常,错误信息:" + err);
              })
            }
          }
        })


      },
      cancel(){
        this.$router.go(-1);
      },
        selectChange() {
        let self = this
        if(self.form.runType ==="2"){
          self.$Message['warning']({
            background: true,
            duration:5,
            content: '此操作将会覆盖原作业定时规则!'
          })
        }
      }
    }
  }
</script>

<style scoped>

</style>
