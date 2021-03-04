<template>
  <Card   :shadow="shadow" class="line-card-wrapper" :class="{active:show}"
          :padding="10">
    <div class="content-con" @click="setActive">
      <div class="left-area" :style="{width: leftWidth}">
        <div>
          <slot></slot>
        </div>
       </div>
    </div>
  </Card>

</template>

<script>
import CommonIcon from '_c/common-icon'
import { ChartPie } from '_c/charts'
import config from '@/config/config'
export default {
  name: 'lineCard',
  components: {
    CommonIcon,
    ChartPie
  },
  data () {
    return {
      activeIndex: 3,
      active:false
    }
  },
  props: {
    show:{
      type: Boolean,
      default: false
    },

    index:{
      type: Number,
      default: 0
    },

    title: {
      type: String,
      default: ''
    },
    left: {
      type: Number,
      default: 50
    },
    color: {
      type: String,
      default: '#2d8cf0'
    },
    pieData:{
      type: Number,
      default: 0
    },
    count2:{
      type: Number,
      default: 0
    },
    icon: {
      type: String,
      default: ''
    },
    iconSize: {
      type: Number,
      default: 20
    },
    shadow: {
      type: Boolean,
      default: false
    }
  },
  watch:{
    show(val){

    }
  },
  computed: {
    leftWidth () {
      return `${this.left}%`
    },
    rightWidth () {
      return `${100- this.left}%`
    },
    pieData1(){
      return [   { value: this.pieData, name: this.title },{ value: this.count2, name: '' }]
    }
  },
  methods:{
    setActive:function () {

       this.$emit('on-set-active',this.index)
    },
  }
}
</script>

<style lang="less"  >
  .active{
    background-color: tint(#ccc,60%);
    color:#fff !important; ;
  }
.common{
  float: left;
  height: 100%;
  display: table;
  text-align: center;
}
.size{
  width: 100%;
  height: 100%;
}
.middle-center{
  display: table-cell;
  vertical-align: middle;
}
.line-card-wrapper{
  .size;
   overflow: hidden;
  .ivu-card-body{
    .size;
  }
  .content-con{
    .size;
    position: relative;
    cursor: pointer;
    .left-area{
      .common;
      & > .icon{
        .middle-center;
      }
    }

  }

}
</style>
