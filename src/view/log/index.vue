<template>
  <div>
    <xtl-page :show-header="false">
      <xtl-search @do-search="doSearch">
        <div>
          <Form :label-width="120">
            <FormItem label="任务名称">
              <Input v-model="searchForm.jobName" placeholder="按任务名称查询" style="width: 200px"/>
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
        @on-selection-change="onSelectionChange"  border >
        <div slot="buttons">
          <Button   type='dashed' icon="ios-cash" @click="doBatchDel">清理日志</Button>
        </div>
      </xtl-table>
     </xtl-page>
   </div>
</template>

<script>
  import util from '@/libs/util.js';
  import config from '@/config/config';
  import JobModal from "@/view/job/job-modal";
  import ImageModal from "@/view/job/image-modal";


  // 设置为无效,则该作业将会废弃,不再执行
  const downloadButton = (vm, h, currentRow) => {
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
          vm.doDownLoadOp(currentRow);
        }
      }
    }, '日志下载');
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
        jobModal:false,
        imgModal: false,
        logText:'',
        isMonitorEnabled:false,
        jobStatusDicts:[],
        idSelectedArr: [],
        iniDate:[util.formatDate(util.getBeforeOrNxtDay(0)), new Date().Format('yyyy-MM-dd')],
         searchForm: {
          createDateEnd:util.formatDate(util.getBeforeOrNxtDay(0)),
          createDateBegin: util.formatDate(util.getBeforeOrNxtDay(0)),
          jobName:'',
          targetResult:''
        },
         databaseTypeList: [],
        selection: {
          jobId:'',
          jobName:''
        },
        tableProps: {
          dataUrl: config.xtlServerContext + "/op/xlog/listPage",
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
            type: "selection",
            align: "center",
            width: "80",
          },
          {
            title: "任务名称",
            align: "left",
            width: "250",
            sortable: true,
            resizable: true,
            render: function (h, param) {
              let name = param.row.name;
              if (name) {
                return h("strong", {
                  style:{
                    color:'#43afc'
                  }
                }, name);
              }
            },
          },
          {
            title: "任务类型",
            align: "left",
            key: 'logType',
            resizable: true,
            width: "100",
          },


          {
            title: "开始时间",
            key: "startTime",
            align: "center",
            sortable: true,
            width: "250",
          },
          {
            title: "结束时间",
            key: "stopTime",
            align: "center",
            sortable: true,
            width: "250",
          },
          {
            title: "运行结果",
            key: "result",
            align: "center",
            width: "150",
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
            }
          }

        );
        columns.push({
          title: "操作",
          key: "operation",
          align: "center",
          fixed: "right",
          width: '120',
          render: function (h, param) {
            return h("div", [
              downloadButton(self,h,param.row),
            ]);
          }
        });
        return columns;
      }
    },
    mounted() {
      this.initData();
    },
    methods: {
      onSelectionChange: function (selection) {
        let self = this;
        self.idSelectedArr = [];
        for (let item of selection) {
          let msg = item.result
          if(msg !== '运行中'){
            self.idSelectedArr.push(item.logId);
          }

        }
      },
      doBatchDel(row) {
        let self = this;
        let idSelectedArr = self.idSelectedArr;
        if (idSelectedArr.length === 0) {
          self.$Message.info('请至少选择一条记录！');
        } else {

          self.$Modal.confirm({
            title: '操作提示',
            content: '<p>执行此操作,将会彻底清除,请谨慎操作!</p>',
            okText: '清理日志',
            cancelText: '取消',
            onOk: () => {
              util.ajax.get(config.xtlServerContext+"/op/xlog/delete",{
                params:{
                  ids:idSelectedArr.toString()
                }
              }).then(function(resp) {
                let result = resp.data ;
                if(result.code === 11000){
                  self.$Message.success("日志清理成功!!");
                  self.reload();
                }
              }).catch((err) => {
                this.$Message.error("日志清理异常,错误信息:" + err);
              })
            },
            onCancel: () => {
              self.reload();
            }
          });
        }

      },
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

      onRowClick(val) {
         this.selection = val;
       },

      doDownLoadOp(row) {
          let self = this
        window.location.href=config.xtlServerContext+"/op/xlog/downLog/"+row.logId ;
      }

    },
  }
</script>

<style>
  .ivu-table .demo-table-error-row td{
    background-color: #ff6600 !important;
    color: #ffffff;
  }
</style>
