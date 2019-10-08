import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.css'
import { observer, inject } from '@tarojs/mobx'

import Login from '../components/login/index'
import  Listpage from './listpage'

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

  //先把store中的方法
  increment = () => {
    const { counterStore } = this.props
    counterStore.increment()
  }

  decrement = () => {
    const { counterStore } = this.props
    counterStore.decrement()
  }

  incrementAsync = () => {
    const { counterStore } = this.props
    counterStore.incrementAsync()
  }

  render () {
    const { counterStore: { counter } } = this.props  //不要在return里面直接访问counterStore.counter
    return (
      <View className='index'>
        <Listpage />
         <View className='index'>
            <Button onClick={this.increment}>+</Button>
            <Button onClick={this.decrement}>-</Button>
            <Button onClick={this.incrementAsync}>Add Async</Button>
            <Text>{counter}</Text>
        </View>
        <Login/>
      </View>
    )
  }
}


export default  Index
