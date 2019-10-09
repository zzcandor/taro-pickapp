import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.css'
import { observer, inject } from '@tarojs/mobx'
import Login from '../components/login/index'

@inject( 'counterStore')  //将方法注入到组件的porps中，通过this.props访问
@observer
class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='index'>
        <Login/>
      </View>
    )
  }
}


export default  Index
