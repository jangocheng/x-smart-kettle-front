<template>
    <div ref="dom"></div>
</template>

<script>
import echarts from 'echarts'
import { on, off } from '@/libs/tools'
export default {
  name: 'serviceRequests',
  props:{
    xExampleData: {
        type:Array,
    default:[]
      },
    seriesExampleData: {
      type:Array,
      default:[]
    }
  },
  data () {
    return {
      dom: null
    }
  },
  methods: {
    resize () {
      this.dom.resize()
    },
    init(){
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        grid: {
          top: '3%',
          left: '1.2%',
          right: '1%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: true,
            data: this.xExampleData
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '',
            type: 'line',
            smooth: true,
            areaStyle: {
              normal: {
                color: '#2d8cf0'
              }
            },
            data: this.seriesExampleData
          }
        ]
      }
      this.$nextTick(() => {
        this.dom = echarts.init(this.$refs.dom)
        this.dom.setOption(option)
        on(window, 'resize', this.resize)
      })
    }
  },
  watch:{
    xExampleData:{
      handler(newVal, oldVal) {
        if (this.dom) {
          if (newVal) {
            this.init();
          }
        }
      },
      deep: true //对象内部属性的监听，关键。
    },
    seriesExampleData:{
      handler(newVal, oldVal) {
        if (this.dom) {
          if (newVal) {
            this.init();
          }
        }
      },
      deep: true //对象内部属性的监听，关键。
    }
  },
  mounted () {
   this.init();
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>
