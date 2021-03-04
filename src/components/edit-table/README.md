# 可编辑表格

用于对结构化数据的编辑

## API

### 表格属性

<table>
<tr>
    <th>属性</th>
    <th>说明</th>
    <th>类型</th>
    <th>默认值</th>
</tr>
<tr>
    <td>v-model</td>
    <td>表格数据，List[Map]格式</td>
    <td>Array</td>
    <td>[]</td>
</tr>
<tr>
    <td>columns</td>
    <td>表格的列描述，具体见下文</td>
    <td>Array</td>
    <td>[]</td>
</tr>
<tr>
    <td>stripe</td>
    <td>是否显示间隔斑马纹</td>
    <td>Boolean</td>
    <td>true</td>
</tr>
<tr>
    <td>border</td>
    <td>是否显示纵向边框</td>
    <td>Boolean</td>
    <td>true</td>
</tr>
<tr>
    <td>show-header</td>
    <td>是否显示表头</td>
    <td>Boolean</td>
    <td>true</td>
</tr>
<tr>
    <td>width</td>
    <td>表格宽度，单位 px</td>
    <td>Number | String</td>
    <td>自动</td>
</tr>
<tr>
    <td>height</td>
    <td>表格高度，单位 px，设置后，如果表格内容大于此值，会固定表头</td>
    <td>Number | String</td>
    <td>-</td>
</tr>
<tr>
    <td>loading</td>
    <td>是否显示加载中</td>
    <td>Boolean</td>
    <td>false</td>
</tr>
<tr>
    <td>disabled-hover</td>
    <td>禁用鼠标悬停时的高亮</td>
    <td>Boolean</td>
    <td>false</td>
</tr>
<tr>
    <td>row-class-name</td>
    <td>行的 className 的回调方法，传入参数：row：当前行数据；index：当前行的索引</td>
    <td>Boolean</td>
    <td>false</td>
</tr>
<tr>
    <td>size</td>
    <td>表格尺寸，可选值为 large、small、default 或者不填</td>
    <td>String</td>
    <td>default</td>
</tr>
<tr>
    <td>highlightRow</td>
    <td>是否支持高亮选中的行，即单选</td>
    <td>Boolean</td>
    <td>false</td>
</tr>
<tr>
    <td>no-data-text</td>
    <td>数据为空时显示的提示内容</td>
    <td>String</td>
    <td>暂无数据</td>
</tr>
<tr>
    <td>no-filtered-data-text</td>
    <td>筛选数据为空时显示的提示内容</td>
    <td>String</td>
    <td>暂无筛选结果</td>
</tr>
<tr>
    <td>showTableOption</td>
    <td>是否显示右上表格操作按钮</td>
    <td>Boolean</td>
    <td>true</td>
</tr>
</table>

### 表格事件
<table>
    <tr>
        <th width="20%">属性名</th>
        <th>说明</th>
        <th width="50%">返回值</th>
    </tr>
    <tr>
        <td>on-row-click</td>
        <td>单击某一行时触发</td>
        <td>row:当前行的数据,index:当前行索引</td>
    </tr>
    <tr>
        <td>on-row-dblclick</td>
        <td>双击某一行时触发</td>
        <td>row:当前行的数据,index:当前行索引</td>
    </tr>
    <tr>
        <td>on-sort-change</td>
        <td>排序时有效，当点击排序时触发</td>
        <td>column：当前列数据;key：排序依据的指标;order：排序的顺序，值为 asc 或 desc</td>
    </tr>
    <tr>
        <td>on-select</td>
        <td>在多选模式下有效，选中某一项时触发</td>
        <td>selection：已选项数据;row：刚选择的项数据</td>
    </tr>
    <tr>
        <td>on-select-cancel</td>
        <td>在多选模式下有效，取消选中某一项时触发</td>
        <td>selection：已选项数据;row：取消选择的项数据</td>
    </tr>
    <tr>
        <td>on-select-all</td>
        <td>在多选模式下有效，点击全选时触发</td>
        <td>selection：已选项数据</td>
    </tr>
    <tr>
        <td>on-selection-change</td>
        <td>在多选模式下有效，只要选中项发生变化时就会触发</td>
        <td>selection：已选项数据</td>
    </tr>
</table>

### 表格插槽
<table>
    <tr>
        <th width="50%">名称</th>
        <th width="50%">说明</th>
    </tr>
    <tr>
        <td>header</td>
        <td>表头</td>
    </tr>
    <tr>
        <td>footer</td>
        <td>表尾</td>
    </tr>
    <tr>
        <td>loading</td>
        <td>加载中</td>
    </tr>
</table>

### 实例方法
<table>
    <tr>
        <th width="30%">方法名</th>
        <th width="40%">说明</th>
        <th width="30%">参数</th>
    </tr>
    <tr>
        <td>getTableData</td>
        <td>获取当前表格数据</td>
        <td>无</td>
    </tr>
</table>

### 列属性
列描述数据对象，是columns中的一项
<table>
 <tr>
    <th>属性</th>
    <th>说明</th>
    <th>类型</th>
    <th>默认值</th>
 </tr>
 <tr>
    <td>type</td>
    <td>列类型，可选值为 index:将此列渲染为索引列、selection：将此列渲染为选择列、expand:将此列渲染为可展开列、html:将此列数据解析成html输出</td>
    <td>String</td>
    <td>-</td>
</tr>
<tr>
    <td>title</td>
    <td>列头显示文字</td>
    <td>String</td>
    <td>#</td>
</tr>
<tr>
    <td>key</td>
    <td>对应列内容的字段名</td>
    <td>String</td>
    <td>-</td>
</tr>
<tr>
    <td>editor</td>
    <td>对应列的编辑器,目前支持三种类型的编辑器：text、select、helpbox，具体使用见下文</td>
    <td>String</td>
    <td>-</td>
</tr>
<tr>
        <td>width</td>
        <td>列宽</td>
        <td>Number</td>
        <td>-</td>
    </tr>
    <tr>
        <td>align</td>
        <td>对齐方式，可选值为 <code>left</code> 左对齐、<code>right</code> 右对齐和 <code>center</code> 居中对齐</td>
        <td>String</td>
        <td>left</td>
    </tr>
    <tr>
        <td>className</td>
        <td>列的样式名称</td>
        <td>String</td>
        <td>-</td>
    </tr>
    <tr>
        <td>fixed</td>
        <td>列是否固定在左侧或者右侧，可选值为 <code>left</code> 左侧和 <code>right</code> 右侧</td>
        <td>String</td>
        <td>-</td>
    </tr>
    <tr>
        <td>ellipsis</td>
        <td>开启后，文本将不换行，超出部分显示为省略号</td>
        <td>Boolean</td>
        <td>false</td>
    </tr>
    <tr>
        <td>render</td>
        <td>自定义渲染列，使用 Vue 的 Render 函数。传入两个参数，第一个是 h，第二个为对象，包含 row、column 和 index，分别指当前行数据，当前列数据，当前行索引，详见示例。
        [学习render函数](https://cn.vuejs.org/v2/guide/render-function.html)</td>
        <td>Function</td>
        <td>-</td>
    </tr>
    <tr>
        <td>renderHeader</td>
        <td>自定义列头显示内容，使用 Vue 的 Render 函数。传入两个参数，第一个是 h，第二个为对象，包含 <code>column</code> 和 <code>index</code>，分别为当前列数据和当前列索引。
        </td>
        <td>Function</td>
        <td>-</td>
    </tr>
    <tr>
        <td>sortable</td>
        <td>对应列是否可以排序，如果设置为 <code>custom</code>，则代表用户希望远程排序，需要监听 Table 的 on-sort-change 事件</td>
        <td>Boolean</td>
        <td>false</td>
    </tr>
    <tr>
        <td>sortMethod</td>
        <td>自定义排序使用的方法，接收三个参数 a 、 b 和 type，当设置 <code>sortable: true</code> 时有效。type 值为 asc 和 desc</td>
        <td>Function</td>
        <td>-</td>
    </tr>
    <tr>
        <td>sortType</td>
        <td>设置初始化排序。值为 asc 和 desc</td>
        <td>String</td>
        <td>-</td>
    </tr>
    <tr>
        <td>filters</td>
        <td>过滤数据的选项，格式为数组，数组中每项包含 <code>label</code> 和 <code>value</code> 属性，使用过滤，必须同时配置 filterMethod</td>
        <td>Array</td>
        <td>-</td>
    </tr>
    <tr>
        <td>filterMethod</td>
        <td>数据过滤使用的方法，如果是多选的筛选项，对每一条数据会执行多次，任意一次返回 true 就会显示</td>
        <td>Function</td>
        <td>-</td>
    </tr>
    <tr>
        <td>filterMultiple</td>
        <td>数据过滤的选项是否多选</td>
        <td>Boolean</td>
        <td>true</td>
    </tr>
    <tr>
        <td>filteredValue</td>
        <td>在初始化时使用过滤，数组，值为需要过滤的 value 集合</td>
        <td>Array</td>
        <td>-</td>
    </tr>
    <tr>
        <td>filterRemote</td>
        <td>使用远程过滤</td>
        <td>Function</td>
        <td>-</td>
    </tr>
</table>

### 编辑器

文本编辑器
```javascript
{
  type:"text",
  //校验函数,参数分别为：新值、旧值、行数据、行号
  validate:function(newVal,oldVal,row,index){
    if(newVal.trim() == ""){
      return{
        valid:false,
        msg:"输入不能为空！"
      }
    }
    return{valid:true}
  },
  //文本编辑器的回调事件一般不需要用，除非你有更改此单元格值以外的其他需求
  //选择框的回调方法，参数为selectData：用户选择数据,rowIndex：行索引,columnKey 列索引
  callbackEvent:"on-name-change"
}
```

下拉框编辑器
```javascript
{
  type:"select",
  enums:[{"value":"1","label":"男"},{"value":"0","label":"女"}],
  //下拉框编辑器的回调事件一般不需要用，除非你有更改此单元格值以外的其他需求
  //选择框的回调方法，参数为selectData：用户选择数据,rowIndex：行索引,columnKey 列索引
  callbackEvent:"on-sex-change"
}
```

选择框编辑器
```javascript
{
  type:"helpbox",
  //选择框的url
  url:"/helpbox/organ/list",
  //选择框的列描述，更详细的参数请参考表格列属性说明
  columns:[
    {
      title: '编号',
      key: 'organizationId',
      sortable: "custom"
    },
    {
      title: '组织名称',
      key: 'name'
    },
    {
      title: '组织描述',
      key: 'description'
    }
  ],
  //帮助框的标题
  title:"组织选择帮助框",
  //选择框的回调方法，参数为selectData：用户选择数据,rowIndex：行索引,columnKey 列索引，建议在此回调方法里自己写更新表格数据的逻辑
  callbackEvent:"on-organ-changed"
}
```
