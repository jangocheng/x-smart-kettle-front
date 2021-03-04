<template>
  <div class="export-data">
    <Row>
      <Form :label-width="70" v-model="form">
        <FormItem label="导出格式:">
          <Select v-model="form.fileFormat" style="width:270px">
            <Option value="xlsx" key="xlsx">xlsx</Option>
            <Option value="csv" key="csv">csv</Option>
          </Select>
        </FormItem>
        <FormItem label="文件名:">
          <Input v-model="form.fileName" style="width:270px" icon="document" placeholder="自定义文件名"/>
        </FormItem>
        <FormItem>
          <Button type="primary" :loading="exportCurrentLoading" @click="exportCurrentPage">导出当前</Button>
          <Button type="primary" v-if="dataUrl!=''" :loading="exportAllLoading" ghost @click="exportAllData" style="margin-left: 8px">导出全部
          </Button>
        </FormItem>
      </Form>
    </Row>
  </div>
</template>

<script>
  import util from '@/libs/util.js';
  import excel from '@/libs/excel';
  import {deepCopy} from "@/libs/assist";

  export default {
    name: "expor-data",
    props: {
      tableName: {
        type: String,
        default: '表格数据'
      },
      tableColumns: {
        type: Array,
        default() {
          return [];
        }
      },
      tableDatas: {
        type: Array,
        default: () => []
      },
      spanColumns: {
        type: Array,
        default: () => []
      },
      dataUrl: {
        type: String,
        default: ''
      },
      searchParams: {
        type: Object
      },
      showSummary:{
        type:Boolean,
        default:false
      },
      summaryMethod:Function
    },
    data() {
      return {
        exportCurrentLoading: false,
        exportAllLoading: false,
        form: {
          fileFormat: 'xlsx',
          fileName: this.tableName
        }
      }
    },
    methods: {
      exportAllData() {
        let self = this
        this.exportAllLoading = true
        let params = Object.assign({offset: 0, limit: 100000}, this.searchParams)
        util.ajax.get(this.dataUrl, {params: params}).then((resp) => {
          if (resp.data) {
            //这里是为了做IE11兼容
            if (!util.isJson(resp.data)) {
              resp.data = JSON.parse(resp.data);
            }
            let resultData = []
            if (resp.data.code === 11000 || resp.data.code === "11000") {
              resultData = resp.data.data.rows;
            } else {
              resultData = resp.data.rows;
            }
            if(this.showSummary){
              let sum = this.summaryData(this.tableDatas)
              resultData.push(sum)
            }
            this.exportExcel(resultData)
          }

        })
      },
      exportCurrentPage() {
        this.exportCurrentLoading = true
        let resultData = deepCopy(this.tableDatas)
        if(this.showSummary){
          let sum = this.summaryData(this.tableDatas)
          resultData.push(sum)
        }
        this.exportExcel(resultData)
      },
      summaryData(data){
        let sums = [];
        if (this.summaryMethod) {
          sums = this.summaryMethod({ columns: this.tableColumns, data:data });
        } else {
          this.tableColumns.forEach((column, index) => {
            if (index === 0) {
              sums[index] = '-';
              return;
            }
            const values = data.map(item => Number(item[column.property]));
            const precisions = [];
            let notNumber = true;
            values.forEach(value => {
              if (!isNaN(value)) {
                notNumber = false;
                let decimal = ('' + value).split('.')[1];
                precisions.push(decimal ? decimal.length : 0);
              }
            });
            const precision = Math.max.apply(null, precisions);
            if (!notNumber) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return parseFloat((prev + curr).toFixed(Math.min(precision, 20)));
                } else {
                  return prev;
                }
              }, 0);
            } else {
              sums[index] = '';
            }
          });
        }
        let total = {}
        this.tableColumns.forEach((column, index)=>{
          total[column.property] = sums[index]
        })
        return  total
      },
      exportExcel(tableData) {
        if (tableData.length) {
          let self = this
          let titles = excel.title_el_transform(this.tableColumns)
          let keys = excel.key_el_transform(this.tableColumns)
          let data = deepCopy(tableData)
          const params = {
            title: titles,
            key: keys,
            data: data,
            autoWidth: true,
            spanColumns: this.spanColumns,
            filename: this.form.fileName,
            format: this.form.fileFormat
          }
          excel.export_array_to_excel(params)

        } else {
          this.$Message.info('表格数据不能为空！')
        }
        this.exportCurrentLoading = false
        this.exportAllLoading = false
      },
    }
  };
</script>
<style>

</style>
