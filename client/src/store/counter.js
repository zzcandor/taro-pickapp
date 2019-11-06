import { observable } from 'mobx'
import { axios } from 'taro-axios'

const counterStore = observable({
  category:[], //注意这里是集合不要{}字典！
  menu:[],
  userinfost:{},
  openid:"",
  loginstatest:'',
  localtost(localinfo){
    this.userinfost=localinfo
    if (localinfo){
      this.loginstatest=true
    }
    console.log('本地存储的用户信息为',this.userinfost)
  },
  updateuserinfo(newinfo,loginstate){
    this.userinfost=newinfo
    this.loginstatest=loginstate
  },
  updateid(id){
    this.openid=id
  },
  getcate(){
    return axios.get('https://gitee.com/blackjack0v0/ShuJuKu/raw/master/allgoods.json')
    //使用return返回promise方便在componentDidMount中调用
      .then(res => {
           this.category=res.data;
           const newmenu=res.data.map(item=>item.catename)
           this.menu=newmenu
           console.log(newmenu)
        //使用map函数来对集合中的对象{}操作时可以采用解构写法！
           //const menu2=res.data.data.categoryList.map(({ id, name }) => ({ id, name }))
           //this.menu=menu2
           //console.log("访问api后返回")
           //console.log(res.data.data.categoryList)
           //console.log(this.menu)
           return  res.data
         })
  }

})

const cartstore = observable({
  currentorderid:'',
  currentorder:{},
  allcheckstate: true,
  totalcount: 0,
  totalprice: 0,
  checkedlist: [],
  cart:[],
  cartid:[],
  defaultcart: [
    {
      id: '6666+',
      prefix: '前缀',
      itemName: '蛋炒饭',
      pic: 'http://img.canyin.com/2019/02/16919C53044.png', //https://s1.st.meishij.net/r/24/193/12798274/s12798274_152739747270250.jpg
      checked: false,
      specList: [''],
      actualPrice: 15.0,
      cnt: 1
    },
    {
      id: '7777+',
      prefix: '前缀',
      itemName: '香菇滑鸡',
      pic: 'https://s1.st.meishij.net/r/24/193/12798274/s12798274_152739747270250.jpg',
      checked: true,
      specList: [''],
      actualPrice: 18.5,
      cnt: 2
    },
  ],  //测试购物车的内容，显示购物车结构

  syncart(cart){
    this.cart=cart
    this.sumcount()
    this.sumprice()
  },

  addtocart(goodsinfo){
    const newcartlist=[]
    const newcartid=[]
    if (this.cartid.indexOf(goodsinfo.id)>-1){           //判断购物车书否存在该商品，存在则不加入
      console.log("已存在该商品")
    }
    else{
      newcartid.push(goodsinfo.id)
      this.cartid=[...this.cartid,...newcartid];
      console.log("id内容为",this.cartid)
      newcartlist.push(goodsinfo)
    }
    //不在购物车内才加入
    this.cart.map((item) => {
      if (goodsinfo.id === item.id) {
        const newitem = {...item, cnt: item.cnt+1}  //判断是否购物车内已有，已有则+1
        newcartlist.push(newitem)
        console.log('更新购物车内商品状态为', newitem)
      }
      else {
        newcartlist.push(item)
        //console.log("添加的其他商品为",item)//把没改动的原来购物车的内容加进去
      }
    });
    this.cart=newcartlist
    //console.log("最新cart内容为",this.cart)
    this.sumcount()
    this.sumprice()
  },
  removefromcart(id){
    const newcartid=[]
    console.log("删除前列表为",this.cart)
    this.cartid.map((item)=> {  //删除id索引
        if(item === id) {
            console.log("跳过")
        }
        else{
          newcartid.push(item)
        }})
    this.cartid=newcartid;
    console.log("cartid索引列表为",this.cartid)


    const newcart=[]
    this.cart.map((item)=> {
        if(item.id === id) {
            console.log("跳过")
        }
        else{
          newcart.push(item)
        }

});
    this.cart=newcart
    console.log("删除后列表为!!!!!",this.cart)
    this.sumcount()
    this.sumprice()
    return newcart
  },


  updatecount(sid, scnt) {
    console.log("触发mobx更新函数")
    const newcartlist = [];
    this.cart.map((item) => {
      if (sid === item.id) {
        const newitem = {...item, cnt: scnt}  //新变量注意使用const以免出现undefined
        newcartlist.push(newitem)
        console.log('更新购物车内商品状态为', newitem)
      }
      else {
        newcartlist.push(item)
      }
    })
    this.cart = newcartlist
    this.sumcount()
    this.sumprice()
  },

  updatecheck(sid, checkstate) {
    const newcartlist = [];
    this.cart.map((item) => {
      if (sid === item.id) {
        const newitem = {...item, checked: !checkstate}
        newcartlist.push(newitem)
        console.log('更新购物车内商品状态为', newitem)
      }
      else {
        newcartlist.push(item)
      }
    })
    this.cart = newcartlist
    this.sumcount()
    this.sumprice()
  },

  checkall(allcheckstate) {
    const newcartlist = [];
    this.cart.map((item) => {
      const newitem = {...item, checked: !allcheckstate}
      newcartlist.push(newitem)
      console.log('更新购物车内商品状态为', newitem)
    })
    this.cart = newcartlist
    this.sumcount()
    this.sumprice()
    this.allcheckstate = !allcheckstate
  },

  sumcount() {
    let totalcount = 0
    this.cart.forEach((item) => {
      if (item.checked === true) {
        totalcount = totalcount + item.cnt
      }
    })
    this.totalcount = totalcount
  },
  sumprice() {
    let totalprice = 0
    this.cart.forEach((item) => {
      if (item.checked === true) {
        totalprice = totalprice + item.actualPrice * item.cnt
      }
    })
    this.totalprice = totalprice
  },
  gencheckedlist() {
    const newcartlist = [];
    this.cart.map((item) => {
      if (item.checked === true) {
        newcartlist.push(item)
        console.log('已经勾选的商品为', item)
      }
    });
    this.checkedlist = newcartlist
    const orderdict={
      checkedlist:newcartlist,
      totalprice:this.totalprice,
      totalcount:this.totalcount,
    }
    return orderdict
  },

  updatecurrentorder(res){
    this.currentorder=res
    this.currentorderid=res._id
    return res
  }

})


const addressstore = observable({
  address: '', //注意这里是集合不要{}字典！
  showmap:false,
  updateaddress(address) {
    this.address=address
  },
  updateshow(e){
  this.showmap=e
  }
})



export {counterStore,cartstore,addressstore}
