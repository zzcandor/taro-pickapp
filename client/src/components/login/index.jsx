/*  getLogin = () => {
    Taro.cloud
      .callFunction({
        name: "login",
        data: {}
      })
      .then(res => {
        this.setState({
          userid: res.result.event.userInfo.openId
        });
        console.log(res.result.event.userInfo.openId)
      })
  }
*/


// 叮咚提醒首页登录组件，发起用户授权
import Taro, { Component } from "@tarojs/taro"
import { View, Button, Image } from "@tarojs/components"
import {AtAvatar,AtList,AtButton,AtModal} from 'taro-ui'

import './index.scss'
import  loginFile from '../../assets/default.jpg'
import {inject, observer} from "@tarojs/mobx";

@inject( 'counterStore')  //将方法注入到组件的porps中，通过this.props访问
@observer
export default class Login extends Component {
  state = {
    oauthBtnStatus: true, // 授权按钮是否显示 默认为显示
    userInfo: null, // 用户信息
    btnText: '微信授权登录',
    isOpened:false
  }
  componentWillMount() {
  }
    /*Taro.getStorage({key:'userInfo'}).then(rst => {   //从缓存中获取用户信息
	    this.setState({
        basicinfo:rst.data
      });
	    console.log('缓存授权信息')
	    console.log(rst.data)
      })*/
  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  // 获取用户信息

    getUserInfo = (userInfo) => {
        console.log('userinfo',userInfo)
        this.setState({
        basicinfo:userInfo.detail.userInfo,
        nickName:userInfo.detail.userInfo.nickName
      });
        if(userInfo.detail.userInfo){   //同意
            Taro.setStorage({key:'userInfo',data:userInfo.detail.userInfo}).then(rst => {  //将用户信息存入缓存中
           console.log(rst.data)
              //Taro.navigateBack()
            })
        } else{ //拒绝,保持当前页面，直到同意
        }
    }

    login = () => {
        Taro.navigateTo({url: '/pages/cate/cate'});
    }
    logout = () => {
        this.setState({isOpened:true})
    }
    handleCancel = () => {
        this.setState({isOpened:false})
    }
    handleConfirm = () => {
        this.setState({isOpened:false,basicinfo:null})
    }
    personInfo = () => {
        Taro.navigateTo({url: '/pages/cart/cart'});
    }


  render() {
    const { isOpened } = this.state
    const {counterStore: { menu, category,userinfost,loginstatest }} = this.props
    return (
    <View className='index'>
    <View className='at-row userinfo'>
        <View className='at-col at-col-9'>
            {userinfost
             ? <View>
                <AtAvatar circle openData={{type:'userAvatarUrl'}} ></AtAvatar>
                <Text>{userinfost.nickName}</Text>
              </View>
             : <Button open-type='getUserInfo' onGetUserInfo={this.getUserInfo} > 微信授权 </Button>
            }
        </View>
    </View>
    <View>
        <AtList>
            <AtListItem title='个人信息' note='可修改单位、电话等信息' arrow='right' onClick={this.personInfo} />
        </AtList>
    </View>
    {
        userinfost
            ?  <View className='logout-btn'>
                <AtButton size='small'  onClick={this.logout}>退出账号</AtButton>
            </View>
            : null
    }
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

</View >
    )
  }
}
