import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import empty from './assets/empty.png'
import './index.scss'
import { AtIcon,AtButton } from 'taro-ui'

import {inject, observer} from "@tarojs/mobx";


@inject( 'cartstore','counterStore')  //将方法注入到组件的porps中，通过this.props访问
@observer
export default class Empty extends Component {

  switchtab(){
    Taro.switchTab({
      url: "../cate/cate",
})
  }

  render () {
    return (
      <View className='cart-empty'>
        <Image
          className='cart-empty__img'
          src={empty}
        />
        <Text className='cart-empty__txt'>
          {this.props.text || '快去享受乐趣吧'}
        </Text>
        <View className='cart-sync'>
          <View   className='cart-empty__icon' onClick={this.switchtab}>
           <AtButton className='cart-button' type='primary' size='small' circle={true}>去购物</AtButton>
          </View>
        </View>
      </View>
    )
  }
}
