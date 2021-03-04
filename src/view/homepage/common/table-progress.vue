<template>
   <Progress :percent="percent" status="active">
    <Icon type="checkmark-circled"  ></Icon>
   </Progress>
 </template>
<script>
  export default {
    data () {
      return {
        activePercent:0
      }
    },
    props:{
      percent:{
        type:Number ,
        default:0
      }
    },
    watch:{
      percent:{
          handler(newVal, oldVal) {
            this.activePercent = newVal
            console.log(this.activePercent,9011)
          },
          deep: true //对象内部属性的监听，关键。
      }
    }
  }
</script>
