<template>
  <div ref="dom" class="charts chart-pie"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'ChartPie',
  props: {
    value: Array,
    text: String,
    subtext: String
  },
  data () {
    return {
      dom: null
    }
  },
  methods: {
    init(){
      this.$nextTick(() => {
        let legend = this.value.map(_ => _.name)
        let option = {
          title: {
            text: this.text,
            subtext: this.subtext,
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            data: []
          },
          series: [
            {
              type: 'pie',
              radius: ['60%', '85%'],
              center: ['50%', '60%'],
              data: this.value,
              color: ['rgb(87,187,149)', '#ccc'],
              itemStyle: {
                normal : {
                  label : {
                    show : false   //隐藏标示文字
                  },
                  labelLine : {
                    show : false   //隐藏标示线
                  }
                },
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                },

              }
            }
          ]
        }
        this.dom = echarts.init(this.$refs.dom, 'tdTheme')
        this.dom.setOption(option)
        on(window, 'resize', this.resize)
      })
    },
    resize () {
      this.dom.resize()
    }
  },
  watch: {
    value: {
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
