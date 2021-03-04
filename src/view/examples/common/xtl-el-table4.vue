<template>
  <xtl-page>
    <!--:dataUrl="dataUrl"-->
    <xtl-search @do-search="gosearch">
      <Form ref="searchForm" :model="searchForm" :label-width="80">
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
            :data="tableDate"
            :searchParams="searchParams"
            show-summary
            height="400"
            stripe
            extendType="all"
            :summary-method="getSummaries">
      <el-table-column
              type="index"
              align="center"
              label="序号"
              width="55">
      </el-table-column>
      <el-table-column
              prop="title"
              label="标题"
              show-overflow-tooltip
              min-width="200">
        <template slot-scope="{row}">
          <a>{{ row.title.substr(0,30)+"..." }}</a>
        </template>
      </el-table-column>
      <el-table-column
              prop="author"
              align="center"
              label="作者"
              min-width="100"
      >
        <template slot-scope="{row}">
          <Tag type="border">{{row.author}}</Tag>
        </template>
      </el-table-column>
      <el-table-column
              prop="type"
              sortable="custom"
              label="国家"
              align="center"
              min-width="100">
      </el-table-column>
      <el-table-column
              prop="importance"
              sortable="custom"
              label="重要性"
              min-width="100">
        <template slot-scope="{row}">
          <Icon v-for="item in row.importance" :key="item" size="20" type="ios-star"/>
        </template>
      </el-table-column>
      <el-table-column
              prop="readers"
              sortable="custom"
              label="阅读数"
              align="right"
              min-width="100">
      </el-table-column>
      <el-table-column
              prop="status"
              sortable="custom"
              label="状态"
              min-width="100">
        <template slot-scope="{row}">
          <Tag type="dot" :color="statusMap[row.status]">{{row.status}}</Tag>
        </template>
      </el-table-column>
      <el-table-column
              prop="timestamp"
              label="时间"
              align="center"
              min-width="130">
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
                dataUrl: config.mockServerContext + "/test/eltable3",
                tableDate: [],
                sumLineData: {},
                searchParams: {},
                searchForm: {
                    code: '',
                    type: '',
                    person: ''
                },
                statusMap: {
                    'draft': 'error',
                    'published': 'primary'
                }
            };
        },
        mounted() {
            for (var i = 0; i < 8000; i++) {
                this.tableDate.push(
                    {
                        "timestamp": "2009-01-04 07:09:35",
                        "title": "Tdsu Tgeomqrltc Jqcby Imnxpk Kbedhd Ivzekfkm",
                        "type": "JP",
                        "importance": 3,
                        "status": "draft",
                        "readers": 2232,
                        "author": "Sandra"
                    }
                )
            }
            this.getSumLine()
        },
        methods: {
            getSumLine() {
                let self = this;
                util.ajax.get(config.mockServerContext + "/test/eltablesum3", {params: this.searchParams}).then((resp) => {
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
                    } else if (column.property == "readers") {
                        sums[index] = this.sumLineData["readersQty"] + '次';
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
