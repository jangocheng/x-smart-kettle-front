<template>
    <xtl-page>
        <xtl-el-table
                :data="tableData1"
                :spanColumns="spanColumns"
                :groupSum="groupSum"
                v-loading="tableLoading"
                height="400">
            <el-table-column
                    type="index"
                    align="center"
                    label="序号"
                    width="55">
            </el-table-column>
            <el-table-column
                    prop="com"
                    label="公司名称"
                    align="center"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="dept"
                    align="center"
                    label="部门">
            </el-table-column>
            <el-table-column
                    prop="name"
                    align="center"
                    label="人员">
            </el-table-column>
            <el-table-column
                    prop="num1"
                    label="数据1"
                    align="right">
            </el-table-column>
            <el-table-column
                    prop="num2"
                    label="数据2"
                    align="right">
            </el-table-column>
            <el-table-column
                    prop="num3"
                    label="数据3"
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
                tableData1: [],
                tableLoading: false,
                spanColumns: ["com", "dept"],
                groupSum: {
                    groupKeys: ["com", "dept"],
                    labelColumns: ["name"],
                    summaryMethod: (datas) => {
                        let sums = {
                            num1: 0,
                            num2: 0,
                            num3: 0
                        };
                        for (let i = 0; i < datas.length; i++) {
                            sums.num1 += datas[i].num1
                            sums.num2 += datas[i].num2
                            sums.num3 += datas[i].num3
                        }
                        return sums;
                    }
                },
            };
        },
        mounted() {
            this.init()
        },
        methods: {
            init() {
                let self = this
                this.tableLoading = true
                util.ajax.get(config.mockServerContext + "/test/eltable").then((resp) => {
                    if (resp.data.code === '000') {
                        self.tableLoading = false
                        self.tableData1 = resp.data.data.rows
                    }
                })
            },
        }
    };
</script>

<style>
</style>
