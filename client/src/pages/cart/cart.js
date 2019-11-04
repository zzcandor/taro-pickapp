import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { ButtonItem, ItemList, Loading } from '@components'
import { getWindowHeight } from '@utils/style'
import Tip from './tip'
import Gift from './gift'
import Empty from './empty'
import List from './list'
import Footer from './footer'
import './cart.scss'
import {inject, observer} from "@tarojs/mobx";


@inject( 'cartstore')  //将方法注入到组件的porps中，通过this.props访问
@observer
class Index extends Component {
  config = {
    navigationBarTitleText: '购物车'
  }

  state = {
    loaded: true,
    login: true
  }

  componentDidShow() {
    //确认登录后才显示购物车，在登录时就获取购物车的内容存到state
    //不存储到服务器，购物车内容存储到本地storage，加入openid来获取！

    /*fetch({ url: API_CHECK_LOGIN, showToast: false, autoLogin: false }).then((res) => {
      if (res) {
        this.setState({ loaded: true, login: true })
        this.props.dispatchCart()
        this.props.dispatchCartNum()
        this.props.dispatchRecommend()
      } else {
        this.setState({ loaded: true, login: false })
      }
    })*/
  }

  componentDidMount(){

  }

  checkall=()=>{
    this.props.cartstore.checkall(this.props.cartstore.allcheckstate)
  }

  render () {
    const {cartstore:{cart,cartinfo}} = this.props//在这里导入数据
    //console.log(updatecount,updatecheck)
    //console.log("cartstore状态",cartstore)
    //const cartinfo = cartstore.cartinfo
    console.log("最新列表状态为",cart)
    const isEmpty = !cart.length
    const isShowFooter = !isEmpty

    if (!this.state.loaded) {
      return <Loading />
    }



    return (
      <View className='cart'>
        <ScrollView
          scrollY
          className='cart__wrap'
          style={{ height: getWindowHeight() }}
        >
          {isEmpty && <Empty />}
          {!isEmpty &&
            <List
              list={cart}
            />
          }
          {isShowFooter &&
            <View className='cart__footer--placeholder' />
          }
        </ScrollView>

        {isShowFooter &&
          <View className='cart__footer'>
            <Footer
              cartInfo={cartinfo}
              onUpdateCheck={this.checkall}
            />
          </View>
        }
      </View>
    )
  }
}

export default Index
