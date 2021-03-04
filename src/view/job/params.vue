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
          <Row justify=end>
            <i-col offset="18" span="2">
              <Button type="primary" size="small" icon="md-add" @click="addrowData">增加一行</Button>
            </i-col>
          </Row>
          <Row>
            <xtlEditTable ref="table1" v-model="datas" :columns="columns"
                          :showTableOption="showTableOption"></xtlEditTable>
          </Row>
          <Row>
            &nbsp
          </Row>
          <Row>
            <i-col offset="10" span="2">
              <Button type="primary" @click="submit">确定</Button>
            </i-col>
            <i-col span="1">
              <Button type="default" @click="reset">重置</Button>
            </i-col>
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

  const deleteButton = (vm, h, currentRow, index) => {
    return h('Button', {
      props: {
        type: "error",
        ghost: true,
      },
      style: {
        margin: '0 5px'
      },
      on: {
        'click': () => {
          vm.doDelete(currentRow.objKey, index);
        }
      }
    }, '删除');
  };
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
        tempList:[],
        fileData: [],
        input1:"",
        showTableOption:false,

        value1:"1",
        value2:"2",
        datas: [],
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

        columns.push({
          title: '编辑',
          align: "center",
          render: function (h, param) {
            return h('div', [
              deleteButton(self, h, param.row, param.index)
            ]);
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
      addrowData() {
        let row = {
          objCode: '',
          objName: '',
          objVal:'',
          objDes:''
        }
        this.datas.push(row);
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
      submit() {
         let self = this;
        let param = {
          targetId: this.$route.query.jobId,
          targetType:'job',
          datas: JSON.stringify(this.datas)
        }
        if (this.datas.length > 0) {
          util.ajax.post(config.xtlServerContext + "/op/xparams/add", param).then(function (resp) {
            let data = resp.data;
            if (data.code === 11000) {
              self.$Message.success("保存成功！");
              self.$router.go(-1);
            } else {
              self.$Message.error("保存失败!");
            }
          }).catch(function (err) {
            console.error(err);
            self.$Message.error("保存失败,请联系系统管理员");
          });
        } else {
          this.$Message.error("保存失败,请至少增加一条参数值！");
        }

      },
      reset() {
        this.datas = [];
      },
    },
    mounted: function () {
      this.initData()
    }
  }
</script>

<style>

</style>

