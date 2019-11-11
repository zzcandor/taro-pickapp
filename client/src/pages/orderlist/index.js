import Taro, { Component } from '@tarojs/taro'
import { View, Text,Image,CoverView ,ScrollView} from '@tarojs/components'
import { AtIcon,AtActionSheet, AtActionSheetItem,AtInput,AtTextarea  } from "taro-ui"
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
         Taro.cloud.callFunction({
        name: 'order',
        data: {
          func: 'getallorder',
          data: {
          }
        }
      }).then(res=>{console.log("所有订单",res);this.setState({allorder:res.result.data.data})})
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

  }

  componentWillUnmount () { }

  componentDidShow () {
  }

  componentDidHide () { }

  componentWillUpdate(){
  }





  render () {
    const {allorder}=this.state
    return (

      <View class="container">
    <View class="list-c">

      { allorder.map((item)=>
      <View key={item._id} class="item" >
        <View class="shop-info" >

          <View class="shop-name">订单号：{item._id}</View>
          {item.ispaid? <View class="order-status">已支付</View>: <View className="order-status">未支付</View>}
          </View>

         <View class="googs-c" >
           <Image  src={item.orderdetail[0].pic}/>
           <View className="goods2">
        {  item.orderdetail.slice(0,2).map((itx)=>
          <View key={itx.id} class="goods" >
            <View class="s-l">{itx.itemName}</View>
            <View class="s-r">x{itx.cnt}</View>
          </View>
        )

        }
            <View className="wuyu">...</View>
           </View>
        </View>
        <View class="price">
          <View class="count">共{item.count}件商品，实付</View>
          <View class="amount">￥{item.price}</View>
        </View>
      </View>) }

    </View>
  </View>

    )
  }
}


export default  Index
