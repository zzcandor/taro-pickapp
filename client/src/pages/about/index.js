import Taro, { Component } from '@tarojs/taro';
import { View, Input, Map, CoverView, ScrollView } from '@tarojs/components';
import QQMapWX from '../../assets/qqmap-wx-jssdk.min.js';
import imgUrl from '../../assets/location.png';
import './index.scss';


import {inject, observer} from "@tarojs/mobx";

@inject( 'cartstore','counterStore','addressstore')  //将方法注入到组件的porps中，通过this.props访问
@observer
export default class chooseaddress extends Component {
  constructor() {
    super(...arguments);
  }
    config = {
    navigationBarTitleText: '关于'
  }



  render() {
    return (
      <View  className="about">
        <View className="text">爱速达 </View>
        <View className="text">提供各种情趣用品</View>
        <View className="text">30分钟迅速送达</View>
        <View className="text">让爱不再等待。</View>
      </View>
    )
  }
}
