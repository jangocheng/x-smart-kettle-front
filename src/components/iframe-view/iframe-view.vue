<template>
  <div :style="{width:width,height:height}">
    <iframe ref="iframeRef"
            v-show="show"
            :src="src"
            :name="newRoute.name"
            height="100%"
            width="100%"
            scrolling="no"
            frameborder="0"></iframe>
  </div>
</template>
<script>
import {getToken, THIRD_TOKEN_KEY} from '@/libs/platformUtil'
import {verifyToken} from '@/api/user'
export default {
  name: 'IFrameView',
  data() {
    return {
      frameHeight: document.body.clientHeight,
      frameWidth: document.body.clientWidth,
    }
  },
  computed: {
    src() {
      let src = this.$route.meta.frameUrl;
      if (src.indexOf('?') === -1) {
        src = src + "?token=" + getToken(THIRD_TOKEN_KEY);
      } else {
        src = src + "&token=" + getToken(THIRD_TOKEN_KEY);
      }
      return src
    },
    show() {
      return this.$route.meta.frameUrl;
    },
    newRoute() {
      return this.$route
    },
    width(){
      return (this.frameWidth)+'px';
    },
    height(){
      return (this.frameHeight)+'px';
    }
  },
  mounted() {
    const self = this;
    verifyToken(getToken(THIRD_TOKEN_KEY)).then((res)=>{
      if(res.data.code==1){
        if(!res.data.data){
          self.$router.push({name: "login"})
        }
      }else{
        self.$Message.error(res.data.message)
      }
    }).catch((err)=>{
      self.$Message.error(err.message)
    })
    window.onresize = () => {
      return (() => {
        let contentHeight = self.$refs.iframeRef.contentWindow.clientHeight
        let contentWidth = self.$refs.iframeRef.contentWindow.frameWidth
        let clientHeight = document.body.clientHeight
        let clientWidth = document.body.clientWidth
        self.frameHeight = clientHeight > contentHeight ? clientHeight:contentHeight
        self.frameWidth = clientWidth > contentWidth ? clientWidth:contentWidth
      })()
    }
  },
}
</script>
<style lang="less" scoped>
</style>
