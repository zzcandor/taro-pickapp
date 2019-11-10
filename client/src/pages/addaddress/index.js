import Taro, { Component } from '@tarojs/taro'
import { View, Text,Input,Form } from '@tarojs/components'
import { AtTextarea } from 'taro-ui'

import './index.scss'


import {inject, observer} from "@tarojs/mobx";
import chooseaddress from "../map";

@inject( 'cartstore','counterStore','addressstore')  //将方法注入到组件的porps中，通过this.props访问
@observer
class Index extends Component {

  config = {
    navigationBarTitleText: '新增收货地址'
  }

  state = {
    loaded: false,
    showmap:false
  }


  componentWillMount () {
  }

  componentDidMount () {
  }
  componentDidUpdate(){
    this.setState({showmap:this.props.addressstore.showmap,
                  address:this.props.addressstore.address})
  }
  componentDidShow(){
  }

  componentWillUnmount(){  //清除当前状态
    console.log("页面返回，清空当前状态")
       this.setState({showmap:false,
                  address:''})
  }

    createaddress=(addressdict)=>{
      wx.cloud.callFunction({
        name: 'address',
        data: {
          func: 'addaddress',
          data: {
            addressdict
          }
        }
      }).then(res=>{
            console.log(res) })
        .catch(err => {
            console.log(err)
      })
  }


  submit=()=>{
    const newad={
      address:this.state.address,
      name:this.state.name,
      phone:this.state.phone,
      checked:true,}

    this.props.addressstore.updateaddressfull(newad)
    this.props.addressstore.updatecheck(newad);
    this.props.addressstore.updateaddresslist(newad)
    this.createaddress(newad)
    Taro.navigateBack()

  }

    handlenameChange (e) {
    this.setState({
      name:e.detail.value
    })
      console.log(e.detail.value)
    // 在小程序中，如果想改变 value 的值，需要 `return value` 从而改变输入框的当前值
    return e.detail.value
  }

      handlephoneChange (e) {
    this.setState({
      phone:e.detail.value
    })
      console.log(e.detail.value)
    // 在小程序中，如果想改变 value 的值，需要 `return value` 从而改变输入框的当前值
    return e.detail.value
  }

      handledtChange (e) {
    this.setState({
      detail:e.detail.value
    })
      console.log(e.detail.value)
    // 在小程序中，如果想改变 value 的值，需要 `return value` 从而改变输入框的当前值
    return e.detail.value
  }



  render () {
    const {addressstore:{showmap,address}}=this.props

    return (
      !this.state.showmap?
      <View className="container">
        <View className="name">
          <span>联系人：</span>
          <Input className="input" value={this.state.name}  onChange={this.handlenameChange.bind(this)} placeholder="请填写收货人的姓名" placeholder-style="font-size: 24rpx"/>
        </View>
        <View className="phone">
          <span>手机号：</span>
          <Input className="input" value={this.state.phone} onChange={this.handlephoneChange.bind(this)}   placeholder="请填写收货人手机号码" placeholder-style="font-size: 24rpx"/>
        </View>
        <View className="address"  onClick={()=>{this.props.addressstore.updateshow(true);this.setState({showmap:true})}}>
          <span >收货地址：</span>
          <View className="m">
            <p> {this.state.address?<span>{this.state.address}</span>:<span>点击选择</span>}</p>
          </View>
          <View className="r">
          </View>
        </View>
        <View className="house-num">
          <span>门牌号：</span>
          <Input className="input"  value={this.state.detail} onChange={this.handledtChange.bind(this)}  placeholder="详细地址，例：16号楼5楼301室" placeholder-style="font-size: 24rpx" />
        </View>
        <View className="submit"  onClick={this.submit}>
          <span>保存地址</span>
        </View>
      </View>:<chooseaddress/>
    )
  }
}


export default  Index
