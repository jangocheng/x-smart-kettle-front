<template>
  <Modal
    v-model="modal"
    fullscreen
    :title="title"
    @on-ok="repoOk"
    @on-cancel="repoCancel"
>
          <img :src="src" width="100%" height="100%"
               scrolling="no" frameborder="0">
          </img>
  </Modal>
 </template>
<script>
  import util from '@/libs/util.js';
  import config from '@/config/config';
  import { getToken, THIRD_TOKEN_KEY } from '@/libs/platformUtil'

  export default {
    name: "preview-modal",

    props: {
      imgModal: {
        type: Boolean,
        default: false
      },
      tplKey:{
        type: String,
        default: ''
      },
      logText:{
        type: String,
        default:''
      }
    },
    data() {
      return {
        modal:false,
        split1: 0.5,

       }
    },

    created() {

      },
    mounted () {

    },
    computed:{
      src() {
        let src = config.xtlServerContext+"/op/xtemplate/getModelImage?tplKey="+this.tplKey
        return src
      },

      title(){
        return "预览【"+this.tplKey+"】调度图"
      }

    },
    watch:{
      imgModal(val) {
        this.modal = val
       }
    },
    methods: {
      repoOk() {
        this.modal = true
        this.$emit('on-ok')
      },
      repoCancel() {
        this.$emit('on-cancel')
      }
    }
  }
</script>

<style scoped>

  .demo-split{
    height: 100%;
    border: 1px solid #dcdee2;
  }
  .demo-split-pane{
    padding: 10px;
  }

</style>
