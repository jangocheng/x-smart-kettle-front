let _ = require('lodash');
function setOrders(datas){
  for(let i=0;i<datas.length;i++){
    datas[i]._order = i;
  }
}
function getGroupResult(groupKeys, datas) {
  let groupResult = {};
  groupKeys.reduce(function (groupkeys, current) {
    groupkeys.push(current);
    let _groupResult = _.groupBy(datas, function (n) {
      let _key = "";
      for (let i = 0, len = groupkeys.length; i < len; i++) {
        _key += (i === len - 1) ? n[groupkeys[i]] : (n[groupkeys[i]] + '||');
      }
      return _key;
    });
    Object.assign(groupResult, _groupResult);
    return groupkeys
  }, []);
  return groupResult;
}
function computeSubSumLine(groupResult, groupKeys, labelColumns, getSummaries) {
  let sumLineArr = [];
  for (let _key in groupResult) {
    let datas = groupResult[_key];
    let lastLine = datas[datas.length - 1];
    let sumLine = {};
    let _keyLen = _key.split("||").length;
    for (let i = 0; i < groupKeys.length; i++) {
      let groupKey = groupKeys[i];
      if (i < _keyLen) {
        sumLine[groupKey] = lastLine[groupKey];
        sumLine._order = lastLine._order + i/20;
      } else {
        sumLine[groupKey] = '小计';
        sumLine._order = lastLine._order + i/10;
      }
    }

    for (let i = 0; i < labelColumns.length; i++) {
      sumLine[labelColumns[i]] = '小计';
    }
    sumLine._sumLine = true;
    let summary = getSummaries(datas);
    Object.assign(sumLine, summary);
    sumLineArr.push(sumLine);
  }
  return sumLineArr;
}

function computeTotalSumLine(datas, groupKeys, labelColumns, getSummaries) {
  let totalSumLine = {};
  for (let groupKey of groupKeys) {
    totalSumLine[groupKey] = "合计";
  }
  for (let i = 0; i < labelColumns.length; i++) {
    totalSumLine[labelColumns[i]] = '合计';
  }
  totalSumLine._order = 9999999;
  totalSumLine._sumLine = true;
  let summary = getSummaries(datas);
  Object.assign(totalSumLine, summary);
  return totalSumLine;
}

function computeSumLime(datas,groupKeys,labelColumns,summaryMethod){
  if(groupKeys){
    setOrders(datas);
    let groupResult = getGroupResult(groupKeys, datas);
    let sumLineArr = computeSubSumLine(groupResult, groupKeys, labelColumns, summaryMethod);
    let totalSumLine = computeTotalSumLine(datas, groupKeys, labelColumns, summaryMethod);
    sumLineArr.push(totalSumLine);
    let datasComputed = _.orderBy(_.concat(datas,sumLineArr), ['_order']);
    return datasComputed;
  }else{
    return datas;
  }
}

export {computeSumLime};




