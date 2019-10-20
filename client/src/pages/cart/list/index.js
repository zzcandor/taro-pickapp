import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { CheckboxItem, InputNumber } from '@components'
import './index.scss'
import {inject, observer} from "@tarojs/mobx";

@inject( 'cartstore')  //将方法注入到组件的porps中，通过this.props访问
@observer
export default class List extends Component {
  static defaultProps = {
    list: [],
    onUpdate: () => {},
    onUpdateCheck: () => {}
  }

  getBaseItem = (item) => ({

    id: item.id,
    cnt: item.cnt,
    checked: item.checked,
    cancheck: true,
  })

  handleUpdate = (itemid, cnt) => {
    console.log("更新数量为",cnt)
    this.props.cartstore.updatecount(itemid,cnt)
  }

  handleUpdateCheck = (sid,checkstate) => {
    this.props.cartstore.updatecheck(sid,checkstate)
  }

  //在组件中匿名函数来传递整个函数，方便整个传递给子组件

  render () {
    const { list } = this.props
    return (
      <View className='cart-list'>
        {list.map(item => (
          <View
            key={item.id}
            className='cart-list__item'
          >
            <CheckboxItem
              checked={item.checked}
              onClick={this.handleUpdateCheck.bind(this, item.id,item.checked)}
            />
            {/*更新购物车确认状态*/}
            <Image
              className='cart-list__item-img'
              src={item.pic}
            />
            <View className='cart-list__item-info'>
              <View className='cart-list__item-title'>
                {!!item.prefix &&
                  <Text className='cart-list__item-title-tag'>{item.prefix}</Text>
                }
                <Text className='cart-list__item-title-name' numberOfLines={1}>
                  {item.itemName}
                </Text>
              </View>

              <View className='cart-list__item-spec'>
                <Text className='cart-list__item-spec-txt'>
                  {item.specList.map(sepc => sepc.specValue).join(' ')}
                </Text>
              </View>

              <View className='cart-list__item-wrap'>
                <Text className='cart-list__item-price'>
                  ¥{item.actualPrice}
                </Text>
                <View className='cart-list__item-num'>
                  <InputNumber
                    num={item.cnt}
                    itemid={item.id}
                    onChange={this.handleUpdate}
                  />
                  {/*这里只传两个参数，InputNumber组件中已经写好再传入一个number变量*/}
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
    )
  }
}
