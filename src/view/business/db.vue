<template>
  <div>
    <xtl-page :show-header="false">
      <xtl-search @do-search="doSearch">
        <div>
          <Form :label-width="120">
            <FormItem label="业务库名">
              <Input v-model="searchForm.name" placeholder="按业务库名称查询" style="width: 200px"/>
            </FormItem>
            <FormItem label="连接方式">
              <Select v-model="searchForm.databaseContype" transfer :multiple="false" style="width: 200px;">
                <Option value="">请选择</Option>
                <Option value="">Native</Option>
                <Option value="">JNDI</Option>
              </Select>
            </FormItem>
          </Form>
        </div>
      </xtl-search>
      <xtl-table
         :columns="tableColumns"
                   v-bind="tableProps"
                    @on-row-click="onRowClick" border >
        <div slot="buttons">
          <Button   type='dashed' icon="ios-cash" @click="gotoAdd">新增业务库</Button>
        </div>
      </xtl-table>
     </xtl-page>
   </div>
</template>

<script>
  import util from '@/libs/util.js';
  import config from '@/config/config';


  // 设置为无效,则该作业将会废弃,不再执行
  const editOpButton = (vm, h, currentRow) => {
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
          vm.doEditOp(currentRow);
        }
      }
    }, '编辑');
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
    }, '删除');
  };


  export default {
    name: "index",
    inject:['reload'],
    components: {},
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
          name:'',
           databaseContype:''
        },
         databaseTypeList: [],
        selection: {
          id:'',
        },
        tableProps: {
          dataUrl: config.xtlServerContext + "/op/xdatabase/listPage",
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
            title: "业务库名",
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
            title: "主机名称",
            key: "hostName",
            align: "center",
            width: "120"
          },
          {
            title: "主机端口",
            key: "port",
            align: "center",
            width: "100"
          },
          {
            title: "数据库名",
            align: "left",
            key: 'databaseName',
            resizable: true,
            width: "200",
          },
          {
            title: "数据库类型",
            align: "left",
            key: 'databaseType',
            resizable: true,
            width: "200",
          },
          {
            title: "访问方式",
            align: "left",
            key: 'databaseContype',
            resizable: true,
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
             return h("div", [
              editOpButton(self,h,param.row),
              delOpButton(self,h,param.row)
            ]);

          }
        });
        return columns;
      }
    },
    mounted() {

    },
    methods: {

      doSearch() {
        this.tableProps.searchParams = Object.assign({}, this.searchForm);
      },

      onRowClick(val) {
         this.selection = val;
       },

      gotoAdd() {
        this.$router.push({
          name: '业务库编辑'
        });
      },

      doEditOp(row){
        let self = this
        let id = row.id
        self.$router.push({
          name: "业务库编辑",
          query: {
            id
          },
          params: {
            page: 'params'
          }
        });
      },
      doDelOp(row) {
          let self = this
        //移除业务库任务
        self.$Modal.confirm({
          title: '操作提示',
          content: '<p>执行此操作,业务库将会彻底删除,请谨慎操作!</p>',
          okText: '移除业务库',
          cancelText: '取消',
          onOk: () => {

            util.ajax.get(config.xtlServerContext+"/op/xdatabase/delete/"+row.id).then(function(resp) {
              let data = resp.data;
              if (data.code ===11000){
                self.$Message.success(data.message);
                self.reload();
              }
            }).catch((err) => {
              this.$Message.error("删除业务库异常,错误信息:" + err);
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

