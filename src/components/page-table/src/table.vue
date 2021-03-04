<template>
  <div class="xtl-grid-table">
    <exportData ref="exportPart" style="display: none"
                :tableColumns="tableColumns"
                :dataUrl="dataUrl"
                :searchParams="searchParams"
                :sortParams="sortParams"
                :paginationParams="paginationParams"
                :exportName="exportName">
    </exportData>
    <slot name="search">
    </slot>
    <Row v-if="showTableOption">
      <i-col span="21">
        <div class="buttons">
          <slot name="buttons">
          </slot>
        </div>
      </i-col>
      <i-col span="3" class="table-extend" style="float: right">
        <Dropdown class="table-option-dropdown" trigger="custom" :visible="optionDropdownVisible"
                  placement="bottom-end"
                  style="float:right">
          <ButtonGroup>
            <Button icon="md-refresh" title="刷新表格数据" @click="tableRefresh"></Button>
            <Button icon="ios-keypad" title="表格选项" @click="tableSettingToggle">
              <Icon type="ios-arrow-down"></Icon>
            </Button>
          </ButtonGroup>
          <DropdownMenu slot="list" style="width:400px;height:225px;padding:5px 10px;">
            <Tabs type="card" name="XtlPageTable">
              <TabPane tab="XtlPageTable" label="导出">
                <export-data
                    :tableColumns="tableColumns"
                    :dataUrl="dataUrl"
                    :searchParams="searchParams"
                    :sortParams="sortParams"
                    :paginationParams="paginationParams"
                    :tableName="tableName"
                    :show-summary="tableShowSummary"
                    :summary-method="tableSummaryMethod"
                    :parsedColumns="parsedColumns">
                </export-data>
              </TabPane>
              <TabPane tab="XtlPageTable" label="列筛选">
                <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
                  <Checkbox :value="checkAll" @on-change="handleCheckAll">全选</Checkbox>
                </div>
                <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
                  <Checkbox v-for="(item, index) in columns" :key="item.key" :label="item.title"
                            v-if="item.title"></Checkbox>
                  <br/><br/>
                  <Button type="primary" @click="columnSelect" class="table-column-select-btn">筛 选</Button>
                  <Button type="primary" @click="columnSave" class="table-column-select-btn" style="margin-left: 8px;">保 存</Button>
                  <Button type="default" @click="columnClear" class="table-column-select-btn" style="margin-left: 8px;">清 除</Button>
                </CheckboxGroup>

              </TabPane>
              <!--<TabPane label="样式">
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
      </i-col>
    </Row>
    <Row style="margin-top:10px;">
      <i-col span="24">
        <Table
            ref="tableRef"
            :columns="tableColumns"
            :data="tableData"
            :stripe="tableStripe"
            :border="tableBorder"
            :show-summary="tableShowSummary"
            :showHeader="tableShowHeader"
            :width="tableWidth"
            :height="tableHeight"
            :loading="tableLoading"
            :disabledHover="disabledHover"
            :highlightRow="highlightRow"
            :rowClassName="rowClassName"
            :size="tableSize"
            :noDataText="noDataText"
            :noFilteredDataText="noFilteredDataText"
            :draggable="draggable"
            :tooltip-theme="tooltipTheme"
            :summaryMethod="tableSummaryMethod"
            :spanMethod="tableSpanMethod"
            @on-sort-change="onSortChange"
            @on-current-change="onCurrentChange"
            @on-select="onSelect"
            @on-select-cancel="onSelectCancel"
            @on-select-all="onSelectAll"
            @on-selection-change="onSelectionChange"
            @on-filter-change="onFilterChange"
            @on-row-click="onRowClick"
            @on-row-dblclick="onRowDblclick"
            @on-expand="onExpand"
            @on-drag-drop="onDragDrop"
            @on-column-width-resize="onColumnWidthResize"
            v-if="hackReset"
        >
          <div slot="header" v-if="slots.header">
            <slot name="header"></slot>
          </div>
          <div slot="footer" v-if="slots.footer">
            <slot name="footer"></slot>
          </div>
          <div slot="loading" v-if="slots.loading">
            <slot name="loading"></slot>
          </div>
        </Table>
      </i-col>
    </Row>
    <Row v-if="!pageDisable" style="margin-top:5px;">
      <i-col span="24" style="text-align:right">
        <Page
            :total="totalNumber"
            :current="currentPage"
            :page-size-opts="pageSizeOpts"
            show-sizer
            show-total
            show-elevator
            @on-change="onPageChange"
            @on-page-size-change="onPageSizeChange">
        </Page>
      </i-col>
    </Row>
  </div>
</template>
<script>
  import util from '@/libs/util';
  import {deepCopy} from '@/libs/assist';
  import md5 from "@/libs/md5";
  import exportData from "./components/export-data.vue";
  import ICol from "view-design/src/components/grid/col";

  export default {
    name: "XtlTable",
    props: {
      tableName: {
        type: String,
        default: '表格数据'
      },
      //是否显示分页
      pageDisable: {
        type: Boolean,
        default: false
      },
      //取数的url
      dataUrl: {
        type: String,
        default: ''
      },
      //查询条件
      searchParams: {
        type: Object
      },
      data: {
        type: Array,
        default() {
          return [];
        }
      },
      columns: {
        type: Array,
        default() {
          return [];
        }
      },
      size: {
        type: String,
        validator(value) {
          return ['small', 'large', 'default'].indexOf(value) > -1;
        }
      },
      width: {
        type: [Number, String]
      },
      height: {
        type: [Number, String]
      },
      stripe: {
        type: Boolean,
        default: true
      },
      border: {
        type: Boolean,
        default: true
      },
      showHeader: {
        type: Boolean,
        default: true
      },
      highlightRow: {
        type: Boolean,
        default: false
      },
      rowClassName: {
        type: Function,
        default() {
          return '';
        }
      },
      context: {
        type: Object
      },
      noDataText: {
        type: String
      },
      noFilteredDataText: {
        type: String
      },
      disabledHover: {
        type: Boolean
      },
      loading: {
        type: Boolean,
        default: false
      },
      showTableOption: {
        type: Boolean,
        default: true
      },
      exportName: String,
      transformRequest: {
        type: Function,
        default: function (data) {
          return data;
        }
      },
      transformResponse: {
        type: Function,
        default: function (data) {
          return data;
        }
      },
      draggable: {
        type: Boolean,
        dafault: false
      },
      tooltipTheme: {
        type: String,
        default: 'dark'
      },
      showSummary: {
        type: Boolean,
        default: false
      },
      summaryMethod: {
        type: Function
      },
      spanMethod: {
        type: Function
      },
      autoSearch: {
        type: Boolean,
        default: true
      },
      pageSizeOpts: {
        type: Array,
        default: function () {
          return  [1, 5, 10, 20, 50, 100, 200];
        }
      }
    },
    destroyed() {
      this.optionDropdownVisible = false
    },

    deactivated() {
      this.optionDropdownVisible = false
    },
    activated() {
      if (this.autoSearch) {
        this.tableRefresh();
      }
    },
    data() {
      return {
        tableData: this.data,
        tableWidth: this.width,
        tableHeight: this.height,
        tableLoading: this.loading,
        cloneColumns: [],
        //样式相关
        tableStripe: "tableStripe" in localStorage ? localStorage.getItem("tableStripe") !== "false" : this.stripe,
        tableBorder: "tableBorder" in localStorage ? localStorage.getItem("tableBorder") !== "false" : this.border,
        tableShowHeader: "tableShowHeader" in localStorage ? localStorage.getItem("tableShowHeader") !== "false" : this.showHeader,
        tableSize: "tableSize" in localStorage ? localStorage.getItem("tableSize") : this.size,
        tableShowSummary: this.showSummary,
        tableSummaryMethod: this.summaryMethod,
        tableSpanMethod: this.spanMethod,

        //单选控制
        isSingleSelectModel: false,
        selection: [],

        //分页相关参数
        totalNumber: 0,
        currentPage: 1,
        limitNumber: 10,
        //表格选项
        optionDropdownVisible: false,

        //列筛选
        checkAll: true,
        checkAllGroup: [],
        //导出格式
        dataExportFormat: "xlsx",
        //排序
        sortParams: {},
        //表格重置
        hackReset: true,
        columnID: '',


        parsedColumns:[]
      }
    },
    computed: {
      tableColumns() {
        let self = this;
        let columns = self.cloneColumns
        for (let i = 0; i < columns.length; i++) {
          let column = columns[i];
          if ("type" in column && column.type === "single-selection") {
            //当前iView版本单选要自己实现
            self.isSingleSelectModel = true;
            column.render = function (h, params) {
              let index = params.index;
              return h("Radio", {
                props: {
                  "value": self.selection[index] === undefined ? false : self.selection[index]
                },
                on: {
                  "on-change": function () {
                    self.selectOnChange(params.row, index);
                  }
                }
              })
            }
          }
        }
        return columns;
      },
      columnNameArr() {
        var arr = [];
        for (var column of this.columns) {
          arr.push(column.title);
        }
        return arr;
      },
      selectedColumnNameArr() {
        var arr = [];
        for (var column of this.cloneColumns) {
          arr.push(column.title);
        }
        return arr;
      },
      paginationParams() {
        var self = this;
        return {
          offset: (self.currentPage - 1) * self.limitNumber,
          limit: self.limitNumber
        }
      },
      slots() {
        return this.$slots;
      },
    },
    watch: {
      searchParams: {
        handler: function (val, oldVal) {
          //查询时重置页码
          this.currentPage = 1;
          this.tableRefresh();
        },
        deep: true
      },
      dataUrl: {
        handler: function (val, oldVal) {
          //查询时重置页码
          this.currentPage = 1;
          this.tableRefresh();
        },
        deep: true
      },
      columns: {
        handler: function (val, oldVal) {
          //查询时重置页码
          this.cloneColumns = deepCopy(val)
          this.currentPage = 1;
          this.tableRefresh();
          this.columnsFilter()
        },
        deep: true
      },
      data: {
        handler(val) {
          this.tableData = val
          this.totalNumber = val.length;
        },
        deep: true
      },
      showSummary: {
        handler(val) {
          this.tableShowSummary = val;
        }
      },
      optionDropdownVisible(val){
        if(val){
          this.parsedColumns = this.$refs.tableRef.cloneColumns
        }
      }
    },
    methods: {
      tableRefresh: function () {
        var self = this;
        if (self.dataUrl) {
          self.tableLoading = true;
          util.ajax.get(self.dataUrl, {
            params: Object.assign({}, self.pageDisable ? {} : self.paginationParams, self.sortParams, self.searchParams),
            transformRequest: [self.transformRequest],
            transformResponse: [self.transformResponse],
            responseType: 'json'
          }).then(function (resp) {
            if (resp.data) {
              //这里是为了做IE11兼容
              if (!util.isJson(resp.data)) {
                resp.data = JSON.parse(resp.data);
              }
              if (resp.data.code == 11000 || resp.data.code === "11000") {
                self.tableData = resp.data.data.rows;
                self.totalNumber = resp.data.data.total;
                self.$emit("on-data-load", resp.data);
              } else if (resp.data.code === 0) {
                alert("获取数据异常，请稍后重试");
              } else {
                self.tableData = resp.data.rows;
                self.totalNumber = resp.data.total;
              }
            }
            self.tableLoading = false;
          }).catch((err) => {
            self.tableLoading = false;
            this.$Message.error("分页数据获取异常,错误信息:" + err);
          });
        } else {
          self.totalNumber = self.data.length;
        }
        this.optionDropdownVisible = false
      },
      columnsFilter() {
        // 根据localStorage筛选列
        let self = this
        this.columnID = md5.MD5(JSON.stringify(this.$route.path + this.columns.length))
        let inColumns = this.columns
        let selectedColumn = new Array()
        let localColumnList = localStorage.getItem("tableColumns")
        if (localColumnList != null) {
          let localColumn = JSON.parse(localColumnList)
          let currentColumn = localColumn.filter(item => {
            return item.id == self.columnID
          })
          if (currentColumn.length == 1) {
            let list = currentColumn[0].value
            inColumns.forEach(item => {
              let characters = ""
              characters += item.key || ""
              characters += item.type || ""
              characters += item.title
              if (characters != "") {
                let coloumn = list.filter((it, index, arr) => it == characters)
                if (coloumn.length >= 1) {
                  selectedColumn.push(item)
                }
              }

            })
          }
        }
        if (selectedColumn.length > 0) {
          this.cloneColumns = deepCopy(selectedColumn)
        } else {
          this.cloneColumns = deepCopy(this.columns)
        }
        if (this.columns.length != this.cloneColumns.length) {
          this.checkAll = false
        }
        this.checkAllGroup = this.selectedColumnNameArr.slice(0);
      },
      getParams: function () {
        return Object.assign({}, this.paginationParams, this.sortParams, this.searchParams)
      },
      exportOper: function (type) {
        this.$refs.exportPart.exportExcel(type);
      },
      onPageChange: function (currentPageIndex) {
        this.currentPage = currentPageIndex;
        this.tableRefresh();
        this.$emit("on-page-change", currentPageIndex)
      },
      onPageSizeChange: function (currentLimitNumber) {
        this.limitNumber = currentLimitNumber;
        this.tableRefresh();
        this.$emit("on-page-size-change", currentLimitNumber)
      },
      handleCheckAll() {
        this.checkAll = !this.checkAll;
        if (this.checkAll) {
          this.checkAllGroup = this.columnNameArr.slice(0);
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
        this.optionDropdownVisible = !this.optionDropdownVisible;
      },
      closeTableSettingDropdown() {
        this.optionDropdownVisible = false;
      },
      onSortChange(sortParams) {
        this.sortParams = {
          sort: sortParams.column.sortField || sortParams.key,
          order: sortParams.order == "normal" ? "" : sortParams.order
        };
        //排序时重置页码
        this.currentPage = 1;
        this.tableRefresh();
      },
      onCurrentChange(currentRow, oldCurrentRow) {
        this.$emit("on-current-change", currentRow, oldCurrentRow);
      },
      onSelect(selection, row) {
        this.$emit("on-select", selection, row);
      },
      onSelectCancel(selection, row) {
        this.$emit("on-select-cancel", selection, row);
      },
      onSelectAll(selection) {
        this.$emit("on-select-all", selection);
      },
      onSelectionChange(selection) {
        this.$emit("on-selection-change", selection);
      },
      onFilterChange(column, key, order) {
        this.$emit("on-filter-change", column, key, order);
      },
      getSelection() {
        return this.$refs.tableRef.getSelection();
      },
      onRowClick(row, index) {
        if (this.isSingleSelectModel) {
          this.selectOnChange(row, index);
          this.$emit("on-single-select", row, index);
        }
        this.$emit("on-row-click", row, index);
      },
      onRowDblclick(row, index) {
        this.$emit("on-row-dblclick", row, index);
      },
      onExpand(row, status) {
        this.$emit("on-expand", row, status);
      },
      onDragDrop(index1, index2) {
        this.$emit("on-drag-drop", index1, index2);
      },
      columnSelect: function () {
        let self = this;
        var columnsObj = self.columns
        let columns = []
        columnsObj.forEach(column => {
          for (let colName of self.checkAllGroup) {
            if (column.title === colName) {
              columns.push(column);
              break;
            }
          }
        })
        this.cloneColumns = columns
        this.optionDropdownVisible = false
      },
      columnSave() {
        let self = this
        this.columnSelect()
        let columnKeys = new Array()
        this.cloneColumns.forEach(item => {
          let characters = ""
          characters += item.key || ""
          characters += item.type || ""
          characters += item.title
          if (characters != "") {
            columnKeys.push(characters)
          }
        })
        let localColumnListStr = localStorage.getItem("tableColumns")
        let localColumnList = null
        if (localColumnListStr == null) {
          localColumnList = new Array()
        } else {
          localColumnList = JSON.parse(localColumnListStr)
          let index = localColumnList.findIndex(column => column.id == self.columnID)
          if (index > -1) {
            localColumnList.splice(index, 1)
          }
        }
        localColumnList.push({id: self.columnID, value: columnKeys})
        localStorage.setItem("tableColumns", JSON.stringify(localColumnList))
        this.optionDropdownVisible = false
      },
      columnClear() {
        let self = this
        let localColumnListStr = localStorage.getItem("tableColumns")
        let localColumnList = null
        if (localColumnListStr == null) {
          localColumnList = new Array()
        } else {
          localColumnList = JSON.parse(localColumnListStr)
          let index = localColumnList.findIndex(column => column.id == self.columnID)
          if (index > -1) {
            localColumnList.splice(index, 1)
          }
        }
        localStorage.setItem("tableColumns", JSON.stringify(localColumnList))
        this.cloneColumns = deepCopy(this.columns)
        this.checkAll = false
        this.handleCheckAll()
        this.optionDropdownVisible = false
      },
      setTableStyleGlobal: function () {
        window.localStorage.setItem("tableBorder", this.tableBorder);
        window.localStorage.setItem("tableStripe", this.tableStripe);
        window.localStorage.setItem("tableShowHeader", this.tableShowHeader);
        window.localStorage.setItem("tableSize", this.tableSize);
        this.optionDropdownVisible = false
        this.$Message.success('应用全局样式成功');
      },
      getTableInstance: function () {
        return this.$refs.tableRef;
      },
      //组件重新渲染方法
      forceUpdate: function () {
        this.hackReset = false
        this.$nextTick(() => {
          this.hackReset = true
        })
      },
      //单选
      selectOnChange: function (row, index) {
        this.selection = Array(index).fill(false);
        this.selection.splice(index, 1, true);
        this.selectStore = [row];
      },
      onColumnWidthResize: function (newWidth, oldWidth, column, event) {
        this.$emit("on-column-width-resize", newWidth, oldWidth, column, event);
      }
    },
    created() {
      this.cloneColumns = deepCopy(this.columns)
    },
    mounted() {
      if (this.autoSearch) {
        this.tableRefresh();
      }
      this.columnsFilter();
    },
    components: {
      ICol,
      exportData
    }
  }
</script>
<style>

</style>
