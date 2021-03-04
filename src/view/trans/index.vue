<template>
  <div>
    <xtl-page :show-header="false">
      <xtl-search @do-search="doSearch">
        <div>
          <Form :label-width="120">
            <FormItem label="转换名称">
              <Input v-model="searchForm.transName" placeholder="按转换名称查询" style="width: 200px"/>
            </FormItem>
            <formItem label="运行日期:" >
              <DatePicker @on-change="dateChange"  type="daterange" format="yyyy-MM-dd"
                          placeholder="选择日期" :value = "iniDate"
                          style="width: 180px"></DatePicker>
            </formItem>
            <FormItem label="运行状态">
              <Select v-model="searchForm.targetResult" transfer :multiple="false" style="width: 200px;">
                <Option value="">请选择</Option>
                <Option v-for="item in transStatusDicts" :value="item.dictKey" :key="item.dictKey">
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
<!--          <Button   type='dashed' icon="ios-cash" @click="gotoAdd">创建转换(按模板)</Button>-->
          <Button   type='dashed' icon="ios-cash" @click="gotoAdd">新建转换</Button>
<!--          <Button  type='dashed' shape="circle"    icon="ios-clock-outline" @click="doCopytrans">复制转换</Button>-->
          <Button  type='dashed'  shape="circle" icon="md-cloudy-night" @click="doGettransImage">调度监控</Button>
          <Button  type='dashed'  shape="circle" icon="ios-nuclear-outline" @click="doRuntrans">本地运行</Button>
          <Button type='dashed' shape="circle" icon="ios-nuclear-outline" @click="">远程运行</Button>
          <Button type='dashed' shape="circle" icon="ios-nuclear-outline" @click="doPauseTrans">暂停</Button>
          <Button type='dashed' shape="circle" icon="ios-nuclear-outline" @click="doResumeTrans">恢复</Button>
          <Button  type='dashed'  shape="circle" icon="ios-nuclear-outline" @click="doStoptrans">停止</Button>
          <Button type='dashed' shape="circle" icon="ios-nuclear-outline" @click="doKilltrans">终止</Button>
        </div>
      </xtl-table>
      <image-modal :imgModal="imgModal" :logText="logText" :row="selection" @on-ok="onrepoModalOk" @on-cancel="onrepoModalCancel" ></image-modal>
    </xtl-page>
   </div>
</template>

<script>
  import util from '@/libs/util.js';
  import config from '@/config/config';
  import transModal from "@/view/trans/trans-modal";
  import ImageModal from "@/view/trans/image-modal";


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
          vm.doEdit(currentRow.transId);
        }
      }
    }, "编辑");
  };

  // 设置为无效,则该转换将会废弃,不再执行
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
    }, '删除转换');
  };


  export default {
    name: "index",
    inject:['reload'],
    components: {
      transModal,
      ImageModal
    },
     data() {
      return {
        transModal:false,
        imgModal: false,
        logText:'',
        isMonitorEnabled:false,
        transStatusDicts:[],
        idSelectedArr: [],
        iniDate:[util.formatDate(util.getBeforeOrNxtDay(-1)), new Date().Format('yyyy-MM-dd')],
        searchForm: {
          createDateEnd:util.formatDate(util.getBeforeOrNxtDay(0)),
          createDateBegin: util.formatDate(util.getBeforeOrNxtDay(-1)),
          transName:'',
          targetResult:''
        },
         databaseTypeList: [],
        selection: {
          transId:'',
          transName:''
        },
        tableProps: {
          dataUrl: config.xtlServerContext + "/api/xtrans/qryTransPageInfo",
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
            title: "转换名称",
            align: "left",
            width: "200",
            sortable: true,
            resizable: true,
            render: function (h, param) {
              let name = param.row.transName;
              if (name) {
                return h("strong", {
                  style:{
                    color:'#183754',
                    fontWeight:900,
                  }
                }, name);
              }
            },
          },
          {
            title: "转换描述",
            align: "left",
            key: 'transDescription',
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
            key: "transType",
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
            key: "transPath",
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
          width: '300',
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
                      self.switch(value,param.row.transId) //params.index是拿到table的行序列，可以取到对应的表格值
                    }
                  }
                },),
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
                      self.switch(value,param.row.transId) //params.index是拿到table的行序列，可以取到对应的表格值
                    }
                  }
                },),
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
      switch(value,trans_id) {
        let self = this;
        let isMonitored = 0;
        if(value){
          isMonitored=1
        }
        util.ajax.post(config.xtlServerContext+"/op/xtrans/setIsMonitored",{transId:trans_id,isMonitored:isMonitored}).then(function(resp) {
          let result = resp.data ;
           if(result.code === 11000){
            self.$Message.success("监控状态切换成功!");
            self.reload();
          }
         }).catch((err) => {
          this.$Message.error("转换状态设置异常,错误信息:" + err);
        })
      },
        initData() {
        let self = this;
          util.ajax.get(config.xtlServerContext+"/api/xrepo/getTransStatusDicts").then(function(resp) {
            self.transStatusDicts = resp.data.data;
          }).catch((err) => {
          this.$Message.error("获取转换状态字典错误,错误信息:" + err);
        })
      },
      doSearch() {
        this.tableProps.searchParams = Object.assign({}, this.searchForm);
      },
      gotoAdd() {
        this.$router.push({
          name: '新增转换'

        });
      },
      doResumeTrans() {
        let self = this;
        let row = self.selection;
        let transId = row.transId;
        let result=row.result;
        if ( !row.transId) {
          self.$Message.info('请选择一条记录！');
        } else {
          util.ajax.get(config.xtlServerContext+"/api/xtrans/resumeTrans",{
            params:{
              transId:transId
            }
          }).then(function(resp) {
            let result = resp.data ;
            self.$Message.success(result.message);
            self.reload();
          }).catch((err) => {
            this.$Message.error("转换恢复异常,错误信息:" + err);
          })
        }
      },
      doPauseTrans() {
        let self = this;
        let row = self.selection;
        let transId = row.transId;
        let result=row.result;
        if ( !row.transId) {
          self.$Message.info('请选择一条记录！');
        } else {
          util.ajax.get(config.xtlServerContext+"/api/xtrans/pauseTrans",{
            params:{
              transId:transId
            }
          }).then(function(resp) {
            let result = resp.data ;
            self.$Message.success(result.message);
            self.reload();
          }).catch((err) => {
            this.$Message.error("转换暂停异常,错误信息:" + err);
          })
        }
      },
      doStoptrans() {
        let self = this;
        let row = self.selection;
        let transId = row.transId;
        let result=row.result;
        if ( !row.transId) {
          self.$Message.info('请选择一条记录！');
        } else {
          util.ajax.get(config.xtlServerContext+"/api/xtrans/stopTrans",{
            params:{
              transId:transId
            }
          }).then(function(resp) {
            let result = resp.data ;
            self.$Message.success(result.message);
            self.reload();
          }).catch((err) => {
            this.$Message.error("转换停止异常,错误信息:" + err);
          })
        }
      },
      doKilltrans() {
        let self = this;
        let row = self.selection;
        let transId = row.transId;
        let result=row.result;

        if ( !row.transId) {
          self.$Message.info('请选择一条记录！');
        } else {
          util.ajax.get(config.xtlServerContext+"/api/xtrans/killTrans",{
            params:{
              transId:transId
            }
          }).then(function(resp) {
            let result = resp.data ;
            self.$Message.success(result.message);
            self.reload();
          }).catch((err) => {
            this.$Message.error("转换终止异常,错误信息:" + err);
          })
        }
      },
      doRuntrans() {
        let self = this;
        let row = self.selection;
        let transId = row.transId;
        let result=row.result;
          if ( !row.transId) {
          self.$Message.info('请选择一条记录！');
        } else {
          this.$router.push({
            name: "转换定时",
            query: {
              transId:transId,
              result:result
            },
            params: {
              page: 'run'
            }
          });
        }
      },
      doCopytrans() {
        let self = this;
        let row = self.selection;
        let transId = row.transId;
        let loading = false;
        if ( !row.transId) {
          self.$Message.info('请选择一条记录！');
        } else {
          this.$router.push({
            name: "复制转换",
            query: {
              transId,
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
      doGettransImage(){
        let self = this;
        let row = self.selection;
        if ( !row.transId) {
          self.$Message.info('请选择一条记录！');
        } else {
          self.imgModal = true;
          util.ajax.get(config.xtlServerContext+"/api/xtrans/getLogText",{
            params:{
              transId:row.transId
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
       doEdit(transId) {
        this.$router.push({
          name: "编辑转换",
          query: {
            transId
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
            this.$Message.warning({content:"转换处于运行状态,禁止此操作,请先手动从队列中移除任务!"})
            return ;
          }
        self.transModal = false;
        self.$Modal.confirm({
          title: "删除转换",
          width:450,
          render: (h) => {
            return h(transModal, {
              props: {
                transId: row.transId,
                transModal: self.transModal
              }
            })
          },
          onOk: function () {
            self.transModal = true;
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
    color: #ffffff;
  }
</style>
