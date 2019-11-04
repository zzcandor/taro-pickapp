import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import classNames from 'classnames'
import minusIcon from './assets/minus.png'
import minusDisabledIcon from './assets/minus-disabled.png'
import { AtIcon } from 'taro-ui'
import plusIcon from './assets/plus.png'
import './index.scss'
import {inject, observer} from "@tarojs/mobx";


@inject( 'cartstore','counterStore')  //将方法注入到组件的porps中，通过this.props访问
@observer
export default class InputNumber extends Component {
  static defaultProps = {
    item:{},
    itemid:'',
    compStyle: '',
    optStyle: '',
    numStyle: '',
    onChange: () => {}
  }

  componentDidMount(){
    this.setState({
      showchange:this.props.show,
     //查找购物车内是否有商品
    })
  }

  updatecart=(item)=>{
    const reformitem={
      id:item.title,
      itemName: item.title.substring(0,10),
      pic: item.img, //https://s1.st.meishij.net/r/24/193/12798274/s12798274_152739747270250.jpg
      checked: true,
      actualPrice: parseFloat(item.price.replace(/[^0-9]/ig,"")),  //正则数字替换
      cnt: 1
    }
    this.props.cartstore.addtocart(reformitem)
    console.log("加入的商品信息为",reformitem)
  }


  handleMinus = (exists,itemid,show)=> {
    let  judgenum=1
    if(show) {judgenum=1}
    if (exists!==undefined){
    const newnum=exists.cnt- 1
      if (newnum<judgenum){
           this.setState({showchange:false})
     this.props.cartstore.removefromcart(itemid)//小于0则从购物车里移除
     Taro.setStorage({key:'cart',data:this.props.cartstore.cart}).then(rst => {  //将用户信息存入缓存中
           console.log(rst.data)  })  //每次更改数量时都会储存一份订单到本地
      }
      else {
           this.props.onChange(this.props.itemid,newnum)
            Taro.setStorage({key:'cart',data:this.props.cartstore.cart}).then(rst => {  //将用户信息存入缓存中
           console.log(rst.data)  })  //每次更改数量时都会储存一份订单到本地
      }
    }
  }

  handlePlus = (exists,item) => {
    this.setState({showchange:true})
    if (exists!==undefined){
    const newnum=exists.cnt+ 1
    this.props.onChange(this.props.itemid,newnum)
    }   //存在直接+1
    else{
     this.updatecart(item) //不存在则加入购物车
    }
  }


  render () {
    const { item,itemid,compStyle, numStyle,show } = this.props
    const {cartstore:{cart,cartinfo}} = this.props
    const {showchange}=this.state
    const existsitem=cart.find(function(x) {return x.id === itemid;})
    console.log("是否存在该商品",existsitem)
    if(existsitem){console.log("存在的商品数量",existsitem.cnt)}
    return (
      <View className='comp-input-number' style={compStyle}>
        { !!existsitem ? <View className='comp-input-number'>
        <View  className='comp-input-number__minus' onClick={()=>this.handleMinus(existsitem,itemid,show)}>
           <AtIcon value='subtract-circle' size='22' />
          </View>
          <View
            className='comp-input-number__num'
          >
           <Text className='comp-input-number__num-txt'>{existsitem.cnt}</Text>
          </View>
        </View>
          :<View/>}
        <View
          className='comp-input-number__plus'
          onClick={()=>this.handlePlus(existsitem,item)}
        >
      <AtIcon value='add-circle' size='22' />
        </View>
      </View>
    )
  }
}

