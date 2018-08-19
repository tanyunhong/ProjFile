import axios from 'axios'
import {vm} from "@/main"
export default {
  /**
   * 请求后台的统一方法
   * @author TYH
   * @url 请求地址
   * @method 请求方式
   * @data 请求参数
   * @callBack 回调函数
   * @isPrompt 是否显示提示
   * @prompt 回调的内容
   */
  requestService({url, method, data, callBack, isPrompt = true, prompt}) {
    axios({url, method, data}).then(response => {
      if (response.data.code === 200){
        if (isPrompt){
          vm.$message.success(prompt ? prompt : response.data.message)
        }
        if (callBack){
          callBack(response.data.result)
        }
      } else{
        vm.$message.error(response.data.message)
      }
    }, reject => {
      console.log(reject)
    }).catch(e => {
      console.log(e)
    })
  }
}
