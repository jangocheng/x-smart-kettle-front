<template>
  <Card :shadow="shadow" class="info-card-wrapper" :padding="10">
    <div class="content-con"  >
      <div class="left-area" :style="{width: leftWidth}">
        <div>
          <slot></slot>
        </div>
       </div>
      <div class="right-area" :style="{width: rightWidth}">
        <Card shadow>
       <chart-pie style="height: 120px" :value="pieData1"  />
        </Card>
      </div>
    </div>
  </Card>
</template>

<script>
import CommonIcon from '_c/common-icon'
import { ChartPie } from '_c/charts'
export default {
  name: 'InforCard',
  components: {
    CommonIcon,
    ChartPie
  },
  props: {

    title: {
      type: String,
      default: ''
    },
    left: {
      type: Number,
      default: 46
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
  }
}
</script>

<style lang="less">
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
.info-card-wrapper{
  .size;
  overflow: hidden;
  .ivu-card-body{
    .size;
  }
  .content-con{
    .size;
    position: relative;
    .left-area{
      .common;
      & > .icon{
        .middle-center;
      }
    }
    .right-area{
      margin-top: -45px;
       .common;
      & > div{
        .middle-center;
      }

     }
  }
}
</style>
