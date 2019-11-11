import Taro, { Component } from '@tarojs/taro'
import { View, Text,Input } from '@tarojs/components'
import { AtTextarea,AtActionSheetItem,AtIcon} from 'taro-ui'
import { CheckboxItem, InputNumber,Loading} from '@components'
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
    showmap:false,
    addresslist:[],
  }


    componentWillMount () {
    Taro.cloud.callFunction({
        name: 'address',
        data: {
          func: 'getaddress',
          data: {
          }
        }
      }).then(res=>{this.setState({
              addresslist:res.result.data
        })})
        .catch(err => {
            console.log(err)
      })
  }

  componentDidMount () {
  }
  componentDidUpdate(){
  }
  componentDidShow(){
       Taro.cloud.callFunction({
        name: 'address',
        data: {
          func: 'getaddress',
          data: {
          }
        }
      }).then(res=>{this.setState({
              addresslist:res.result.data,
              loaded:true,
        })})
        .catch(err => {
            console.log(err)
      })
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
      <View>
      {this.state.loaded ?
    <View class="container">
      {this.state.addresslist.map(item => (
      <View  key={item.address} onClick={ ()=>this.updateadcheck(item) }>
        <View class="popitem" >
        <View class="i-l">
          <span class="address">{item.address}{item.detail} </span>
          <View class="user-info">
            <span class="s-l">{item.name}</span>
            <span class="s-r">{item.phone}</span>
          </View>
        </View>
          <AtIcon  value='edit' size='30'
           onClick={()=>{console.log("内容",item,`${item}`);Taro.navigateTo({ url: "/pages/addaddress/index?addressfull="+JSON.stringify(item)})}}/>
      </View>
      </View>
        ))}

      <View onClick={()=>Taro.navigateTo({url:"/pages/addaddress/index"})}>
        <View className="shouhuo">
        <AtIcon  color="#FF6E54"  value='add-circle' size='24' />
        <View className="xingzeng">新增收货地址</View>
        </View>
      </View>
  </View>:<Loading/>}
      </View>

    )
  }
}


export default  Index
