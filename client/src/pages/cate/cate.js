import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { Loading } from '@components'
import { connect } from '@tarojs/redux'
import * as actions from '@actions/cate'
import { getWindowHeight } from '@utils/style'
import Menu from './menu'
import List from './list'
import Banner from './banner'
import './cate.scss'
import {inject, observer} from "@tarojs/mobx";

@inject( 'counterStore')  //将方法注入到组件的porps中，通过this.props访问
@observer
class Cate extends Component {
  config = {
    navigationBarTitleText: '分类'
  }

  state = {
    current: -1,
    loaded: false,
    loading: false
  }

  componentDidMount() {

      this.props.counterStore.getcate().then((res)=>{
       this.setState({
              loaded: true,
              current: res[0].id
            })
      })


  }

  handleMenu = (id) => {
    this.setState({ loading: true }, () => {
      this.setState({ current: id, loading: false })
    })
  }

  getcate =() =>{
    this.props.counterStore.getcate()
  }

  render () {
    const {counterStore: { menu, category}  } = this.props
    const { current, loading } = this.state
    const currentCategory = category.find(item => item.id === current) || {}
    const banner = currentCategory.focusBannerList || []
    const list = currentCategory.categoryGroupList || []
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
