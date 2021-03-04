<template>
    <xtl-page hasExtend hasBottom>
        <div slot="icon">
            <Icon type="md-rose"/>
        </div>
        <div slot="extend">
            <a @click="pageGoBack">返回上一页</a>
        </div>
        <Form ref="form" :model="form" label-position="top" :rules="ruleValidate">
            <Row>
                <i-col span="6">
                    <FormItem label="用户名称" prop="basepath">
                        <Input v-model="form.userName" placeholder="请输入用户名称" style="width: 190px"></Input>
                    </FormItem>
                    <FormItem label="用户状态">
                        <RadioGroup v-model="form.status" style="width: 190px">
                            <Radio :label=1>正常</Radio>
                            <Radio :label=-1>锁定</Radio>
                        </RadioGroup>
                    </FormItem>
                </i-col>
                <i-col span="6">
                    <FormItem label="用户名称" prop="basepath">
                        <Input v-model="form.userName" placeholder="请输入用户名称" style="width: 190px"></Input>
                    </FormItem>
                    <FormItem label="用户状态">
                        <RadioGroup v-model="form.status" style="width: 190px">
                            <Radio :label=1>正常</Radio>
                            <Radio :label=-1>锁定</Radio>
                        </RadioGroup>
                    </FormItem>
                </i-col>
                <i-col span="6">
                    <FormItem label="用户名称" prop="basepath">
                        <Input v-model="form.userName" placeholder="请输入用户名称" style="width: 190px"></Input>
                    </FormItem>
                    <FormItem label="用户状态">
                        <RadioGroup v-model="form.status" style="width: 190px">
                            <Radio :label=1>正常</Radio>
                            <Radio :label=-1>锁定</Radio>
                        </RadioGroup>
                    </FormItem>
                </i-col>
                <i-col span="6">
                    <FormItem label="用户名称" prop="basepath">
                        <Input v-model="form.userName" placeholder="请输入用户名称" style="width: 190px"></Input>
                    </FormItem>
                </i-col>
            </Row>
            <Row>
                <i-col span="24">
                    <FormItem label="用户描述">
                        <Input type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入用户描述"></Input>
                    </FormItem>
                </i-col>
            </Row>
            <!--<Row>
                <i-col span="24">
                    <FormItem label="系统描述">
                        <xtl-editor @on-change="editorChange"></xtl-editor>
                    </FormItem>
                </i-col>
            </Row>-->
            <Row>
                <i-col span="24">
                    <FormItem label="编辑表格">
                        <xtl-edit-table ref="table1" v-model="datas1" :columns="columns1" disabledHover
                                          @on-cell-changed="onCellChange">
                            <Button type="primary" @click="addRow" icon="md-add" slot="search">增加一行</Button>
                        </xtl-edit-table>
                    </FormItem>
                </i-col>
            </Row>
            <!--<Row>
                <i-col span="24">
                    <FormItem label="图片上传" prop="name">
                        <xtl-upload-img-list imgWidth="80px" imgHeight="80px" :fileList="imgData"
                                               @upload-result="uploadResult"></xtl-upload-img-list>
                    </FormItem>
                </i-col>
            </Row>-->
            <Row>
                <i-col span="24">
                    <FormItem label="附件上传" prop="name">
                        <xtl-upload-file showFileList otherParam="1" :fileList="fileList"
                                           @upload-result="uploadResult"></xtl-upload-file>
                    </FormItem>
                </i-col>
            </Row>
            <Row>
                <i-col span="24">
                    <FormItem label="视频上传" prop="name">
                        <xtl-upload-video></xtl-upload-Video>
                    </FormItem>
                </i-col>
            </Row>
        </Form>
        <div slot="bottom">
            <Button type="primary" @click="formSubmit">保存</Button>
            <Button type="default" @click="formReset">重置</Button>
        </div>
    </xtl-page>
</template>

<script>
    import util from '@/libs/util.js';
    import config from '@/config/config';
    import {deepCopy} from '@/libs/assist.js';

    export default {
        components: {

        },
        data() {
            return {
                datas1: [],
                columns1: [
                    {
                        title: '序号',
                        key: 'index',
                        type: 'index',
                        width: 70,
                        align: 'center',
                        fixed: 'left'
                    }, {
                        title: '文本框',
                        key: 'k1',
                        align: 'center',
                        width: 150,
                        editor: {
                            type: "text",
                            callbackEvent: 'on-cell-changed'
                        }
                    }, {
                        title: '日期选择',
                        key: 'k2',
                        align: 'center',
                        width: 200,
                        tooltip: true,
                        editor: {
                            type: "date",
                            callbackEvent: 'on-cell-changed'
                        }
                    }, {
                        title: '日期选择区间',
                        key: 'k3',
                        align: 'center',
                        width: 200,
                        tooltip: true,
                        editor: {
                            type: "daterange",
                            callbackEvent: 'on-cell-changed'
                        }
                    }, {
                        title: '开关',
                        key: 'k4',
                        align: 'right',
                        tooltip: true,
                        width: 100,
                        editor: {
                            type: "switch",
                            callbackEvent: 'on-cell-changed'
                        }
                    }, {
                        title: '下拉选择',
                        key: 'k5',
                        align: 'right',
                        tooltip: true,
                        width: 150,
                        editor: {
                            type: "select",
                            enums: [
                                {value: '1', label: '男'},
                                {value: '0', label: '女'}
                            ],
                            callbackEvent: 'on-cell-changed'
                        }
                    }, {
                        title: '帮助框',
                        key: 'k6Name',
                        align: 'right',
                        tooltip: true,
                        //width: 100,
                        editor: {
                            type: "helpbox",
                            url: config.upmsServerContext + "/manage/user/list",
                            columns: [
                                {
                                    title: '用户编码',
                                    key: 'userId',
                                    align: 'center'
                                },
                                {
                                    title: '用户名称',
                                    key: 'userName',
                                    align: 'center'
                                }
                            ],
                            title: '系统选择框',
                            callbackEvent: 'on-cell-changed'
                        }
                    }
                ],
                rowIndex: 0,
                form: {
                    userName: "",
                    status: 0
                },
                ruleValidate: {
                    name: [{
                        required: true,
                        message: '用户名称不能为空',
                        trigger: 'blur'
                    }],
                },
                created: false,
                fileList:[],
                imgData:[]
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
            editorChange: function (html, text) {
                console.log("html=" + html);
                console.log("text=" + text);
            },
            addRow: function () {
                var tmp = {
                    k1: '', k2: '', k3: '', k4: '', k5: '', k6Name: ''
                };
                this.datas1.push(tmp);
                console.log(this.datas1);
            },
            onCellChange(result, rowIndex, columnKey) {
                if (columnKey == 'k6Name') {
                    this.$set(
                        this.datas1[rowIndex],
                        "k6",
                        result.userId
                    );
                    this.$set(
                        this.datas1[rowIndex],
                        "k6Name",
                        result.userName
                    );
                } else {
                    this.$set(
                        this.datas1[rowIndex],
                        columnKey,
                        result
                    );
                }
            },
            formSubmit: function () {
                var self = this;
                self.$refs.form.validate((valid) => {
                    if (valid) {
                        var params = {
                            name: self.form.name,
                            status: self.form.status
                        };
                        if (self.userId) {
                            self.$Message.success('保存成功');
                            /*util.ajax.post(config.upmsServerContext + "/manage/user/update/" + self.userId, params).then(function (resp) {
                              self.$Message.success('保存成功');
                            }).catch(function (err) {
                              self.$Message.error('保存失败,请联系系统管理员');
                            });*/
                        } else {
                            self.$Message.success('新增资源成功');
                            self.created = true;
                            /*util.ajax.post(config.upmsServerContext + "/manage/user/create", params).then(function (resp) {
                              self.$Message.success('新增资源成功');
                              self.created = true;
                            }).catch(function (err) {
                              self.$Message.error('新增资源失败,请联系系统管理员');
                            });*/
                        }

                    }
                })
            },
            uploadResult(value) {
                console.log(value)
            },
            pageGoBack: function () {
                this.$router.go(-1);
            },
            formReset: function () {
                this.$refs.form.resetFields();
            },
            initData: function () {
                var self = this;
                if (self.userId) {
                    util.ajax.get(config.upmsServerContext + "/manage/user/get/" + self.userId).then(function (resp) {
                        var result = resp.data.data;
                        self.form.userName = result.userName;
                        self.form.status = result.status;
                    }).catch(function (err) {
                        self.$Message.error('获取数据失败,请联系系统管理员');
                    });
                }
                var fileData = [];
                var tmp1={
                    originalFileId:'70da33f10a164ab193efb66b477db89d.png',
                    fileUrl:  "70da33f10a164ab193efb66b477db89d.png",
                    fileCode: "70da33f10a164ab193efb66b477db89d.png",
                    fileName: "swift.png",
                    fileType:"png",
                    size: 3404,
                };
                fileData.push(tmp1);
                var tmp2={
                    originalFileId:'02bd4c630de64539b450c27a6f0af64f.png',
                    fileUrl:  "02bd4c630de64539b450c27a6f0af64f.png",
                    fileCode: "02bd4c630de64539b450c27a6f0af64f.png",
                    fileName: "swift2.png",
                    fileType:"png",
                    size: 34034,
                };
                fileData.push(tmp2);
                self.fileList = fileData;
                self.imgData = deepCopy(fileData);
            },
            uploadResult: function (data) {
                console.log(data);
            }
        },
        mounted: function () {
            this.initData();
        }
    }
</script>

<style>

</style>
