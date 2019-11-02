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
import { View, Button, Image,Text } from "@tarojs/components"


import './index.scss'
import  loginFile from '../../assets/default.jpg'
import {inject, observer} from "@tarojs/mobx";

@inject( 'counterStore')  //将方法注入到组件的porps中，通过this.props访问
@observer
export default class Login extends Component {

  componentWillMount() {
  }
    /*Taro.getStorage({key:'userInfo'}).then(rst => {   //从缓存中获取用户信息
	    this.setState({
        basicinfo:rst.data
      });
	    console.log('缓存授权信息')
	    console.log(rst.data)
      })*/
  componentDidMount() {

  }

  // 获取用户信息

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
              Taro.setStorage({key:'loginstate',data:true})
              //Taro.navigateBack()
            })
        } else{ //拒绝,保持当前页面，直到同意
        }
    }

  render() {
    return (
      <View className='dialog-container' hidden={this.props.hide} >
        <View className='dialog-mask'>
        <View className='dialog-info'>
          <View className='dialog-title'><Text>登录提示</Text>
          <View className='dialog-content'><Text>请允许获取个人信息权限以便登录</Text>
          <View className='dialog-footer'>
            <Button className='dialog-btn' open-type='getUserInfo' onGetUserInfo={this.getUserInfo}>
              好的</Button>
          </View>
        </View>
      </View>
        </View>
        </View>
      </View>
    )
  }
}

