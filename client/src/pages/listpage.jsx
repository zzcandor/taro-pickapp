import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.css'
import { connect } from '@tarojs/redux'


import Login from '../components/login/index'

import { createStore } from 'stamen'



//const counter = useStore(S => S.count)



class Listpage extends Component {

  config = {
    navigationBarTitleText: '第二页'
  }

  componentWillMount () { }

  componentDidMount () {
    console.log(this.props.counter)
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='index'>
        <Text>taro+云开发+mobx</Text>
      </View>
    )
  }
}

export default  Listpage
