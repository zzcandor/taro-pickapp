import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import empty from './assets/empty.png'
import './index.scss'
import { AtIcon } from 'taro-ui'

import {inject, observer} from "@tarojs/mobx";


@inject( 'cartstore','counterStore')  //将方法注入到组件的porps中，通过this.props访问
@observer
export default class Empty extends Component {

  synccart(){  //获取本地储存的订单
    Taro.getStorage({key:'cart'}).then(rst => {  //将用户信息存入缓存中
                    this.props.cartstore.syncart(rst.data)
                    console.log("本地数据为",rst.data)
                    }).catch(err=>{console.log(err)})

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
          <Text className='cart-empty__txt'>点此同步购物车</Text>
          <View  onClick={this.synccart}>
            <AtIcon value='download-cloud' size='40' />
          </View>
        </View>
      </View>
    )
  }
}
