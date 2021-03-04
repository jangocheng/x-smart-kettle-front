<template>
    <div class="org-info">
      <div class="org-tree">
        <Tree :data="treeData" :load-data="loadData" @on-select-change="selectChange"></Tree>
      </div>
      <div class="org-detail">
        <detail v-if="eventType=='show'" :datas="currentNode" @go-back="getGoBack" @over-delete="overDelete"></detail>
        <edit v-if="eventType == 'create' || eventType ==='edit' " :datas="currentNode"
                  :event-type="eventType" @go-back="getGoBack" ></edit>
      </div>
    </div>
</template>
<script>

  import util from '@/libs/util.js';
  import config from '@/config/config';
  import Detail from "./detail";
  import Edit from "./edit";

  export default {
    name: "tree",
    components: {
      Edit,
      Detail
    },
    data() {
      return {
        curStru: {},
        currentNode: {},
        eventType: "other",
         treeData: []
      }
    },
    created() {
      let self = this
      this.getRootData(function (data) {
        let rootNode = data[0];
      });

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
                obj.path=item.path
                obj.lasted=item.lasted
                let type = item.type
                if(type.toString().indexOf('@') !=-1){
                  obj.type=type.toString().split('@')[2]
                }else {
                  obj.type=item.type
                }
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

      getData(node, callback) {
        let self = this
          if(node.lasted ===true){
          return ;
        }
        util.ajax.get(config.xtlServerContext + "/api/xrepo/qryRepoSubTree", {
          params: {
            pId: node.id
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
                obj.path=item.path
                obj.id = item.id
                obj.lasted=item.lasted
                let type = item.type ;
                if(type.toString().indexOf('@') !=-1){
                  obj.type=type.toString().split('@')[2]
                }else {
                  obj.type=item.type
                }
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
      getNodeByParentId(list, node) {
        let self = this
        let selectNodes = {}
        if (list && list.length > 0) {
          for (let i = 0; i < list.length; i++) {
            if (list[i].id == node.parentId) {
              selectNodes = list[i]
              break
            }
            if (list[i].hasOwnProperty('children') && list[i].children.length > 0) {
              selectNodes = self.getNodeByParentId(list[i].children, node)
            }

          }
        }
        return selectNodes
      },
      overDelete(type, node) {
        this.eventType = type
        let self = this
        let parantNode = this.getNodeByParentId(this.treeData, node)
        if (parantNode) {
          this.getData(parantNode, (data) => {
            self.$set(parantNode, 'children', data)
          })
          this.currentNode = parantNode
        }

      },
      getGoBack(type) {
        this.eventType = type
      }
    }
  }
</script>

<style lang="less" scope>
  @import url("styles/variable.less");
  .org-tree {
    width: 20%;
    clear: both;
    float: left;
    min-height: 450px;
    border-right: 1px solid #dcdee2;
  }

  .org-detail {
    float: left;
    width: 75%;
    min-height: 400px;
    padding: 0 40px 30px;
    margin-left: 50px;
    .title-extend {
      float: right;
    }
    .detil-org {
      padding-top: 40px;
    }
    .detil-dept {
      padding-top: 40px;
    }
    .org-edit {
      padding-top: 40px;
    }
    .detil-info {
      p {
        font-size: 12px;
        color: #25295d;
        margin-bottom: 8px;
      }
      div {
        color: #25295d;
        font-size: 20px;
        margin-bottom: 20px;
      }
    }
    .detil-event {
      /*width: 300px;*/
      /*margin: 0 auto;*/
      button {
        width: 88px;
        margin-right: 10px;
      }
    }
  }
</style>
<style lang="less">
  @import url("styles/variable.less");

  .org-info {
    overflow: hidden;
  }

  .org-tree {
    .ivu-tree {
      .ivu-tree-children {
        .ivu-tree-title-selected {
          background: none;
          font-weight: bold;
          color: #25295d;
        }
        .ivu-tree-title:hover {
          background: none;
          color: #25295d;
          font-weight: bold;
        }
      }
      ul {
        font-size: 14px !important;
      }
    }
  }
</style>
