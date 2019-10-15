import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image,Button} from '@tarojs/components'
import {AtAvatar,AtList,AtButton,AtModal} from 'taro-ui'
import defaultAvatar from '@assets/default-avatar.png'
import Vip from './vip'
import bg from './assets/bg.png'
import qrCode from './assets/qr-code.png'
import level01 from './assets/level-01.png'
import './index.scss'
import {inject, observer} from "@tarojs/mobx";

@inject( 'counterStore')  //将方法注入到组件的porps中，通过this.props访问
@observer
export default class Profile extends Component {
  state = {
    oauthBtnStatus: true, // 授权按钮是否显示 默认为显示
    userinfo: {}, // 用户信息,
    btnText: '微信授权登录',
    isOpened:false,
    loginstate:false
  }
    getUserInfo = (userInfo) => {
        console.log('userinfo',userInfo)
        this.setState({
        userinfo:userInfo.detail.userInfo,
        nickName:userInfo.detail.userInfo.nickName,
        loginstate:true
      });
        Taro.cloud.callFunction({name: "login", data: {}})
            .then(res => {
              const openid=res.result.event.userInfo.openId
              this.setState({openid: openid});
              this.props.counterStore.updateid(openid);
              console.log("用户ID为",openid)})
      //调用云函数获取appid
        this.props.counterStore.updateuserinfo(userInfo.detail.userInfo,true)  //更新mobx的状态
        console.log(this.props.counterStore.userinfost.nickName)
        if(userInfo.detail.userInfo){   //同意
            Taro.setStorage({key:'userInfo',data:userInfo.detail.userInfo}).then(rst => {  //将用户信息存入缓存中
           console.log(rst.data)
              //Taro.navigateBack()
            })
        } else{ //拒绝,保持当前页面，直到同意
        }
    }

    logout = () => {
      this.setState({
          isOpened:true
        });
    }
    handleCancel = () => {
        this.setState({isOpened:false})
    }
    handleConfirm = () => {
        this.setState({isOpened:false,userinfo:{},loginstate:false,})
        const  clearinfo={}
        this.props.counterStore.updateuserinfo(clearinfo,false)
        Taro.removeStorageSync('userInfo')
    }


  render () {
    const { userinfo,loginstate,isOpened } = this.state
    const {counterStore: { menu, category,userinfost,loginstatest }} = this.props
    return (
      <View className='user-profile'>
        {/* // NOTE 背景图片：Image 标签 + position absolute 实现 */}
        <Image
          className='user-profile__bg'
          src={bg}
          mode='widthFix'
        />

        <View className='user-profile__wrap'>
          <View className='user-profile__avatar'>
            <Image
              className='user-profile__avatar-img'
              src={userinfost.avatarUrl || defaultAvatar}
            />
          </View>

          <View className='user-profile__info' >
            {loginstatest ?
              <View className='user-profile__info-wrap'>
                {/* XXX 没有全部 level 对应的图标，暂时都用 v1 */}
                <Image className='user-profile__info-level' src={level01} />
                <Text className='user-profile__info-uid'>
                  {userinfost.nickName}
                </Text>
              </View> :
              <View className='user-profile__info-name'>
              <Button  open-type='getUserInfo' onGetUserInfo={this.getUserInfo} >点此登录 </Button>
              </View>
            }
              {loginstatest &&
              <View className='user__logout-txt' onClick={this.logout}>退出</View>}
          </View>

          <View className='user-profile__extra'>
            <View className='user-profile__extra-qr'>
              <Image
                className='user-profile__extra-qr-img'
                src={qrCode}
              />
            </View>
          </View>

          <Vip />
          <View className='logout-model'>
            <AtModal
                isOpened={isOpened}
                title='确定退出？'
                cancelText='取消'
                confirmText='确认'
                onCancel={this.handleCancel}
                onConfirm={this.handleConfirm}
            />
          </View>
        </View>
      </View>
    )
  }
}
