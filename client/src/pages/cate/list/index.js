import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image,Icon } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import classNames from 'classnames'
import './index.scss'
import addicon from '../../../images/icon/icon37.png';
import {inject, observer} from "@tarojs/mobx";


@inject( 'cartstore','counterStore')  //将方法注入到组件的porps中，通过this.props访问
@observer
export default class List extends Component {
  static defaultProps = {
    list: []
  }

  updatecart=(item)=>{
    const reformitem={
      id:item.title,
      itemName: item.title.substring(0,10),
      pic: item.img, //https://s1.st.meishij.net/r/24/193/12798274/s12798274_152739747270250.jpg
      checked: true,
      actualPrice: item.price,
      cnt: 1
    }
    this.props.cartstore.addtocart(reformitem)
    console.log("加入的商品信息为",reformitem)
  }


  render () {
    const { list } = this.props
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
                  <View color='#FFAF38'  onClick={()=>{this.updatecart(item)}}>
                      <AtIcon value='add-circle' size='22' />
                  </View>
                </View>
              </View>

          </View>:<View/>

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
