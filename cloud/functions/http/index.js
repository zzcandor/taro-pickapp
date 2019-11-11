// 云函数入口文件
const cloud = require('wx-server-sdk')

const axios= require('axios'); //引用 got

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  const { url } = event
    let response =[]
  //let getResponse = await got('httpbin.org/get') //get请求 用httpbin.org这个网址做测试
  //return getResponse.body
   await axios.get(url).then(res=>{response=res.data})
   return response
}