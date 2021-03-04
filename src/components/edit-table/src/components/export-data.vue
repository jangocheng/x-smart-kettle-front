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
                    <Button type="primary" :loading="exportLoading" @click="exportExcel">导出数据</Button>
                </FormItem>
            </Form>
        </Row>
    </div>
</template>

<script>
    import excel from '@/libs/excel'
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
            }
        },
        data() {
            return {
                exportLoading: false,
                form: {
                    fileFormat: 'xlsx',
                    fileName: this.tableName
                }
            }
        },
        methods: {
            exportExcel() {
                if (this.tableDatas.length) {
                    this.exportLoading = true
                    let self = this
                    let titles = excel.title_transform(this.tableColumns)
                    let keys = excel.key_transform(this.tableColumns)
                    let data = deepCopy(self.tableDatas)
                    const params = {
                        title: titles,
                        key: keys,
                        data: data,
                        autoWidth: true,
                        filename: this.form.fileName,
                        format: this.form.fileFormat
                    }
                    excel.export_array_to_excel(params)
                    this.exportLoading = false
                } else {
                    this.$Message.info('表格数据不能为空！')
                }
            },
        }
    };
</script>
<style>

</style>
