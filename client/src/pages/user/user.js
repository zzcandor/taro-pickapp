import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { getWindowHeight } from '@utils/style'
import Profile from './profile'
import Menu from './menu'
import Activity from './activity'
import './user.scss'
import {inject, observer} from "@tarojs/mobx";

@inject( 'counterStore')  //将方法注入到组件的porps中，通过this.props访问
@observer
class User extends Component {
  state = {
    oauthBtnStatus: true, // 授权按钮是否显示 默认为显示
    btnText: '微信授权登录',
    isOpened:false,
    loginstate:false
  }

  config = {
    navigationBarTitleText: '个人中心'
  }

  componentDidShow() {
  }





  render () {

    return (
      <View className='user'>
        <ScrollView
          scrollY
          className='user__wrap'
          style={{ height: getWindowHeight() }}
        >
          <Profile  />
          <Menu />
          <View className='user__empty' />
        </ScrollView>
        <View className='user__activity'>
          <Activity />
        </View>
      </View>
    )
  }
}

export default User
