<template>
  <exception-page
    :src="config[type].img"
    :title="config[type].title"
    :desc="config[type].desc"
    :back="false"
    style="height: 500px"></exception-page>
</template>

<script>
import Config from './typeConfig'
import ExceptionPage from "@/view/exception/exception-page";
export default {
  name: 'dev',
  components: {
    ExceptionPage,
  },
  data(){
    return {
      type:'dev',
      config: Config
    }
  }
}
</script>
