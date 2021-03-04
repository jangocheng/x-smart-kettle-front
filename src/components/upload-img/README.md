# 图片上传API文档

## 概述 

 图片上传组件，用于上传图片、展示图片、图片裁剪

## API
### 控件属性
<table>
    <tr>
        <th width="20%">属性</th>
        <th>说明</th>
        <th width="10%">类型</th>
        <th width="10%">默认值</th>
    </tr>
    <tr>
        <td>showOnly</td>
        <td>设置此属性则只展示图片，不能上传图片</td>
        <td>Boolean</td>
        <td>false</td>
    </tr>
    <tr>
        <td>defaultImg</td>
        <td>默认图片，值为图片服务器中图片的info_id</td>
        <td>String</td>
        <td>""</td>
    </tr>
    <tr>
        <td>cropperWidth</td>
        <td>幕布宽度</td>
        <td>Number</td>
        <td>240</td>
    </tr>
    <tr>
        <td>cropperHeight</td>
        <td>幕布高度</td>
        <td>Number</td>
        <td>240</td>
    </tr>
    <tr>
        <td>outputSize</td>
        <td>裁剪生成图片的质量</td>
        <td>Number</td>
        <td>1</td>
    </tr>
    <tr>
        <td>full</td>
        <td>是否输出原图比例的截图</td>
        <td>Boolean</td>
        <td>false</td>
    </tr>
    <tr>
        <td>outputType</td>
        <td>裁剪生成图片的格式</td>
        <td>String</td>
        <td>png</td>
    </tr>
    <tr>
        <td>canMove</td>
        <td>上传图片是否可以移动</td>
        <td>Boolean</td>
        <td>true</td>
    </tr>
    <tr>
        <td>original</td>
        <td>上传图片按照原始比例渲染</td>
        <td>Boolean</td>
        <td>false</td>
    </tr>
    <tr>
        <td>canMoveBox</td>
        <td>截图框能否拖动</td>
        <td>Boolean</td>
        <td>true</td>
    </tr>
    <tr>
        <td>autoCrop</td>
        <td>是否默认生成截图框</td>
        <td>Boolean</td>
        <td>true</td>
    </tr>
    <tr>
        <td>autoCropWidth</td>
        <td>默认生成截图框宽度</td>
        <td>Number</td>
        <td>180</td>
    </tr>
    <tr>
        <td>autoCropHeight</td>
        <td>默认生成截图框高度</td>
        <td>Number</td>
        <td>180</td>
    </tr>
    <tr>
        <td>fixedBox</td>
        <td>固定截图框大小 不允许改变</td>
        <td>Boolean</td>
        <td>true</td>
    </tr>
    <tr>
        <td>hasZoomSize</td>
        <td>是否生成其他尺寸的图片，以剪裁后的为基准</td>
        <td>Boolean</td>
        <td>false</td>
    </tr>
    <tr>
        <td>zoomSize</td>
        <td>其他生成图片的尺寸，形式：100-100,50-50</td>
        <td>String</td>
        <td>""</td>
    </tr>
    <tr>
        <td>otherParam</td>
        <td>其他需要传递的参数</td>
        <td>String</td>
        <td>""</td>
    </tr>
</table>

### 控件事件

<table>
    <tr>
        <th width="20%">属性名</th>
        <th>说明</th>
        <th width="50%">返回值</th>
    </tr>
    <tr>
        <td>upload-result</td>
        <td>上传完成触发</td>
        <td>文件信息：<br/>
            {<br />
              &nbsp;&nbsp;&nbsp;&nbsp;"originalName":"",<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;"originalFileId":"",<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;"size":,<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;"50-50":"",<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;"100-100":"",<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;"md5":"",<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;"otherParam":""<br/>
            }
            </td>
    </tr>
</table>
