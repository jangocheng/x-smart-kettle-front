<template>
    <div class="editing-status">
        <Select v-model="val" transfer :multiple="multiple" @on-change="doSave">
            <Option v-for="item in enums" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
    </div>
</template>

<script>
    export default {
        name: "select-editor",
        props: {
            row: Object,
            column: Object,
            index: Number
        },
        data() {
            return {
                val: this.row[this.column.key],
                enums: this.column.editor.enums,
                multiple: this.column.editor.multiple,
                callbackEvent: this.column.editor.callbackEvent
            }
        },
        computed: {
            label: function () {
                for (let item of this.enums) {
                    if (item.value === this.val) {
                        return item.label;
                    }
                }
            }
        },
        methods: {
            doSave: function () {
                let newVal = this.val;
                let oldVal =  this.row[this.column.key];
                let validate = this.column.editor.validate;

                if (validate) {
                    let result = validate(newVal, oldVal, this.row, this.index);
                    if (!result.valid) {
                        this.$Message.error(result.msg);
                        return;
                    }
                }
                var param = {
                    rowIndex: this.index,
                    columnKey: this.column.key,
                    value: newVal,
                    callbackEvent: this.column.editor.callbackEvent
                }
                if(this.multiple && this.arrSame(newVal,oldVal)){
                    //在多选情况下，初始化时会触发select的onchange事件，导致死循环，所以要判断一下如果新旧值一样就不继续调用单元格change事件
                }else {
                    this.$emit("cell-on-change", param);
                }
            },
            arrSame:function(arr,newArr){
                let bol = true;
                if (arr.length != newArr.length) {
                    return false;
                }
                for (let i = 0, n = arr.length;i < n; i++) {
                    if (arr[i] instanceof Array) {
                        bol = arrSame(arr[i],newArr[i])
                        if (!bol) {
                            break;
                        }
                    } else if (arr[i] instanceof Object) {
                        bol = objSame(arr[i],newArr[i])
                        if (!bol) {
                            break;
                        }
                    }else if (arr[i] != newArr[i]) {
                        bol = false;
                        break;
                    }
                }
                return bol;
            }
        }
    }
</script>

<style>

</style>

