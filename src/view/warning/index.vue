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
           </Form>
        </div>
      </xtl-search>
      <xtl-table
         :columns="tableColumns"
        v-bind="tableProps"
         @on-selection-change="onSelectionChange" >
        <div slot="buttons">
          <Button   type='dashed' icon="ios-cash" @click="doBatchDel">删除记录</Button>
        </div>
      </xtl-table>
      <msg-modal :msgModal="msgModal" :jobName="jobName" :logText="logText" @on-ok="onrepoModalOk" @on-cancel="onrepoModalCancel" ></msg-modal>

    </xtl-page>
  </div>
</template>

<script>
  import util from '@/libs/util.js';
  import config from '@/config/config';
  import msgModal from "@/view/warning/msg-modal";
   // 设置为无效,则该作业将会废弃,不再执行
  const detailButton = (vm, h, currentRow) => {
    return h('Button', {
      props: {
        type: "warning",
        size: "small",

      },
      style: {
        margin: "0 5px"
      },
      on: {
        "click": () => {
          vm.doDetailButton(currentRow);
        }
      }
    }, '异常记录');
  };

  export default {
    name: "index",
    inject:['reload'],
    components: {
      msgModal
    },
    data() {
      return {
        jobStatusDicts:[],
        msgModal:false,
        idSelectedArr: [],
        logText:'',
        jobName:'',
        iniDate:[util.formatDate(util.getBeforeOrNxtDay(0)), new Date().Format('yyyy-MM-dd')],
         searchForm: {
          createDateEnd:util.formatDate(util.getBeforeOrNxtDay(0)),
          createDateBegin: util.formatDate(util.getBeforeOrNxtDay(0)),
          jobName:'',
        },
        databaseTypeList: [],
        selection: {
          jobId:'',
          jobName:''
        },
        tableProps: {
          dataUrl: config.xtlServerContext + "/op/xlogwarning/listPage",
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
            title: "创建时间",
            key: "startTime",
            align: "center",
            sortable: true,
            width: "200",
          },
          {
            title: "任务名称",
            align: "left",
            width: "200",
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
            width: "200",
          },
          {
            title: "预警实体",
            align: "left",
            key: 'logSub',
            resizable: true,
            width: "300",
          },
          {
            title: "是否异常",
            align: "left",
            key: 'logError',
            resizable: true,
            width: "100",
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
              detailButton(self,h,param.row),
            ]);
          }
        });
        return columns;
      }
    },
    mounted() {
     },
    methods: {
      doDetailButton:function(row){
        let self = this;
        self.msgModal = true;
        self.logText = row.logMsg
        self.jobName =row.name
      },
      onSelectionChange: function (selection) {
        let self = this;
        self.idSelectedArr = [];
        for (let item of selection) {
          self.idSelectedArr.push(item.logId);
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
        this.searchForm.createDateBegin =e[0];
        this.searchForm.createDateEnd = e[1];
      },

      doSearch() {
          this.tableProps.searchParams = Object.assign({}, this.searchForm);
      },

      onRowClick(val) {
        this.selection = val;
      },
      onrepoModalOk(node) {
        this.msgModal = false
      },
      onrepoModalCancel() {
        this.msgModal = false
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
            okText: '彻底删除',
            cancelText: '取消',
            onOk: () => {
              util.ajax.get(config.xtlServerContext+"/op/xlogwarning/delete",{
                params:{
                  ids:idSelectedArr.toString()
                }
              }).then(function(resp) {
                let result = resp.data ;
                if(result.code === 11000){
                  self.$Message.success("预警清理成功!");
                  self.reload();
                }
              }).catch((err) => {
                this.$Message.error("预警清理异常,错误信息:" + err);
              })
            },
            onCancel: () => {
              self.reload();
            }
          });
        }

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
