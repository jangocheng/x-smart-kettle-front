<template>
  <div>
    <xtl-table
      :columns="tableColumns"
      :pageDisable="true"
      :stripe="false"
      :border="false"
      :showTableOption="false"
      v-bind="tableProps"
    >
    </xtl-table>
  </div>
</template>

<script>
  import util from '@/libs/util.js';
  import config from '@/config/config';
  import tableProgress from './table-progress'
  export default {
    name: "index",
    inject:['reload'],
    components: {
      tableProgress
    },
    props:{
      startDate:{
        type:String,
        default:''
      },
      endDate:{
        type:String,
        default:''
      }
    },
    data() {
      return {
        tableProps: {
          dataUrl:config.xtlServerContext + "/api/xjob/qryTransWarningInfo",
          data: [],
          searchParams: {},
        }
      }
    },
    computed: {
      searchParams(){
        let searchForm ={
          createDateEnd:this.startDate,
          createDateBegin: this.endDate
        }
        return  Object.assign({}, searchForm);
      },
      tableColumns() {
        let columns = [];
        let self = this;
        columns.push({
            title: "排名",
            type:'index',
            align: "center",
            width: "80",
            render: (h, params) => {
              let index = params.row.index
              if(index ==1){
                return h('div', [
                  h('Icon', {
                    props: {
                      type: 'ios-ribbon',
                      color:'#ff0000',
                      size:30
                    }
                  }),

                ]);
              }else if(index == 2){
                return h('div', [
                  h('Icon', {
                    props: {
                      type: 'ios-ribbon',
                      color:'#ff2ba2',
                      size:30
                    }
                  }),

                ]);
              }else if(index ==3 ){
                return h('div', [
                  h('Icon', {
                    props: {
                      type: 'ios-ribbon',
                      color:'#ff8a24',
                      size:30
                    }
                  }),

                ]);
              }else {
                return h('div', [
                  h('strong', params.row.index)
                ]);
              }

            }
          },
          {
            title: "实例名称",
            align: "center",
            key:'target_name',
            width: "150",
            className: 'demo-table-info-column'
          },
          {
            title: "异常占比",
            align: "left",
            width: "220",
            render: (h, params) => {
              return h(tableProgress, {
                props: {
                  percent: params.row.warning_records
                }
              })
            }

          },
          {
            title: "异常实例数",
            align: "left",
            key:'date',
            className: 'demo-table-info-column',
            width: "120",
            render: (h, params) => {
              return h('div', [
                h('strong', params.row.warning_records)
              ]);
            }
          }
        );
        return columns;
      }
    },
    mounted() {
    },
    methods: {

    },
  }
</script>

<style>
  .ivu-table td.demo-table-info-column{
    color: #19BE6B;
    font-weight: bold;
  }
</style>
