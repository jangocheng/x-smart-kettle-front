<template>
    <Modal v-model="boxShow" :title="boxTitle" @on-cancel="onCancel" :mask-closable="false" :width="width" transfer>
        <div v-if="boxShow">
            <XtlSearch @do-search="doSearch">
                <slot>
                    <Form :label-width="100">
                        <FormItem label="搜索">
                            <Input v-model="searchText" placeholder="请输入搜索内容" style="width: 200px"/>
                        </FormItem>
                    </Form>
                </slot>
            </XtlSearch>
            <XtlTable ref="helpBoxTable" :dataUrl="tableUrl" :columns="tableColumnsClone" @on-row-click="onRowClick"
                        @on-selection-change="onSelectionChange"
                        @on-select="onSelect" @on-select-cancel="onSelectCancel"
                        @on-select-all="onSelectAll" @on-select-all-cancel="onSelectAllCancel"
                        :transformResponse="transformResponse"
                        :searchParams="searchParams" size="small" :showTableOption="false">

            </XtlTable>
        </div>
        <div slot="footer">
            <Button type="primary" ghost @click="onClear">{{clearText}}</Button>
            <Button type="primary" @click="onOk">确定</Button>
        </div>
    </Modal>
</template>

<script>
    import XtlTable from "../../page-table/src/table";
    import XtlSearch from "../../search-box/src/search-box";

    export default {
        name: "XtlHelp",
        components: {
            XtlTable,
            XtlSearch
        },
        props: {
            value: Boolean,
            url: String,
            columns: Array,
            title: {
                type: String,
                default: "帮助框"
            },
            width: {
                type: Number,
                default: 520
            },
            multiSelect: {
                type: Boolean,
                default: false
            },
            //外部查询条件
            helpBoxSearchParams: {
                type: Object,
                default: function () {
                    return {}
                }
            },
            clearText: {
                type: String,
                require: false,
                default: "清空"
            },
            rowKey: {
                type: String,
                require: false,
                default: ""
            }

        },
        data() {
            return {
                boxShow: this.value,
                searchText: "",
                reSetPages: false,
                selection: [],
                selectRows: {},
                searchParams: {},
                tableColumnsClone: []
            }
        },
        computed: {
            tableUrl: function () {
                return this.url
            },
            boxTitle: function () {
                return this.title
            }
        },
        methods: {
            init: function () {
                let self = this;
                self.selectStore = [];
                self.selectRows = {};
                let selectColumn = {
                    width: 80,
                    align: 'center',
                    title: "选择"
                };
                if (this.multiSelect) {
                    selectColumn.type = "selection"
                } else {
                    //当前iView版本单选要自己实现
                    selectColumn.render = function (h, params) {
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
                this.tableColumnsClone = JSON.parse(JSON.stringify(this.columns));
                this.tableColumnsClone.unshift(selectColumn);
                this.searchParams = Object.assign({}, {
                    search: self.searchText
                }, self.helpBoxSearchParams);
            },
            onOk: function () {
                let result = null;
                if (this.multiSelect && this.rowKey) {
                    var selectStore = [];
                    for (var item in this.selectRows) {
                        selectStore.push(this.selectRows[item]);
                    }
                    result = selectStore;
                    this.selectStore = selectStore;
                }
                if (this.selectStore.length > 0) {
                    if (this.multiSelect) {
                        result = this.selectStore;
                    } else {
                        result = this.selectStore[0];
                    }
                    this.$emit("onOk", result);
                    this.$emit("input", false);
                    this.clearSelectData();
                    this.boxShow = false;
                } else {
                    this.$Message.error("请选择一条记录");
                }
            },
            onClear: function () {
                this.clearSelectData();
                this.$emit("onClear");
                this.$emit("input", false);
                this.boxShow = false;
            },
            onCancel: function () {
                this.clearSelectData();
                this.$emit("input", false);
                this.boxShow = false;
            },
            doSearch: function () {
                //this.clearSelectData();
                this.searchParams = Object.assign({}, {
                    search: this.searchText
                }, this.helpBoxSearchParams);
            },
            onRowClick: function (row, index) {
                this.selectOnChange(row, index);
            },
            //单选
            selectOnChange: function (row, index) {
                this.selection = Array(index).fill(false);
                this.selection.splice(index, 1, true);
                this.selectStore = [row];
            },
            onSelectionChange: function (rows) {
                if (!this.rowKey) {
                    this.selectStore = rows;
                }
            },
            onSelect: function (selection, row) {
                if (this.rowKey) {
                    this.selectRows[row[this.rowKey]] = row;
                }
            },
            onSelectCancel: function (selection, row) {
                if (this.rowKey) {
                    delete this.selectRows[row[this.rowKey]];
                }
            },
            onSelectAll: function (selection) {
                if (this.rowKey) {
                    this.allSelection = selection;
                    for (var item of selection) {
                        this.selectRows[item[this.rowKey]] = item;
                    }
                }
            },
            onSelectAllCancel: function (selection) {
                if (this.rowKey) {
                    var deleteSelection = this.allSelection;
                    for (var item of deleteSelection) {
                        delete this.selectRows[item[this.rowKey]];
                    }
                }
            },
            transformResponse: function (resp) {
                if (this.rowKey) {
                    var self = this;
                    var tableData = [];
                    var respType = 0;
                    if (resp.code === 1 || resp.code === "000") {
                        tableData = resp.data.rows;
                        respType = 1;
                    } else if (resp.rows && resp.total) {
                        tableData = resp.rows;
                        respType = 2;
                    }
                    for (var i = 0; i < tableData.length; i++) {
                        if (self.selectRows[tableData[i][self.rowKey]]) {
                            tableData[i]._checked = true;
                        }
                    }
                    if (respType == 1) {
                        resp.data.rows = tableData;
                    } else if (respType == 2) {
                        resp.rows = tableData;
                    }
                }
                return resp;
            },
            clearSelectData: function () {
                this.selection = [];//清空已选项
                this.selectStore = [];//清空已选数据
                this.selectRows = {};//清空已选数据
            }
        },
        watch: {
            value: function () {
                if (this.value) {
                    this.boxShow = true;
                }
                this.searchText = "";
                this.searchParams = Object.assign({}, {
                    search: this.searchText
                }, this.helpBoxSearchParams);
            },
            multiSelect: function () {
                this.init();
            },
            columns: function () {
                this.init();
            },
            helpBoxSearchParams: function () {
                this.init();
            }
        },
        created() {
            this.init();
        }
    }
</script>

<style>

</style>
