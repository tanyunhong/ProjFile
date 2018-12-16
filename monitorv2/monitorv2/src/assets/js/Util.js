import axios from 'axios'
import {_vm} from '@/main.js'
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
  transformDataType(data, fixNum = 1){ 
    let byte = data / 1024;
    if (byte > 1048579){
        return (byte / 1048579).toFixed(fixNum) + "G"
    } else {
        return (byte / 1024).toFixed(fixNum) + "M"
    }
  },
  transformDataTypeByKB(data,fixNum = 1){
    let byte = data / 1024;
    if (byte > 1024){
        return (byte / 1024).toFixed(fixNum) + "G"
    } else {
        return byte.toFixed(fixNum) + "M"
    }
  },
  transformDataTypeByM(data, fixNum = 1){
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
    if(data.children){        
        for(let item of data.children){
            childrenObj[item.id] = item;
        }
    }
    return Object.assign(data, {childrenObj,
        Memory: {data: useMem + ' / ' + men, proportion: menProportion},
        HeapMemory: {data: useheap + ' / ' + heap, proportion: heapProportion}
    })
  },
  /**获取基本信息*/
  getAppInfo(data){
    return [
        {name: '项目名称', value: data.projectName},
        {name: '项目路径', value: data.projectPath},
        {name: 'ip地址', value: data.ip},
        {name: '端口', value: data.port}
    ];
  },
  requestService({vm, url, method, callBack, data, failBack}) {
    if(!vm && !_vm){
        console.log("引用出错！")
        return;
    }
    if(!vm){
        vm = _vm
    }
    let u = this
    vm.$axios({method, url, data}).then(response => {
        if(response.status == 200){
            if(response.data.code && response.data.code != 0){
                if(response.data.message){
                    vm.$message.error(response.data.message);
                }
                if(failBack){
                    failBack(response.data);
                }
                if (response.data.code === -1) { //-1代表没登录
                    u.cancelAllInterval(vm);
                    vm.$router.push('/')
                }
                return;
            }
            if(callBack){
                callBack(response.data);
            }
        } else {
            vm.$message.error(response.data.message ? response.data.message : '操作失败！');
            if(failBack){
                failBack(response.data);
            }
        }
    }, reject => {
        console.log(reject)
        if(failBack){
            failBack();
        }
    }).catch(a => {
        console.log(a)
        if(failBack){
            failBack();
        }
    });
  },
  confirm({vm, tip, type = 'warning', callBack }){
    if(!vm && !_vm){
      console.log("引用出错！")
      return;
    }
    if(!vm){
        vm = _vm
    }
    vm.$confirm(tip, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type
    }).then(() => {
        if(callBack){
            callBack();
        }
    }).catch(() => {});
  },
  trim(str){
     return str.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');  
  },
  trimData({data, exclude = []}){
    for(let v in data){
      if(!exclude.includes(v)){
        if(typeof data[v] == "string"){
            data[v] = this.trim(data[v])
        } 
      }
    }
  },
  /**取消全部定时 */
  cancelAllInterval(vm){
    if(!vm){
        vm = _vm
    }
    let data = vm.$store.state.interval.data
    for(let name in data){
        this.cancelInterval({vm, name});
    }
  },
  /**开启定时 */
  setInterval({vm, name, time = 5000, callBack}){
    if(!vm){
        vm = _vm
    }
    //开启前先把旧定时器取消
    let oldCount = vm.$store.state.interval.data[name]
    clearInterval(oldCount
    )
    //开启新定时器
    let count = setInterval(function(){
      if(typeof callBack == "function"){
        callBack()
      }  
    }, time);
    vm.$store.commit("interval/setData", {name, count})
  },
  /**取消指定定时 */
  cancelInterval({vm, name, callBack}){
    if(!vm){
        vm = _vm
    }
    
    let count = vm.$store.state.interval.data[name]
    clearInterval(count)

    if(name){
        vm.$store.commit("interval/cancelData", name)
    }
    if(typeof callBack == "function"){
        callBack()
    }  
  },
  setUser({vm, user, remember}){
    if(!vm){
        vm = _vm
    }
    vm.$store.commit("user/setUser", {user, remember})
  },
  getUser(vm){
    if(!vm){
        vm = _vm
    }
    return Object.assign({}, vm.$store.state.user)
  },
  clearUser(vm){
    if(!vm){
        vm = _vm
    }
     vm.$store.commit('user/clearUser')
  },
  compileStr(code, slat, num = 2){
    let c = ''
    if(code){
        for(let index = 1; index <= num; index++){
            c = String.fromCharCode(code.charCodeAt(0)+code.length);  
            for(var i=1;i<code.length;i++){        
                c += String.fromCharCode(code.charCodeAt(i)+code.charCodeAt(i-1));  
            }     
            code = escape(c)
        }
    }
    return code;
  },
  uncompileStr(code, slat, num = 2){
    let c = ''
    if(code){
        for(let index = 1;index<= num; index++){
            code = unescape(code);        
            c = String.fromCharCode(code.charCodeAt(0)-code.length);        
            for(var i=1;i<code.length;i++){        
                c += String.fromCharCode(code.charCodeAt(i) -c.charCodeAt(i-1));        
            } 
            code = c     
        }
        if(slat && code.indexOf(slat) > -1){
            code = code.substring(code.indexOf(slat))
        }  
    }
    return code;
  },
  setStorageData({key, value, storage = window.localStorage}){
    storage.setItem(key, value)
  },
  getStorageData({key, storage = window.localStorage}){
    return storage.getItem(key)
  },
  removeItem({key, storage = window.localStorage}){
    storage.removeItem(key)
  }
}



// WEBPACK FOOTER //
// ./src/assets/js/Util.js