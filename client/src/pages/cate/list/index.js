import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import classNames from 'classnames'
import './index.scss'

export default class List extends Component {
  static defaultProps = {
    list: []
  }

  handleClick = (item) => {
    Taro.navigateTo({
      url: `/pages/cate-sub/cate-sub?subId=${item.id}&categoryId=${item.superCategoryId}`
    })
  }

  render () {
    const { list } = this.props
    return (
      <View className='cate-list'>
         <View className='cate-list__group'>
            <View className='cate-list__wrap'>
             {list.map((item,index) => (
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
                </View>

        ))}
         </View>
          </View>
      </View>
    )
  }
}
