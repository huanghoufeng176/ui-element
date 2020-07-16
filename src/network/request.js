import axios from 'axios'

// axios.interceptors.request.use(config=>{
//   config.headers.Authorization=window.sessionStorage.getItem('token')
//   return config
// })

export function request(config){
  return new Promise((resolve,reject)=>{
    //1.创建axios的实例
    const instance=axios.create({
      baseURL:'http://timemeetyou.com:8889/api/private/v1/',
      timeout:5000
    })
    //2.axios的拦截器
    //2.1请求拦截的作用
    instance.interceptors.request.use(config => {
      config.headers.Authorization=window.sessionStorage.getItem('token')
      return config
    })
    
    instance(config).then(res=>{
      resolve(res)
    }).catch(err=>{
      reject(err)
    })
  })
}