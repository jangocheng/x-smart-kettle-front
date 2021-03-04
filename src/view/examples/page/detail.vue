<template>
    <xtl-page hasExtend :icon="pageicon">
        <!--<div slot="icon">
          <Icon type="md-rose" />
        </div>-->
        <div slot="extend">
            <a @click="pageGoBack">返回上一页</a>
        </div>

        <Tabs style="margin-bottom: 20px">
            <TabPane label="基础信息" name="name1">
                <xtl-detail :icon="detailicon" title="基础信息" contentType="table"
                              :tableData="tableData">
                </xtl-detail>
            </TabPane>
            <!--<TabPane label="宣传图片" name="name2">
              <xtl-detail :icon="detailicon" title="宣传图片" contentType="img"
                         :fileData="imgData" imgHeight="160px" imgWidth="160px">
              </xtl-detail>
            </TabPane>-->
        </Tabs>

        <xtl-detail :icon="detailicon" title="展示图片" contentType="img"
                      :fileData="imgData">
        </xtl-detail>

        <xtl-detail :icon="detailicon" title="附件信息" contentType="file"
                      :fileData="fileData">
        </xtl-detail>
    </xtl-page>
</template>

<script>
    import util from '@/libs/util.js';
    import config from '@/config/config';

    export default {
        components: {},
        data() {
            return {
                pageicon: 'md-rose',
                detailicon: 'ios-folder-open',
                datailtitle: '基础信息',
                contentType: 'table',
                tableData: [],
                imgData: [],
                fileData: []
            }
        },
        computed: {
            userId: function () {
                return this.$route.query.userId;
            },
            title: function () {
                return this.$route.meta.title;
            }
        },
        methods: {
            pageGoBack: function () {
                this.$router.go(-1);
            },
            initData: function () {
                let self = this;
                if (self.userId) {
                    util.ajax.get(config.upmsServerContext + "/manage/user/get/" + self.userId).then(function (resp) {
                        var result = resp.data.data;
                        /*var tableData = [];
                        var tmp = {
                            'column0':'用户名称',
                            'column1':result.userName,
                            'column2':'用户状态',
                            'column3':result.status == '1' ? '正常':'锁定',
                        };
                          tableData.push(tmp);
                          var tmp2 = {
                              'column0':'用户名称1',
                              'column1':result.userName,
                              'column2':'用户状态1',
                              'column3':result.status,
                          };
                          tableData.push(tmp2);
                          var tmp3={
                              'column0':'用户描述',
                              //'column1':"描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述"

                              'column1':'用户描述用户描述用户描述用户描述用户描述用户描述用户描述',
                          };
                          tableData.push(tmp3);
                          var tmp4={};
                          //tableData.push(tmp4);*/


                        var data = [];
                        var tmp1 = {
                            name: '用户名称',
                            value: result.userName
                        };
                        data.push(tmp1);
                        var tmp2 = {
                            name: '用户状态',
                            value: result.status == '1' ? '正常' : '锁定',
                        };
                        data.push(tmp2);
                        data.push(tmp1);
                        data.push(tmp2);
                        var tmp11 = {
                            name: '测试合并',
                            value: "测试合并",
                            rowspan: '1',
                            colspan: '3'
                        };
                        data.push(tmp11);
                        //data.push({});
                        var tmp3 = {
                            name: '用户描述',
                            value: '用户描述用户描述用户描述用户描述用户描述用户描述用户描述',
                            rowspan: '1',
                            colspan: '3'
                        };
                        data.push(tmp3);
                        var tmp4 = {
                            name: '测试输入框',
                            value: function (h, param) {
                                return h("Input", {
                                    props: {
                                        type: "textarea",
                                    },
                                    on: {
                                        'on-change': () => {
                                            console.log("111");
                                        }
                                    }
                                });
                            },
                            rowspan: '1',
                            colspan: '7'
                        };
                        data.push(tmp4);
                        var tableData = {
                            data: data,
                            columnNum: 2
                        };
                        self.tableData = tableData

                    }).catch(function (err) {
                        self.$Message.error('获取数据失败,请联系系统管理员');
                    });
                }

                var fileData = [];
                var tmp1 = {
                    fileUrl: "70da33f10a164ab193efb66b477db89d.png",
                    fileCode: "70da33f10a164ab193efb66b477db89d.png",
                    fileName: "swift.pngswift.pngswift.pngswift.png",
                    fileType: "png",
                    size: 3404,
                };
                fileData.push(tmp1);
                var tmp2 = {
                    fileUrl: "02bd4c630de64539b450c27a6f0af64f.png",
                    fileCode: "02bd4c630de64539b450c27a6f0af64f.png",
                    fileName: "swift2.png",
                    fileType: "png",
                    size: 34034,
                };
                fileData.push(tmp2);
                self.imgData = fileData;
                self.fileData = fileData;
            },
        },
        mounted: function () {
            this.initData();
        }
    }
</script>

<style>

</style>
