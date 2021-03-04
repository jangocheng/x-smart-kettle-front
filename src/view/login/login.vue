<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <Carousel
      v-model="value3"
      :autoplay="setting.autoplay"
      :autoplay-speed="setting.autoplaySpeed"
      :dots="setting.dots"
      :radius-dot="setting.radiusDot"
      :trigger="setting.trigger"
      :arrow="setting.arrow"
>
      <CarouselItem >
        <div class="demo-carousel">
          <img src="@/assets/images/admin_01.jpg" style="width:100%;height:100%;"  alt="轮播图">
        </div>
      </CarouselItem>
      <CarouselItem >
        <div class="demo-carousel">
          <img src="@/assets/images/admin_02.jpg" style="width:100%;height:100%;"  alt="轮播图">
        </div>
      </CarouselItem>
      <CarouselItem >
        <div class="demo-carousel">
          <img src="@/assets/images/admin_03.jpg" style="width:100%;height:100%;"  alt="轮播图">
        </div>
      </CarouselItem>
      <CarouselItem >
        <div class="demo-carousel">
          <img src="@/assets/images/admin_04.jpg" style="width:100%;height:100%;"  alt="轮播图">
        </div>
      </CarouselItem>
    </Carousel>
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录Smart Kettle调度监控平台"   :bordered="false">
        <div style="text-align:center">
          <img src="../../../public/logo-min.png" style="width: 50%;height: 50%;">
         </div>
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit" :loading="loading"></login-form>
          <p class="login-tip">输入用户名admin或superadmin,密码随便,即可登录</p>
        </div>
      </Card>
    </div>
    <div style="position:fixed;text-align:center;bottom:0;margin:0 auto;width:100%;color: #5c6b77">
      <a target="_blank" style="color: #5c6b77" href="http://open.inspur.com/yuenbin/x-smart-kettle-front.git">
        © 2020-2021 规划、设计、开发、运维等版权归yuenbin所有</a>&nbsp;<br/>
      博客地址： <a target="_blank" style="color: #5c6b77"
               href="https://my.oschina.net/yaukie">
      https://my.oschina.net/yaukie</a>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions, mapGetters } from 'vuex'
export default {
  components: {
    LoginForm
  },
  data () {
    return {
      value3: 0,
      loading: false,
      setting: {
        autoplay: true,
        autoplaySpeed: 2000,
        dots: 'inside',
        radiusDot: false,
        arrow: 'never'
      }
    }
  },
  methods: {
    ...mapGetters([
      'getToken'
    ]),
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),
    handleSubmit ({ userName, password ,verification}) {
      const that = this
      that.loading = true
      that.handleLogin({ userName, password,verification }).then(res => {
         if (that.getToken() != null ){
          this.$Message.success({
            closable: true,
            content: '登录成功',
            type: 'success'
          })
        }

        that.$router.push({
          name: that.$config.homeName
        })

         that.loading = false
      }).catch(err => {
        that.loading = false
        that.$Message.error(err.message)
      })
    },
  }
}
</script>

<style>

</style>
