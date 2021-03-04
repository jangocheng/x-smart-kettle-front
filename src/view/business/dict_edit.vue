<template>
  <xtl-page hasExtend   hasBottom>
    <!--<div slot="icon">
      <Icon type="md-rose" />
    </div>-->
    <div slot="extend">
      <Button type="default" @click="pageGoBack">返回</Button>
    </div>
    <Collapse accordion v-model="value1">
      <Panel name="1" hide-arrow>
        基本信息
        <div slot="content">
          <Form ref="form" :model="form" :label-width="80" :rules="ruleValidate">
            <Row>
              <i-col span="12" offset="6">

                <FormItem label="字典ID"   prop="dictId">
                  <Input v-model="form.dictId"    style="width:300px"></Input>
                </FormItem>
                <FormItem label="字典名称" prop="dictName">
                  <Input v-model="form.dictName"    style="width:300px"></Input>
                </FormItem>
              </i-col>

            </Row>
          </Form>

        </div>
      </Panel>
    </Collapse>
    <Collapse accordion v-model="value2">
      <Panel name="2" hide-arrow>
        字典信息
        <div slot="content">
          <Row justify=end>
            <i-col offset="18" span="2">
              <Button type="primary" size="small" icon="md-add" @click="addrowData">增加一行</Button>
            </i-col>
          </Row>
          <Row>
            <xtlEditTable ref="table1" v-model="datas" :columns="columns"
                          :showTableOption="showTableOption"></xtlEditTable>
          </Row>
          <Row>
            &nbsp
          </Row>
          <Row>
            <i-col offset="10" span="2">
              <Button type="primary" @click="submit">确定</Button>
            </i-col>
            <i-col span="1">
              <Button type="default" @click="resetForm">重置</Button>
            </i-col>
          </Row>
        </div>
      </Panel>
    </Collapse>
  </xtl-page>
</template>

<script>
  import util from '@/libs/util.js';
  import config from '@/config/config';
  import ICol from "view-design/src/components/grid/col";

  const deleteButton = (vm, h, currentRow, index) => {
    return h('Button', {
      props: {
        type: "error",
        ghost: true,
      },
      style: {
        margin: '0 5px'
      },
      on: {
        'click': () => {
          vm.doDelete(currentRow.dictKey, index);
        }
      }
    }, '删除');
  };
  export default {
    components: {ICol},
    data() {
      return {
        contentType: 'table',
        showTableOption:false,
        form: {
          dictId:"",
          dictName:''
        },
        ruleValidate: {
          dictId: this.requiredField('字典ID'),
          dictName: this.requiredField('字典名称')
        },
        value1:"1",
        value2:"2",
        datas: [],
      }
    },
    created(){

    },

    computed: {

      columns() {
        let columns = [];
        let self = this;
        columns.push({
          title: '字典Key',
          align: 'center',
          key: 'dictKey',
          editor: {
            type: "text",
          }
        });
        columns.push({
          title: '字典值',
          align: 'center',
          key: 'dictValue',
          editor: {
            type: "text",
          }
        });
        columns.push({
          title: '字典排序',
          align: 'center',
          key: 'orderNum',
          editor: {
            type: "text",
          }
        });
        columns.push({
          title: '字典描述',
          align: 'center',
          key: 'dictDesc',
          editor: {
            type: "text",
          }
        });

        columns.push({
          title: '编辑',
          align: "center",
          render: function (h, param) {
            return h('div', [
              deleteButton(self, h, param.row, param.index)
            ]);
          }
        });
        return columns;
      },
      title: function () {
        return this.$route.meta.title;
      },
      dictId:function(){
        return this.$route.query.dictId
      }
    },
    methods: {
      initData: function () {
        let self = this;
        if(self.dictId){
          util.ajax.get(config.xtlServerContext + '/op/xdict/get/'+self.dictId).then(function (resp) {
            var result = resp.data.data
            self.form.dictId=result.dictId
            self.form.dictName=result.dictName
            self.datas = result
          }).catch((err) => {
            this.$Message.error("获取字典异常,错误信息:" + err);
          })
        }
      },

      pageGoBack: function () {
        this.$router.go(-1);
      },
      addrowData() {
        let row = {
          dictKey: '',
          dictValue: '',
          orderNum:1,
          dictDesc:''
        }
        this.datas.push(row);
      },
      doDelete: function (cellId, index) {
        var self = this;
        this.$Modal.confirm({
          title: '提示',
          content: '<p>确定要删除吗?</p>',
          onOk: () => {
            self.datas.splice(index, 1);
          }
        });
      },
      submit() {
        let self = this;
        let param = {
          dictId: self.form.dictId,
          dictName:self.form.dictName,
          datas: JSON.stringify(this.datas)
        }
        if(self.dictId){
          if (this.datas.length > 0) {
            util.ajax.post(config.xtlServerContext + "/op/xdict/update", param).then(function (resp) {
              let data = resp.data;
              if (data.code === 11000) {
                self.$Message.success("更新成功！");
                self.$router.go(-1);
              } else {
                self.$Message.error("更新失败!");
              }
            }).catch(function (err) {
              console.error(err);
              self.$Message.error("更新失败,请联系系统管理员");
            });
          } else {
            this.$Message.error("更新失败,请至少增加一条字典值！");
          }
        }else {
          if (this.datas.length > 0) {
            util.ajax.post(config.xtlServerContext + "/op/xdict/add", param).then(function (resp) {
              let data = resp.data;
              if (data.code === 11000) {
                self.$Message.success("保存成功！");
                self.$router.go(-1);
              } else {
                self.$Message.error("保存失败!");
              }
            }).catch(function (err) {
              console.error(err);
              self.$Message.error("保存失败,请联系系统管理员");
            });
          } else {
            this.$Message.error("保存失败,请至少增加一条字典值！");
          }
        }


      },
      resetForm () {
        this.$refs.form.resetFields()
        this.datas=[]
      },
      requiredField (fieldName) {
        return [{
          required: true,
          message: fieldName + '不能为空',
          trigger: 'blur'
        }]
      },
    },
    mounted: function () {
      this.initData()
    }
  }
</script>

<style>

</style>

