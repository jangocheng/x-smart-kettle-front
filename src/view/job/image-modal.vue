<template>
  <Modal
    v-model="modal"
    fullscreen
    :title="title"
    @on-ok="repoOk"
    @on-cancel="repoCancel"
>

    <div class="demo-split">
      <Split v-model="split1">
        <div slot="left" class="demo-split-pane">
          <img :src="src" width="100%" height="100%"
               scrolling="no" frameborder="0">
          </img>
        </div>
        <div slot="right" class="demo-split-pane" style="overflow: auto">
          <Card shadow>
            <p slot="title">当前作业实时调度日志</p>
            <Input v-model="logText" type="textarea" :rows="22"
                   style="overflow-y:scroll" placeholder="Enter something..." />
          </Card>

        </div>
      </Split>
    </div>


  </Modal>
 </template>
<script>
  import util from '@/libs/util.js';
  import config from '@/config/config';
  import { getToken, THIRD_TOKEN_KEY } from '@/libs/platformUtil'

  export default {
    name: "image-modal",

    props: {
      imgModal: {
        type: Boolean,
        default: false
      },
      row:{
        type: Object,
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
        let src = config.xtlServerContext+"/api/xjob/getJobImage?jobId="+this.row.jobId
        return src
      },

      title(){
        return "查看作业【"+this.row.jobName+"】调度图"
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
