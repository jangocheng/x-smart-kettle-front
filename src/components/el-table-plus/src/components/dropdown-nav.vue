<template>
  <div>
    <Dropdown class="table-option-dropdown" trigger="custom" :visible="optionDropdownVisible"
              placement="bottom-end" style="display: inline-block;float: right;">
      <ButtonGroup>
        <Button icon="md-refresh" title="刷新表格数据" @click="tableRefresh"></Button>
        <Button icon="ios-keypad" title="表格选项" @click="tableSettingToggle">
          <Icon type="ios-arrow-down"></Icon>
        </Button>
      </ButtonGroup>
      <DropdownMenu slot="list" style="width:400px;height:225px;padding:5px 10px;">
        <Tabs type="card"   name="elTable">
          <TabPane label="导出"  tab="elTable">
            <export-data :tableColumns="tableColumns" :tableDatas="tableDatas" :spanColumns="spanColumns"
                         :tableName="tableName" :dataUrl="dataUrl" :searchParams="searchParams"
                         :show-summary="showSummary" :summary-method="summaryMethod"></export-data>

          </TabPane>
          <!-- <TabPane label="列筛选"  tab="elTable">
             <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
               <Checkbox :value="checkAll" @on-change="handleCheckAll">全选</Checkbox>
             </div>
             <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
               <Checkbox v-for="(item, index) in tableColumns" :key="index" :label="item.label"
                         v-if="item.label"></Checkbox>
               <br/><br/>
               <Button type="primary" long @click="columnSelect">确定</Button>
             </CheckboxGroup>
           </TabPane>-->
          <!--<TabPane label="样式"  tab="elTable">
            显示边框
            <i-switch v-model="tableBorder" style="margin-right: 5px"></i-switch>
            显示斑马纹
            <i-switch v-model="tableStripe" style="margin-right: 5px"></i-switch>
            显示表头
            <i-switch v-model="tableShowHeader" style="margin-right: 5px"></i-switch>
            <br><br> 表格尺寸
            <Radio-group v-model="tableSize" type="button">
              <Radio label="large">大</Radio>
              <Radio label="default">中(默认)</Radio>
              <Radio label="small">小</Radio>
            </Radio-group>
            <br><br>
            <Button type="default" long @click="setTableStyleGlobal">应用为全局样式</Button>
          </TabPane>-->
        </Tabs>
        <Button type="primary" icon="md-close" size="small" title="关闭"
                style="position:absolute;top:10px;right:10px;"
                @click="closeTableSettingDropdown"></Button>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>

  import exportData from './export-data'
  import {deepCopy} from "@/libs/assist";

  export default {
    name: "dropdown-nav",
    components: {
      exportData
    },
    props: {
      tableName: {
        type: String,
        default: '表格数据'
      },
      dataUrl: {
        type: String,
        default: ''
      },
      searchParams: {
        type: Object
      },
      data: {
        type: Array,
        default: () => []
      },
      columns: {
        type: Array,
        request: true
      },
      spanColumns: {
        type: Array,
        default: () => []
      },
      showSummary:{
        type:Boolean,
        default:false
      },
      summaryMethod:Function
    },
    data() {
      return {
        checkAll: true,
        optionDropdownVisible: false,
        tableColumns: [],
        tableDatas: [],
        checkAllGroup: []
      }
    },
    mounted() {
      this.tableColumns = deepCopy(this.columns)
      this.tableDatas = deepCopy(this.data)
      this.checkAllGroup = deepCopy(this.columnNameArr)
    },
    watch: {
      columns(val) {
        this.tableColumns = deepCopy(val)
        this.checkAllGroup = deepCopy(this.columnNameArr)
      },
      data(val) {
        this.tableDatas = deepCopy(val)
      }
    },
    computed: {
      columnNameArr() {
        let labels = []
        for (var column of this.columns) {
          if (column.hasOwnProperty('label')) {
            labels.push(column.label)
          }
        }
        return labels
      }
    },
    methods: {
      tableRefresh() {
        this.$emit('change-columns', this.columns)
        // this.$Message.info('该功能尚在开发中......')
      },
      columnSelect() {
        let self = this;
        var columnsObj = deepCopy(this.columns)
        let columns = []
        columnsObj.forEach(column => {
          for (let colName of self.checkAllGroup) {
            if (!column.hasOwnProperty('label') || column.label == colName) {
              columns.push(column)
              break
            }
          }
        })
        this.$emit('change-columns', columns)
        this.optionDropdownVisible = false
      },
      handleCheckAll() {
        this.checkAll = !this.checkAll;
        if (this.checkAll) {
          this.checkAllGroup = deepCopy(this.columnNameArr)
        } else {
          this.checkAllGroup = [];
        }
      },
      checkAllGroupChange(data) {
        if (data.length === this.columnNameArr.length) {
          this.checkAll = true;
        } else if (data.length > 0) {
          this.checkAll = false;
        } else {
          this.checkAll = false;
        }
      },
      tableSettingToggle() {
        this.optionDropdownVisible = !this.optionDropdownVisible
      },
      closeTableSettingDropdown() {
        this.optionDropdownVisible = false
      },

    }
  }
</script>

<style>

</style>
