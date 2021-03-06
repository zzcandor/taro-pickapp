import Taro, { Component } from '@tarojs/taro'

import {counterStore,cartstore,addressstore} from './store/counter'


import Index from './pages/index'
import Cate  from './pages/cate/cate'
import Listpage from './pages/listpage'
import '@tarojs/async-await'

import { Provider } from '@tarojs/mobx'
import './app.scss'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

//在app中引入store,可以引入多个store，使用时@inject( 'counterStore')指明store即可
const store = {
  counterStore:counterStore,
  cartstore:cartstore,
  addressstore:addressstore,

}




class App extends Component {
 //在路由修改首页，放在前面的就是首页，组件不要放在路由里

  globalData={
	payStatus:null,//支付状态
	orderNo:null//订单号
  }


  config = {
    navigateToMiniProgramAppIdList: [
    "wxd9634afb01b983c0"],
    pages: [
      'pages/cate/cate',
      'pages/cart/cart',
      'pages/index',
      'pages/user/user',
      'pages/order/index',
      'pages/addaddress/index',
      'pages/addresslist/index',
      "pages/about/index",
      "pages/map/index",
      "pages/remark/index",
      "pages/orderlist/index"


    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: '点单小程序',
      navigationBarTextStyle: 'black'
    },
    permission: {
      // 在 app.json 里面增加 permission 属性配置
      'scope.userLocation': {
        desc: '请授权以便使用定位信息',
      },
    },
     tabBar: {
      color: "#666",
      selectedColor: "#b4282d",
      backgroundColor: "#fafafa",
      borderStyle: 'black',
      list: [{
        pagePath: "pages/cate/cate",
        iconPath: "./assets/tab-bar/home.png",
        selectedIconPath: "./assets/tab-bar/home-active.png",
        text: "首页"
      }, {
        pagePath: "pages/cart/cart",
        iconPath: "./assets/tab-bar/cart.png",
        selectedIconPath: "./assets/tab-bar/cart-active.png",
        text: "购物车"
      }, {
        pagePath: "pages/user/user",
        iconPath: "./assets/tab-bar/user.png",
        selectedIconPath: "./assets/tab-bar/user-active.png",
        text: "个人"
      }]
    },
    cloud: true
  }

  componentDidMount () {
    if (process.env.TARO_ENV === 'weapp') {
      Taro.cloud.init()
    }
  }

  componentDidShow () {
    let extraData=this.$router.params.referrerInfo.extraData
    console.log("跳转小程序后带的值",this.$router.params.referrerInfo.extraData)
    console.log(extraData)

if(extraData){
  //不管成功失败 先把支付结果赋值
  this.globalData.payStatus=extraData.code===0?true:false;
  if(extraData.code!==0){
    wx.showToast({
      title: extraData.msg,//错误提示
      icon: 'none',
      duration: 3000
    });
      return

  }
  //支付成功
 this.globalData.orderNo=extraData.data.orderNo;
  console.log("全局变量为",this.globalData)
  counterStore.updateglobaldata(this.globalData)
}
  }

  componentDidHide () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>

      <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
