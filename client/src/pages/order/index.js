import Taro, { Component } from '@tarojs/taro'
import { View, Text,Image } from '@tarojs/components'
import { AtIcon,AtActionSheet, AtActionSheetItem } from "taro-ui"
import { CheckboxItem, InputNumber } from '@components'
import './index.scss'


import {inject, observer} from "@tarojs/mobx";

@inject( 'cartstore','counterStore','addressstore')  //将方法注入到组件的porps中，通过this.props访问
@observer
class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
  }

  state = {
    loaded: false,
    orderdetail:''
  }


  componentWillMount () {
    const id2=this.props.cartstore.currentorderid
    console.log("id2",id2)
    Taro.cloud.callFunction({
        name: 'order',
        data: {
          func: 'getorder',
          data: {
            _id:id2
          }
        }
      }).then(res=>{this.setState({
              loaded:true,
              currentorder:res.result.data,
              orderdetail:res.result.data.orderdetail
        })})
        .catch(err => {
            console.log(err)
      })
  }

    /*const orderData = {
    _id: orderId,
    submitdate: db.serverDate(),
    ispaid: false,
    owner:OPENID,
    price: orderdict.totalprice,
    count:orderdict.totalcount,
    orderdetail:orderdict.checkedlist
  }*/ //数据结构为


  componentDidMount () {
           this.setState({
                  addressfull:this.props.addressstore.addressfull})
  }

  componentWillUnmount () { }

  componentDidShow () {
    this.setState({openaction:false})
  }

  componentDidHide () { }

  componentWillUpdate(){
       this.setState({
                  addressfull:this.props.addressstore.addressfull})
  }

  updateadcheck=(addressfull)=>{
    this.props.addressstore.updateaddressfull(addressfull)
    this.props.addressstore.updatecheck(addressfull);
    this.setState({openaction:false})
  }

    handlebzChange (e) {
    this.setState({
      dbeizhu:e.detail.value
    })
      console.log(e.detail.value)
    // 在小程序中，如果想改变 value 的值，需要 `return value` 从而改变输入框的当前值
    return e.detail.value
  }


  render () {
    const curod=this.state.currentorder
    const orderdetail=this.state.orderdetail
    const {addressstore:{addresslist,addressfull}}=this.props
    return (
<View  >
      {this.state.loaded ?
   <View class="container">
    <View class="header-c"  >
      <View class="delivery" >
        <View class="address-c" >
          <View class="address" onClick={()=>{this.setState({openaction:true})}}>
            <span class="address-info">{this.state.addressfull.address}</span>
            <span class="user-info">{this.state.addressfull.name} {this.state.addressfull.phone}</span>
          </View>
          <AtIcon value='chevron-right' size='20' color="gray"/>
        </View>
        <View class="line-sp" />
      </View>
     </View>
    <View class="item-list">
      <View class="list">
        {orderdetail.map(item => (
        <View class="item" key={item.id}>
          <Image  src={item.pic} />
          <View class="item-r">
            <View class="r-t">
              <span>{item.itemName}</span>
              <span>￥{item.actualPrice}</span>
            </View>
          </View>
        </View>))}
      </View>
       <View class="line-sp" />
    </View>
        <View class="totle-price">
          <View class="m">
            <span>小计:</span>
          </View>
          <View class="r">
            <span>￥{curod.price}</span>
          </View>
        </View>

    <View class="bottom-c">
      <View class="b-mid">
        <Text class="mid-l">备注</Text>
          <Input  class="mid-2" value={this.state.beizhu} onChange={this.handlebzChange.bind(this)}  placeholder="填写备注" placeholder-style="font-size: 24rpx" />
      </View>
      <View class="line-sp" />
    </View>

    <View class="pay-btn" >
      <View class="top">
        <View class="s-l">微信支付</View>
      </View>
    </View>

    <AtActionSheet isOpened={this.state.openaction} cancelText='取消' title='选择收货地址' onCancel={ this.handleCancel } onClose={ this.handleClose }>
      {addresslist.map(item => (
      <AtActionSheetItem  key={item.address} onClick={ ()=>this.updateadcheck(item) }>
        <View class="popitem" >
          <CheckboxItem
              checked={item.checked}
              onClick={()=>this.updateadcheck(item)}
            />
        <View class="i-l">
          <span class="address">{item.address} </span>
          <View class="user-info">
            <span class="s-l">{item.name}</span>
            <span class="s-r">{item.phone}</span>
          </View>
        </View>
          <AtIcon  value='edit' size='30' />
      </View>
      </AtActionSheetItem>
        ))}

      <AtActionSheetItem onClick={()=>Taro.navigateTo({url:"/pages/addaddress/index"})}>
        <View className="shouhuo">
        <AtIcon  color="#FF6E54"  value='add-circle' size='24' />
        <View className="xingzeng">新增收货地址</View>
        </View>
      </AtActionSheetItem>
    </AtActionSheet>

   </View>



       : <View>生成订单中...</View>}
</View>
    )
  }
}


export default  Index
