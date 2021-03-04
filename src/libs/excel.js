/* eslint-disable */
import XLSX from 'xlsx';
import XLSXStyle from 'xlsx-style'
import {deepCopy} from "./assist";

const titleRules = {
  '': '',
  '#': '#',
  '序号': '序号',
  '编号': '编号',
  '操作': '操作',
}
const typeRules = {
  'index': 'index',
  'select': 'select',
  'selection': 'selection',
  'single-selection': 'single-selection'
}

function auto_width(ws, data) {
  /*set worksheet max width per col*/
  const colWidth = data.map(row => row.map(val => {
    /*if null/undefined*/
    if (val == null) {
      return {'wch': 10};
    }
    /*if chinese*/
    else if (val.toString().charCodeAt(0) > 255) {
      return {'wch': val.toString().length * 2};
    } else {
      return {'wch': val.toString().length > 7 ? val.toString().length : 7};
    }
  }))
  /*start in the first row*/
  let result = colWidth[0];
  for (let i = 1; i < colWidth.length; i++) {
    for (let j = 0; j < colWidth[i].length; j++) {
      if (result[j]['wch'] < colWidth[i][j]['wch']) {
        result[j]['wch'] = colWidth[i][j]['wch'] > 7 ? colWidth[i][j]['wch'] : 7;
      }
    }
  }
  ws['!cols'] = result;
}

function merge_title(ws, title) {
  let mergeData = []
  let flag = false
  let row = 1, col = 1
  for (let i = 0; i < title.length; i++) {
    for (let j = 0; j < title[i].length; j++) {
      flag = false, row = 1, col = 1
      let merge = {s: {r: i, c: j}, e: {r: i, c: j}}
      while ((j + row) < title[i].length && title[i][j] === title[i][j + row]) {
        merge.e.c = j + row
        row++
        flag = true
      }
      while ((i + col) < title.length && title[i][j] === title[i + col][j]) {
        merge.e.r = i + col
        col++
        flag = true
      }
      if (flag) {
        mergeData.push(merge)
      }
    }
  }
  ws['!merges'] = ws['!merges'].concat(mergeData)
}

function merge_content(ws, tableData, spanColumnKeys, titleLen) {
  if (spanColumnKeys == null || spanColumnKeys.length === 0) {
    return null;
  }
  let flag = false
  let mergeData = []
  let sck = spanColumnKeys, dLen = tableData.length, kLen = sck.length, params = [];
  for (let i = 0; i < dLen; i++) {
    params[i] = []
    for (let j = 0; j < kLen; j++) {
      params[i][j] = {}
    }
  }
  for (let i = 0; i < dLen; i++) {
    for (let j = 0; j < kLen; j++) {
      let merge = {s: {r: i + titleLen, c: j}, e: {r: i + titleLen, c: j}}
      flag = false
      //如果单元格和右侧内容相同则合并
      let n = 1;
      while (j + n < kLen && tableData[i][sck[j]] === tableData[i][sck[j + n]]) {
        if (params[i][j + n].hasOwnProperty('disable')) {
          break
        }
        params[i][j + n].disable = true
        merge.e.c = j + n
        flag = true
        n++;
      }
      //如果单元格和下侧内容相同则合并
      let m = 1;
      while (i + m < dLen && tableData[i][sck[j]] === tableData[i + m][sck[j]] && tableData[i + m][sck[j]] !== '小计') {
        if (params[i + m][j].hasOwnProperty('disable')) {
          break
        }
        params[i + m][j].disable = true
        merge.e.r = i + titleLen + m
        flag = true
        m++;
      }
      if (flag) {
        mergeData.push(merge)
        params[i][j].disable = true
      }
    }
  }
  ws['!merges'] = ws['!merges'].concat(mergeData)
}

function add_style(ws, title) {

  // 补充空白数据
  let rangs = ws['!ref'].split(":");
  let rowSum = parseInt(rangs[1].replace(/[^0-9]/ig, ""))
  let colhash = []
  Object.keys(ws).forEach(item => {
    if (/^[A-Z]+\d+$/.test(item)) {
      var alphabet = item.replace(/[^a-z]+/ig, "");
      if (colhash.indexOf(alphabet) == -1) {
        colhash.push(alphabet)
        for (var i = 1; i <= rowSum; i++) {
          if(!ws.hasOwnProperty(alphabet + i)){
            ws[alphabet + i] = {
              v: '',
              t: 's'
            }
          }
        }
      }
    }
  })

  let titlestyle = {
    border: {
      left: {style: 'thin', color: {rgb: "000000"}},
      top: {style: 'thin', color: {rgb: "000000"}},
      right: {style: 'thin', color: {rgb: "000000"}},
      bottom: {style: 'thin', color: {rgb: "000000"}},
    },
    alignment: {horizontal: "center", vertical: "center"},
    fill: {bgColor: {indexed: 64}, fgColor: {rgb: "5A9BD5"}}
  }
  let bodyPairStyle = {
    border: {
      left: {style: 'thin', color: {rgb: "000000"}},
      top: {style: 'thin', color: {rgb: "000000"}},
      right: {style: 'thin', color: {rgb: "000000"}},
      bottom: {style: 'thin', color: {rgb: "000000"}},
    },
    alignment: {vertical: "center"},
    fill: {bgColor: {indexed: 64}, fgColor: {rgb: "DDEBF7"}}
  }
  let bodyStyle = {
    border: {
      left: {style: 'thin', color: {rgb: "000000"}},
      top: {style: 'thin', color: {rgb: "000000"}},
      right: {style: 'thin', color: {rgb: "000000"}},
      bottom: {style: 'thin', color: {rgb: "000000"}},
    },
    alignment: {vertical: "center"}
  }
  Object.keys(ws).forEach(item => {

    /**
     * 加载表头样式：蓝色背景，水平垂直居中，边框
     */
    var reg = new RegExp("^[A-Z]+[1 -" + title.length + "]$", "gim");
    if (reg.test(item)) {
      ws[item].s = titlestyle
    } else

      /**
       * 表体样式： 垂直居中，边框
       */
    if (/^[A-Z]+\d+$/.test(item)) {
      if (parseInt(item.replace(/[^0-9]/ig, "")) % 2 == 0) {
        ws[item].s = bodyStyle
      } else {
        ws[item].s = bodyPairStyle
      }

    }
  })
  /* ws.B2 = {
       v:'',
       t:'s',
       s:bodyPairStyle
   }*/

}

function title_filter(data) {
  let filterData = deepCopy(data);
  for (var i = 0; i < filterData.length; i++) {
    if ((filterData[i].hasOwnProperty('type') && filterData[i].type == typeRules[filterData[i].type]) ||
      // !filterData[i].hasOwnProperty('title') ||
      filterData[i].title == titleRules[filterData[i].title]) {
      filterData.splice(i, 1)
      i--
    }
  }
  return filterData
}

function title_el_filter(data) {
  let filterData = deepCopy(data);

  for (var i = 0; i < filterData.length; i++) {
    if ((filterData[i].hasOwnProperty('property') && filterData[i].property == typeRules[filterData[i].property]) ||
      // !filterData[i].hasOwnProperty('title') ||
      filterData[i].label == titleRules[filterData[i].label]) {
      filterData.splice(i, 1)
      i--
    }
  }
  return filterData
}

function json_to_array(key, jsonData) {
  return jsonData.map(v => key.map(j => {
    return v[j]
  }));
}

// fix data,return string
function fixdata(data) {
  let o = ''
  let l = 0
  const w = 10240
  for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)))
  o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)))
  return o
}

// get head from excel file,return array
function get_header_row(sheet) {
  const headers = []
  const range = XLSX.utils.decode_range(sheet['!ref'])
  let C
  const R = range.s.r
  /* start in the first row */
  for (C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
    var cell = sheet[XLSX.utils.encode_cell({c: C, r: R})]
    /* find the cell in the first row */
    var hdr = 'UNKNOWN ' + C // <-- replace with your desired default
    if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
    headers.push(hdr)
  }
  return headers
}

export const title_transform = (paramData) => {
  let result = []
  let data1 = []
  let data2 = []
  let flag = false
  let data = title_filter(paramData)
  // let data =  paramData
  for (var i = 0; i < data.length; i++) {
    data1.push(data[i].title)
    data2.push(data[i].title)
    if ('children' in data[i]) {
      flag = true
      data2.pop()
      let children = data[i].children
      for (var j = 0; j < children.length; j++) {
        data1.push(data[i].title)
        data2.push(children[j].title)
      }
      data1.pop()
    }
  }
  result.push(data1)
  if (flag) {
    result.push(data2)
  }
  return result
}


export const title_el_transform = (paramData) => {
  let result = []
  let data1 = []
  let data2 = []
  let flag = false
  let data = title_el_filter(paramData)
  // let data =  paramData
  for (var i = 0; i < data.length; i++) {
    data1.push(data[i].label)
    data2.push(data[i].label)
    if ('children' in data[i]) {
      flag = true
      data2.pop()
      let children = data[i].children
      for (var j = 0; j < children.length; j++) {
        data1.push(data[i].label)
        data2.push(children[j].label)
      }
      data1.pop()
    }
  }
  result.push(data1)
  if (flag) {
    result.push(data2)
  }
  return result
}

export const key_transform = (paramData) => {
  let result = []
  let data = title_filter(paramData)
  // let data = paramData
  for (var i = 0; i < data.length; i++) {
    if ("children" in data[i]) {
      let children = data[i].children
      for (var j = 0; j < children.length; j++) {
        result.push(children[j].key)
      }
    } else {
      result.push(data[i].key)
    }
  }
  return result
}

export const key_el_transform = (paramData) => {
  let result = []
  let data = title_el_filter(paramData)
  // let data = paramData
  for (var i = 0; i < data.length; i++) {
    if ("children" in data[i]) {
      let children = data[i].children
      for (var j = 0; j < children.length; j++) {
        result.push(children[j].property)
      }
    } else {
      result.push(data[i].property)
    }
  }
  return result
}

export const export_table_to_excel = (id, filename) => {
  const table = document.getElementById(id);
  const wb = XLSX.utils.table_to_book(table);
  XLSX.writeFile(wb, filename + ".xlsx");

  /* the second way */
  // const table = document.getElementById(id);
  // const wb = XLSX.utils.book_new();
  // const ws = XLSX.utils.table_to_sheet(table);
  // XLSX.utils.book_append_sheet(wb, ws, filename);
  // XLSX.writeFile(wb, filename);
}

export const export_json_to_excel = ({data, key, title, filename, spanColumns, autoWidth, format}) => {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data, {header: key, skipHeader: false});
  for (var i = title.length; i > 0; i--) {
    data.unshift(title[i - 1])
  }
  if (autoWidth) {
    const arr = json_to_array(key, data);
    auto_width(ws, arr);
  }
  merge_content(ws, data, spanColumns)
  XLSX.utils.book_append_sheet(wb, ws, filename);
  XLSX.writeFile(wb, filename + '.' + format);
}

export const export_array_to_excel = ({key, data, title, filename, spanColumns, autoWidth, format}) => {
  const wb = XLSX.utils.book_new();
  const arr = json_to_array(key, data);
  for (var i = title.length; i > 0; i--) {
    arr.unshift(title[i - 1])
  }
  const ws = XLSX.utils.aoa_to_sheet(arr);
  if (autoWidth) {
    auto_width(ws, arr);
  }
  // 合并表头
  if (!ws['!merges']) ws['!merges'] = [];
  if (title.length > 1) {
    merge_title(ws, title)
  }
  merge_content(ws, data, spanColumns, title.length)
  add_style(ws, title)
  XLSX.utils.book_append_sheet(wb, ws, filename);
  // XLSXStyle.writeFile(wb, filename + '.' + format);
  let tmpDown = new Blob([s2ab(XLSXStyle.write(wb,
    {bookType: 'xlsx', bookSST: false, type: 'binary'}//这里的数据是用来定义导出的格式类型
  ))], {
    type: ""
  });
  saveAs(tmpDown, filename + '.' + "xlsx");
}

function s2ab(s) {
  if (typeof ArrayBuffer !== 'undefined') {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  } else {
    var buf = new Array(s.length);
    for (var i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }
}

function saveAs(obj, fileName) {
  var tmpa = document.createElement("a");
  tmpa.download = fileName || "下载";
  tmpa.href = URL.createObjectURL(obj);
  tmpa.click();
  setTimeout(function () {
    URL.revokeObjectURL(obj);
  }, 100);
}

export const read = (data, type) => {
  /* if type == 'base64' must fix data first */
  // const fixedData = fixdata(data)
  // const workbook = XLSX.read(btoa(fixedData), { type: 'base64' })
  const workbook = XLSX.read(data, {type: type});
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const header = get_header_row(worksheet);
  const results = XLSX.utils.sheet_to_json(worksheet);
  return {header, results};
}

export default {
  export_table_to_excel,
  export_array_to_excel,
  export_json_to_excel,
  key_transform,
  key_el_transform,
  title_transform,
  title_el_transform,
  read
}
