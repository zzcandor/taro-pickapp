import Taro, { Component } from '@tarojs/taro'
import { View, Text,Image } from '@tarojs/components'
import { AtIcon } from 'taro-ui'

import './index.scss'


import {inject, observer} from "@tarojs/mobx";

@inject( 'cartstore','counterStore')  //将方法注入到组件的porps中，通过this.props访问
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


  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    const curod=this.state.currentorder
    const orderdetail=this.state.orderdetail
    return (
<View  >
      {this.state.loaded ?
   <View class="container">
    <View class="header-c"  >
      <View class="delivery" >
        <View class="address-c" >
          <View class="address">
            <span class="address-info">这里是地址</span>
            <span class="user-info">吴先生  13112253680</span>
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
        <span class="mid-l">备注</span>
        <View class="mid-r">
          <span>这里是备注</span>
           <AtIcon value='chevron-right' size='20' color="gray"/>
        </View>
      </View>
      <View class="line-sp" />
    </View>

    <View class="pay-btn" >
      <View class="top">
        <View class="s-l">微信支付</View>
      </View>
    </View>
   </View>

       : <View>生成订单中...</View>}
</View>
    )
  }
}


export default  Index
