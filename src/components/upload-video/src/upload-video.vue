<template>
    <div class="defaultVideo" :style="{width:videoWidth + 'px',height:videoHeight+'px'}">
        <div class="deleteBox" @click="deleteAction" v-if="hasUpload" :style="{'width': videoWidth}">
            <Icon type="md-close" title="删除"/>
        </div>
        <video :controls="hasControls" :poster="poster" :src="addFile"
               :width="videoWidth" :height="videoHeight"
               @click="openUpload()">Your browser does not support the video tag.
        </video>
        <input type="file" ref="uploadInput" style="position:absolute; clip:rect(0 0 0 0);" accept="video/mp4"
               @change="readVideo($event, 1)">
        <Spin fix v-if="spinShow">
            <Icon type="ios-loading" size=18 class="spin-icon-load"></Icon>
            <div>正在上传...</div>
        </Spin>
    </div>
</template>

<script>
    import axios from 'axios';
    import add from "./styles/images/add.png";
    import config from '@/config/config';

    export default {
        name: 'XtlUploadVideo',
        props: {
            videoWidth: {
                type: String,
                required: false,
                default: '240'
            },
            videoHeight: {
                type: String,
                required: false,
                default: '240'
            },
            controls: {
                type: Boolean,
                required: false,
                default: true
            },
            defaultVideo: {//默认图片
                type: String,
                required: false,
                default: "",
            },
            otherParam: {//其他需要传递的参数
                type: String,
                required: false,
                default: ""
            },
        },
        data() {
            return {
                poster: add,
                addFile: null,
                fileCode: '',
                hasControls: false,
                fileName: null,
                spinShow: false,
                hasUpload: false,
            };
        },
        computed: {},
        components: {},
        methods: {
            openUpload() {
                if(!this.hasUpload){
                    this.$refs.uploadInput.click();
                }
            },
            readVideo(e, num) {
                //读取图片
                let self = this;
                var file = e.target.files[0];
                let filename = e.target.value;

                let strRegex = "mp4";
                let ext = filename.substr(filename.lastIndexOf(".") + 1);

                if (strRegex.indexOf(ext) == -1) {
                    alert('视频类型必须是mp4');
                    return false;
                } else {
                    this.fileName = e.target.value;
                    if (this.fileName.indexOf("/") > 0) {
                        this.fileName = this.fileName.substring(this.fileName.lastIndexOf("/") + 1);
                    }
                    if (this.fileName.indexOf("\\") > 0) {
                        this.fileName = this.fileName.substring(this.fileName.lastIndexOf("\\") + 1);
                    }
                }
                let formData = new FormData();
                formData.append('file', file);
                this.doUpLoad(formData);
            },
            doUpLoad(formData) {
                let self = this;
                self.spinShow = true;
                axios.post(config.ossServerContext + "/file/put", formData).then(response => {
                    if (response.data.code == "11000") {
                        var result = response.data.data;
                        if (result.length > 0) {
                            self.addFile = config.ossServerContext + "/file/get/" + result[0].originalFileId;
                            self.poster = "";
                            self.hasUpload = true;
                            self.hasControls = self.controls;
                            result[0].otherParam = self.otherParam;
                            self.fileCode = result[0].originalFileId;
                            self.$emit("upload-result", result[0]);
                        }
                    } else {
                        self.$emit("upload-result", null);
                    }
                    self.spinShow = false;
                    //保证每次点击选择文件可触发onchang事件
                    this.$refs.uploadInput.value = '';
                })
            },
            initView() {
                this.hasControls = false;
                if (this.defaultVideo && this.defaultVideo != "") {
                    this.hasUpload = true;
                    if (this.defaultVideo.indexOf("http://") >= 0 || this.defaultVideo.indexOf("/") >= 0) {
                        this.addFile = this.defaultVideo;
                    } else {
                        this.addFile = config.ossServerContext + "/file/get/" + this.defaultVideo;
                        //改变海报，通过视频截取
                    }
                } else {
                    this.addFile = "";
                    this.hasUpload = false;
                    this.poster = add;
                }
            },
            deleteAction() {
                this.$emit("delete-action", this.fileCode);
                this.fileCode = "";
                this.initView();
            }
        },
        mounted() {
            this.initView();
        },
        watch: {
            defaultVideo: function () {
                this.initView();
            }
        }
    }
</script>

<style scoped lang="less">

</style>
