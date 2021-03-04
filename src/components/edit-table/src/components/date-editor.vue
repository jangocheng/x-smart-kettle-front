<template>
    <div class="editing-status">
        <DatePicker
                :value="value"
                :type="type"
                :format="format"
                :placeholder="placeholder"
                :startDate="startDate"
                :confirm="confirm"
                :editable="editable"
                :options="options"

                @on-change="doSave"
                @on-ok="doSave"
                @on-clear="doSave"
        >
        </DatePicker>
    </div>
</template>

<script>
    export default {
        name: "date-editor",
        props: {
            row: Object,
            column: Object,
            index: Number
        },
        data() {
            return {
                value: this.row[this.column.key] || "",
                type: this.column.editor.type,
                format: this.column.editor.format || "yyyyMMdd",
                placeholder: this.column.editor.placeholder || "",
                startDate: this.column.editor.startDate ? this.column.editor.startDate : new Date(),
                confirm: this.column.editor.confirm || false,
                editable: this.column.editor.editable || false,
                options: this.column.editor.options || {}
            }
        },
        methods: {
            doSave: function (valueFormated, valueDate) {
                let newVal = valueFormated, oldVal = this.value;
                let validate = this.column.editor.validate;
                if (validate) {
                    let result = validate(newVal, oldVal, this.row, this.index);
                    if (!result.valid) {
                        this.$Message.error(result.msg);
                        return;
                    }
                }
                if (newVal !== oldVal) {
                    var param = {
                        rowIndex: this.index,
                        columnKey: this.column.key,
                        value: newVal,
                        callbackEvent: this.column.editor.callbackEvent
                    }
                    this.$emit("cell-on-change", param);
                }
            }
        }
    }
</script>

<style>

</style>

