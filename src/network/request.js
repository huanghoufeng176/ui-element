import axios from 'axios'

export function request(config){
  return new Promise((resolve,reject)=>{
    const instance=axios.create({
      baseURL:'http://timemeetyou.com:8889/api/private/v1/',
      timeout:5000
    })
    instance(config).then(res=>{
      resolve(res)
    }).catch(err=>{
      reject(err)
    })
  })
}