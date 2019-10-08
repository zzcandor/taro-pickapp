import Taro, { Component } from '@tarojs/taro'

import counterStore from './store/counter'

import Index from './pages/index'
import Listpage from './pages/listpage'

import { Provider } from '@tarojs/mobx'
import './app.css'
import {inject} from "@tarojs/mobx/types/index";

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }


//在app中引入store,可以引入多个store，使用时@inject( 'counterStore')指明store即可
const store = {
  counterStore
}

class App extends Component {
 //在路由修改首页，放在前面的就是首页，组件不要放在路由里
  config = {
    pages: [
      'pages/index'

    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    },
    cloud: true
  }

  componentDidMount () {
    if (process.env.TARO_ENV === 'weapp') {
      Taro.cloud.init()
    }
  }

  componentDidShow () {}

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
