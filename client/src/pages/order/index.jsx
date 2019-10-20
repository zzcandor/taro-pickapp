import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtTextarea } from 'taro-ui'

import './index.css'


import {inject, observer} from "@tarojs/mobx";

@inject( 'cartstore','counterStore')  //将方法注入到组件的porps中，通过this.props访问
@observer
class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
  }

  state = {
    loaded: false,
  }


  componentWillMount () {
    const id2=this.props.cartstore.currentorderid
    console.log("id2",id2)
    Taro.cloud.callFunction({
        name: 'order',
        data: {
          func: 'getorder',
          data: {
            _id:id2
          }
        }
      }).then(res=>{this.setState({
              loaded:true,
              currentorder:res.result.data
        })})
        .catch(err => {
            console.log(err)
      })
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    const curod=this.state.currentorder
    return (
      <View>
      {this.state.loaded ?
       <View className='cart'>
         <View className='cart'>
        <p >成功生成订单！</p>
         </View>
         <View>
        <View className='cart'>
        <p >订单号：{curod._id}</p>
         </View>
        <View className='cart'>
        <p >订单日期：{curod.submitdate}</p>
         </View>
         <View className='cart'>
        <p >总数为：{curod.count}</p>
         </View>
         <View className='cart'>
        <p >总价为：{curod.price}</p>
         </View>
         <View className='cart'>
        <Text>支付状态：{curod.ispaid}</Text>
         </View>
          <View className='cart'>
        <Text>订单详情：{JSON.stringify(curod.orderdetail)}</Text>
          </View>
         </View>
       </View> : <View>生成订单中...</View>}
      </View>
    )
  }
}


export default  Index
