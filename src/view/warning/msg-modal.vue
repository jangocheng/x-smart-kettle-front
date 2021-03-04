<template>
  <Modal
    v-model="modal"
    :title="title"
fullscreen
    @on-ok="repoOk"
    @on-cancel="repoCancel"
>

    <div class="demo-split">
      <Card shadow>
        <p slot="title">预警日志</p>
        <Input v-model="logText" type="textarea" :rows="22"
               style="overflow-y:scroll" placeholder="Enter something..." />
      </Card>
    </div>

  </Modal>
 </template>
<script>


  export default {
    name: "msg-modal",

    props: {
      msgModal: {
        type: Boolean,
        default: false
      },

      logText:{
        type: String,
        default:''
      },
      jobName:{
        type: String,
        default:''
      }
    },
    data() {
      return {
        modal:false,
       }
    },

    created() {

      },
    mounted () {

    },
    computed:{

      title(){
        return "查看【"+this.jobName+"】预警信息"
      }
    },
    watch:{
      msgModal(val) {
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
