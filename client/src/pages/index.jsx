import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.css'
import { observer, inject } from '@tarojs/mobx'

@inject( 'counterStore')  //将方法注入到组件的porps中，通过this.props访问
@observer
class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
  }

  componentWillMount () {
    Taro.getStorage({key:'userInfo'}).then(rst => {   //从缓存中获取用户信息存到mobx状态
        this.props.counterStore.localtost(rst.data)
    }).catch(err=>{console.log(err)
    })
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='index'>
      </View>
    )
  }
}


export default  Index
