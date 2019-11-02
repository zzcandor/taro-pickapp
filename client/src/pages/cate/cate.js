import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { Loading } from '@components'
import { getWindowHeight } from '@utils/style'
import Menu from './menu'
import List from './list'
import Banner from './banner'
import './cate.scss'
import {inject, observer} from "@tarojs/mobx";
import Skeleton from 'taro-skeleton'


@inject('counterStore')  //将方法注入到组件的porps中，通过this.props访问
@observer
class Cate extends Component {
  config = {
    navigationBarTitleText: '分类'
  }

  state = {
    current: 0,
    loaded: false,
    loading: false
  }

  componentDidMount() {
    console.log('store信息',this.props.counterStore);
      this.props.counterStore.getcate().then((res)=>{
       this.setState({
              loaded: true,
              userinfo:this.props.counterStore.userinfost
            })
      })


  }

  componentWillUpdate(){

  }

  handleMenu = (id) => {
    this.setState({ loading: true }, () => {
      this.setState({ current: id, loading: false })
    })
  }

  render () {
    const {counterStore: { menu, category,userinfost }} = this.props  //这里是双重解构写法
    console.log('渲染时的状态',userinfost)
    const { current, loading } = this.state
    //console.log("当前目录为",menu)
    const currentCategory = category.find((item,index) => index === current) || {}
    console.log("当前目录为",currentCategory,current)
    const banner = currentCategory.focusBannerList || []
    const list = currentCategory.detail || []
    console.log("目录详情为",list)
    const height = getWindowHeight()

    if (!this.state.loaded) {
      return <Loading />
    }

    return (
      <View className='cate'>
        <ScrollView
          scrollY
          className='cate__menu'
          style={{ height }}
        >
          <Menu
            current={current}
            list={menu}
            onClick={this.handleMenu}
          />
        </ScrollView>
        {/* 通过切换元素实现重置 ScrollView 的 scrollTop */}
        {loading ?
          <View /> :
          <ScrollView
            scrollY
            className='cate__list'
            style={{ height }}
          >
            <View className='cate__list-wrap'>
              <Banner banner={banner} />
              <List list={list} />
            </View>
          </ScrollView>
        }
      </View>
    )
  }
}

export default Cate
