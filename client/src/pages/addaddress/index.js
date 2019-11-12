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
    showmap:false,
    name:"",
    phone:"",
    address:"",
    detail:"",
  }


  componentWillMount () {
    if (this.$router.params.addressfull){
    console.log("参数",this.$router.params.addressfull)
    const addressfull=JSON.parse(this.$router.params.addressfull);
    this.setState({
      name:addressfull.name,
      phone:addressfull.phone,
      detail:addressfull.detail,
      address:addressfull.address,
      id:addressfull._id,
    })}
  }


  componentDidMount () {
  }
  componentDidUpdate(){
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
            console.log("创建地址后返回",res);
        this.props.addressstore.updateaddresslist(res.result.data.data)
        this.props.addressstore.updatecheck(res.result.data.data._id);Taro.navigateBack() })
        .catch(err => {
            console.log(err)
      })
  }

    updateaddress=(addressdict,id)=>{
      wx.cloud.callFunction({
        name: 'address',
        data: {
          func: 'updateaddress',
          data: {
            addressdict,id
          }
        }
      }).then(res=>{
            console.log(res);
             this.props.addressstore.renewaddresslist(id,res.result.data.data)
            this.props.addressstore.updatecheck(id);Taro.navigateBack() })
        .catch(err => {
            console.log(err)
      })
  }


  submit=(address)=>{
    const newad={
      address:address,  //不能直接通过this.state.address获取 不然会取得空值
      detail:this.state.detail,
      name:this.state.name,
      phone:this.state.phone,
      checked:true,}
    console.log(newad)
    this.props.addressstore.updateaddressfull(newad)
    this.createaddress(newad)


  }


    update=(address,id)=>{
    const newad={
      address:address,  //不能直接通过this.state.address获取 不然会取得空值
      detail:this.state.detail,
      name:this.state.name,
      phone:this.state.phone,
      }
    console.log(newad)
    this.props.addressstore.updateaddressfull(newad)
    this.updateaddress(newad,id)


  }



    delete=(id)=>{
     wx.cloud.callFunction({
        name: 'address',
        data: {
          func: 'deleteaddress',
          data: {
            id
          }
        }
      }).then(res=>{
            console.log(res);this.props.addressstore.delete(id);Taro.navigateBack() })
        .catch(err => {
            console.log(err)
      })





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
      <View className="container">
        <View className="name">
          <span>联系人：</span>
          <Input  className="input" value={this.state.name}  onChange={this.handlenameChange.bind(this)} placeholder="请填写收货人的姓名" placeholder-style="font-size: 24rpx"/>
        </View>
        <View className="phone">
          <span>手机号：</span>
          <Input   className="input" value={this.state.phone} onChange={this.handlephoneChange.bind(this)}   placeholder="请填写收货人手机号码" placeholder-style="font-size: 24rpx"/>
        </View>
        <View className="address"  onClick={()=>{Taro.navigateTo({url:"/pages/map/index"})}}>
          <span >收货地址：</span>
          <View className="m">
            <p> {this.state.address?<span>{this.state.address}</span>:<span>点击选择</span>}</p>
          </View>
          <View className="r">
          </View>
        </View>
        <View className="house-num">
          <span>门牌号：</span>
          <Input    className="input"  value={this.state.detail} onChange={this.handledtChange.bind(this)}  placeholder="详细地址，例：16号楼5楼301室" placeholder-style="font-size: 24rpx" />
        </View>

        {this.state.id?
        <Button  onClick={this.update.bind(this,this.state.address,this.state.id)}>
          更新地址</Button>:
        <Button  onClick={this.submit.bind(this,this.state.address)}>
          保存地址</Button>}
          {this.state.id && <Button type="warn" onClick={this.delete.bind(this,this.state.id)}>
            删除</Button>
          }
      </View>
    )
  }
}


export default  Index
