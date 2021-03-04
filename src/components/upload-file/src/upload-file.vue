<template>
    <div class="upload-file-box">
        <div class="upload-btn-box">
            <Button :size="buttonSize" icon="md-cloud-upload" type="primary" :loading="loading"
                    @click="UploadFile()" ghost v-if="uploadBtn">
                <span v-if="!loading">{{title}}</span>
                <span v-else>Loading...</span>
            </Button>
            <a v-if="!uploadBtn" @click="UploadFile()">
                <Icon type="md-add"></Icon>
                上传附件
            </a>
        </div>
        <input type="file" :disabled="false" ref="uploadInput" style="position:absolute; clip:rect(0 0 0 0);"
               :multiple="multiple"
               :accept="accept"
               @change="readFile($event, 1)"/>
        <div class="upload-file-list" v-if="showFileList && resultList.length > 0">
            <List border size="small">
                <ListItem v-for="item in resultList" :key="item.fileCode">
                    <i-col span="21">
                        <a :href="item.fileUrl">
                            {{item.fileName}}
                            <span class="size" style="margin-left: 5px" v-if="item.showSize">({{item.showSize}})</span>
                        </a>
                    </i-col>
                    <i-col span="3" style="text-align: right">
                        <Button @click="deleteFile(item.fileCode)" type="text">删除</Button>
                    </i-col>
                </ListItem>
            </List>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import config from '@/config/config';
    import {setConfig} from "@/config/config";
    import util from '@/libs/util';
    import ICol from "view-design/src/components/grid/col";

    export default {
        components: {ICol},
        name: "XtlUploadFile",
        props: {
            accept: {//txt,word,excel
                type: String,
                required: false,
                default: "text/plain,application/msword,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            },
            fileSuffix: {
                type: String,
                required: false,
                default: "pdf|doc|docx|txt|xls|xlsx|jpg|jpeg|png|gif"
            },
            title: {
                type: String,
                required: false,
                default: "上传"
            },
            multiple: {
                type: Boolean,
                default: false
            },
            uploadBtn: {
                type: Boolean,
                required: false,
                default: false
            },
            showFileList: {
                type: Boolean,
                required: false,
                default: false
            },
            otherParam: {//其他需要传递的参数
                type: String,
                required: false,
                default: ""
            },
            fileList: {
                type: Array,
                required: false,
                default: () => {
                    return []
                }
            },
            ossServerContext: {
                type: String,
                required: false,
                default: ''
            }
        },

        data() {
            return {
                buttonSize: 'default',
                addFile: "",
                loading: false,
                attachmentFile: {
                    // fileUrl:"",
                    fileCode: "",
                    fileType: "",
                    fileName: "",
                    size: ""
                },
                resultList: []
            }
        },
        methods: {
            UploadFile: function () {
                this.$refs.uploadInput.click();
            },
            readFile: function (e, num) {
                let self = this;
                //读取文件
                // var file = e.target.files[0];
                for (let file of e.target.files) {
                    // fileSuffix
                    var reg = new RegExp("\.(" + this.fileSuffix + ")$", "i");
                    if (!reg.test(file.name)) {
                        alert("文件类型必须是(" + this.fileSuffix + ")中的一种");
                        return false;
                    } else {
                        self.attachmentFile.fileName = file;
                        if (self.attachmentFile.fileName.name.indexOf("/") > 0) {
                            self.attachmentFile.fileName = self.attachmentFile.fileName.name.substring(self.attachmentFile.fileName.name.lastIndexOf("/") + 1);
                        }
                        if (self.attachmentFile.fileName.name.indexOf("\\") > 0) {
                            self.attachmentFile.fileName = self.attachmentFile.fileName.name.substring(self.attachmentFile.fileName.name.lastIndexOf("\\") + 1);
                        }
                    }
                    self.attachmentFile.fileType = self.attachmentFile.fileName.name.substring(self.attachmentFile.fileName.name.lastIndexOf(".") + 1);

                }
                self.loading = true;
                self.loadtoServer();
            },
            loadtoServer: function () {
                var self = this;
                let inputDOM = this.$refs.uploadInput;
                var afile = inputDOM.files;
                if (afile.size == 0) {
                    alert("不能传入空文件");
                    return false;
                }
                let formData = new FormData();
                for (let file of afile) {
                    formData.append('file', file);
                }
                let resultList = [];
                let uploadUrl = config.ossServerContext + "/file/put";
                let downloadUrl = config.ossServerContext + "/file/get/";
                axios.post(uploadUrl, formData).then(response => {
                    if (response.data.code == "11000") {
                        var result = response.data.data;
                        self.loading = false;
                        if (result.length >= 1) {
                            result.forEach(item => {
                                let tmp = {
                                    fileUrl: downloadUrl + item.originalFileId,
                                    fileCode: item.originalFileId,
                                    fileName: item.originalName,
                                    fileType: item.fileExtension,
                                    size: item.size,
                                    showSize: util.formatterSizeUnit(item.size),
                                    otherParam: self.otherParam
                                };

                                resultList.push(tmp);
                                self.resultList.push(tmp);
                            });
                            if (this.showFileList) {
                                self.$emit("upload-result", self.resultList);
                            } else {
                                if (self.multiple) {
                                    self.$emit("upload-result", resultList);
                                } else {
                                    self.$emit("upload-result", resultList[0]);
                                }
                            }
                        } else {
                            self.$emit("upload-result", null);
                        }
                    }
                    self.$refs.uploadInput.value = null
                });
            },
            deleteFile: function (fileCode) {
                if (fileCode) {
                    var result = [];
                    var deletes = []
                    this.resultList.forEach(item => {
                        if (item.fileCode != fileCode) {
                            result.push(item);
                        } else {
                            deletes.push(item)
                        }
                    });
                    this.resultList = result;
                    if (this.multiple) {
                        this.$emit("upload-result", this.resultList, deletes);
                    } else {
                        this.$emit("upload-result", this.resultList, deletes);
                    }
                }
            }
        },
        watch: {
            fileList: function (value) {
                let downloadUrl = config.ossServerContext + "/file/get/";
                var data = this.fileList;
                // for (var i = 0; i < data.length; i++) {
                //     if (data[i].fileUrl) {
                //         data[i].fileUrl = downloadUrl + data[i].fileUrl;
                //     }
                // }
                this.resultList = data;
            }
        }
    }
</script>

<style>

</style>
