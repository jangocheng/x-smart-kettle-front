<template>
    <div class="upload-box">
        <!-- 初始化图片链接 -->
        <div class="defaultImg" :style="{'width': imgWidth, 'height': imgHeight}">
            <!--<Icon type="ios-close" class="deleteIcon" @click="deleteAction" v-if="hasDelete"/>-->
            <div class="deleteBox" @click="deleteAction" v-if="hasDelete && hasUpload" :style="{'width': imgWidth}">删除
            </div>
            <img :src="addFile" :onerror="errorImg"
                 :style="{'width': imgWidth, 'height': imgHeight}"
                 @click="openUpload()"/>
            <input type="file" :disabled="showOnly" ref="uploadInput" style="position:absolute; clip:rect(0 0 0 0);"
                   accept="image/png, image/jpeg, image/gif, image/jpg" @change="readImg($event, 1)">
            <Spin fix v-if="spinShow">
                <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                <div>正在上传...</div>
            </Spin>
        </div>
        <!-- 剪裁图片对话框 -->
        <Modal v-model="visibleModel" title="图片剪裁" @on-ok="ok" @on-cancel="cancel" :width="modelWidth">
            <div class="cropper-content">
                <div class="cropper" :style="{'width': cropperWidth + 'px', 'height': cropperHeight + 'px'}">
                    <VueCropper
                            ref="cropper"
                            :img="uploadImg"
                            :outputSize="option.outputSize"
                            :outputType="option.outputType"
                            :info="true"
                            :full="option.full"
                            :canMove="option.canMove"
                            :canMoveBox="option.canMoveBox"
                            :original="option.original"
                            :autoCrop="option.autoCrop"
                            :autoCropWidth="option.autoCropWidth"
                            :autoCropHeight="option.autoCropHeight"
                            :fixedBox="option.fixedBox"
                            @realTime="realTime"
                    ></VueCropper>
                </div>
                <div class="show-preview" v-show="showPreview"
                     :style="{'width': previews.w + 'px', 'height': previews.h + 'px', 'overflow': 'hidden', 'margin': '5px'}">
                    <div :style="previews.div" class="preview">
                        <img :src="previews.url" :style="previews.img">
                    </div>
                </div>
            </div>
            <div class="msg">使用滚轮缩放图片</div>
        </Modal>
        <Modal v-model="viewImageModal" title="图片预览" class="viewImage">
            <img :src="viewBigImage"/>
            <div slot="footer">
                <Button type="primary" @click="closeViewModal">关闭</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import {VueCropper} from "vue-cropper";
    import axios from 'axios';
    import add from "./styles/images/add-small.png";
    import config from '@/config/config';
    import {deepCopy} from "@/libs/assist";

    var ieFirstEmit = true;
    export default {
        name: 'XtlUploadImg',
        props: {
            showOnly: {//不可点击， 为true 只可以展示图片，不可以上传图片
                type: Boolean,
                required: false,
                default: false
            },
            defaultImg: {//默认图片
                type: [String, Number],
                required: false,
                default: "",
            },
            showPreview: {
                type: Boolean,
                required: false,
                default: true
            },
            errorImg: {//图像请求失败显示图片
                type: String,
                required: false,
                default: "",
            },
            cropperWidth: {//幕布宽度
                type: Number,
                required: false,
                default: 360
            },
            cropperHeight: {//幕布高度
                type: Number,
                required: false,
                default: 360
            },
            outputSize: {//裁剪生成图片的质量
                type: Number,
                required: false,
                default: 1
            },
            full: {//是否输出原图比例的截图
                type: Boolean,
                required: false,
                default: true
            },
            sizes: {//预览图大小
                type: [String, Number],
                required: false,
                default: ''
            },
            outputType: {//裁剪生成图片的格式
                type: String,
                required: false,
                default: "jpeg"
            },
            canMove: {//上传图片是否可以移动
                type: Boolean,
                required: false,
                default: true
            },
            original: {//上传图片按照原始比例渲染
                type: Boolean,
                required: false,
                default: false
            },
            canMoveBox: {//截图框能否拖动
                type: Boolean,
                required: false,
                default: true
            },
            autoCrop: {//是否默认生成截图框
                type: Boolean,
                required: false,
                default: true
            },
            autoCropWidth: {//默认生成截图框宽度
                type: Number,
                required: false,
                default: 300
            },
            autoCropHeight: {//默认生成截图框高度
                type: Number,
                required: false,
                default: 300
            },
            fixedBox: {//固定截图框大小 不允许改变
                type: Boolean,
                required: false,
                default: true
            },

            hasZoomSize: {//是否生成其他尺寸的图片，以剪裁后的为基准;废弃
                type: Boolean,
                required: false,
                default: false
            },
            zoomSize: {//其他生成图片的尺寸，形式：100-100,50-50;废弃
                type: String,
                required: false,
                default: ""
            },
            otherParam: {//其他需要传递的参数
                type: String,
                required: false,
                default: ""
            },
            showAtOnce: {//上传后立即显示出来
                type: Boolean,
                required: false,
                default: true
            },
            doCut: {//是否裁剪
                type: Boolean,
                required: false,
                default: true
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
            maxSize: { //上传图片最大限制 单位：k
                type: Number,
                required: false,
                default: null
            },
            hasDelete: {
                type: Boolean,
                required: false,
                default: false
            },
            ossServerContext: {
                type: String,
                required: false,
                default: ''
            },
            container: {
                type:String,
                default:''
            }
        },
        data() {
            return {
                addFile: add,
                fileName: "",
                uploadImg: add,
                previews: {},
                downImg: '#',
                visibleModel: false,
                viewImg: '',
                spinShow: false,
                hasUpload: false,
                viewImageModal: false,
                viewBigImage: '',
                defaultImgUrl: ''
            };
        },
        computed: {
            option: function () {
                return {
                    outputSize: this.outputSize,
                    full: this.full,
                    outputType: this.outputType,
                    canMove: this.canMove,
                    original: this.original,
                    canMoveBox: this.canMoveBox,
                    autoCrop: this.autoCrop,
                    autoCropWidth: this.autoCropWidth,
                    autoCropHeight: this.autoCropHeight,
                    fixedBox: this.fixedBox
                }
            },
            modelWidth: function () {
                let value = (this.cropperWidth + this.autoCropWidth + 160);
                value = value < 600 ? 600 : value;
                return value + "px";
            }
        },
        components: {
            VueCropper
        },
        methods: {
            openUpload() {
                if (this.hasUpload || this.showOnly) {
                    this.openViewBox();
                } else {
                    this.$refs.uploadInput.click();
                }
            },
            readImg(e, num) {
                //读取图片
                var file = e.target.files[0];
                let filename = e.target.value;
                // ie浏览器触发两次onchange事件
                if (this.isIE()) {
                    if (ieFirstEmit) {
                        ieFirstEmit = false;
                    } else {
                        ieFirstEmit = true;
                        return;
                    }
                }
                if (!file || !file.size) {
                    this.$Message.error("获取图片大小信息失败！");
                    return;
                }
                if (this.maxSize) {
                    let fileSize = file.size;
                    if (fileSize > this.maxSize * 1024) {
                        this.$Message.error("上传图片大小需要小于" + this.maxSize + "k");
                        this.$refs.uploadInput.value = '';
                        return;
                    }
                }
                let strRegex = "gif,jpg,jpeg,png,GIF,JPG,PNG";
                let ext = filename.substr(filename.lastIndexOf(".") + 1);

                if (strRegex.indexOf(ext) == -1) {
                    alert('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种');
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

                //ie不剪裁
                if (this.isIE() || !this.doCut) {
                    let formData = new FormData();
                    formData.append('file', file);

                    this.doUpLoad(formData);
                } else {
                    var reader = new FileReader();
                    var self = this;
                    reader.onload = (e) => {
                        let data;
                        if (typeof e.target.result === 'object') {
                            // 把Array Buffer转化为blob 如果是base64不需要
                            data = window.URL.createObjectURL(new Blob([e.target.result]));
                        } else {
                            data = e.target.result;
                        }

                        self.uploadImg = data;
                        self.visibleModel = true;
                    };
                    // 转化为blob
                    reader.readAsArrayBuffer(file);
                }
            },
            // 实时预览函数
            realTime(data) {
                this.previews = data;
            },
            ok() {
                var self = this;
                self.spinShow = true;
                this.$refs.cropper.getCropBlob((data) => {
                    var afile = new File([data], this.fileName);
                    let formData = new FormData();
                    formData.append('file', afile);
                    if (this.hasZoomSize) {
                        formData.append('sizes', this.zoomSize);
                    }
                    self.doUpLoad(formData);
                });
            },
            cancel() {
                if (this.viewImg && this.viewImg != "") {
                    this.addFile = this.viewImg;
                    this.viewBigImage = this.addFile;
                } else {
                    if (this.defaultImgUrl && this.defaultImgUrl != "") {
                        if (this.defaultImgUrl.indexOf("http://") >= 0 || this.defaultImgUrl.indexOf("/") >= 0) {
                            this.addFile = this.defaultImgUrl;
                        } else {
                            this.addFile = config.ossServerContext + "/file/getImg/" + this.defaultImgUrl + "?sizes=" + this.sizes + "&container="+this.container;
                            // this.viewBigImage = config.ossServerContext + "/file/getImg/" + this.defaultImg + "?container=moutai";
                        }
                    } else {
                        this.addFile = add;
                    }
                    this.viewBigImage = this.addFile;
                }
                //保证每次点击选择文件可触发onchang事件
                this.$refs.uploadInput.value = '';
            },
            initView() {
                if (this.defaultImgUrl && this.defaultImgUrl != "") {
                    this.hasUpload = true;
                    if (this.defaultImgUrl.indexOf("http://") >= 0 || this.defaultImgUrl.indexOf("/") >= 0) {
                        this.addFile = this.defaultImgUrl;
                        this.viewBigImage = this.addFile;
                    } else {
                        this.addFile = config.ossServerContext + "/file/getImg/" + this.defaultImgUrl + "?sizes=" + this.sizes + "&container="+this.container;
                        // this.viewBigImage = config.ossServerContext + "/file/getImg/" + this.defaultImg + "?container=moutai";
                    }
                } else {
                    this.addFile = add;
                }
            },
            doUpLoad(formData) {
                let self = this;
                self.spinShow = true;
                formData.append('container', this.container);
                //formData.append('description','description');
                //formData.append('extendInfo','extendInfo');
                //formData.append('userId','userId');
                axios.post(config.ossServerContext + "/file/put", formData).then(response => {
                    if (response.data.code == "11000") {
                        var result = response.data.data;
                        if (result.length > 0) {
                            if (self.showAtOnce) {
                                self.hasUpload = true;
                                self.addFile = config.ossServerContext + "/file/getImg/" + result[0].originalFileId + "?sizes=" + self.sizes + "&container="+this.container;
                                // self.viewBigImage = config.ossServerContext + "/file/getImg/" + result[0].originalFileId + "?container=moutai";
                                self.defaultImgUrl = result[0].originalFileId
                                self.viewImg = self.addFile;
                                result[0].otherParam = self.otherParam;
                            } else {
                                self.hasUpload = false;
                            }
                            self.$emit("upload-result", result[0]);
                        }
                    } else {
                        self.$emit("upload-result", null);
                    }
                    self.spinShow = false;

                    //保证每次点击选择文件可触发onchang事件
                    this.$refs.uploadInput.value = '';
                });
            },
            isIE() {
                let flag = false;
                if (!!window.ActiveXObject || "ActiveXObject" in window) {
                    flag = true;
                } else if (navigator.userAgent.indexOf("Edge") > -1) {
                    flag = true;
                }
                return flag;
            },
            deleteAction(obj) {
                var data = {
                    fileCode: this.defaultImgUrl,
                    otherParam: this.otherParam
                };
                this.hasUpload = false;
                this.defaultImgUrl = "";
                this.initView();
                this.$emit("delete-action", data);
            },
            openViewBox() {
                this.viewBigImage = config.ossServerContext + "/file/getImg/" + this.defaultImgUrl + "?container="+this.container;
                this.viewImageModal = true;
            },
            closeViewModal() {
                this.viewImageModal = false;
            }
        },
        mounted() {
            this.defaultImgUrl = deepCopy(this.defaultImg);
            this.initView();
        },
        watch: {
            defaultImg: function () {
                this.defaultImgUrl = deepCopy(this.defaultImg);
                this.initView();
            }
        }
    }
</script>

<style>

</style>
