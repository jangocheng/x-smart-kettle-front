<template>
  <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
    <FormItem prop="userName">
      <Input  size="large" v-model="form.userName" placeholder="请输入用户名">
        <span slot="prepend">
          <Icon :size="24" type="ios-person"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="password">
      <Input   size="large"  type="password" v-model="form.password" placeholder="请输入密码">
        <span slot="prepend">
          <Icon :size="24" type="md-lock"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="verification">
      <Input   size="large"   v-model="form.verification" placeholder="验证码">
      </Input>
      <img :src="require('@/assets/icons/veri_'+verification_image+'.png')" @click="fleshVerify" title="换一张"
        border="0" style="		width: 100px;		display: block;		margin-top: 10px;cursor: pointer" />
    </FormItem>
    <FormItem>
      <Button @click="handleSubmit" type="primary"  :loading="loading" long>登录</Button>
    </FormItem>
  </Form>
</template>
<script>
   import { getVerifyImage } from '@/api/user'
  export default {
  name: 'LoginForm',
  props: {
    userNameRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ]
      }
    },
    passwordRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      }
    },
    verificationRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '验证码不能为空', trigger: 'blur' }
        ]
      }
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
       verification_image: "",
      form: {
        userName: 'admin',
        password: '1',
        verification: ''
      }
    }
  },
    created () {
      this.fleshVerify();
    },
    computed: {
    rules () {
      return {
        userName: this.userNameRules,
        password: this.passwordRules,
        verification: this.verificationRules
      }
    }
  },
  methods: {
    fleshVerify() {
      var that = this;
      var random = Math.random();
      getVerifyImage({
        t: random
      }).then(function(res) {
        let imgSrc = res.data.src ;
        that.verification_image =imgSrc;
      });
    },
    handleSubmit () {
      let params ={
      userName:this.form.userName,
        password: this.form.password,
        verification: this.form.verification
      }
       this.$refs.loginForm.validate((valid) => {
         let that = this;
         if (valid) {
           that.$emit("on-success-valid",params);
        }else {
           that.$Message({
            showClose: true,
            message: '登录失败,失败原因:' + res.msg,
            type: 'error'
          })
        }
      })
    }
  }
}
</script>
