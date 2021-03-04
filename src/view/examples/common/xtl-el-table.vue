<template>
  <xtl-page>
    <xtl-drag-search></xtl-drag-search>
    <xtl-search>
      <Form :label-width="100">
        <FormItem label="订单编号:">
          <Input style="width: 160px"/>
        </FormItem>
        <FormItem label="制单日期:">
          <DatePicker type="date" format="yyyyMMdd"
                      style="width: 160px"></DatePicker>
        </FormItem>
        <FormItem label="类型:">
          <Select style="width:160px">
            <Option value="全部">全部</Option>
            <Option value="类型1">类型1</Option>
            <Option value="类型2">类型2</Option>
            <Option value="类型3">类型3</Option>
          </Select>
        </FormItem>
        <FormItem label="批准人:">
          <Input style="width:160px"/>
        </FormItem>
        <!--<FormItem>
          <Button type="primary" icon="ios-search">查询</Button>
        </FormItem>-->
      </Form>
    </xtl-search>
    <xtl-el-table
      :data="tableData"
      :spanColumns="spanColumns"
      :groupSum="groupSum"
      border>
      <div slot="buttons">
        <Button type="primary" ghost icon="ios-add">新增</Button>
        <Button type="primary" ghost icon="md-checkmark-circle-outline">确认</Button>
        <Button type="primary" ghost icon="logo-bitcoin">收款</Button>
        <Button type="primary" ghost icon="ios-browsers-outline">复核</Button>
        <Button type="primary" ghost icon="ios-print">开票</Button>

      </div>
      <el-table-column
        type="selection"
        align="center"
        width="55">
      </el-table-column>
      <el-table-column
        type="index"
        label="序号"
        width="55">
      </el-table-column>
      <el-table-column
        prop="company"
        label="公司名称"
        align="center"
        width="180">
      </el-table-column>
      <el-table-column
        prop="month"
        align="center"
        label="月份">
      </el-table-column>
      <el-table-column
        prop="name"
        align="center"
        label="人员">
      </el-table-column>
      <el-table-column
        prop="value"
        label="数量">
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <Button type="text" size="small"
            @click="handleEdit(scope.$index, scope.row)">编辑</Button>
          <Button type="text" size="small" style="margin-left: 10px;"
            @click="handleDelete(scope.$index, scope.row)">删除</Button>
        </template>
      </el-table-column>
    </xtl-el-table>
  </xtl-page>
</template>


<script>

  export default {
    components: {

    },
    data() {
      return {
        tableData: [
          {company: "inspur", month: "一月", name: "tom", value: 10},
          {company: "inspur", month: "一月", name: "jack", value: 11},
          {company: "inspur", month: "二月", name: "tom", value: 8},
          {company: "inspur", month: "二月", name: "jack", value: 11},
          {company: "maotai", month: "一月", name: "tom", value: 12},
          {company: "maotai", month: "一月", name: "jack", value: 13},
          {company: "maotai", month: "二月", name: "tom", value: 12},
          {company: "maotai", month: "二月", name: "jack", value: 13},
          {company: "aaa", month: "二月", name: "jack", value: 13}
        ],
        spanColumns: ["company", "month", "name"],
        groupSum: {
          groupKeys: ["company", "month"],
          labelColumns: ["name"],
          summaryMethod: function (datas) {
            let valueSum = 0;
            for (let i = 0; i < datas.length; i++) {
              valueSum += datas[i].value
            }
            return {value: valueSum};
          }
        }
      };
    },
    methods: {
      getdata(evt) {
        console.log(evt.draggedContext.element.id)
      },
      datadragEnd(evt) {
        console.log('拖动前的索引 :' + evt.oldIndex)
        console.log('拖动后的索引 :' + evt.newIndex)
        console.log(this.tags)
      },
      handleEdit(index, row) {
        console.log(index, row);
      },
      handleDelete(index, row) {
        console.log(index, row);
      }
    }
  };
</script>
<style>

</style>
