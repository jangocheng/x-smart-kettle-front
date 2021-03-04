<template>
  <div>
    <xtl-page :show-header="false">
      <xtl-search @do-search="doSearch">
        <div>
          <Form :label-width="120">
            <FormItem label="任务名称">
              <Input v-model="searchForm.name" placeholder="按任务名称查询" style="width: 200px"/>
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
    }, '删除定时');
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
        iniDate:[util.formatDate(util.getBeforeOrNxtDay(-1)), new Date().Format('yyyy-MM-dd')],
         searchForm: {
          createDateEnd:util.formatDate(util.getBeforeOrNxtDay(0)),
          createDateBegin: util.formatDate(util.getBeforeOrNxtDay(-1)),
          name:'',
          targetResult:''
        },
         databaseTypeList: [],
        selection: {
          jobId:'',
          jobName:''
        },
        tableProps: {
          dataUrl: config.xtlServerContext + "/op/xquartz/listPage",
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
            title: "任务类型",
            align: "left",
            key: 'quartzType',
            resizable: true,
            width: "200",
          },
          {
            title: "定时规则",
            align: "left",
            key: 'quartzCron',
            resizable: true,
            width: "200",
          },
          {
            title: "定时描述",
            align: "left",
            key: 'quartzDescription',
             width: "200",
          },
          {
            title: "定时器状态",
            key: "isDel",
            align: "center",
            width: "120",
            render: function (h, param) {
              let isDel = param.row.isDel;
              if (  isDel =='1') {
                return h('div', [
                  h('strong', '已关闭')
                ]);
              }else {
                return h('div', [
                  h('strong', "已开启")
                ]);
              }
            },
          },
          {
            title: "上一次运行时间",
            key: "historyTime",
            align: "center",
            sortable: true,
            width: "200",
          },
          {
            title: "下一次预计运行时间",
            key: "preTime",
            align: "center",
            sortable: true,
            width: "200",
          },

        );
        columns.push({
          title: "操作",
          key: "operation",
          align: "center",
          fixed: "right",
          width: '300',
          render: function (h, param) {
            let isDel = param.row.isDel

            if(isDel =='1'){
              return h("div", [
                h('strong', {
                  style: {
                    marginRight: '5px'
                  },
                }, '开启定时'),
                h('i-switch', {
                  props: {
                    type: 'primary',
                    trueColor: '#ce3f0f',
                    falseColor: '#316457',
                    value: isDel ==='0'   //控制开关的打开或关闭状态，官网文档属性是value
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    'on-change': (value) => {//触发事件是on-change,用双引号括起来，
                      //参数value是回调值，并没有使用到
                      self.switch(value,param.row) //params.index是拿到table的行序列，可以取到对应的表格值
                    }
                  }
                },),
                delOpButton(self,h,param.row),
               ]);
            }else {
              return h("div", [
                h('strong', {
                  style: {
                    marginRight: '5px'
                  },
                }, '移除定时'),
                h('i-switch', {
                  props: {
                    type: 'primary',
                    trueColor: '#ce3f0f',
                    falseColor: '#316457',
                    value: isDel === '0'  //控制开关的打开或关闭状态，官网文档属性是value
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    'on-change': (value) => {//触发事件是on-change,用双引号括起来，
                      //参数value是回调值，并没有使用到
                      self.switch(value,param.row) //params.index是拿到table的行序列，可以取到对应的表格值
                    }
                  }
                },),
                delOpButton(self,h,param.row),
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
      switch(value,row) {
        let self = this;
        let isDel = row.isDel;
        let quartzId = row.quartzId;
        if(isDel === '0' || isDel =='' || isDel =='null') {
          isDel='1'
          //移除定时任务
          self.$Modal.confirm({
            title: '操作提示',
            content: '<p>执行此操作,任务将会从定时队列中移除,请谨慎操作!</p>',
            okText: '移除定时',
            cancelText: '取消',
            onOk: () => {
              util.ajax.get(config.xtlServerContext+"/op/xquartz/updScheStatus",{
                params:{
                  quartzId:quartzId,
                  isDel:isDel
                }
              }).then(function(resp) {
                let result = resp.data ;
                if(result.code === 11000){
                  self.$Message.success("定时移除成功!");
                  self.reload();
                }
              }).catch((err) => {
                this.$Message.error("定时器开关状态切换异常,错误信息:" + err);
              })
            },
            onCancel: () => {
              self.reload();
            }
          });

        }else
        {
          //开启定时任务
          isDel ='0'
          util.ajax.get(config.xtlServerContext+"/op/xquartz/updScheStatus",{
            params:{
              quartzId:quartzId,
              isDel:isDel
            }
          }).then(function(resp) {
            let result = resp.data ;
            if(result.code === 11000){
              self.$Message.success("定时开启成功!");
              self.reload();
            }
          }).catch((err) => {
            this.$Message.error("定时器开关状态切换异常,错误信息:" + err);
          })
        }

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

      doDelOp(row) {
          let self = this
        let status = row.targetResult
          if(status == '10' || status =='20'){
            this.$Message.warning({content:"作业处于运行状态,禁止此操作!"})
            return ;
          }


        //移除定时任务
        self.$Modal.confirm({
          title: '操作提示',
          content: '<p>执行此操作,任务将会从定时队列中移除,请谨慎操作!</p>',
          okText: '移除定时',
          cancelText: '取消',
          onOk: () => {

            util.ajax.get(config.xtlServerContext+"/op/xquartz/delete",{
              params:{
                targetId:row.targetId,
                targetType:row.quartzType
              }
            }).then(function(resp) {
              let data = resp.data;
              if (data.code ===11000){
                self.$Message.success(data.message);
                self.reload();
              }
            }).catch((err) => {
              this.$Message.error("删除定时异常,错误信息:" + err);
            })
          },
          onCancel: () => {
            self.reload();
          }
        });


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
