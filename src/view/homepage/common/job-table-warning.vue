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
          dataUrl:config.xtlServerContext + "/api/xjob/qryJobWarningInfo",
          data: [],
          searchParams:{
            createDateEnd:'',
            createDateBegin: ''
          }
         }
      }
    },
    computed: {


    },
    watch:{
      startDate:{
        handler(newVal, oldVal) {
          this.tableProps.searchParams = Object.assign({}, {createDateBegin:newVal,});
        },
        deep: true //对象内部属性的监听，关键。
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
