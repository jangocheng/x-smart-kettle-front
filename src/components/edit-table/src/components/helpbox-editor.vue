<template>
    <div class="read-status">
        <span>{{val}}</span>
        <div class="edit-btn">
            <Button type="text" icon="md-create" @click="doEdit"></Button>
        </div>
        <div v-if="editing">
            <XtlHelpBox v-model="editing" :url="helpBoxUrl" :columns="helpBoxColumns" :width="helpBoxWidth"
                            :title="helpBoxTitle" :muliSelect="muliSelect" :helpBoxSearchParams="helpBoxSearchParams" @onOk="doSave" @onClear="onClear">
            </XtlHelpBox>
        </div>
    </div>
</template>

<script>
    import XtlHelpBox from "../../../help-box/src/help-box";

    export default {
        name: "helpbox-editor",
        components: {
            XtlHelpBox
        },
        props: {
            row: Object,
            column: Object,
            index: Number
        },
        data() {
            return {
                editing: false
            }
        },
        computed: {
            val: function () {
                return this.row[this.column.key];
            },
            helpBoxUrl: function () {
                return this.column.editor.url;
            },
            helpBoxColumns: function () {
                return this.column.editor.columns;
            },
            callbackEvent: function () {
                return this.column.editor.callbackEvent;
            },
            helpBoxTitle: function () {
                return this.column.editor.title;
            },
            muliSelect: function () {
                return this.column.editor.muliSelect;
            },
            helpBoxWidth: function () {
                return this.column.editor.helpBoxWidth;
            },
            helpBoxSearchParams: function () {
                if (this.column.editor.setSearchParams) {
                    return this.column.editor.setSearchParams(this.row, this.column, this.index)
                } else {
                    return {}
                }
            }
        },
        methods: {
            doEdit: function () {
                this.editing = true;
            },
            doSave: function (result) {
                var param = {
                    rowIndex: this.index,
                    columnKey: this.column.key,
                    value: result,
                    callbackEvent: this.column.editor.callbackEvent
                }
                this.$emit("cell-on-change", param);
            },
            onClear: function () {
                var param = {
                    rowIndex: this.index,
                    columnKey: this.column.key,
                    value: null,
                    callbackEvent: this.column.editor.callbackEvent
                }
                this.$emit("cell-on-change", param);
            }
        }
    }
</script>

<style>

</style>

