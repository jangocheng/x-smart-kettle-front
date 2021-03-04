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
                    <Button type="primary" :loading="exportCurrentLoading" @click="exportCurrentPage">导出当前页</Button>
                    <Button type="primary" :loading="exportAllLoading" ghost @click="exportAllData" style="margin-left: 8px">导出全部</Button>
                </FormItem>
            </Form>
        </Row>
    </div>
</template>

<script>
    import util from '@/libs/util';
    import excel from '@/libs/excel';
    import {deepCopy} from "@/libs/assist";

    export default {
        name: 'export-data',
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
            dataUrl: {
                type: String,
                default() {
                    return "";
                }
            },
            searchParams: {
                type: Object,
                default() {
                    return {};
                }
            },
            sortParams: {
                type: Object,
                default() {
                    return {};
                }
            },
            paginationParams: {
                type: Object,
                default() {
                    return {};
                }
            },
            showSummary:{
                type: Boolean,
                default: false
            },
            summaryMethod:{
                type: Function,
                default:()=>{}
            },
            parsedColumns:{
                type: Array,
                default() {
                    return [];
                }
            },
            exportName: String
        },
        data() {
            return {
                exportCurrentLoading:false,
                exportAllLoading:false,
                form: {
                    fileFormat: "xlsx",
                    fileName: this.tableName,
                },
                tebleParsedColumns:[]
            }
        },
        created(){
          this.tebleParsedColumns = this.parsedColumns
        },
        methods: {
            exportCurrentPage() {
                this.exportCurrentLoading = true
                let exportParams = Object.assign({}, this.paginationParams, this.sortParams, this.searchParams)
                this.getDataFromServer(exportParams)
            },
            exportAllData() {
                this.exportAllLoading = true
                let paginationParams = {offset: 0, limit: 100000}
                let exportParams = Object.assign({}, paginationParams, this.sortParams, this.searchParams)
                this.getDataFromServer(exportParams)
            },
            getDataFromServer(params) {
                let self = this
                util.ajax.get(this.dataUrl, {params: params}).then(function (resp) {
                    if (resp.data.code === '11000' || resp.data.code == 11000) {
                        let resultData = deepCopy(resp.data.data.rows)
                        if (self.showSummary){
                            let sum = self.summaryData(resultData)
                            resultData.push(sum)
                        }
                        self.exportExcel(resultData)
                    } else {
                        self.$Message.error(resp.data.data)
                    }
                })
            },
            summaryData (data) {
                let sums = {};
                if (this.summaryMethod) {
                    sums = this.summaryMethod({ columns: this.tebleParsedColumns, data: data });
                } else {
                    this.cloneColumns.forEach((column, index) => {
                        const key = column.key;
                        if (index === 0) {
                            sums[key] = {
                                key: column.key,
                                value: '合计'
                            };
                            return;
                        }
                        const values = data.map(item => Number(item[column.key]));
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
                            const currentValue = values.reduce((prev, curr) => {
                                const value = Number(curr);
                                if (!isNaN(value)) {
                                    return parseFloat((prev + curr).toFixed(Math.min(precision, 20)));
                                } else {
                                    return prev;
                                }
                            }, 0);
                            sums[key] = {
                                key: column.key,
                                value: currentValue
                            };
                        } else {
                            sums[key] = {
                                key: column.key,
                                value: ''
                            };
                        }
                    });
                }
                let total={}
                Object.keys(sums).forEach(item => {
                    if(item){
                        total[item] = sums[item].value
                    }
                })
                return total;
            },
            exportExcel(tableDatas) {
                if (tableDatas.length) {
                    let titles = excel.title_transform(this.tableColumns)
                    let keys = excel.key_transform(this.tableColumns)
                    let data = deepCopy(tableDatas)
                    const params = {
                        title: titles,
                        key: keys,
                        data: data,
                        autoWidth: true,
                        filename: this.form.fileName,
                        format: this.form.fileFormat,
                    }
                    excel.export_array_to_excel(params)
                } else {
                    this.$Message.info('表格数据不能为空！')
                }
                this.exportCurrentLoading = false
                this.exportAllLoading = false
            },
        },
        watch: {
            exportName: function () {
                this.form.fileName = this.exportName;
            },
            parsedColumns(val){
                this.tebleParsedColumns = val
            }
        }
    };
</script>
<style>

</style>
