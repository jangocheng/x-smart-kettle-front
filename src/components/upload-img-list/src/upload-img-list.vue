<template>
  <div class="upload-img-list-box" :style="{'height': boxHeight}">
      <div v-for="item in imgBoxList" class="upload-div" v-if="item !='del' ">
          <uploadImg
                  :showOnly="showOnly"
                  :defaultImg="item?item:defaultImg"
                  :showPreview="showPreview"
                  :errorImg="errorImg"
                  :cropperWidth="cropperWidth"
                  :cropperHeight="cropperHeight"
                  :outputSize="outputSize"
                  :full="full"
                  :sizes="sizes"
                  :outputType="outputType"
                  :canMove="canMove"
                  :original="original"
                  :canMoveBox="canMoveBox"
                  :autoCrop="autoCrop"
                  :autoCropWidth="autoCropWidth"
                  :autoCropHeight="autoCropHeight"
                  :fixedBox="fixedBox"
                  :hasZoomSize="hasZoomSize"
                  :zoomSize="zoomSize"
                  :otherParam="otherParam"
                  :showAtOnce="showAtOnce"
                  :doCut="doCut"
                  :imgWidth="imgWidth"
                  :imgHeight="imgHeight"
                  :maxSize="maxSize"
                  :hasDelete="hasDelete"
                  :ossServerContext="ossServerContext"
                  @delete-action="deleteAction"
                  @upload-result="uploadResult"
          >
          </uploadImg>
      </div>
  </div>
</template>

<script>
  import uploadImg from "../../upload-img/src/upload-img";

  export default {
    name:'XtlUploadImgList',
    props:{
      showOnly: {//不可点击， 为true 只可以展示图片，不可以上传图片
        type: Boolean,
        required: false,
        default: false
      },
      defaultImg:{//默认图片
        type:String,
        required:false,
        default:"",
      },
      showPreview:{
        type:Boolean,
        required:false,
        default:true
      },
      errorImg:{//图像请求失败显示图片
        type:String,
        required:false,
        default:"",
      },
      cropperWidth:{//幕布宽度
        type: Number,
        required: false,
        default:360
      },
      cropperHeight:{//幕布高度
        type: Number,
        required: false,
        default:360
      },
      outputSize:{//裁剪生成图片的质量
        type: Number,
        required: false,
        default:1
      },
      full:{//是否输出原图比例的截图
        type: Boolean,
        required: false,
        default:true
      },
      sizes: {//预览图大小
        type: [String, Number],
        required: false,
        default: ''
      },
      outputType:{//裁剪生成图片的格式
        type: String,
        required: false,
        default:"jpeg"
      },
      canMove:{//上传图片是否可以移动
        type: Boolean,
        required: false,
        default:true
      },
      original:{//上传图片按照原始比例渲染
        type: Boolean,
        required: false,
        default:false
      },
      canMoveBox:{//截图框能否拖动
        type: Boolean,
        required: false,
        default:true
      },
      autoCrop:{//是否默认生成截图框
        type: Boolean,
        required: false,
        default:true
      },
      autoCropWidth:{//默认生成截图框宽度
        type: Number,
        required: false,
        default:300
      },
      autoCropHeight:{//默认生成截图框高度
        type: Number,
        required: false,
        default:300
      },
      fixedBox:{//固定截图框大小 不允许改变
        type: Boolean,
        required: false,
        default:true
      },

      hasZoomSize:{//是否生成其他尺寸的图片，以剪裁后的为基准;废弃
        type:Boolean,
        required:false,
        default:false
      },
      zoomSize:{//其他生成图片的尺寸，形式：100-100,50-50;废弃
        type:String,
        required:false,
        default:""
      },
      otherParam:{//其他需要传递的参数
        type:String,
        required:false,
        default:""
      },
      showAtOnce:{//上传后立即显示出来
        type:Boolean,
        required:false,
        default:true
      },
      doCut:{//是否裁剪
        type:Boolean,
        required:false,
        default:true
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
        fileList:{
            type: Array,
            required: false,
            default: []
        },
        ossServerContext:{
            type: String,
            required:false,
            default: ''
        }
    },
    data() {
      return {
          hasDelete:true,
          imgBoxList:[],
          imgList:[]
      };
    },
    computed:{
        boxHeight:function () {
            var imgHeight = this.imgHeight.replace("px","");
            var boxHeight = (parseInt(imgHeight) + 20 ) + "px";
            return boxHeight;
        }
    },
    components: {
      uploadImg
    },
    methods: {
       initImgList:function() {
           this.imgBoxList = [];
           if(this.fileList && this.fileList.length > 0){
               this.imgList = this.fileList;
               for(var i=0;i<this.imgList.length;i++){
                   this.imgBoxList.push(this.imgList[i].fileCode);
               }
           }
           this.imgBoxList.push('');
       },
      uploadResult(data){
          data.fileCode = data.originalFileId;
          var length = this.imgBoxList.length;
          this.imgBoxList[length-1] = data.fileCode;
          this.imgList.push(data);
          this.$emit("upload-result", this.imgList);
          this.imgBoxList.push(length);
      },
      deleteAction(data){
          var result = [];
          if(data.fileCode){
              this.imgList.forEach(item => {
                  if(item.fileCode != data.fileCode){
                      result.push(item);
                  }
              });
              this.imgList = result;
              this.$emit("upload-result", this.imgList);
              var list = [];
              for(var i=0;i<this.imgBoxList.length;i++){
                  if(this.imgBoxList[i] == data.fileCode){
                      this.imgBoxList[i] = 'del';
                  }
                  list.push(this.imgBoxList[i]);
              }
              this.imgBoxList = list;
          }
      }
    },
    mounted() {
        this.initImgList();
    },
    watch: {
        fileList:{
              handler: function () {
                  this.initImgList();
              },
              deep: true
        }
    }
  }
</script>

<style>

</style>
