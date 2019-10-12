import { observable } from 'mobx'
import { axios } from 'taro-axios'

const counterStore = observable({
  category:[], //注意这里是集合不要{}字典！
  menu:[],
  userinfost:{},
  loginstatest:false,
  updateuserinfo(newinfo,loginstate){
    this.userinfost=newinfo
    this.loginstatest=loginstate
  },
  getcate(){
    return axios.get('https://miniapp.you.163.com//xhr/list/category.json')
    //使用return返回promise方便在componentDidMount中调用
      .then(res => {
           this.category=res.data.data.categoryList;
           this.menu=res.data.data.categoryList.map(({ id, name }) => ({ id, name }))
        //使用map函数来对集合中的对象{}操作时可以采用解构写法！
           //const menu2=res.data.data.categoryList.map(({ id, name }) => ({ id, name }))
           //this.menu=menu2
           //console.log("访问api后返回")
           //console.log(res.data.data.categoryList)
           //console.log(this.menu)
           return  res.data.data.categoryList
         })
  }

})
export default counterStore
