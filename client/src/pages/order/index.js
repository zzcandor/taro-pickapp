import Taro, { Component } from '@tarojs/taro'
import { View, Text,Image,CoverView ,ScrollView,Button,Form} from '@tarojs/components'
import { AtIcon,AtActionSheet, AtActionSheetItem,AtInput,AtTextarea  } from "taro-ui"
import { CheckboxItem, InputNumber } from '@components'
import './index.scss'
import { axios } from 'taro-axios'

import {inject, observer} from "@tarojs/mobx";
import wxPayUtil from "../../wxpay/wxPayUtil";

@inject( 'cartstore','counterStore','addressstore')  //将方法注入到组件的porps中，通过this.props访问
@observer
class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
  }

  state = {
    loaded: false,
    orderdetail:'',
    beizhu:"",
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
                   Taro.cloud.callFunction({
        name: 'address',
        data: {
          func: 'getaddress',
          data: {
          }
        }
      }).then(res=>{this.props.addressstore.parseaddresslist(res.result.data)
          console.log("返回内容为",res.result.data)})
        .catch(err => {
            console.log(err)
      })
  }

  componentWillUnmount () { }

  componentDidShow () {
    this.setState({openaction:false})
    const globalData=this.props.counterStore.globalData
    console.log(globalData)
    if(globalData.payStatus!=null&&globalData.payStatus!==undefined){
    let orderno=globalData.orderNo;

    //更新支付状态 如果支付成功
    if (globalData.payStatus){
     Taro.cloud.callFunction({
        name: 'order',
        data: {
          func: 'updatepay',
          data: {
            _id:orderno,
          }
        }
      }).then(res=>{console.log("返回内容为",res);
      Taro.redirectTo({url:"/pages/orderlist/index"})
      this.props.counterStore.updateglobaldata({})
      })
        .catch(err => {
            console.log(err)
      })
    }

    console.log('接收到返回支付结果',globalData.payStatus);
    console.log('订单号',orderno);
  //处理您自己的业务
}


  }

  componentDidHide () { }

  componentWillUpdate(){
       this.setState({
                  addressfull:this.props.addressstore.addressfull,
                  addresslist:this.props.addressstore.addresslist})
    console.log("!!!更新为",this.props.addressstore.addresslist)
  }

  updateadcheck=(id,addressfull)=>{
    this.props.addressstore.updateaddressfull(addressfull)
    this.props.addressstore.updatecheck(id);
    this.setState({openaction:false})
  }

    submit(e){  //发送通知
    if(this.state.addressfull){
    axios.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx3011a047f254103f&secret=7792462e3dbe1b82cdbf8f492215c7a9')
      .then(res=>{
        console.log("返回值",res)
    let _access_token = res.data.access_token
        console.log("accesstoken：",_access_token)
    let url='https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token='+_access_token
     let _jsonData = {
      access_token: _access_token,
      touser: 'op4P9461xCkoNgtBQK6r8VyzC6J8',
      template_id: 'XhZPxCE6l8I5c4tImAe4cJxtSbrF0R0IbIxPnHd6QDY',
      form_id: e.detail.formId,
      page: "pages/orderlist/index",
      data: {
        "keyword1": { "value": this.state.currentorder._id, "color": "#173177" },//单号
        "keyword2": { "value": this.state.currentorder.price, "color": "#173177" }, //金额
        "keyword3": { "value": this.state.currentorder.orderdetail[0].itemName, "color": "#173177" }, //商品名称
        "keyword4": { "value": this.state.addressfull, "color": "#173177" }, //订单号码
        "keyword5": { "value": this.state.currentorder.ispaid, "color": "#173177" }, //支付时间
      }
    }

    console.log("form_id",e)
    Taro.request({
        url: url,
        data: _jsonData,
        method:'POST',
        success: function (res) {
          console.log("请求成功",res)
        },
        fail: function (err) {
          console.log('request fail ', err);
        },
        complete: function (res) {
          console.log("request completed!");
        }

 })})}
}

  pay=(oldorder)=>{
    console.log(this.state.addressfull)
    if (!this.state.addressfull){
      Taro.showToast(
        {
      title: "请选择收货地址",//错误提示
      icon: 'none',
      duration: 1000
    }
      )
    }
    else{
    const neworder2={
      address:this.state.dizhi,
      beizhu:this.state.beizhu,
    }

     Taro.cloud.callFunction({
        name: 'order',
        data: {
          func: 'updateorder',
          data: {
            _id:oldorder._id,
            neworder:neworder2,
          }
        }
      }).then(res=>console.log("返回内容为",res))
        .catch(err => {
            console.log(err)
      })


    console.log("支付接口")
    this.checkpay(oldorder._id)}
  }

  checkpay(orderno){
    let out_trade_no=orderno;
    //支付金额 单位：元
    let total_fee='0.10';
    //支付商户号，登录YunGouOS.com 申请 支持资质个人申请
    //商品简称
    let body='情趣小店';
    //回调地址
    let notify_url='';

    let attach="我是附加参数，我会在被原路传送到回调地址";

    let title='黑的杰克收银台'//收银台标题显示名称 xxx-收银台
    let orderNo= orderno

    wxPayUtil.toPay(out_trade_no,total_fee,body,notify_url,attach,title,(response)=>{
        console.log(response);
	    //您的业务
      });
    //上面是调用支付的。
  }





  render () {
    const curod=this.state.currentorder
    const orderdetail=this.state.orderdetail
    const {addressstore:{addresslist,addressfull}}=this.props
    console.log("addressfull",!!addressfull)
    return (
<ScrollView >
      {this.state.loaded ?
   <View class="container">
    <View class="header-c"  >
      <View class="delivery" >
        <View class="address-c" >
          {this.state.addressfull?
          <View class="address" onClick={()=>{this.setState({openaction:true})}}>
            <span class="address-info">{this.state.addressfull.address}{this.state.addressfull.detail}</span>
            <span class="user-info">{this.state.addressfull.name} {this.state.addressfull.phone}</span>
          </View>:  <View class="address" onClick={()=>{this.setState({openaction:true})}}>
            <span class="address-info">选择收货地址</span>
          </View>
          }

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

    <View class="bottom-c" onClick={()=>Taro.navigateTo({url:"/pages/remark/index"})}>
      <View class="b-mid">
        <span class="mid-l">备注</span>
        <View class="mid-r">
          <span>{this.state.beizhu||"这里是备注"}</span>
           <AtIcon value='chevron-right' size='20' color="gray"/>
        </View>
      </View>
      <View class="line-sp" />
    </View>


 <Form onSubmit={this.submit} report-submit="true">
    <Button class="pay-btn"  formType="submit" onClick={this.pay.bind(this,curod)}>
      <View class="top">
        <View class="s-l">微信支付</View>
      </View>
    </Button>
 </Form>
    <AtActionSheet isOpened={this.state.openaction} cancelText='取消' title='选择收货地址' onCancel={ this.handleCancel } onClose={ this.handleClose }>
      {this.state.addresslist.map(item => (
      <AtActionSheetItem  key={item.address} onClick={ ()=>{this.updateadcheck(item._id,item);
      this.setState({ dizhi:item
      })} }>
        <View class="popitem" >
          <CheckboxItem
              checked={item.checked}
              onClick={()=>this.updateadcheck(item._id)}
            />
        <View class="i-l">
          <span class="address">{item.address}{item.detail} </span>
          <View class="user-info">
            <span class="s-l">{item.name}</span>
            <span class="s-r">{item.phone}</span>
          </View>
        </View>
          <AtIcon  value='edit' size='30' onClick={()=>{Taro.navigateTo({url: "/pages/addaddress/index?addressfull="+JSON.stringify(item)})}} />
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
   </View> : <View>生成订单中...</View>}
</ScrollView>


    )
  }
}


export default  Index
