# 帮助框

用于快速生成对一系列条目的选择帮助框

## API

### 帮助框属性

<table>
<tr>
<th>属性名</th>
<th>描述</th>
<th>类型</th>
<th>默认值</th>
</tr>
<tr>
<td>value</td>
<td>是否显示帮助框，一般用v-model进行双向数据绑定</td>
<td>String</td>
<td>-</td>
</tr>
<tr>
<td>url</td>
<td>帮助框的取数url，接收参数有：offset、limit、sort、order、search,返回数据为List[Map...]形式</td>
<td>String</td>
<td>-</td>
</tr>
<tr>
<td>columns</td>
<td>帮助框里表格的列描述，详细见table组件的column属性文档</td>
<td>String</td>
<td>-</td>
</tr>
<tr>
<td>title</td>
<td>帮助框的标题</td>
<td>String</td>
<td>帮助框</td>
</tr>
<tr>
<td>multiSelect</td>
<td>是否多选</td>
<td>Boolean</td>
<td>false</td>
</tr>
</table>

### 事件属性

<table>
<tr>
<th>属性名</th>
<th>说明</th>
<th>返回值</th>
</tr>
<tr>
<td>onOk</td>
<td>选择确定时触发的事件</td>
<td>已选择的数据</td>
</tr>
<tr>
<td>onClear</td>
<td>选择清空时触发的事件</td>
<td>无</td>
</tr>
</table>
