<template>
  <div class="xtl-table-box">
    <div class="pt-box">
      <div class="pt-header" v-if="showHeader">
        <div class="pt-icon">
          <Icon :type="icon" v-if="icon"></Icon>
          <slot name="icon"></slot>
        </div>
        <div class="pt-title">
          {{title ||　pageTitle}}
        </div>
        <div class="pt-extend" v-if="hasExtend">
          <slot name="extend"></slot>
        </div>
      </div>
      <div class="pt-body">
        <slot></slot>
        <div class="bottom-box" v-if="hasBottom">
          <slot name="bottom"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "XtlPage",
    props: {
      title: {
        type: String,
        required: false,
        default: ""
      },
      icon: {
          type: String,
          required: false,
          default: ""
      },
      showHeader: {
          type: Boolean,
          required: false,
          default: true
      },
      hasExtend: {
        type: Boolean,
        required: false,
        default: false
      },
      hasBottom: {
          type: Boolean,
          required: false,
          default: false
      }
    },
    data() {
      return {
      }
    },
    mounted(){
    },
    computed: {
      pageTitle() {
        return this.$route.meta.title;
      }
    }
  }
</script>
<style>

</style>
