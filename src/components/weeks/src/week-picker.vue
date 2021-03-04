<template>
  <div>
    <DatePicker
            type="month"
            :style="datestyle"
            :format="format"
            @on-change="dateOnChange"
            v-model="defaultDate"
            class="date-box"
    ></DatePicker>
    <Select :style="selectStyle" @on-change="onChange" v-model="defaultValue" style="margin-left: 10px;">
      <Option v-for="item in weekList" :value="item.PRI_WEEK" :key="item.PRI_WEEK">{{ item.WEEK_NAME }}</Option>
    </Select>
  </div>

</template>

<script>
  import util from '@/libs/util.js';

  export default {
    name: "XtlWeeks",
    props: {
      format: {
        type: String,
        default: 'yyyyMM'
      },
      placeholder: {
        type: String,
        default: ''
      },
      datestyle: {
        type: String,
        default: 'width:100px'
      },
      selectStyle: {
        type: String,
        default: 'width:220px'
      },
      defaultSelect: {
        type: String,
        default: ""
      }
    },
    data() {
      return {
        defaultDate: '',
        weekList: [],
        defaultValue: '',
      }
    },
    methods: {
      onChange(val) {
        let node = this.weekList.filter(item => item.PRI_WEEK === val);
        this.$emit('on-change', node[0]);
      },
      dateOnChange(val) {
        if (val == "") {
          this.weekList = [];
          this.defaultValue = "";
          this.$emit('on-change', null);
          return;
        }
        this.initWeekList(val);
        if (this.weekList.length > 0) {
          this.defaultValue = this.weekList[0].PRI_WEEK;
          this.$emit('on-change', this.weekList[0]);
        }

      },
      initWeekList(val) {
        var year = val.substring(0, 4);
        var month = val.substring(4, 6);
        var weeksCount = util.getWeeks(year, month);
        var weekList = [];
        for (var i = 0; i < weeksCount; i++) {
          var daterange = util.getWeekTime(year, month, (i + 1));
          var str = year + "年" + month + "月第" + (i + 1) + "周" + daterange.str;
          weekList.push({
            PRI_MONTH: val,
            PRI_WEEK: val + (i + 1),
            BEGIN_DATE: daterange.from,
            END_DATE: daterange.to,
            WEEK_NAME: str
          });
        }
        this.weekList = weekList;
      },
      init(){
        if (this.defaultSelect) {
          var defaultSelect = this.defaultSelect;
          this.defaultDate = defaultSelect.substring(0, 6);
          this.initWeekList(this.defaultDate);
          this.defaultValue = defaultSelect;
        }
      },
    },
    mounted(){this.init();},
    watch: {
      defaultSelect: function () {
       this.init();
      }
    }
  }


</script>

<style>

</style>
