<template>
    <div class="editor-wrapper">
        <div :id="editorId"></div>
    </div>
</template>

<script>
    import axios from 'axios';
    import Editor from 'wangeditor'
    //import 'wangeditor/release/wangEditor.min.css'
    import util from '@/libs/util';
    import config from "@/config/config";

    export default {
        name: 'XtlEditor',
        props: {
            value: {
                type: String,
                default: ''
            },
            /**
             * 绑定的值的类型, enum: ['html', 'text']
             */
            valueType: {
                type: String,
                default: 'html',
                validator: (val) => {
                    return util.oneOf(val, ['html', 'text'])
                }
            },
            /**
             * @description 设置change事件触发时间间隔
             */
            changeInterval: {
                type: Number,
                default: 200
            },
            /**
             * @description 是否开启本地存储
             */
            cache: {
                type: Boolean,
                default: true
            }
        },
        computed: {
            editorId() {
                return `editor${this._uid}`
            }
        },
        methods: {
            setHtml(val) {
                this.editor.txt.html(val)
            }
        },
        mounted() {
            this.editor = new Editor(`#${this.editorId}`)
            this.editor.customConfig.onchange = (html) => {
                let text = this.editor.txt.text()
                if (this.cache) localStorage.editorCache = html
                this.$emit('input', this.valueType === 'html' ? html : text)
                this.$emit('on-change', html, text)
            }

            // 删除粘贴内容的样式
            this.editor.customConfig.pasteFilterStyle = false
            // 设置触发事件间隔
            this.editor.customConfig.onchangeTimeout = this.changeInterval

            this.editor.customConfig.zIndex = 1000

            // 配置debug模式
            this.editor.customConfig.debug = true
            // 隐藏“网络图片”tab
            this.editor.customConfig.showLinkImg = false
            // 使用 base64 保存图片
            // this.editor.customConfig.uploadImgShowBase64 = true
            // 上传图片到服务器
            // this.editor.customConfig.uploadImgServer = config.ossServerContext + "/file/wangeditor/put"
            //
            this.editor.customConfig.uploadImgHeaders = {
                // 'Accept': 'multipart/form-data, text/plain, */*',
                // 'enctype':'multipart/form-data'
                // =""
            }
            this.editor.customConfig.customUploadImg = function (files, insert) {
                let formData = new FormData();
                for (let file of files) {
                    formData.append('file', file);
                }
                // files 是 input 中选中的文件列表
                // insert 是获取图片 url 后，插入到编辑器的方法
                axios.post(config.ossServerContext + "/file/put", formData).then(response => {
                    if (response.data.code == "11000") {
                        var result = response.data.data;
                        // 上传代码返回结果之后，将图片插入到编辑器中
                        let imgUrl = []
                        result.forEach(item=>{
                            insert(config.ossServerContext + "/file/getImg/"+item.fileName)
                            // imgUrl.push()
                        })

                    }
                })




            }
            // 自定义菜单配置
            this.editor.customConfig.menus = [
                'head',  // 标题
                'bold',  // 粗体
                'fontSize',  // 字号
                'fontName',  // 字体
                'italic',  // 斜体
                'underline',  // 下划线
                'strikeThrough',  // 删除线
                'foreColor',  // 文字颜色
                'backColor',  // 背景颜色
                'link',  // 插入链接
                'list',  // 列表
                'justify',  // 对齐方式
                'quote',  // 引用
                // 'emoticon',  // 表情
                'image',  // 插入图片
                'table',  // 表格
                'video',  // 插入视频
                'code',  // 插入代码
                'undo',  // 撤销
                'redo'  // 重复
            ]
            // 自定义配置颜色（字体颜色、背景色）
            this.editor.customConfig.colors = [
                '#000000',
                '#eeece0',
                '#1c487f',
                '#4d80bf',
                '#c24f4a',
                '#8baa4a',
                '#7b5ba1',
                '#46acc8',
                '#f9963b',
                '#ffffff'
            ]
            this.editor.customConfig.pasteTextHandle = function (content) {
                // content 即粘贴过来的内容（html 或 纯文本），可进行自定义处理然后返回
                if (content == '' && !content) return ''
                var str = content
                str = str.replace(/<xml>[\s\S]*?<\/xml>/ig, '')
                str = str.replace(/<style>[\s\S]*?<\/style>/ig, '')
                str = str.replace(/<\/?[^>]*>/g, '')
                str = str.replace(/[ | ]*\n/g, '\n')
                // str = str.replace(/&nbsp;/ig, '')
                return str
            }

            // create这个方法一定要在所有配置项之后调用
            this.editor.create()
            // 如果本地有存储加载本地存储内容
            let html = this.value || localStorage.editorCache


            if (html) this.editor.txt.html(html)
        }
    }
</script>

<style>

</style>
