<template>
  <div class="xtl-search-box">
    <div ref="searchBox" class="search-box" :class="{ 'more-search': !isOpen && hashMore }">
      <div class="search xtl-search"  :class="{'right-class':hashMore}">
        <slot>
        </slot>
        <Button type="text" class="more-btn" @click="getMore" v-if="hashMore">
          更多
          <Icon :type="isOpen?'ios-arrow-up':'ios-arrow-down'" @click="getMore"></Icon>
        </Button>
        <Button type="primary" class="search-btn" icon="ios-search" @click="doSearch">查询</Button>
      </div>
      <!--<Divider v-if="hashMore" @click="getMore">
        <Icon :type="isOpen?'ios-arrow-down':'ios-arrow-up'" @click="getMore"></Icon>
      </Divider>-->
    </div>
  </div>
</template>

<script>
import {findComponentClassDownward} from '@/libs/assist'
    export default {
        name: "XtlSearch",
        data() {
            return {
                isOpen: false,
                hashMore: false,
            }
        },
        computed: {},
        watch: {},
        components: {},
        methods: {
            doSearch: function () {
                this.$emit("do-search");
            },
            getMore: function () {
                if (this.isOpen) {
                    this.isOpen = false;
                } else {
                    this.isOpen = true;
                }
            },
            init() {
                // console.log()
                // console.log(document.getElementsByClassName("xtl-search")[0].getElementsByClassName("ivu-form"))
                // let data = findComponentClassDownward(this,"default-show");


                var ivuform = this.$refs.searchBox.getElementsByClassName("ivu-form");
                if (ivuform && ivuform.length > 0) {
                    var defaultShow = ivuform[0].getElementsByClassName("default-show");
                    if (defaultShow && defaultShow.length > 0) {
                        this.hashMore = true;
                    }
                }
            }
        },
        mounted() {
            this.init();
        }
    }
</script>
<style>

</style>

