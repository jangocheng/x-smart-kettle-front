<template>
  <div>
    <div class="title-extend">
      <Button type="primary" icon="md-add" ghost @click="goCreatePage">新增下级</Button>
    </div>
    <div class="detil-org">
      <Form :label-width="80">
        <FormItem label="节点编码">
          {{form.code}}
        </FormItem>
        <FormItem label="节点名称">
          {{form.title}}
        </FormItem>
        <FormItem label="节点类型">
          {{type}}
        </FormItem>
        <FormItem>
          <Button type="primary" ghost style="margin-right: 10px;" @click="doEdit">编辑</Button>
          <Button v-if="form.lasted" ghost type="error" @click="doDeleteOrg">删除</Button>
        </FormItem>
      </Form>

    </div>

  </div>
</template>

<script>
  import util from '@/libs/util.js';
  import config from '@/config/config';

  export default {
    name: "detail",
    props: {
      datas: {
        type: Object,
        required: true
      }
    },
    data() {
      return {

        form: {
          id:"",
          code: "",
           title: "",
          type: "",
          pId: "",
           isLasted:""
         }
      }
    },
    computed:{
      type:function () {
        if(this.form.type ==='file'){
          return '文件库'
        }else if(this.form.type ==='db'){
          return    '资源库'
        }else if(this.form.type ==='tree'){
          return '资源目录'
        }else if(this.form.type==='job')
        {
          return   '作业'
        }else if(this.form.type==='transformation')
        {
          return   '转换'
        }else if(this.form.type==='root') {
          return '根节点'
        }else {
          return '资源子目录'
        }
      }
    },
    created(){
      this.form = this.datas

    },
    watch: {
      datas(val) {
        this.form = val
      }
    },
    methods: {

      doDeleteOrg() {
        var self = this;
        this.$Modal.confirm({
          title: '提示',
          content: '<p>确定要删除吗?</p>',
          onOk: () => {
            util.ajax.get(config.xtlServerContext + "/op/xrepository/delRepoDir", {
            	 params:{
					          path: self.form.path,
					          repoId: self.form.id.toString().split("@")[0]
					        }
            }).then(function (resp) {
              if (resp.data.code == 11000) {
                self.$Message.success('删除成功');
                self.$emit('over-delete', 'show',self.form)
              } else {
                self.$Message.success('删除失败');
               }

            })
          }
        });
      },
      doEdit() {
        let self = this
        let eventType = "edit"
        this.$emit('go-back', eventType)
      },
      goCreatePage() {
        let self = this
        let eventType = 'create'
        this.$emit('go-back', eventType)
      },
      pageGoBack() {
        this.$emit('go-back','show')
      },
    }
  }
</script>

<style lang="less">

  .detil-org {
    .ivu-form-label-right {
      .ivu-form-item {
        label {
          margin-right: 10px !important;
        }
      }
    }
  }

</style>
