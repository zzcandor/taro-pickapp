import { observable } from 'mobx'
import { axios } from 'taro-axios'

const counterStore = observable({
  counter: 0,
  category:[],
  menu:[],
  counterStore() {
    this.counter++
  },
  increment() {
    this.counter++
  },
  decrement() {
    this.counter--
  },
  incrementAsync() {
    setTimeout(() => {
      this.counter++
    }, 1000)
  },
  getcate(){
    return axios.get('https://miniapp.you.163.com//xhr/list/category.json')
      .then(res => {
           this.category=res.data.data.categoryList;
           const menu2=res.data.data.categoryList.map(({ id, name }) => ({ id, name }))
           this.menu=menu2
           console.log("访问api后返回")
           console.log(res.data.data.categoryList)
           console.log(this.menu)
           return  res.data.data.categoryList
         })
  }

})
export default counterStore
