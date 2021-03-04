<template>
  <div ref="dom"></div>
</template>

<script>
  import echarts from 'echarts'
  import { on, off } from '@/libs/tools'
  export default {
    name: 'ChartBar2',
    props:{
      jobSeriesData: {
        type:Array,
        default:[]
      },
      transSeriesData: {
        type:Array,
        default:[]
      },
      text: String,
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
              type: 'shadow'
            }
          },
          title: {
            text: this.text,
            x: 'center'
          },
          xAxis:  [
            {
              type: 'category',
              boundaryGap: true,
              axisTick: {show: false},
              data: ['普通任务', '定时任务']
            }
          ],
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: '作业实例',
              type: 'bar',
              color: ['#2d7c6f'],
              itemStyle: {
                normal: {
                  label: {
                    show: true,  //开启显示
                    position: 'top',  //在上方显示
                    textStyle: {  //数值样式
                      color: '#ccc',
                      fontSize: 16
                    }
                  }
                }
              },
              data: this.jobSeriesData
            },
            {
              name: '转换实例',
              type: 'bar',
              color: ['rgb(32,176,255)'],
              itemStyle: {
                normal: {
                  label: {
                    show: true,  //开启显示
                    position: 'top',  //在上方显示
                    textStyle: {  //数值样式
                      color: '#ccc',
                      fontSize: 16
                    }
                  }
                }
              },
              data: this.transSeriesData
            },

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
      jobSeriesData: {
        handler (newVal, oldVal) {
          if (this.dom) {
            if (newVal) {
              this.init();
            }
          }
        },
        deep: true //对象内部属性的监听，关键。
      },
      transSeriesData: {
        handler (newVal, oldVal) {
          if (this.dom) {
            if (newVal) {
              this.init();
            }
          }
        },
        deep: true //对象内部属性的监听，关键。
      },
    },
    mounted () {
      this.init();
    },
    beforeDestroy () {
      off(window, 'resize', this.resize)
    }
  }
</script>
