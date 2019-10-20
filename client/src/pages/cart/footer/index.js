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
                  Taro.navigateTo({url:combineurl })})
        .catch(err => {
            console.log(err)
      })
  }


  handleOrder = () => {
    const orderdetail=this.props.cartstore.gencheckedlist()
    this.createorder(orderdetail)
    let out_trade_no=wxPayUtil.getOrderNo("WA");
    //支付金额 单位：元
    let total_fee='0.10';
    //支付商户号，登录YunGouOS.com 申请 支持资质个人申请
    //商品简称
    let body='情趣小店';
    //回调地址
    let notify_url='';

    let attach="我是附加参数，我会在被原路传送到回调地址";

    let title='黑的杰克收银台'//收银台标题显示名称 xxx-收银台

    /*wxPayUtil.toPay(out_trade_no,total_fee,body,notify_url,attach,title,(response)=>{
        console.log(response);
	    //您的业务
      });   */
    //上面是调用支付的。
  }

  render () {
    const { totalcount,totalprice } = this.props.cartstore
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
            type='primary'
            text='下单'
            onClick={this.handleOrder}
          />
        </View>
      </View>
    )
  }
}
