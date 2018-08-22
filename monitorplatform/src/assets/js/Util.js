import axios from 'axios'
export default {
  //没有颜色的格式化
  formatJson(msg) { 
    var rep = "~";
    var jsonStr = JSON.stringify(msg, null, rep)
    var str = "";
    for (var i = 0; i < jsonStr.length; i++) {
        var text2 = jsonStr.charAt(i)
        if (i > 1) {
            var text = jsonStr.charAt(i - 1)
            if (rep != text && rep == text2) {
                str += "<br/>"
            }
        }
        str += text2;
    }
    jsonStr = "";
    for (var i = 0; i < str.length; i++) {
        var text = str.charAt(i);
        if (rep == text)
            jsonStr += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
        else {
            jsonStr += text;
        }
        if (i == str.length - 2)
            jsonStr += "<br/>"
    }
    return jsonStr;
  },

  //带颜色的格式显示
  syntaxHighlight(json) { 
    if (typeof json != 'string') {
        json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
        function(match) {
            var cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        }
    );
  },
  /**
   * 根据服务名称以及请求url获取监控数据
   */
  getServerMonitorData(serverName, callBack, failBack){
    axios({
        method: 'get',
        url: '/' + serverName + "/health" 
    }).then(
        healthResponse => {
        //console.log(healthResponse)
        if(healthResponse.status == 200){
            axios({
                method: 'get',
                url: '/' + serverName + "/metrics/mem.*%7Cheap.*" 
            }).then(menResponse => {
                //console.log(menResponse)
                callBack(serverName, healthResponse.data, menResponse.data);
            },reject =>{
                failBack(serverName)
            }).catch(a => {console.log(a)})
        } else {
            failBack(serverName)
        }
        }, reject =>{
        failBack(serverName)
        }
    ).catch(a => {console.log(a)})
  },
  /**处理字节与MG之间的转换 */
  transformDataType(data, fixNum = 2){ // 0 是 字节单位 1 是 千字节单位
    let byte = data / 1024;
    if (byte > 1048579){
        return (byte / 1048579).toFixed(fixNum) + "G"
    } else {
        return (byte / 1024).toFixed(fixNum) + "M"
    }
  },
  transformDataTypeByKB(data,fixNum = 2){
    let byte = data / 1024;
    if (byte > 1024){
        return (byte / 1024).toFixed(fixNum) + "G"
    } else {
        return byte.toFixed(fixNum) + "M"
    }
  },
  transformDataTypeByM(data, fixNum = 2){
    if (data > 1024){
        return (data / 1024).toFixed(fixNum) + "G"
    } else {
        return data.toFixed(fixNum) + "M"
    }
  },
  /**处理两个数值比较百分比 */
  dealProportion(numerator, denominator){
    return parseFloat((numerator * 100 / denominator).toFixed(1));
  },
  /**处理内存数据数据 */
  dealData(data){
    let men = "0", useMem = "0", menProportion = 0;
    let heap = "0", useheap = "0", heapProportion = 0;
    if (data.jsonData && data.jsonData != "{}"){
        let jsonData = eval('(' + data.jsonData + ')')
        men = this.transformDataTypeByKB(jsonData.mem); //总内存
        let useMenNum = jsonData.mem - jsonData['mem.free']; //已用内存
        useMem = this.transformDataTypeByKB(useMenNum);
        menProportion = this.dealProportion(useMenNum, jsonData.mem); //内存使用百分比

        heap = this.transformDataTypeByKB(jsonData['heap.committed']);
        useheap = this.transformDataTypeByKB(jsonData['heap.used']);
        heapProportion = this.dealProportion(jsonData['heap.used'], jsonData['heap.committed']); //内存使用百分比
    }
    let childrenObj  = {}
    for(let item of data.children){
        childrenObj[item.id] = item;
    }
    return Object.assign(data, {childrenObj,
        Memory: {data: useMem + ' / ' + men, proportion: menProportion},
        HeapMemory: {data: useheap + ' / ' + heap, proportion: heapProportion}
    })
  },
    /**获取基本信息
     */
    getAppInfo(data){
      return [
        {name: '项目路径', value: data.projectPath},
        {name: '项目名称', value: data.projectName},
        {name: '访问域名', value: data.hostName},
        {name: '服务端口', value: data.port}
        ];
    }
}
