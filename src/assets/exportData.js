
/*
* tHeader  @params 表头
* filterVal @params 表头对应的字段
* datalist @params 要导出的数据集合
* excelName @params 导出的excel的文件名
*/

function exportExcel(tHeader,filterVal,datalist,excelName) {
　require.ensure([], () => {
    const { export_json_to_excel } = require('../../exportlist/Export2Excel')
    const data = formatJson(filterVal, datalist)
    export_json_to_excel(tHeader, data, excelName)
  })
}
function formatJson(filterVal, jsonData) {
  return jsonData.map(v => filterVal.map(j => v[j]))
}
export default exportExcel