<template>
  <div class="editing-status">
    <i-switch v-model="value"
              :disabled="disabled"
              :true-value="trueValue"
              :false-value="falseValue"
              @on-change="doSave"
    >
      <span slot="open">{{openTag}}</span>
      <span slot="close">{{closeTag}}</span>
    </i-switch>
  </div>
</template>

<script>
  export default {
    name: "switch-editor",
    props: {
      row: Object,
      column: Object,
      index: Number
    },
    data() {
      return {
        value: this.row[this.column.key] || false,
        trueValue: this.column.editor.trueValue || true,
        falseValue: this.column.editor.falseValue || false,
        openTag: this.column.editor.openTag || "开",
        closeTag: this.column.editor.closeTag || "关",
        disabled: this.column.editor.disabled || false
      }
    },
    methods: {
      doSave: function (status) {
        let newVal = status;
        let oldVal = this.row[this.column.key];
        let validate = this.column.editor.validate;
        if (validate) {
          let result = validate(newVal, oldVal, this.row, this.index);
          if (!result.valid) {
            this.$Message.error(result.msg);
          }
        }
        let param = {
          rowIndex: this.index,
          columnKey: this.column.key,
          value: status,
          callbackEvent: this.column.editor.callbackEvent
        }
        this.$emit("cell-on-change", param);
      }
    }
  }
</script>

<style>

</style>
