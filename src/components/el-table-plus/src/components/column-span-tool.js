function computeColumnSpanParams(spanColumnKeys, tableData) {
  if (spanColumnKeys.length === 0) {
    return null;
  }
  let params = {}, sck = spanColumnKeys, dLen = tableData.length, kLen = sck.length;
  for (let i = 0; i < dLen; i++) {
    for (let j = 0; j < kLen; j++) {
      //如果单元格和右侧内容相同则合并
      let n = 1;
      while (j + n < kLen && tableData[i][sck[j]] === tableData[i][sck[j + n]]) {
        params[sck[j] + i] = params[sck[j] + i] || {rowspan: 1, colspan: 1};
        if ("disable" in params[sck[j] + i]) {
          break;
        }
        params[sck[j] + i].colspan = n + 1;
        params[sck[j + n] + i] = {disable: true};
        n++;
      }
      //如果单元格和下侧内容相同则合并
      let m = 1;
      while (i + m < dLen && tableData[i][sck[j]] === tableData[i + m][sck[j]] && tableData[i + m][sck[j]] !=='小计') {
        params[sck[j] + i] = params[sck[j] + i] || {rowspan: 1, colspan: 1};
        if ("disable" in params[sck[j] + i]) {
          break;
        }
        params[sck[j] + i].rowspan = m + 1;
        params[sck[j] + (i + m)] = {disable: true};
        m++;
      }
    }
  }
  return params;
}


function computeSpanMethod({row, column, rowIndex, columnIndex, params}) {
  if (!params) {
    return;
  }
  let param = params[column.property + rowIndex];
  if (param) {
    if (param.disable) {
      return {rowspan: 0, colspan: 0};
    } else {
      return {rowspan: param.rowspan, colspan: param.colspan}
    }
  }
}

export {computeColumnSpanParams, computeSpanMethod};
