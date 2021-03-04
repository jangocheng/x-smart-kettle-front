<template>
  <div>
    <xtl-page :show-header="false">
      <xtl-search @do-search="doSearch">
        <div>
          <Form :label-width="120">
            <FormItem label="作业名称">
              <Input v-model="searchForm.jobName" placeholder="按作业名称查询" style="width: 200px"/>
            </FormItem>
            <formItem label="运行日期:" >
              <DatePicker @on-change="dateChange"  type="daterange" format="yyyy-MM-dd"
                          placeholder="选择日期" :value = "iniDate"
                          style="width: 180px"></DatePicker>
            </formItem>
            <FormItem label="运行状态">
              <Select v-model="searchForm.targetResult" transfer :multiple="false" style="width: 200px;">
                <Option value="">请选择</Option>
                <Option v-for="item in jobStatusDicts" :value="item.dictKey" :key="item.dictKey">
                  {{item.dictValue }}
                </Option>
              </Select>
            </FormItem>
          </Form>
        </div>
      </xtl-search>
      <xtl-table
        :row-class-name="rowClassName"
        :columns="tableColumns"
                   v-bind="tableProps"
                    @on-row-click="onRowClick" border >
        <div slot="buttons">
          <Button   type='dashed' icon="ios-cash" @click="gotoCreate">创建作业(按模板)</Button>
          <Button   type='dashed' icon="ios-cash" @click="gotoAdd">新建作业(已有)</Button>
          <Button  type='dashed' shape="circle"    icon="ios-clock-outline" @click="doCopyJob">复制作业</Button>
          <Button  type='dashed'  shape="circle" icon="md-cloudy-night" @click="doGetJobImage">调度监控</Button>
          <Button  type='dashed'  shape="circle" icon="ios-nuclear-outline" @click="doRunJob">本地运行</Button>
          <Button type='dashed' shape="circle" icon="ios-nuclear-outline" @click="">远程运行</Button>
          <Button  type='dashed'  shape="circle" icon="ios-nuclear-outline" @click="doStopJob">停止</Button>
          <Button type='dashed' shape="circle" icon="ios-nuclear-outline" @click="doKillJob">终止</Button>
        </div>
      </xtl-table>
      <image-modal :imgModal="imgModal" :logText="logText" :row="selection" @on-ok="onrepoModalOk" @on-cancel="onrepoModalCancel" ></image-modal>
    </xtl-page>
   </div>
</template>

<script>
  import util from '@/libs/util.js';
  import config from '@/config/config';
  import JobModal from "@/view/job/job-modal";
   import ImageModal from "@/view/job/image-modal";


  // 修改按钮
  const editButton = (vm, h, currentRow) => {
    return h('Button', {
      props: {
        type: "dashed",
        size: "small",

      },
      style: {
        margin: "0 5px"
      },
      on: {
        "click": () => {
          vm.doEdit(currentRow.jobId);
        }
      }
    }, "编辑");
  };

  // 设置为无效,则该作业将会废弃,不再执行
  const delOpButton = (vm, h, currentRow) => {
    return h('Button', {
      props: {
        type: "dashed",
        size: "small",

      },
      style: {
        margin: "0 5px"
      },
      on: {
        "click": () => {
          vm.doDelOp(currentRow);
        }
      }
    }, '删除作业');
  };

  // 设置为无效,则该作业将会废弃,不再执行
  const setVarButton = (vm, h, currentRow) => {
    return h('Button', {
      props: {
        type: "dashed",
        size: "small",

      },
      style: {
        margin: "0 5px"
      },
      on: {
        "click": () => {
          vm.doSetVar(currentRow);
        }
      }
    }, '设置参数');
  };


  export default {
    name: "index",
    inject:['reload'],
    components: {
      JobModal,
       ImageModal
    },
     data() {
      return {
        varModal:false,
        jobModal:false,
        imgModal: false,
        logText:'',
        isMonitorEnabled:false,
        jobStatusDicts:[],
        idSelectedArr: [],
        iniDate:[util.formatDate(util.getBeforeOrNxtDay(-1)), new Date().Format('yyyy-MM-dd')],

        searchForm: {
          createDateEnd:util.formatDate(util.getBeforeOrNxtDay(0)),
          createDateBegin: util.formatDate(util.getBeforeOrNxtDay(-1)),
          jobName:'',
          targetResult:''
        },
         databaseTypeList: [],
        selection: {
          jobId:'',
          jobName:''
        },
        tableProps: {
          dataUrl: config.xtlServerContext + "/api/xjob/qryJobPageInfo",
          data: [],
          searchParams: {},
        }
      }
    },
    computed: {
      tableColumns() {
        let columns = [];
        let self = this;
        columns.push({
            title: "选择",
            type: "single-selection",
            align: "center",
            width: "80",
          },
          {
            title: "作业名称",
            align: "left",
            width: "200",
            sortable: true,
            resizable: true,
            render: (h, { row }) => {
              return h(
                "a",

                {
                  style:{
                    color:'#183754',
                    fontWeight:900,
                    underline:'underline'
                  },
                  on: {
                    click: () => {
                      this.$router.push({
                        name: "作业详情",
                        query: { jobId: row.jobId },
                      });
                    },
                  },
                },
                row.jobName
              );
            },
/*            render: function (h, param) {
              let name = param.row.jobName;
              if (name) {
                return h("strong", {
                  style:{
                    color:'#43afc'
                  }
                }, name);
              }
            },*/
          },
          {
            title: "作业描述",
            align: "left",
            key: 'jobDescription',
            resizable: true,
            width: "200",
          },
          {
            title: "运行状态",
            key: "result",
            align: "center",
            width: "120",
            render: function (h, param) {
              let target_result = param.row.result;
              if ( !target_result || target_result =='' || target_result =='null') {
                return h('div', [
                  h('strong', '未运行')
                ]);
              }else {
                return h('div', [
                  h('strong', target_result)
                ]);
              }
            },
          },
          {
            title: "定时规则",
            align: "left",
            key: 'cron',
            resizable: true,
            width: "200",
          },
          {
            title: "定时描述",
            align: "left",
            key: 'quartz',
             width: "200",
          },
          {
            title: "资源库类型",
            key: "jobType",
            align: "center",
            width: "120",
          },
          {
            title: "资源库名称",
            key: "repoName",
            align: "center",
            width: "120",
          },
          {
            title: "所在路径",
            key: "jobPath",
            align: "center",
            width: "120",
          },
          {
            title: "日志级别",
            key: "logLevel",
            align: "center",
            width: "120",
          },
          {
            title: "上一次运行时间",
            key: "startTime",
            align: "center",
            sortable: true,
            width: "200",
          },
          {
            title: "运行总耗时(秒)",
            key: "diff",
            align: "center",
            sortable: true,
            width: "150",
          },

          {
            title: "状态",
            key: "isDel",
            align: "center",
            width: "80",
            render: function (h, param) {
              let is_del = param.row.isDel;

                if(is_del =='0' || is_del=='null' || is_del==''){
                  return h('div', [
                    h('Icon', {
                      props: {
                        type: 'md-checkmark-circle'
                      },
                      style:{
                        color:'green',
                        fontSize:'22px'
                      }

                    })

                  ]);
                }else{
                  return h('div', [
                    h('Icon', {
                      props: {
                        type: 'ios-close-circle'
                      },
                      style:{
                        color:'red',
                        fontSize:'22px'
                      }

                    })

                  ]);
                }
            }
          }
        );
        columns.push({
          title: "操作",
          key: "operation",
          align: "center",
          fixed: "right",
          width: '400',
          render: function (h, param) {
            let isMonitorEnabled = param.row.isMonitorEnabled

            if(!isMonitorEnabled || isMonitorEnabled =='0' || isMonitorEnabled == ''){
              return h("div", [
                h('strong', {
                  style: {
                    marginRight: '5px'
                  },
                }, '开启监控'),
                h('i-switch', {
                  props: {
                    type: 'primary',
                    trueColor: '#13ce66',
                    falseColor: '#646449',
                    value: isMonitorEnabled ==='1'   //控制开关的打开或关闭状态，官网文档属性是value
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    'on-change': (value) => {//触发事件是on-change,用双引号括起来，
                      //参数value是回调值，并没有使用到
                      self.switch(value,param.row.jobId) //params.index是拿到table的行序列，可以取到对应的表格值
                    }
                  }
                },),
                setVarButton(self,h,param.row),
                 editButton(self,h,param.row),
                delOpButton(self,h,param.row)
              ]);
            }else {
              return h("div", [
                h('strong', {
                  style: {
                    marginRight: '5px'
                  },
                }, '关闭监控'),
                h('i-switch', {
                  props: {
                    type: 'primary',
                    trueColor: '#13ce66',
                    falseColor: '#646449',
                    value: isMonitorEnabled === '1'  //控制开关的打开或关闭状态，官网文档属性是value
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    'on-change': (value) => {//触发事件是on-change,用双引号括起来，
                      //参数value是回调值，并没有使用到
                      self.switch(value,param.row.jobId) //params.index是拿到table的行序列，可以取到对应的表格值
                    }
                  }
                },),
                setVarButton(self,h,param.row),
                editButton(self,h,param.row),
                delOpButton(self,h,param.row)
              ]);
            }

          }
        });
        return columns;
      }
    },
    mounted() {
      this.initData();
    },
    methods: {
      rowClassName (row, index) {
        let result = row.result ;
       if (result === '运行中' ||  result ==='等待中') {
          return 'demo-table-error-row';
        }
        return '';
      },
      dateChange : function (e) {
        this.iniDate = e;
        this.searchForm.createDateBegin = e[0];
        this.searchForm.createDateEnd = e[1];
      },
      switch(value,job_id) {
        let self = this;
        let isMonitored = 0;
        if(value){
          isMonitored=1
        }
        util.ajax.post(config.xtlServerContext+"/op/xjob/setIsMonitored",{jobId:job_id,isMonitored:isMonitored}).then(function(resp) {
          let result = resp.data ;
           if(result.code === 11000){
            self.$Message.success("监控状态切换成功!");
            self.reload();
          }
         }).catch((err) => {
          this.$Message.error("作业状态设置异常,错误信息:" + err);
        })
      },
        initData() {
        let self = this;
          util.ajax.get(config.xtlServerContext+"/api/xrepo/getTransStatusDicts").then(function(resp) {
            self.jobStatusDicts = resp.data.data;
          }).catch((err) => {
          this.$Message.error("获取作业状态字典错误,错误信息:" + err);
        })
      },
      doSearch() {
        this.tableProps.searchParams = Object.assign({}, this.searchForm);
      },
      gotoCreate() {
        this.$router.push({
          name: '创建作业'
        });
      },
      gotoAdd() {
        this.$router.push({
          name: '新增作业'

        });
      },
      doSetVar(row){
        let self = this
        let jobId = row.jobId
        self.$router.push({
          name: "作业参数",
          query: {
            jobId
          },
          params: {
            page: 'params'
          }
        });
      },
      doStopJob() {
        let self = this;
        let row = self.selection;
        let jobId = row.jobId;
        let result=row.result;
        if ( !row.jobId) {
          self.$Message.info('请选择一条记录！');
        } else {
          util.ajax.get(config.xtlServerContext+"/api/xjob/stopJob",{
            params:{
              jobId:jobId
            }
          }).then(function(resp) {
            let result = resp.data ;
            self.$Message.success(result.message);
            self.reload();
          }).catch((err) => {
            this.$Message.error("作业停止异常,错误信息:" + err);
          })
        }
      },
      doKillJob() {
        let self = this;
        let row = self.selection;
        let jobId = row.jobId;
        let result=row.result;

        if ( !row.jobId) {
          self.$Message.info('请选择一条记录！');
        } else {
          util.ajax.get(config.xtlServerContext+"/api/xjob/killJob",{
            params:{
              jobId:jobId
            }
          }).then(function(resp) {
            let result = resp.data ;
            self.$Message.success(result.message);
            self.reload();
          }).catch((err) => {
            this.$Message.error("作业终止异常,错误信息:" + err);
          })
        }
      },
      doRunJob() {
        let self = this;
        let row = self.selection;
        let jobId = row.jobId;
        let result=row.result;
          if ( !row.jobId) {
          self.$Message.info('请选择一条记录！');
        } else {
          this.$router.push({
            name: "作业定时",
            query: {
              jobId:jobId,
              result:result
            },
            params: {
              page: 'run'
            }
          });
        }
      },
      doCopyJob() {
        let self = this;
        let row = self.selection;
        let jobId = row.jobId;
        let loading = false;
        if ( !row.jobId) {
          self.$Message.info('请选择一条记录！');
        } else {
          this.$router.push({
            name: "复制作业",
            query: {
              jobId,
              loading
            },
            params: {
              page: 'copy'
            }
          });
        }
      },
      onrepoModalOk(node) {
        this.imgModal = false
      },
      onrepoModalCancel() {
        this.imgModal = false
      },
      doGetJobImage(){
        let self = this;
        let row = self.selection;
        if ( !row.jobId) {
          self.$Message.info('请选择一条记录！');
        } else {
          self.imgModal = true;
          util.ajax.get(config.xtlServerContext+"/api/xjob/getLogText",{
            params:{
              jobId:row.jobId
            }
          }).then(function(resp) {
            let data = resp.data.data;
            self.logText = data ;
          }).catch((err) => {
            this.$Message.error("获取调度日志出错,错误信息:" + err);
          })
        }
      },
      onRowClick(val) {
         this.selection = val;
       },
       doEdit(jobId) {
        this.$router.push({
          name: "编辑作业",
          query: {
            jobId
          },
          params: {
            page: 'edit'
          }
        });
      },
      doDelOp(row) {
          let self = this
        let status = row.targetResult
          if(status == '10' || status =='20'){
            this.$Message.warning({content:"作业处于运行状态,禁止此操作,请先手动从队列中移除任务!"})
            return ;
          }
        self.jobModal = false;
        self.$Modal.confirm({
          title: "删除作业",
          width:450,
          render: (h) => {
            return h(JobModal, {
              props: {
                jobId: row.jobId,
                jobModal: self.jobModal
              }
            })
          },
          onOk: function () {
            self.jobModal = true;
            self.reload()
          }
        })

      },
    },
  }
</script>

<style>
  .ivu-table .demo-table-error-row td{
    background-color: #ff6600 !important;
    color: #fff;
  }
</style>
