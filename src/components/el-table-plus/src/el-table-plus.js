import util from '@/libs/util';
import {computeColumnSpanParams, computeSpanMethod} from "./components/column-span-tool"
import dropdownNav from './components/dropdown-nav'
import {computeSumLime} from "./components/data-groupby-tool"
import {findComponentsDownward} from 'view-design/src/utils/assist';
import {deepCopy} from "@/libs/assist";

export default {
    name: 'XtlElTable',
    componentName: 'XtlElTable',
    components: {
        dropdownNav
    },
    props: {

        tableName: {
            type: String,
            default: '表格数据'
        },
        //是否折叠查询条件
        collapseSearch: {
            type: Boolean,
            default: false
        },
        dataUrl: {
            type: String,
            default: ''
        },
        columns: {
            type: Array,
            default: function () {
                return []
            }
        },
        data: {
            type: Array,
            default: () => {
                return []
            }
        },
        spanColumns: {
            type: Array,
            default: function () {
                return []
            }
        },
        groupSum: {
            type: Object,
            default: function () {
                return {}
            }
        },
        //查询条件
        searchParams: {
            type: Object
        },
        rowClassName: [String, Function],
        border: {
            type: Boolean,
            default: true
        },
        //扩展方式 all loadmore paging
        extendType: {
            type: String,
            default: ""
        },
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
        showTableOption: {
            type: Boolean,
            default: true
        },
        showSummary: {
            type: Boolean,
            default: false
        },
        summaryMethod: Function


    },
    data() {
        return {
            showAll: true,
            colIcon: 'ios-arrow-up',
            cloneTableTata: [],
            sortParams: {},
            tableColumns: [],
            tableLoading: false,
            totalNumber: 0,

            pageSizeOpts: [10, 50, 100, 200],
            limitNumber: 10,
            currentPage: 1,
        };
    },
    mounted() {
        if (this.data.length > 0) {
            this.cloneTableTata = deepCopy(this.data)
        } else {
            this.tableRefresh()
        }
        this.tableColumns = findComponentsDownward(this, 'ElTable')[0].store.states.columns;
    },
    watch: {
        searchParams: {
            handler: function (val, oldVal) {
                //查询时重置页码
                this.currentPage = 1
                this.cloneTableTata = []
                this.tableRefresh();
            },
            deep: true
        },
        dataUrl: {
            handler: function (val, oldVal) {
                //查询时重置页码
                this.currentPage = 1
                this.cloneTableTata = []
                this.tableRefresh();
            },
            deep: true
        },
        data(val) {
            this.cloneTableTata = deepCopy(val)
        }
    },
    computed: {
        spanParams() {
            return computeColumnSpanParams(this.spanColumns, this.tableData);
        },
        tableData() {
            let groupSum = this.groupSum;
            return computeSumLime(this.cloneTableTata, groupSum.groupKeys, groupSum.labelColumns, groupSum.summaryMethod);
        },
        paginationParams() {
            return {
                offset: (this.currentPage - 1) * this.limitNumber,
                limit: this.limitNumber
            }
        },
        showAddMore() {
            if (this.cloneTableTata.length > this.totalNumber)
                return false
            else
                return true

        },
        elTablePlusButtonsStyle() {
            let style = {}
            if (this.showTableOption)
                style.width = 'calc(100% - 90px)'
            else
                style.width = '100%'
            return style
        },
        tableOptionDropdownStyle() {
            let style = {}
            if (this.showTableOption)
                style.display = 'inline-block'
            else
                style.display = 'none'
            return style
        }
    },
    methods: {
        toggle() {
            this.showAll = !this.showAll
            this.colIcon = this.showAll ? 'ios-arrow-up' : 'ios-arrow-down'
            this.$nextTick(function () {
                this.tableRefresh()
            })
        },
        tableRefresh() {
            let self = this;
            if (self.dataUrl !== '') {
                let requireTableTata = []
                self.tableLoading = true;
                util.ajax.get(self.dataUrl, {
                    params: Object.assign({}, self.paginationParams, self.sortParams, self.searchParams),
                    transformRequest: [self.transformRequest],
                    transformResponse: [self.transformResponse],
                    responseType: 'json'
                }).then(function (resp) {
                    if (resp.data) {
                        //这里是为了做IE11兼容
                        if (!util.isJson(resp.data)) {
                            resp.data = JSON.parse(resp.data);
                        }
                        if (resp.data.code === 11000 || resp.data.code === "11000") {
                            requireTableTata = resp.data.data.rows;
                            self.totalNumber = resp.data.data.total;
                            self.$emit("on-data-load", resp.data);
                        } else if (resp.data.code === 0) {
                            alert("获取数据异常，请稍后重试");
                        } else {
                            requireTableTata = resp.data.rows;
                            self.totalNumber = resp.data.total;
                        }
                        if (self.extendType === 'loadmore') {
                            self.cloneTableTata = self.cloneTableTata.concat(requireTableTata)
                        } else {
                            self.cloneTableTata = requireTableTata
                        }
                    }
                    self.tableLoading = false;
                });
            }
            this.optionDropdownVisible = false;
            this.maxHeight = this.fixHead ? this.getMaxHeight() : this.height;
        },

        sortChange({column, prop, order}) {
            if (this.data.length <= 0) {
                this.sortParams = {
                    sort: prop,
                    order: order == null ? 'desc' : order === 'ascending' ? 'asc' : 'desc'
                }
                this.cloneTableTata = []
                this.tableRefresh()
            }
        },
        onPageChange(currentPageIndex) {
            this.currentPage = currentPageIndex;
            this.tableRefresh();
            this.$emit("on-page-change", currentPageIndex)
        },
        onPageSizeChange(currentLimitNumber) {
            this.currentPage = 1;
            this.limitNumber = currentLimitNumber;
            this.tableRefresh();
            this.$emit("on-page-size-change", currentLimitNumber)
        },
        defaultComputeSpanMethod({row, column, rowIndex, columnIndex}) {
            let params = this.spanParams;
            return computeSpanMethod({row, column, rowIndex, columnIndex, params});
        },
        setSumLineClass({row, rowIndex}) {
            if (this.rowClassName) {
                return this.rowClassName;
            } else {
                if (row._sumLine) {
                    return 'sum-line-row'
                }
            }
        },
        changeColumns(data) {
            this.$set(this.tableColumns, data)
            this.cloneTableTata = []
            this.tableRefresh()
            // this.$set(this.tableColumns, this.tableColumns.splice(2,1))
        },
        addMore() {
            this.tableRefresh()
        }
    },
    render(h) {
        const namespace = 'xtl-el-table';
        const {caption, actionBar, search, searchBtn, buttons, ...otherSlots} = this.$slots;
        return (
            <div class={namespace}>
                {
                    (caption || actionBar) &&
                    <div class={`${namespace}__header`}>
                        <h1 class={`${namespace}__header__caption`}>{caption}</h1>
                        <div class={`${namespace}__header__action-bar`}>{actionBar}</div>
                    </div>
                }

                <div class={`table-search`}>
                    {
                        this.collapseSearch ?
                            <div>
                                <div class={this.showAll ? '' : 'search-col'}>{search}</div>
                                <Form label-width={100}>
                                    <FormItem>
                      <span onClick={this.toggle} slot={`label`} style={`cursor: pointer`}>
                        <Icon type={this.colIcon} size={16}/>
                      </span>
                                        {searchBtn}
                                    </FormItem>
                                </Form>
                            </div>
                            :
                            <div>{search}</div>
                    }
                </div>

                <div>
                    <div class={`${namespace}__buttons`} style={this.elTablePlusButtonsStyle}>{buttons}</div>
                    <div class={`table-option-dropdown`} style={this.tableOptionDropdownStyle}>
                        <dropdownNav data={this.tableData} columns={this.tableColumns} spanColumns={this.spanColumns}
                                     tableName={this.tableName} dataUrl={this.dataUrl}
                                     searchParams={Object.assign({}, this.sortParams, this.searchParams)}
                                     on-change-columns={this.changeColumns}
                                     show-summary={this.showSummary}
                                     summary-method={this.summaryMethod}
                        ></dropdownNav>
                    </div>
                </div>

                <el-table
                    data={this.tableData}
                    span-method={this.defaultComputeSpanMethod}
                    row-class-name={this.setSumLineClass}
                    border={this.border}
                    v-loading={this.tableLoading}
                    on-sort-change={this.sortChange}
                    useVirtual={this.extendType === 'all'}
                    show-summary={this.showSummary}
                    summary-method={this.summaryMethod}
                    {...{props: this.$attrs, on: this.$listeners}}
                >
                    {
                        Object.entries(otherSlots).map(([key, val]) =>
                            <template slot={key}>{val}</template>
                        )
                    }
                    {
                        this.columns.map(column => {
                            const {formatter, renderBody} = column;
                            const data = {
                                props: {
                                    ...column,
                                    formatter: formatter && (row => formatter(row[column.prop]))
                                }
                            };

                            if (renderBody) {
                                data.scopedSlots = {
                                    default({row}) {
                                        return renderBody(h, row);
                                    }
                                };
                            }
                            return (
                                <el-table-column {...data}></el-table-column>
                            );
                        })
                    }
                    {
                        this.extendType === 'loadmore' ?
                            <div slot='append'>
                                <div v-show={this.data.length <= 0 && this.showAddMore}>
                                    <div v-show={!this.tableLoading} class={`${namespace}__add__more`}
                                         onClick={this.addMore}>
                                        加载更多
                                    </div>
                                </div>
                            </div> :
                            <div></div>
                    }
                </el-table>
                {
                    this.extendType === 'paging' ?
                        <Row style="margin-top:15px;">
                            <i-col span="24" style="text-align:right">
                                <Page
                                    total={this.totalNumber}
                                    current={this.currentPage}
                                    page-size-opts={this.pageSizeOpts}
                                    show-sizer
                                    show-total
                                    show-elevator
                                    on-on-change={this.onPageChange}
                                    on-on-page-size-change={this.onPageSizeChange}>
                                </Page>
                            </i-col>
                        </Row> :
                        <div></div>
                }

            </div>
        );
    }
};

