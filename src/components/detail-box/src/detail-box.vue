<template>
    <div class="xtl-detail-box">
        <div class="dt-box">
            <div class="dt-header">
                <div class="dt-icon">
                    <Icon :type="icon" v-if="icon"></Icon>
                    <slot name="icon"></slot>
                </div>
                <div class="dt-title">
                    {{title}}
                </div>
                <div class="dt-extend" v-if="hasExtend">
                    <slot name="extend"></slot>
                </div>
            </div>
            <div class="dt-body">
                <div class="detail-list" v-if="contentType == 'table' && tableDataClone.length == 0">
                    <span class="note">{{note}}</span>
                </div>
                <Table v-if="contentType == 'table' && tableDataClone.length > 0" class="detail-table"
                       :columns="tableColumnsClone" :data="tableDataClone" disabled-hover
                       :show-header=false border :span-method="handleSpan">
                </Table>

                <div class="detail-list" v-if="contentType == 'img'">
                    <span class="note" v-if="fileDataClone.length == 0">{{note}}</span>
                    <div class="img-box" v-for="item in fileDataClone">
                        <img :src="getImgUrl(item.fileUrl)" :style="{'width': imgWidth, 'height': imgHeight}"/>
                        <div class="img-box-name" :style="{'width': imgWidth}">{{item.fileName}}</div>
                    </div>
                </div>

                <div class="detail-list" v-if="contentType == 'file' && fileDataClone.length == 0">
                    <span class="note">{{note}}</span>
                </div>
                <List border size="small" class="file-list" v-if="contentType == 'file' && fileDataClone.length>0">
                    <ListItem v-for="(item,index) in fileDataClone" :key="index">
                        <i-col span="21">
                            <a :href="getFileUrl(item.fileUrl)">
                                {{item.fileName}}
                            </a>
                        </i-col>
                        <i-col span="3">
                            {{item.sizeString}}
                        </i-col>
                    </ListItem>
                </List>
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
    import util from '@/libs/util';
    import {deepCopy} from '@/libs/assist';
    import config from "@/config/config";

    export default {
        name: "XtlDetail",
        props: {
            title: {
                type: String,
                required: true,
                default: ""
            },
            icon: {
                type: String,
                required: false,
                default: ""
            },
            hasExtend: {
                type: Boolean,
                required: false,
                default: false
            },
            contentType: {
                type: String,//table,img,file
                required: false,
                default: ""
            },
            tableColumns: {
                type: Array,
                required: false,
                default: null
            },
            tableData: {
                type: [Array, Object],
                required: false,
                default: null
            },
            fileData: {
                type: Array,
                required: false,
                default: null
            },
            imgWidth: {
                type: String,
                required: false,
                default: '80px'
            },
            imgHeight: {
                type: String,
                required: false,
                default: '80px'
            },
        },
        data() {
            return {
                note: '暂无数据',
                tableColumnsClone: [],
                tableDataClone: [],
                fileDataClone: []
            }
        },
        computed: {},
        watch: {
            tableColumns: {
                handler: function () {
                    this.initData();
                },
                deep: true
            },
            tableData: {
                handler: function () {
                    this.initData();
                },
                deep: true
            },
            fileData: function () {
                this.initData();
            }
        },
        components: {},
        methods: {
            initData: function () {
                var columnNum = 2;
                var labelWidth = 180;
                var tableDataClone = [];
                if (this.tableData) {
                    var str = JSON.stringify(this.tableData);
                    if (str.indexOf("[") == 0 && str.indexOf("]") == str.length - 1) {
                        if (this.tableData.length > 0) {
                            tableDataClone = this.tableData;
                        }
                    } else {
                        if (this.tableData.columnNum) {
                            columnNum = this.tableData.columnNum;
                        }
                        if (this.tableData.labelWidth) {
                            labelWidth = this.tableData.labelWidth;
                        }
                        if (this.tableData.data) {
                            var tableData = this.tableData.data;
                            var i = 0;
                            do {
                                var tmp = {
                                    span: {}
                                };
                                var t = 0;
                                for (var j = 0; j < columnNum; j++) {
                                    if (i >= tableData.length) {
                                        break;
                                    }
                                    if ((t + j) >= columnNum) {
                                        break;
                                    }
                                    var item = tableData[i];
                                    var key1 = 'column' + (j * 2);
                                    var key2 = 'column' + (j * 2 + 1);
                                    var tmp1 = {};
                                    tmp1[key1] = item.name;
                                    tmp1[key2] = item.value;
                                    if (item.rowspan) {
                                        if (!tmp.span[(j * 2 + 1)]) {
                                            tmp.span[(j * 2 + 1)] = {
                                                rowspan: item.rowspan
                                            }
                                        } else {
                                            tmp.span[(j * 2 + 1)].rowspan = item.rowspan;
                                        }
                                    }
                                    if (item.colspan) {
                                        if (!tmp.span[(j * 2 + 1)]) {
                                            tmp.span[(j * 2 + 1)] = {
                                                colspan: item.colspan
                                            }
                                        } else {
                                            tmp.span[(j * 2 + 1)].colspan = item.colspan;
                                        }
                                        t = t + Math.ceil((item.colspan * 1) / 2) - 1;
                                    }
                                    tmp = Object.assign(tmp, tmp1);
                                    i++;
                                }
                                tableDataClone.push(tmp);
                            } while (i < tableData.length);
                        }
                    }
                }
                var tableColumns = [];
                if (this.tableColumns && this.tableColumns.length > 0) {
                    tableColumns = this.tableColumns;
                } else {
                    for (var i = 0; i < columnNum * 2; i++) {
                        tableColumns.push({});
                    }
                }
                for (var i = 0; i < tableColumns.length; i++) {
                    var column = tableColumns[i];
                    if (!column.key) {
                        column.key = 'column' + i;
                    }
                    if (i % 2 == 0) {
                        column.align = "right";
                        column.className = "columnKey";
                        column.width = labelWidth;
                    } else {
                        column.align = "left";
                        column.className = "columnValue";
                        column.render = function (h, param) {
                            var value = param.row[param.column.key];
                            if (typeof value == "function") {
                                return value(h, param);
                            } else {
                                return h('div', {}, value);
                            }
                        }
                    }
                    tableColumns[i] = column;
                }
                this.tableColumnsClone = deepCopy(tableColumns);
                this.tableDataClone = deepCopy(tableDataClone);
                if (this.fileData && this.fileData.length > 0) {
                    var fileData = this.fileData;
                    for (var i = 0; i < fileData.length; i++) {
                        if (fileData[i].size) {
                            fileData[i].sizeString = util.formatterSizeUnit(fileData[i].size);
                        }
                    }
                    this.fileDataClone = fileData;
                }
            },
            handleSpan({row, column, rowIndex, columnIndex}) {
                var spanData = row.span;
                if (spanData && spanData[columnIndex]) {
                    return spanData[columnIndex];
                }
            },
            getImgUrl(value) {
                return config.ossServerContext + "/file/getImg/" + value
            },
            getFileUrl(value) {
                return config.ossServerContext + "/file/get/" + value
            }
        },
        mounted() {
            this.initData();
        }
    }
</script>
<style>

</style>
