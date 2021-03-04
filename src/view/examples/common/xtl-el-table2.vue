<template>
  <xtl-page>
    <xtl-search @do-search="gosearch">
      <Form ref="searchForm" :model="searchForm" :label-width="100">
        <FormItem label="订单编号:" prop="code">
          <Input v-model="searchForm.code" style="width: 160px"/>
        </FormItem>
        <FormItem label="类型:" prop="type">
          <Select v-model="searchForm.type" style="width:160px">
            <Option value="全部">全部</Option>
            <Option value="类型1">类型1</Option>
            <Option value="类型2">类型2</Option>
            <Option value="类型3">类型3</Option>
          </Select>
        </FormItem>
        <FormItem label="批准人:" prop="person">
          <Input v-model="searchForm.person" style="width:160px"/>
        </FormItem>
      </Form>
    </xtl-search>
    <xtl-el-table
      :dataUrl="dataUrl"
      :searchParams="searchParams"
      show-summary
      height="400"
      stripe
      extendType="loadmore"
      :summary-method="getSummaries">
      <el-table-column
        type="selection"
        align="center"
        width="55">
      </el-table-column>
      <el-table-column
        prop="Name"
        label="Name"
        align="center"
        width="180">
      </el-table-column>
      <el-table-column
        prop="Status"
        align="center"
        label="Status">
        <template slot-scope="{row}">
          <Tag type="dot" :color="statusMap[row.Status]">{{row.Status}}</Tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="Portrayal"
        align="right"
        sortable="custom"
        label="Portrayal">
      </el-table-column>
      <el-table-column
        prop="People"
        align="right"
        sortable="custom"
        label="People">
      </el-table-column>
      <el-table-column
        prop="Sampling Time"
        label="Sampling Time"
        align="right">
      </el-table-column>
      <el-table-column
        prop="Updated Time"
        label="Updated Time"
        align="right">
      </el-table-column>
    </xtl-el-table>
  </xtl-page>
</template>


<script>
  import util from '@/libs/util'
  import config from '@/config/config'

  export default {
    components: {

    },
    data() {
      return {
        dataUrl: config.mockServerContext + "/test/eltable2",
        sumLineData: {},
        searchParams: {},
        statusMap:{
          'Fail':'error',
          'Success':'success',
          'Working':'primary'
        },
        searchForm: {
          code: '',
          type: '',
          person: ''
        }
      };
    },
    mounted() {
      this.getSumLine()
    },
    methods: {
      getSumLine() {
        let self = this;
        util.ajax.get(config.mockServerContext + "/test/eltablesum2", {params: this.searchParams}).then((resp) => {
          if (resp.data.code === '000') {
            self.sumLineData = resp.data.data
          }
        })
      },
      getSummaries(param) {
        let {columns} = param;
        let sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          } else if (column.property == "People") {
            sums[index] = this.sumLineData["PeopleQty"] + '人';
            return;
          }else if (column.property == "Portrayal") {
            sums[index] = this.sumLineData["PortrayalQty"] + '个';
            return;
          } else {
            sums[index] = '-';
          }
        });
        return sums
      },
      gosearch() {
        this.searchParams = Object.assign({}, this.searchForm)
        this.getSumLine()
      }
    }
  };
</script>

<style>
</style>
