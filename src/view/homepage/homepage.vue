<template>
  <div>
    <Row  >
      <i-col  span="10">
         <Divider orientation="left"><span><Icon @click="refresh" type="md-refresh-circle" style="cursor: pointer;font-size: 24px;color: #41d0ff" /></span>&nbsp;
          <span style="font-size: 20px;font-weight: bold;color:#ccc">实例运行统计</span></Divider>
      </i-col>
    <i-col   span="14">
      <Divider orientation="right">
        <span style="color:#ccc"> 统计截止日期:&nbsp;{{initTime}}</span>&nbsp;
      <DatePicker @on-change="dateChange"  type="daterange" format="yyyy-MM-dd"
                  placeholder="选择日期" :value = "iniDate"
                  style="width: 200px"></DatePicker>
      </Divider>
    </i-col>
    </Row>
    <Row >
         <i-col  span="5"><span style="font-size: 20px;font-weight: bold;color: #0a110c">运行详情</span>
           &nbsp; &nbsp; &nbsp;<Icon type="ios-images" style="color:#41d0ff" />&nbsp;<span>实例总数</span>&nbsp;
           <span style="font-size: 20px;color: #ccc">{{totalInstances}}</span></i-col>
     </Row>
    <br/>
    <Row  :gutter="20" >
      <i-col  :lg="6"v-for="(infor, i) in inforCardData" :key="`infor-${i}`"
             style="height: 125px;padding: 10px;">
        <infor-card shadow :color="infor.color" :title="infor.title" :pieData="infor.count" :count2="infor.count2" :icon-size="36">
          <p><icon :type="infor.icon" :color="infor.color" :size="18"/>&nbsp;
            <span style="font-size: 18px;color: #cccc;font-weight: bold">{{ infor.title }}</span></p>
          <count-to :end="infor.count" count-class="count-style"/>
          <p><span style="color: #ccc;font-size: 12px">占实例总数: &nbsp;{{ infor.rate }}%</span></p>
        </infor-card>
      </i-col>
    </Row>
    <br/>
    <Row >
    <i-col  span="4"><span style="font-size: 20px;font-weight: bold;color: #0a110c">实例详情</span> </i-col>
  </Row>
    <Row :gutter="20" style="margin-top: 10px;">
         <Card shadow>
          <chart-bar style="height: 300px;" :jobSeriesData="jobSeriesData" :transSeriesData="transSeriesData"   text="任务实例总体情况"/>
        </Card>
     </Row>
    <br/>

    <Row >
      <i-col  span=18><span style="font-size: 20px;font-weight: bold;color: #0a110c">运行趋势</span></i-col>
      <i-col  span="6">  <span style="color:#ccc"> 统计时间:&nbsp;{{iniDate[0]}}&nbsp;至&nbsp;{{iniDate[1]}}</span>&nbsp;</i-col>
    </Row>
    <br/>
    <Row  :gutter="20" >
      <i-col  :lg="8"v-for="(line, i) in lineCardData" :key="`infor-${i}`" style="height: 125px;padding: 10px;" >
        <line-card shadow  @on-set-active="setActive"  :show="i==0?show_0:(i==1?show_1:show_2)" :color="line.color"
                   :index="i" :title="line.title" :pieData="line.count" :count2="line.count2" :icon-size="36">
          <p><icon :type="line.icon" :color="line.color" :size="18"/>&nbsp;&nbsp;
            <span style="font-size: 18px;color: rgba(194,204,183,0.8);font-weight: bold">{{ line.title }}</span></p>
          <count-to :end="line.count" count-class="count-style"/>
        </line-card>
      </i-col>
    </Row>
    <Row :gutter="24" >
      <i-col span="24">
      <Card shadow>
        <example style="height: 310px;" :x-example-data="xExampleData" :series-example-data="seriesExampleData"/>
      </Card>
      </i-col>
    </Row>
    <br/>
    <Row >
      <i-col  span=18><span style="font-size: 20px;font-weight: bold;color: #0a110c">运行告警统计</span></i-col>
      <i-col  span="6">  <span style="color:#ccc"> 统计时间:&nbsp;{{iniDate[0]}}&nbsp;至&nbsp;{{iniDate[1]}}</span>&nbsp;</i-col>
    </Row>
    <br/>
    <Row :gutter="24" >
      <i-col span="12"  >
        <Card shadow>
          <p slot="title">作业实例告警排行</p>
          <xtl-table
            :columns="tableColumns1"
            :pageDisable="true"
            :row-class-name="rowClassName"
            :stripe="false"
            :border="false"
            :showTableOption="false"
            v-bind="tableProps1"
          >
          </xtl-table>
          </Card>
      </i-col>
      <i-col span="12"  >
        <Card shadow>
          <p slot="title">转换实例告警排行</p>
          <xtl-table
            :columns="tableColumns2"
            :pageDisable="true"
            :stripe="false"
            :border="false"
            :row-class-name="rowClassName"
            :showTableOption="false"
            v-bind="tableProps2"
          >
          </xtl-table>
          </Card>
      </i-col>
    </Row>
  </div>
</template>

<script>
  import jobTableWarning from '@/view/homepage/common/job-table-warning'
  import transTableWarning from '@/view/homepage/common/trans-table-warning'
  import InforCard from '@/components/card/infor-card'
  import LineCard from '@/components/card/line-card'
  import CountTo from '_c/count-to'
  import { ChartPie,ChartBar } from '_c/charts'
  import Example from './example.vue'
   import util from '@/libs/util'
  import config from '@/config/config'
  import tableProgress from '@/view/homepage/common/table-progress'
  export default {
    name: 'home',
    inject:['reload'],
    components: {
      jobTableWarning,
      transTableWarning,
      InforCard,
      LineCard,
      CountTo,
      ChartPie,
      Example,
      ChartBar
    },
    data () {
      return {
        tableProps1: {
          dataUrl:config.xtlServerContext + "/api/xjob/qryJobWarningInfo?limit=7&offset=0",
          data: [],
          searchParams:{

          }
        },
        tableProps2: {
          dataUrl:config.xtlServerContext + "/api/xjob/qryTransWarningInfo?limit=7&offset=0",
          data: [],
          searchParams:{

          }
        },
        totalInstances:0,
        jobSeriesData:[],
        transSeriesData:[],
        index:0,
        xExampleData:[],
        seriesExampleData:[],
        active:false,
        show_0:true,
        show_1:false,
        show_2:false,
        activeClass:'',
        iniDate:[util.formatDate(util.getBeforeOrNxtDay(-9)), new Date().Format('yyyy-MM-dd')],
        searchForm: {
          createDateEnd: new Date().Format('yyyy-MM-dd'),
          createDateBegin: util.formatDate(util.getBeforeOrNxtDay(-9)),
         },
        lineCardData: [
          { title: '已运行实例总数', icon: 'md-globe',rate:0,count: 0,count2:0, color: '#5791ff' },
          { title: '运行成功次数', icon: 'md-checkmark-circle-outline', rate:0,count: 0,count2:0,  color: '#1cf003' },
          { title: '运行失败次数', icon: 'ios-close-circle', rate:0,count: 0,count2:0, color: '#be1f0e' }
        ],
        inforCardData: [
          { title: '运行成功', icon: 'md-checkmark-circle-outline',rate:0,count: 0,count2:0, color: '#1cf003' },
          { title: '运行失败', icon: 'ios-close-circle', rate:0,count: 0,count2:0,  color: '#be1f0e' },
          { title: '运行中', icon: 'ios-code-working', rate:0,count: 0,count2:0, color: '#5791ff' },
          { title: '未运行', icon: 'ios-stopwatch', rate:0,count: 0,count2:0, color: '#ed7ced' }
         ],


      }
    },
    computed:{
      tableColumns1() {
        let columns = [];
        let self = this;
        columns.push({
            title: "排名",
            align: "center",
            width: "80",
            render: (h, params) => {
              let index = params.row.rowIndex
               if(index =='1'){
                return h('div', [
                  h('Icon', {
                    props: {
                      type: 'ios-ribbon',
                      color:'#ff0000',
                      size:30
                    }
                  }),

                ]);
              }else if(index == '2'){
                return h('div', [
                  h('Icon', {
                    props: {
                      type: 'ios-ribbon',
                      color:'#ff2ba2',
                      size:30
                    }
                  }),

                ]);
              }else if(index == '3' ){
                return h('div', [
                  h('Icon', {
                    props: {
                      type: 'ios-ribbon',
                      color:'#ff8a24',
                      size:30
                    }
                  }),

                ]);
              }else {
                return h('div', [
                  h('strong', params.row.rowIndex)
                ]);
              }

            }
          },
          {
            title: "实例名称",
            align: "center",
            sortable: true,
            resizable: true,
            width:'150',
            // className: 'demo-table-info-column',
            render: (h, { row }) => {
              return h(
                "a",
                {
                  style:{
                    color:'#19BE6B',
                    fontWeight:900,
                    underline:'underline'
                  },
                  on: {
                    click: () => {
                      this.$router.push({
                        name: "告警监控",
                      });
                    },
                  },
                },
                row.targetName
              );
            },
          },
          {
            title: "异常占比",
            align: "left",
            width: "220",
            render: (h, params) => {
              return h(tableProgress, {
                props: {
                  percent: params.row.warningRecords
                }
              })
            }

          },
          {
            title: "异常次数",
            align: "left",
            key:'date',
            className: 'demo-table-info-column',
            width: "120",
            render: (h, params) => {
              return h('div', [
                h('strong', params.row.warningRecords)
              ]);
            }
          }
        );
        return columns;
      },

      tableColumns2() {
        let columns = [];
        let self = this;
        columns.push({
            title: "排名",
             align: "center",
            width: "80",
            render: (h, params) => {
              let index = params.row.rowIndex
              if(index =="1"){
                return h('div', [
                  h('Icon', {
                    props: {
                      type: 'ios-ribbon',
                      color:'#ff0000',
                      size:30
                    }
                  }),

                ]);
              }else if(index == '2'){
                return h('div', [
                  h('Icon', {
                    props: {
                      type: 'ios-ribbon',
                      color:'#ff2ba2',
                      size:30
                    }
                  }),

                ]);
              }else if(index =='3' ){
                return h('div', [
                  h('Icon', {
                    props: {
                      type: 'ios-ribbon',
                      color:'#ff8a24',
                      size:30
                    }
                  }),

                ]);
              }else {
                return h('div', [
                  h('strong', params.row.rowIndex)
                ]);
              }

            }
          },
          {
            title: "实例名称",
            align: "center",
             width: "150",
            sortable: true,
            resizable: true,
            // className: 'demo-table-info-column',
            render: (h, { row }) => {
              return h(
                "a",
                {
                  style:{
                    color:'#19BE6B',
                    fontWeight:900,
                    underline:'underline'
                  },
                  on: {
                    click: () => {
                      this.$router.push({
                        name: "告警监控",
                      });
                    },
                  },
                },
                row.targetName
              );
            },
          },
          {
            title: "异常占比",
            align: "left",
            width: "220",
            render: (h, params) => {
              return h(tableProgress, {
                props: {
                  percent: params.row.warningRecords
                }
              })
            }

          },
          {
            title: "异常次数",
            align: "left",
            key:'date',
            className: 'demo-table-info-column',
            width: "120",
            render: (h, params) => {
              return h('div', [
                h('strong', params.row.warningRecords)
              ]);
            }
          }
        );
        return columns;
      }
      ,
    initTime(){
        return new Date().getHours()+":"+new Date().getMinutes()+":"+new Date().getSeconds()
      }
    },
    mounted () {
      this.$Notice.success({
        title: '温馨提醒',
        desc:'使用调度大盘，一定要先开启作业或转换的监控开关哦<br/>为避免性能问题，监控已默认关闭',
        duration: 0
      });
     this.initData() ;
      this.setActive(this.index);

    },
    methods:{
      initData(){
        let self = this;
        //初始化运行详情
        const msg = this.$Message.loading({
          content: "加速获取大盘数据中...",
          duration: 0
        });
        util.ajax.get(config.xtlServerContext+"/api/xjob/getRunningDetail",{
          params:{
            createDateBegin:self.searchForm.createDateBegin,
            createDateEnd:self.searchForm.createDateEnd
          }
        }).then(function(resp) {
          let data = resp.data.data ;
          self.totalInstances = parseInt(data.totalInstances) ;
          //计算运行成功实例
          self.inforCardData[0].count = parseInt(data.runnedOkInstances) ;
          self.inforCardData[0].count2=parseInt(self.totalInstances)-parseInt(data.runnedOkInstances)
          self.inforCardData[0].rate=Math.round(parseInt(data.runnedOkInstances) / self.totalInstances  * 10000) / 100;

          //计算运行失败实例
          self.inforCardData[1].count = parseInt(data.runnedErrorInstances) ;
          self.inforCardData[1].count2=parseInt(self.totalInstances)-parseInt(data.runnedErrorInstances)
          self.inforCardData[1].rate=Math.round(parseInt(data.runnedErrorInstances) / self.totalInstances  * 10000) / 100;


          //计算运行中实例
          self.inforCardData[2].count = parseInt(data.runningInstances) ;
          self.inforCardData[2].count2=parseInt(self.totalInstances)-parseInt(data.runningInstances)
          self.inforCardData[2].rate=Math.round(parseInt(data.runningInstances) / self.totalInstances  * 10000) / 100;


          //计算未运行实例
          self.inforCardData[3].count = parseInt(data.unRunnedInstances) ;
          self.inforCardData[3].count2=parseInt(self.totalInstances)-parseInt(data.unRunnedInstances)
          self.inforCardData[3].rate=Math.round(parseInt(data.unRunnedInstances) / self.totalInstances  * 10000) / 100;

          self.lineCardData[0].count=parseInt(data.runnedInstances) ;
          self.lineCardData[1].count=parseInt(data.runnedOkSum) ;
          self.lineCardData[2].count=parseInt(data.runnedErrorSum) ;

          // 销毁 loading 消息
          setTimeout(msg, 0);

        }).catch((err) => {
          // 销毁 loading 消息
          setTimeout(msg, 0);
          this.$Message.error("调度大盘数据初始化异常,错误信息:" + err);
        })

        this.tableProps1.searchParams = Object.assign({}, this.searchForm);
        this.tableProps2.searchParams = Object.assign({}, this.searchForm);

        const msg1 = this.$Message.loading({
          content: "加速获取大盘数据中...",
          duration: 0
        });

        util.ajax.get(config.xtlServerContext+"/api/xjob/qrySeriesData",{
          params:{
            createDateBegin:self.searchForm.createDateBegin,
            createDateEnd:self.searchForm.createDateEnd
          }
        }).then(function(resp) {
          let data = resp.data.data ;
           self.jobSeriesData = data.jobSeriesData
           self.transSeriesData = data.transSeriesData
           // 销毁 loading 消息
          setTimeout(msg1, 0);
        }).catch((err) => {
          // 销毁 loading 消息
          setTimeout(msg1, 0);
          this.$Message.error("调度大盘数据初始化异常,错误信息:" + err);
        })

      },
      setActive:function(index){
        let self  = this;
        const msg1 = this.$Message.loading({
          content: "加速获取大盘数据中...",
          duration: 0
        });

        util.ajax.get(config.xtlServerContext+"/api/xjob/qryTrendData",{
          params:{
            flag:index,
            createDateBegin:self.searchForm.createDateBegin,
            createDateEnd:self.searchForm.createDateEnd
          }
        }).then(function(resp) {
          let data = resp.data.data ;
          self.xExampleData = data.xExampleData
          self.seriesExampleData = data.seriesExampleData
          // 销毁 loading 消息
          setTimeout(msg1, 0);
        }).catch((err) => {
          // 销毁 loading 消息
          setTimeout(msg1, 0);
          this.$Message.error("调度大盘数据初始化异常,错误信息:" + err);
        })

        if(index == 0 ){
          this.show_0=true
          this.show_1=false
          this.show_2=false
        }else if(index == 1){

          this.show_0=false
          this.show_1=true
          this.show_2=false
        }else if(index ==2){

          this.show_0=false
          this.show_1=false
          this.show_2=true
        }

      },
      refresh(){
        this.initData() ;
        this.setActive(this.index);
      },
      dateChange : function (e) {
        this.iniDate = e;
        this.searchForm.createDateBegin = e[0];
        this.searchForm.createDateEnd = e[1];
        this.tableProps1.searchParams = Object.assign({}, this.searchForm);
        this.tableProps2.searchParams = Object.assign({}, this.searchForm);
        this.initData() ;
        this.setActive(this.index);
      },
      rowClassName (row, index) {
        if (index === 0) {
          return 'demo-table-info-row1';
        } else if (index === 1) {
          return 'demo-table-error-row2';
        } else if (index === 2) {
          return 'demo-table-error-row3';
        }
        return '';
      }
    }
  }
</script>

<style lang="less">
  .count-style{
    font-size: 20px;
  }
  .ivu-table td.demo-table-info-column{
    color: #19BE6B;
    font-weight: bold;
  }

  .ivu-table .demo-table-info-row1 td{
    /*background-color: rgba(255, 38, 248, 0.4);*/
   }

  .ivu-table .demo-table-error-row2 td{
    /*background-color: rgba(255, 0, 0, 0.4);*/
   }

  .ivu-table .demo-table-error-row3 td{
    /*background-color: rgba(255, 138, 36, 0.4);*/
  }
</style>
