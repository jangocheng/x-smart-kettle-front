<template>
  <div>
  <Form ref="form"   :label-width="120"  >
    <FormItem label="选择删除方式">
      <RadioGroup v-model="selectType" @on-change="selectChange">
        <Radio :label= 1>置为无效</Radio>
        <Radio :label= 2>本地删除</Radio>
        <Radio :label= 3>关联删除</Radio>
      </RadioGroup>
    </FormItem>
  </Form>
  </div>
</template>

<script>
  import util from '@/libs/util.js';
  import config from '@/config/config';

  export default {
    name: "trans-modal",

    props: {
      transModal: {
        type: Boolean,
        default: false
      },
      transId:{
        type: String,
        default: ''
      }
    },
    data() {
      return {
        selectType: 1,
         modal:false
      }
    },
    created() {
     },
    watch:{
      transModal(val){
        if (val) {
          if(this.selectType == 1){
            this.setIsDel()
          }else if(this.selectType == 2){
            this.delFromLocal()
          }else if (this.selectType == 3){
            this.delFromRepo()
          }
        }
       }
    },
    methods: {
      setIsDel() {
        util.ajax.post(config.xtlServerContext + "/op/xtrans/setIsDel/"+this.transId).then(resp => {
          if (resp.data.code === '11000') {
            this.$Message.success("状态已更改!");
          }
        }).catch((err) => {
          this.$Message.error("转换状态变更异常,错误信息:" + err);
        })
      },
      delFromLocal(){
        util.ajax.get(config.xtlServerContext + "/op/xtrans/delFromLocal",{
          params: {
            transId: this.transId
          }
        }).then(resp => {
          if (resp.data.code === '11000') {
            this.$Message.success("从本地库删除成功!");
          }
        }).catch((err) => {
          this.$Message.error("转换删除异常,错误信息:" + err);
        })
      },
      delFromRepo(){
        util.ajax.get(config.xtlServerContext + "/op/xtrans/delFromRepo",{
          params: {
            transId: this.transId
          }
        }).then(resp => {
          if (resp.data.code === '11000') {
            this.$Message.success("从资源库删除成功!");
          }
        }).catch((err) => {
          this.$Message.error("转换删除异常,错误信息:" + err);
        })
      },
        selectChange() {
        let self = this
        if(self.selectType == 1){
          self.$Message['warning']({
            background: true,
            duration:5,
            content: '此操作只会把转换置为无效状态,不会删除!'
          })
        }else if(self.selectType == 2){
          self.$Message['warning']({
            background: true,
            duration:5,
            content: '此操作将会从本地库删除转换,请谨慎操作!'
          })
        }else if(self.selectType == 3){
          self.$Message['warning']({
            background: true,
            duration:5,
            content: '此操作将会从资源库彻底删除转换,请谨慎操作!'
          })
        }
      },
    }
  }
</script>

<style scoped>

</style>
