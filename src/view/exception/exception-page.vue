<template>
  <div class="exception-page">
    <div class="img">
      <img :src="src" />
    </div>
    <div class="content">
      <h1>{{title}}</h1>
      <div class="desc">{{desc}}</div>
      <back-btn-group class="action" v-if="back"></back-btn-group>
    </div>
  </div>
</template>

<script>
import Config from './typeConfig'
import backBtnGroup from './back-btn-group.vue'
export default {
  name: 'ExceptionPage',
  components: {
    backBtnGroup,
  },
  props: {
    code: String,
    desc: String,
    title: String,
    src: String,
    back:{
      type:Boolean,
      default: true
    },
    'homeRoute':{
      type: String
    }
  },
  data () {
    return {
      config: Config
    }
  }
}
</script>

<style lang="less" scoped>
  .exception-page{
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    .img{
      padding-right: 52px;
      zoom: 1;
      img{
        max-width: 430px;
      }
    }
    .content{
      h1{
        color: #434e59;
        font-size: 72px;
        font-weight: 600;
        line-height: 72px;
        margin-bottom: 24px;
      }
      .desc{
        color: rgba(0,0,0, 0.45);
        font-size: 20px;
        line-height: 28px;
        margin-bottom: 16px;
      }
    }
  }

</style>
