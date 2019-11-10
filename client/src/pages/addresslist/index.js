import Taro, { Component } from '@tarojs/taro'
import { View, Text,Input } from '@tarojs/components'
import { AtTextarea,AtActionSheetItem,AtIcon} from 'taro-ui'
import { CheckboxItem, InputNumber } from '@components'
import './index.scss'


import {inject, observer} from "@tarojs/mobx";
import chooseaddress from "../map";

@inject( 'cartstore','counterStore','addressstore')  //将方法注入到组件的porps中，通过this.props访问
@observer
class Index extends Component {

  config = {
    navigationBarTitleText: '选择收货地址'
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
  }
  componentDidShow(){
  }

  componentWillUnmount(){  //清除当前状态
  }

    updateadcheck=(addressfull)=>{
    this.props.addressstore.updateaddressfull(addressfull)
    this.props.addressstore.updatecheck(addressfull);
    this.setState({openaction:false})
  }




  render () {
    const {addressstore:{addresslist}}=this.props

    return (

    <View class="container">
      {addresslist.map(item => (
      <View  key={item.address} onClick={ ()=>this.updateadcheck(item) }>
        <View class="popitem" >
        <View class="i-l">
          <span class="address">{item.address} </span>
          <View class="user-info">
            <span class="s-l">{item.name}</span>
            <span class="s-r">{item.phone}</span>
          </View>
        </View>
          <AtIcon  value='edit' size='30' />
      </View>
      </View>
        ))}

      <View onClick={()=>Taro.navigateTo({url:"/pages/addaddress/index"})}>
        <View className="shouhuo">
        <AtIcon  color="#FF6E54"  value='add-circle' size='24' />
        <View className="xingzeng">新增收货地址</View>
        </View>
      </View>
  </View>

    )
  }
}


export default  Index
