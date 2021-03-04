<template>
  <xtl-page hasExtend   hasBottom>
    <!--<div slot="icon">
      <Icon type="md-rose" />
    </div>-->
    <div slot="extend">
      <Button type="default" @click="pageGoBack">返回</Button>
    </div>
    <Collapse accordion v-model="value1">
      <Panel name="1" hide-arrow>
        基本信息
        <div slot="content">
          <Form ref="form" :model="form" :label-width="80"  >
            <Row>
              <i-col span="12" offset="6">

                <FormItem label="作业名称"   prop="jobName">
                  {{form.jobName}}
                </FormItem>
                <FormItem label="作业描述" prop="jobDescription">
                  {{form.jobDescription}}
                </FormItem>
                <FormItem label="作业类型" prop="jobType">
                 {{form.jobType}}
                </FormItem>

                <FormItem label="作业路径" prop="jobPath">
              {{form.jobPath}}
                </FormItem>
                <FormItem label="日志级别" prop="jobLogLevel">
     {{form.jobLogLevel}}
                </FormItem>
                <FormItem label="有效性" prop="isDel">
                  <RadioGroup v-model="form.isDel" aria-readonly="true">
                    <Radio :label= 0 >有效</Radio>
                    <Radio :label= 1>无效</Radio>
                  </RadioGroup>
                </FormItem>
                <FormItem label="日志监控" prop="isMonitorEnabled">
                  <i-switch size="large"  aria-readonly="true" v-model="form.isMonitorEnabled"
                            true-color='#13ce66'   false-color='#646449' >
                    <span slot="open">开启</span>
                    <span slot="close">关闭</span>
                  </i-switch>
                </FormItem>
              </i-col>

            </Row>
          </Form>

        </div>
      </Panel>
    </Collapse>
      <Collapse accordion v-model="value2">
      <Panel name="2" hide-arrow>
        参数信息
        <div slot="content">
          <Row>
             <Table stripe :columns="columns" :data="datas"></Table>
          </Row>
          <Row>
            &nbsp
          </Row>
        </div>
      </Panel>
    </Collapse>
  </xtl-page>
</template>

<script>
  import util from '@/libs/util.js';
  import config from '@/config/config';
  import ICol from "view-design/src/components/grid/col";

  export default {
    components: {ICol},
    data() {
      return {
        contentType: 'table',
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
        tableData: [],
        imgData: [],
        fileData: [],
        input1:"",
        showTableOption:false,

        value1:"1",
        value2:"2",
        datas: [],
        dataType:"",

      }
    },
    created(){

      },

    computed: {

      columns() {
        let columns = [];
        let self = this;
        columns.push({
          title: '参数编码',
          align: 'center',
          key: 'objCode',
          editor: {
            type: "text",
          }
        });
        columns.push({
          title: '中文名称',
          align: 'center',
          key: 'objName',
          editor: {
            type: "text",
          }
        });
        columns.push({
          title: '参数取值',
          align: 'center',
          key: 'objVal',
          editor: {
            type: "text",
          }
        });
        columns.push({
          title: '参数描述',
          align: 'center',
          key: 'objDes',
          editor: {
            type: "text",
          }
        });

        return columns;
      },
      title: function () {
        return this.$route.meta.title;
      }
    },
    methods: {
      initData: function () {
        let self = this;

          util.ajax.get(config.xtlServerContext + '/op/xjob/get' , {
            params:{
              jobId:this.$route.query.jobId
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
            this.$Message.error("获取作业基本信息异常,错误信息:" + err);
          })

        util.ajax.get(config.xtlServerContext+"/op/xparams/getParams",{
          params:{
            targetId:this.$route.query.jobId,
            targetType:'job'
          }
        }).then(function(resp) {
          self.datas = resp.data.data;
        }).catch((err) => {
          this.$Message.error("获取变量参数异常,错误信息:" + err);
        })
      },

      pageGoBack: function () {
        this.$router.go(-1);
      },
      doDelete: function (cellId, index) {
        var self = this;
        this.$Modal.confirm({
          title: '提示',
          content: '<p>确定要删除吗?</p>',
          onOk: () => {
            self.datas.splice(index, 1);
          }
        });
      },
    },
    mounted: function () {
      this.initData()
    }
  }
</script>

<style>

</style>

