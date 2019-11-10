import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { getWindowHeight } from '@utils/style'
import { Login } from '../../components/login'
import Profile from './profile'
import Menu from './menu'
import Activity from './activity'
import './user.scss'
import {inject, observer} from "@tarojs/mobx";
import message_img from '../../images/user/message.png';
import avatar_img from '../../images/user/avatar.png';
import coupon_img from '../../images/user/coupon.png';
import about_img from '../../images/user/about.png';
import address_img from '../../images/user/address.png';
import all_img from '../../images/user/all.png';
import { AtFab } from 'taro-ui'
import {
  MaterialIcons,
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome,
} from 'taro-icons';

@inject( 'counterStore')  //将方法注入到组件的porps中，通过this.props访问
@observer
class User extends Component {
  state = {
    oauthBtnStatus: true, // 授权按钮是否显示 默认为显示
    btnText: '微信授权登录',
    isOpened:false,
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




  config = {
    navigationBarTitleText: '个人中心'
  }

  componentDidMount() {
      Taro.getStorage({key:'loginstate'}).then(rst => {  //将用户信息存入缓存中
       this.setState({
         loginstate:rst.data
       })
           console.log(rst.data)}).catch(err=>{console.log(err)})
      Taro.getStorage({key:'userInfo'}).then(rst => {  //将用户信息存入缓存中
       this.setState({
         userinfo:rst.data
       })}).catch(err=>{console.log(err)})
  }




  /*render () {

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
  }*/  //网易严选类用户页面

  render() {
    const { userinfo,loginstate,isOpened,coupon_number,coupon_img } = this.state
    const {counterStore: { menu, category,userinfost,loginstatest }} = this.props
    return (
      <View className="user-page">
        <Login  hide={loginstate?true:loginstatest} />
        <View className="not-login">
          <View
            className="to-login"
          >
            <View className="left">
              <View className= "name" >
                {userinfost.nickName||userinfo.nickName|| '请登录 >'}
              </View>
              <View className="msg">
                <View  className="msg msgpic" >
                  <Image  mode="aspectFit" src={message_img} />
                </View>
                <View className="msg msgpic" >
                  <Image
                    mode="aspectFit"
                    src="http://static-r.msparis.com/uploads/9/a/9a00ce9a5953a6813a03ee3324cbad2a.png"
                  />
                </View>
              </View>
            </View>
            <View className="avatar-container">
              <Image className="avatar" src={userinfost.avatarUrl||userinfo.avatarUrl||avatar_img} />
            </View>
          </View>
        </View>
        <View className="login">
          <View
            className="item"
          >
            <View className="left">
              <Image className="icon-left" src={all_img} />
              <Text>我的订单</Text>
            </View>
            <View className="right">
              {coupon_number && <View className="num">{coupon_number}</View>}
              <View className="iconfont icon-more arrow" />
            </View>
          </View>

          <View
            className="item"  onClick={()=>{Taro.navigateTo({url: '/pages/addresslist/index'})}}
          >
            <View className="left" >
              <Image className="icon-left" src={address_img} />
              <Text>收货地址</Text>
            </View>
            <View className="right">
              {coupon_number && <View className="num">{coupon_number}</View>}
              <View className="iconfont icon-more arrow" />
            </View>
          </View>

          <View
            className="item"
          >
            <View className="left"   onClick={()=>{Taro.navigateTo({url: '/pages/about/index'})}}>
              <Image className="icon-left" src={about_img} />
              <Text>关于</Text>
            </View>
            <View className="right">
              <View className="iconfont icon-more arrow" />
            </View>
          </View>
          <Button open-type="contact" className="kefu" >
            <Text>客服</Text>
          </Button>



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
    );
  }



}

export default User

/*
          <Form onSubmit={this.submit} report-submit="true">
            <Button formType="submit">发送模板消息</Button>
         </Form> */  //发送模板消息
