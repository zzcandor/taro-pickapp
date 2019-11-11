import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { CheckboxItem, ButtonItem } from '@components'
import './index.scss'
import config from "../../../wxpay/config";
import wxPayUtil from "../../../wxpay/wxPayUtil";


import {inject, observer} from "@tarojs/mobx";

@inject( 'cartstore','counterStore')  //将方法注入到组件的porps中，通过this.props访问
@observer
export default class Footer extends Component {
  static defaultProps = {
    cartInfo: {},
    onToggle: () => {}
  }
  state ={
    disabled:false
  }

  handleUpdateCheck = () => {
    this.props.onUpdateCheck()
  }

  createorder=(orderdict)=>{
      wx.cloud.callFunction({
        name: 'order',
        data: {
          func: 'creatorder',
          data: {
            orderdict
          }
        }
      }).then(res=>{
            this.props.cartstore.updatecurrentorder(res.result.data.data)
            console.log('调用函数后取得的数据',res.result.data.data)
                  const combineurl='/pages/order/index'
                  Taro.navigateTo({url:combineurl })
                  this.setState({disabled:false});this.clearcart()})
        .catch(err => {
            console.log(err)
      })
  }


  handleOrder = () => {
    this.setState({disabled:true})
    const orderdetail=this.props.cartstore.gencheckedlist()
    this.createorder(orderdetail)

  }


  clearcart=()=>{
    this.props.cartstore.clearcartst()
     Taro.clearStorage({key:'cart'})
  }


  render () {
    const { totalcount,totalprice } = this.props.cartstore
    const {disabled} =this.state
    return (
      <View className='cart-footer'>
        <View className='cart-footer__select'>
          <CheckboxItem
            checked={!!totalcount}
            onClick={this.handleUpdateCheck}
          >
            <Text className='cart-footer__select-txt'>
              {!totalcount ? '全选' : `已选(${totalcount})`}
            </Text>
          </CheckboxItem>
        </View>
        <View className='cart-footer__amount'>
          <Text className='cart-footer__amount-txt'>
            ¥{parseFloat(totalprice).toFixed(2)}
          </Text>
        </View>
        <View className='cart-footer__btn'>
          <ButtonItem
            disabled={disabled}
            type='primary'
            text='下单'
            onClick={this.handleOrder}
          />


        </View>
      </View>
    )
  }
}
