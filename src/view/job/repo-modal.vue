<template>
    <Modal
            v-model="modal"
            title="选择作业"
            @on-ok="repoOk"
            @on-cancel="repoCancel">
      <Tree :data="treeData" :load-data="loadData" @on-select-change="selectChange"></Tree>
    </Modal>
</template>

<script>
    import util from '@/libs/util.js';
    import config from '@/config/config';

    export default {
        name: "repo-modal",
        props: {
          repoModal: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                treeData: [],
                currentNode: {},
                modal: false
            }
        },
        created() {
          let self = this
          this.getRootData(function (data) {
            let rootNode = data[0];
          });
        },
        watch: {
            repoModal(val) {
                this.modal = val
                this.currentNode = {}
            }
        },
        methods: {
          loadData(node, callback) {
            let self = this
            this.getData(node, function (data) {
              if (data.length > 0) {
                callback(data)
              }
            })
          },
          selectChange(node) {
            let self = this
            if (node.length > 0) {
              if (self.currentNode != node[0]) {
                self.currentNode = node[0]
                self.eventType = 'show'
                if (node[0].children.length <= 0) {
                  self.getData(node[0], function (data) {
                    self.$set(node[0], 'children', data)
                  })
                }
                self.$set(node[0], 'expand', true)
              }
            } else {
              self.$set(self.currentNode, 'expand', !self.currentNode.expand)
              self.currentNode.selected = true
            }
          },
          getRootData(callback) {
            let self = this
            let childs = []
            util.ajax.get(config.xtlServerContext + "/api/xrepo/qryRepoRootTree").then(function (resp) {
              if (resp.data.code == 11000) {
                let data = resp.data.data;
                if (data.length > 0) {
                  data.forEach(item => {
                    let obj = {}
                    obj.title = item.text
                    obj.code = item.id
                    obj.pId = item.parent
                    obj.id = item.id
                    obj.lasted=item.lasted
                    let type = item.type
                    if(type.toString().indexOf('@') !=-1){
                      obj.type=type.toString().split('@')[2]
                    }else {
                      obj.type=item.type
                    }
                    obj.repo=item.type
                    obj.path=item.path
                    obj.loading = false
                    obj.children = []
                    childs.push(obj)
                  })
                }
                self.treeData = childs;
                self.addIcon(self.treeData);
                callback(childs)
              } else {
                self.$Message.error(resp.data.message)
              }
            }).catch((err) => {
              self.$Message.error("数据获取异常,错误信息:" + err);
            })
          },

          getData(node, callback) {
            let self = this
            if(node.lasted ===true){
              return ;
            }
            util.ajax.get(config.xtlServerContext + "/api/xrepo/qryRepoSubTree", {
              params: {
                pId: node.id,
                type:'job'
              }
            }).then(function (resp) {
              const childs = [];
              if (resp.data.code == 11000) {
                let nodeDatas = resp.data.data
                if (nodeDatas.length > 0) {
                  nodeDatas.forEach(item => {
                    let obj = {}
                    obj.title = item.text
                    obj.code = item.id
                    obj.pId = item.parent
                    obj.id = item.id
                    obj.lasted=item.lasted
                    obj.path=item.path
                    let type = item.type
                    if(type.toString().indexOf('@') !=-1){
                      obj.type=type.toString().split('@')[2]
                    }else {
                      obj.type=item.type
                    }
                    obj.repo=item.type
                    obj.loading = false
                    obj.children = []
                    childs.push(obj)
                  })
                  self.addIcon(childs);
                } else {
                  self.$set(node, "hasChild", false)
                  self.$delete(node, 'loading')
                }
                if (callback) {
                  callback(childs)
                }

              } else {
                self.$set(node, "hasChild", false)
                self.$delete(node, 'loading')
                if (callback) {
                  callback([])
                }
              }
            }).catch((err) => {
              self.$Message.error("数据获取异常,错误信息:" + err);
            })

          },
          addIcon(rows){
            rows.forEach(item => {
              if(item.lasted === false){
                item.render = (h, {root, node, data}) => {
                  return h('span', {style: {display: 'inline-block', width: '100%'}}, [
                    h('span', [
                      h('Icon', {props: {type: 'ios-folder-outline'}, style: {marginRight: '8px'}}),
                      h('span', data.title)
                    ])
                  ]);
                }
              }else {
                item.render = (h, {root, node, data}) => {
                  return h('span', {style: {display: 'inline-block', width: '100%'}}, [
                    h('span', [
                      h('Icon', {props: {type: 'ios-paper-outline'}, style: {marginRight: '8px'}}),
                      h('span', data.title)
                    ])
                  ]);
                }
              }
              if(item.children!= undefined && item.children.length>0){
                this.addIcon(item.children);
              }
            });
            return rows;
          },
            repoOk() {

                  if (this.currentNode.hasOwnProperty('type') && this.currentNode.type === 'job') {
                    this.$emit('on-ok', this.currentNode)
                }else {
                  this.modal = true
                  this.$Message.error('请选择到具体作业')
                    this.$emit('on-ok')
                }
            },
            repoCancel() {
                this.$emit('on-cancel')
            }
        }
    }
</script>

<style scoped>

</style>
