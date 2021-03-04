<template>
  <div id="app">
    <router-view v-if="isRouterAlive"/>
  </div>
</template>

<script>
  import {
    mapState,
    mapMutations
  } from 'vuex';
  import axios from '@/libs/api.request'
export default {
  name: 'App',
  provide() { //父组件中通过provide来提供变量，在子组件中通过inject来注入变量。
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      isRouterAlive: true //控制视图是否显示的变量
    }
  },
  computed: {
    ...mapState(['openFlag']),
  },
  created() {
     if (process.env.VUE_APP_ISOPENSOURCE=='true') {
      this.getVersion();
    }

  },
  methods: {
    ...mapMutations(['setUpdateOpenFlag']),
    reload() {
      this.isRouterAlive = false; //先关闭，
      this.$nextTick(function() {
        this.isRouterAlive = true; //再打开
      })
    },
    getVersion() { //获取开源提示
      axios.request({
        url:'/getVersion',
        method:"get"
      }
        ).then(res => {
          let data = res.data ;
         if (data.code == 1) {
          if (data.version != process.env.VUE_APP_VERSION) {
            this.setUpdateOpenFlag(true);
            this.$Modal.confirm({
              title: '版本升级通知',
              content: "您使用的是开源版本,目前版本较低<br/>"+data.msg,
              loading: true,
              okText: '立即升级',
              cancelText: '暂不升级',
              onOk: () => {
                setTimeout(() => {
                  this.$Modal.remove();
                  this.$Message.info('Asynchronously close the dialog box');
                }, 2000);
                window.location.href = "http://www.baidu.com"
              }
            });

          }
        }
      })
    }
  },
}
</script>

<style lang="less">
.size{
  width: 100%;
  height: 100%;
}
html,body{
  .size;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
#app {
  .size;
}
</style>
