import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image,Icon } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import classNames from 'classnames'
import './index.scss'
import addicon from '../../../images/icon/icon37.png';
import {inject, observer} from "@tarojs/mobx";
import {  InputNumber } from '@components'

@inject( 'cartstore','counterStore')  //将方法注入到组件的porps中，通过this.props访问
@observer
export default class List extends Component {
  static defaultProps = {
    list: []
  }
  state={
    count:0
  }

  judgeshow=(item)=>{
    if (this.props.cartstore.cartid.indexOf(item.title)>-1){
      return true
    }
    else{
      return false
    }

  }


  handleUpdate = (itemid, cnt) => {
    console.log("更新数量为",cnt)
     this.props.cartstore.updatecount(itemid,cnt)
    Taro.setStorage({key:'cart',data:this.props.cartstore.cart}).then(rst => {  //将用户信息存入缓存中
           console.log("存到本地数据为",rst.data)  })  //每次更改数量时都会储存一份订单到本地
    console.log("更新数量为",cnt)

  }


  render () {
    const { list} = this.props
    const {count}=this.state
    const cart=this.props.cartstore.cart
    return (
      <View className='cate-list'>
            <View >
             {list.map((item,index) => (
               item.title?
            <View key={item.title} className='item'>
              <View className='item-img'>
                <Image className='item-img' src={item.img}/>
              </View>
              <View className='item-info'>
                <View className='item-info-title'>{item.title.substring(0,10)}</View>
                <View className='item-info-desc'>{item.title}</View>
                <View  className='item-footer'>
                  <View className='item-info-price'>{item.price}</View>
                 <InputNumber
                   show={this.judgeshow(item)}
                    item={item}
                    itemid={item.title}
                    onChange={this.handleUpdate}
                  />
                  </View>
                </View>
              </View>
      :<View/>

        ))}
         </View>
          </View>
    )
  }
}



      /*

                <View
                  key={item.dtname}
                  className={classNames('cate-list__item',
                    { 'cate-list__item--right': (index + 1) % 3 === 0 }
                  )}
                  onClick={this.handleClick.bind(this, item)}
                >
                  <Image className='cate-list__item-img' src={item.dtpic} />
                  <View className='cate-list__item-txt-wrap'>
                    <Text className='cate-list__item-txt'>{item.dtname}</Text>
                  </View>
                </View>*/
