<template>
    <div class="xtl-edit-table" :class="{hasSumLine:hasSumLine}">
        <slot name="search">
        </slot>
        <Row>
            <i-col :span="showTableOption?21:24">
                <div class="buttons">
                    <slot name="buttons">
                    </slot>
                </div>
            </i-col>
            <i-col :span="showTableOption?3:0" v-if="showTableOption" style="float: right">
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
                        <Tabs type="card">
                            <TabPane label="导出">
                                <export-data :tableColumns="tableColumns" :tableDatas="tableDatas"
                                             :tableName="tableName"></export-data>
                            </TabPane>
                            <TabPane label="列筛选">
                                <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
                                    <Checkbox :value="checkAll" @on-change="handleCheckAll">全选</Checkbox>
                                </div>
                                <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
                                    <Checkbox v-for="(item, index) in columns" :key="item.key" :label="item.title"
                                              v-if="item.title"></Checkbox>
                                    <br/><br/>
                                    <Button type="primary" @click="columnSelect" class="table-column-select-btn">筛 选
                                    </Button>
                                    <Button type="primary" @click="columnSave" class="table-column-select-btn" style="margin-left: 8px;">保
                                        存
                                    </Button>
                                    <Button type="default" @click="columnClear" class="table-column-select-btn" style="margin-left: 8px;">清
                                        除
                                    </Button>
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
        <Table id="tabledatas" ref="table" :columns="tableColumns"
               :data="tableDatas"
               :stripe="tableStripe"
               :border="tableBorder"
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
               :rowKey="true"
               @on-sort-change="onSortChange"
               @on-current-change="onCurrentChange"
               @on-select="onSelect"
               @on-select-cancel="onSelectCancel"
               @on-select-all="onSelectAll"
               @on-selection-change="onSelectionChange"
               @on-filter-change="onFilterChange"
               @on-row-click="onRowClick"
               @on-row-dblclick="onRowDblclick"
               @on-expand="onExpand">
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
    </div>
</template>

<script>
    import EditorPlugin from "./components/editorPlugin.js";
    import {deepCopy} from '@/libs/assist';
    import ExportData from "./components/export-data";
    import md5 from "@/libs/md5";

    export default {
        components: {ExportData},
        name: 'XtlEditTable',
        props: {
            tableName: {
                type: String,
                default: '表格数据'
            },
            columns: {
                type: Array,
                default: () => []
            },
            value: {
                type: Array,
                default: () => []
            },
            sumLineData: {
                type: Object,
                default: () => {
                }
            },
            size: {
                validator(value) {
                    return ['small', 'large', 'default'].indexOf(value) !== -1
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
                default: false
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
            loading: {
                type: Boolean,
                default: false
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
            showTableOption: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                tableColumns: [],
                tableDatas: [],
                cloneColumns: [],
                tableWidth: this.width,
                tableHeight: this.height,
                tableLoading: this.loading,

                //样式相关
                tableStripe: this.stripe,
                tableBorder: this.border,
                tableShowHeader: this.showHeader,
                tableSize: this.size,

                optionDropdownVisible: false,
                checkAll: true,
                checkAllGroup: [],
                columnID: ''
            };
        },
        computed: {
            hasSumLine() {
                if (this.sumLineData && Object.keys(this.sumLineData).length !== 0) {
                    return true;
                } else {
                    return false;
                }

            },
            slots() {
                return this.$slots;
            },
            columnNameArr() {
                var arr = [];
                let tableColumnsClone = deepCopy(this.columns);
                for (var column of tableColumnsClone) {
                    arr.push(column.title);
                }
                return arr;
            },
            selectedColumnNameArr() {
                var arr = [];
                let tableColumnsClone = deepCopy(this.tableColumns);
                for (var column of tableColumnsClone) {
                    arr.push(column.title);
                }
                return arr;
            },
        },
        watch: {
            columns: {
                handler() {
                    let tableColumnsClone = deepCopy(this.columns);
                    this.findEditorInColumn(tableColumnsClone);
                    this.tableColumns = tableColumnsClone;
                },
                deep: true
            },
            value: {
                handler() {
                    let tableDatasClone = deepCopy(this.value);
                    this.tableDatas = tableDatasClone;
                    if (this.hasSumLine) {
                        this.tableDatas.push(this.sumLineData);
                    }
                },
                deep: true
            },
            loading(val){
                this.tableLoading=val
            }
        },
        created() {

        },
        mounted() {
            this.init();
            // this.checkAllGroup = this.columnNameArr.slice(0);
        },
        methods: {
            init: function () {
                let self = this
                let tableDatasClone = deepCopy(this.value);
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
                                let coloumn = list.filter(it => it == characters)
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
                this.tableColumns = deepCopy(this.cloneColumns);
                this.findEditorInColumn(this.tableColumns);
                this.checkAllGroup = this.selectedColumnNameArr.slice(0);
                this.tableDatas = tableDatasClone;
                if (this.hasSumLine) {
                    this.tableDatas.push(this.sumLineData);
                }
            },
            findEditorInColumn: function (columns) {
                let self = this;
                for (let column of columns) {
                    if ("editor" in column) {
                        column.render = (h, param) => {
                            //有过滤器的情况
                            if (column.editor.hasOwnProperty("filter") && !column.editor.filter(param)) {
                                return h('span', param.row[param.column.key]);
                            }
                            //有合计行的情况
                            else if (self.hasSumLine && param.index === self.tableDatas.length - 1) {
                                return h('span', param.row[param.column.key]);
                            }
                            //默认情况
                            else {
                                return h(EditorPlugin, {
                                    props: {
                                        row: param.row,
                                        column: param.column,
                                        index: param.index
                                    },
                                    on: {
                                        "cell-on-change": function (param) {
                                            self.cellOnChange(param);
                                        }
                                    }
                                })
                            }

                        }
                    }
                    if (column.hasOwnProperty("children")) {
                        let columnChildren = column.children;
                        this.findEditorInColumn(columnChildren);
                    }
                }
            },
            cellOnChange: function (param) {
                let callbackEvent = param.callbackEvent, rowIndex = param.rowIndex, columnKey = param.columnKey,
                    value = param.value;
                if (callbackEvent) {
                    this.$emit(callbackEvent, value, rowIndex, columnKey);
                } else {
                    for (let i = 0, len = this.value.length; i < len; i++) {
                        if (i === rowIndex) {
                            let item = this.value[i];
                            if (!this.hasSumLine) {
                                //先删除这个key再对这个key赋值,目的是避免触发表格的重绘
                                delete item[columnKey];
                                item[columnKey] = value;
                            }
                            this.$set(item, columnKey, value);
                            this.$emit("input", this.value);
                        }
                    }
                }

            },
            tableRefresh() {
                let tableColumnsClone = deepCopy(this.columns);
                let tableDatasClone = deepCopy(this.value);
                this.findEditorInColumn(tableColumnsClone);
                this.tableColumns = tableColumnsClone;
                this.tableDatas = tableDatasClone;
                if (this.hasSumLine) {
                    this.tableDatas.push(this.sumLineData);
                }
                this.checkAllGroup = deepCopy(this.columnNameArr)
                this.checkAll = true
                this.optionDropdownVisible = false
            },
            tableSettingToggle() {
                this.optionDropdownVisible = !this.optionDropdownVisible;
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
            columnSelect() {
                let self = this;
                var columnsObj = deepCopy(this.columns)
                let columns = []
                columnsObj.forEach(column => {
                    for (let colName of self.checkAllGroup) {
                        if (column.title === colName) {
                            columns.push(column);
                            break;
                        }
                    }
                })
                this.tableColumns = columns
                this.findEditorInColumn(this.tableColumns);

                this.optionDropdownVisible = false
            },
            columnSave() {
                let self = this
                this.columnSelect()
                let columnKeys = new Array()
                this.tableColumns.forEach(item => {
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
                this.tableColumns = deepCopy(this.columns)
                this.findEditorInColumn(this.tableColumns);
                this.checkAll = false
                this.handleCheckAll()
                this.optionDropdownVisible = false
            },
            closeTableSettingDropdown() {
                this.optionDropdownVisible = false
            },
            getTableData: function () {
                return this.value;
            },
            onSortChange(sortParams) {
                this.$emit("on-sort-change", sortParams);
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
            onRowClick(row, index) {
                this.$emit("on-row-click", row, index);
            },
            onRowDblclick(row, index) {
                this.$emit("on-row-dblclick", row, index);
            },
            onExpand(row, status) {
                this.$emit("on-expand", row, status);
            },
            getSelection() {
                return this.$refs.table.getSelection();
            }
        }
    };
</script>
<style>

</style>

