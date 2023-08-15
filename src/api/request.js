import axios from "axios"
import config from "../config"
import { ElMessage } from 'element-plus'
const NETWORK_ERROR = '网络请求异常，请稍后再试......'
//创建一个axios实例对象
const service = axios.create({
    baseURL:config.baseApi
})
//请求之前做一些事
service.interceptors.request.use((req)=>{
    return req
})
//请求之后做一些事
service.interceptors.response.use((res)=>{
    console.log(res.data);
    const { code, data, msg} =res.data
    if(code ==200){
        return data
    }else{
        //网络请求错误
        ElMessage.error(msg || NETWORK_ERROR)
        return Promise.reject(msg || NETWORK_ERROR)
    }
})
// 封装的核心函数
function request(options){
    options.method = options.method || 'get' 
    if(options.method.toLowerCase()=="get"){
        options.params =options.data
    }
    let isMock = config.mock
    if(typeof options.mock !=='undefined'){
        isMock = options.mock
    }
    if (config.env == 'prod'){
        service.defaults.baseURL = config.baseApi
    }else{
        service.defaults.baseURL = isMock ? config.mockApi :config. baseApi
    }
    return service(options)
}
export default request